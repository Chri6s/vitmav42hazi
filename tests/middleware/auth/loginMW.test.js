const requireUserLogin = require('../../../middleware/auth/loginMW');
const crypto = require('crypto');

describe('requireUserLogin middleware', () => {
    let req, res, next, UserModel, objectRepository, middleware;

    beforeEach(() => {
        req = {
            method: 'POST',
            body: {},
            session: {}
        };
        res = {
            locals: {},
            redirect: jest.fn()
        };
        next = jest.fn();

        UserModel = {
            findOne: jest.fn()
        };

        objectRepository = {
            UserModel
        };

        middleware = requireUserLogin(objectRepository);
    });

    it('should call next() immediately for non-POST requests', async () => {
        req.method = 'GET';
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should set error message if username or password is missing', async () => {
        req.body = { username: '' };
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should set error if user is not found', async () => {
        req.body = { username: 'someone', password: 'pass' };
        UserModel.findOne.mockResolvedValue(null);
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should set error if password does not match', async () => {
        req.body = { username: 'someone', password: 'wrong' };
        // Pre-hash a "good" password
        const goodHash = crypto.createHash('sha256').update('right').digest('hex');
        UserModel.findOne.mockResolvedValue({ username: 'someone', password: goodHash, _id: '123' });
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should set session and redirect on successful login', async () => {
        req.body = { username: 'someone', password: 'pass' };
        const hash = crypto.createHash('sha256').update('pass').digest('hex');
        UserModel.findOne.mockResolvedValue({ username: 'someone', password: hash, _id: 'abc123' });
        await middleware(req, res, next);
        expect(req.session.userid).toBe('abc123');
        expect(req.session.isAuthenticated).toBe(true);
        expect(res.redirect).toHaveBeenCalledWith('/user');
    });

    it('should handle thrown errors gracefully', async () => {
        req.body = { username: 'someone', password: 'pass' };
        UserModel.findOne.mockRejectedValue(new Error('DB error'));
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});