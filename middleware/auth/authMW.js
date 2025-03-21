const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return function(req, res, next) {
        if(typeof req.session === 'undefined' || !req.session.userid || typeof req.session.belepve === 'undefined' || req.session.belepve !== true) {
            res.locals.error = "User not authenticated";
            return res.redirect('/');
        }
        return next();

    };
};
