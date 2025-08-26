const requireUserRegister = require('../../../middleware/auth/registerMW');

describe('requireUserRegister middleware', () => {
    let req, res, next, UserModel, objectRepository, middleware;

    beforeEach(() => {
        req = {
            method: 'POST',
            body: {},
            session: {},
            headers: {}
        };
        res = {
            locals: {},
            redirect: jest.fn(),
            status: jest.fn(() => res),
            json: jest.fn()
        };
        next = jest.fn();

        function FakeUserModel(data) { Object.assign(this, data); }
        FakeUserModel.prototype.save = jest.fn();

        objectRepository = { UserModel: FakeUserModel };
        UserModel = FakeUserModel;

        middleware = requireUserRegister(objectRepository);
    });

    it('should skip for non-POST requests', async () => {
        req.method = 'GET';
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should set error if any field is missing', async () => {
        req.body = { username: '', email: '', password: '' };
        UserModel.findOne = jest.fn();

        await middleware(req, res, next);
        
        expect(res.locals.error).toBe("All fields are required");
        expect(next).toHaveBeenCalled();
    });

    it('should set error if username already exists', async () => {
        req.body = { username: 'user', email: 'user@email.com', password: 'pw' };
        UserModel.findOne = jest.fn().mockResolvedValue({ username: 'user', email: 'another@email.com' });
        
        await middleware(req, res, next);
        
        expect(res.locals.error).toBe("Username already taken");
        expect(next).toHaveBeenCalled();
    });

    it('should set error if email already exists', async () => {
        req.body = { username: 'user', email: 'used@email.com', password: 'pw' };
        UserModel.findOne = jest.fn().mockResolvedValue({ username: 'other', email: 'used@email.com' });
        
        await middleware(req, res, next);
        
        expect(res.locals.error).toBe("Email already taken"); // Nagyon másra itt nem tudok tesztelni szóval most ez lesz:(
        expect(next).toHaveBeenCalled();
    });

    it('should register user, set session, and redirect for form requests', async () => {
        req.body = { username: 'user', email: 'email@email.com', password: 'pw' };
        UserModel.findOne = jest
            .fn()
            .mockResolvedValueOnce(null)
            .mockReturnValueOnce({
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ id: 4 })
            });
        UserModel.prototype.save = jest.fn().mockResolvedValue({ _id: 'abc123' });

        await middleware(req, res, next);

        expect(req.session.userid).toBe('abc123');
        expect(req.session.successMessage).toContain("Registration successful");
        expect(res.redirect).toHaveBeenCalledWith('/user');
    });

    it('should register user and return JSON for application/json requests', async () => {
        req.body = { username: 'user', email: 'email@email.com', password: 'pw' };
        req.headers['content-type'] = 'application/json';

        UserModel.findOne = jest
            .fn()
            .mockResolvedValueOnce(null)
            .mockReturnValueOnce({
                sort: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue({ id: 1 })
            });
        UserModel.prototype.save = jest.fn().mockResolvedValue({ _id: 'asd123' });

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: true,
            message: "Registration successful"
        }));
    });

    it('should handle exceptions and set error', async () => {
        req.body = { username: 'user', email: 'email@email.com', password: 'pw' };
        UserModel.findOne = jest.fn().mockRejectedValue(new Error('Some DB error'));
        await middleware(req, res, next);
        expect(res.locals.error).toBe("An error occurred during registration");
        expect(next).toHaveBeenCalled();
    });
});