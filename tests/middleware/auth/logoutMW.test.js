
// Tudom teljesen "felesleges" egy logout MW-t tesztelni, de hát ha már belejöttem akkor már...

const requireLogout = require('../../../middleware/auth/logoutMW');

describe('requireLogout middleware', () => {
    let req, res, next, middleware;

    beforeEach(() => {
        req = {
            session: {
                destroy: jest.fn(cb => cb())
            }
        };
        res = {
            redirect: jest.fn()
        };
        next = jest.fn();
        middleware = requireLogout({});
    });

    it('should destroy the session and redirect to "/"', () => {
        middleware(req, res, next);
        expect(req.session.destroy).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should still redirect to "/" if destroy callback gets an error', () => {
        req.session.destroy = jest.fn(cb => cb(new Error('fail')));
        middleware(req, res, next);
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});