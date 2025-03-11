const requireOption = require("../../lib/js/requireOption");

module.exports = function(objectRepository) {
    return function(req, res, next) {
        if(typeof req.session.loggedin === 'undefined' || req.session.loggedin !== true) {
            return res.redirect('/user');
        }
        next();
    }
}