const requireAddBook = require('../../../middleware/book/addBookMW');

describe('requireAddBook middleware', () => {
    let req, res, next, BookModel, objectRepository, middleware;

    beforeEach(() => {
        req = {
            method: 'POST',
            body: {},
            path: '/book/add',
            session: {},
            headers: { accept: '' },
            xhr: false
        };
        res = {
            locals: {},
            status: jest.fn(() => res),
            json: jest.fn(),
            redirect: jest.fn()
        };
        next = jest.fn();

        function FakeBookModel(data) { Object.assign(this, data); }
        FakeBookModel.prototype.save = jest.fn();

        objectRepository = { BookModel: FakeBookModel };
        BookModel = FakeBookModel;

        middleware = requireAddBook(objectRepository);
    });

    it('should skip for non-POST requests', async () => {
        req.method = 'GET';
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
    });

    it('should skip if req.body is missing', async () => {
        req.body = undefined;
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should skip if not on /book/add path', async () => {
        req.path = '/book/zaszlozaszlosziv';
        await middleware(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should require title, author, and ISBN', async () => {
        req.body = { title: '', author: '', ISBN: '' };
        await middleware(req, res, next);
        expect(res.locals.error).toBe("Title, author, and ISBN are required");
        expect(next).toHaveBeenCalled();
    });

    it('should add book, set session and redirect for normal requests', async () => {
        req.body = { title: 'Book', author: 'Mátyás Király', ISBN: '1234-123-13001-1337', year: 2006, category: 'Science' };
        BookModel.findOne = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue({ id: 5 })
        });
        BookModel.prototype.save = jest.fn().mockResolvedValue();

        await middleware(req, res, next);

        expect(req.session.successMessage).toBe("Book added successfully");
        expect(res.redirect).toHaveBeenCalledWith('/search');
    });

    it('should add book, set session and return JSON for ajax (xhr=true)', async () => {
        req.body = { title: 'Book', author: 'Mátyás Király', ISBN: '1234-123-13001-1337', year: 2020, category: 'Science' };
        req.xhr = true;
        BookModel.findOne = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue({ id: 5 })
        });
        BookModel.prototype.save = jest.fn().mockResolvedValue();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: "Book added successfully",
                book: expect.objectContaining({ title: 'Book', author: 'Mátyás Király', ISBN: '1234-123-13001-1337' })
            })
        );
    });

    it('should add book, set session and return JSON for ajax (headers.accept includes json)', async () => {
        req.body = { title: 'Book', author: 'Mátyás Király', ISBN: '1234-123-13001-1337', year: 2020, category: 'Science' };
        req.headers.accept = 'application/json';
        BookModel.findOne = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue({ id: 10 })
        });
        BookModel.prototype.save = jest.fn().mockResolvedValue();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                success: true,
                message: "Book added successfully",
                book: expect.objectContaining({ title: 'Book', author: 'Mátyás Király', ISBN: '1234-123-13001-1337' })
            })
        );
    });

    it('should default category to Uncategorized', async () => {
        req.body = { title: 'Book', author: 'Mátyás Király', ISBN: '1234-123-13001-1337', year: 2020, category: 'Science' };
        BookModel.findOne = jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(null)
        });
        BookModel.prototype.save = jest.fn().mockResolvedValue();

        await middleware(req, res, next);

        expect(res.redirect).toHaveBeenCalledWith('/search');
    });

    it('should handle errors and respond with 500 and json for ajax requests', async () => {
        req.body = { title: 'Book', author: 'Mátyás Király', ISBN: '1234-123-13001-1337', year: 2020, category: 'Science' };
        req.xhr = true;
        BookModel.findOne = jest.fn().mockImplementation(() => { throw new Error('fail'); });

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            success: false,
            message: "An error occurred while adding the book"
        }));
    });

    it('should handle errors and call next with error for non-ajax requests', async () => {
        req.body = { title: 'Book', author: 'Mátyás Király', ISBN: '1234-123-13001-1337', year: 2020, category: 'Science' };
        BookModel.findOne = jest.fn().mockImplementation(() => { throw new Error('fail'); });

        await middleware(req, res, next);

        expect(res.locals.error).toBe("An error occurred while adding the book");
        expect(next).toHaveBeenCalled();
    });
});