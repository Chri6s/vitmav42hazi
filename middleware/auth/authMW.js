const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return function(req, res, next) {
        if(typeof req.session === 'undefined' || !req.session.userid || typeof req.session.belepve === 'undefined' || req.session.belepve === false) {
            res.locals.error = "User not authenticated";
            if(req.originalUrl !== "/") return res.redirect('/');
        }
        res.locals.successMessage = "";
        res.locals.errorMessage = "";
        res.locals.belepve = req.session.belepve;
        res.locals.userid = req.session.userid;
        
        UserModel.findById(req.session.userid)
            .then(user => {
                res.locals.user = user;
                return next();
            })
            .catch(err => {
                console.log(`Error fetching user: ${err}`);
                return next();
            });
    };
};
