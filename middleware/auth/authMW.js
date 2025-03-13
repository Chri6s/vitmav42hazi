const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return function(req, res, next) {
        if(typeof req.session === 'undefined' || !req.session.userid) {
            return res.redirect('/login');
        }

        UserModel.findOne({ id: req.session.userId})
            .then(user => {
                if(!user) {
                    req.session.destroy(err => {
                        if(err) console.log(`[${colors.cyan("MW")}][❌] Session destroy error:\n`, err);
                        return res.redirect('/login');
                    });
                }
                res.locals.user = user;
                return next();
            })
            .catch(err => {
                console.log(`[${colors.cyan("MW")}][❌] Error finding user:\n`, err);
                return res.redirect('/login');
            });
    }
}