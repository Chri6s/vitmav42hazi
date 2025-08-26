const requireOption = require("../../lib/js/requireOption");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return function(req, res, next) {
        if(typeof req.session === 'undefined' || !req.session.userid || typeof req.session.isAuthenticated === 'undefined' || req.session.isAuthenticated === false) {
            res.locals.error = "User not authenticated";
            if(req.originalUrl !== "/") return res.redirect('/');
        }
        res.locals.successMessage = "";
        res.locals.errorMessage = "";
        res.locals.isAuthenticated = req.session.isAuthenticated;
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
