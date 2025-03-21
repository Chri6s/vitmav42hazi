const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");
const crypto = require("crypto");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return function(req, res, next) {
        if(req.method !== 'POST') return next();
        if(!req.body.username || !req.body.password) return next(); // TODO error handling when no username or password

        UserModel.findOne({ username: req.body.username })
            .then(user => {
                if(!user) return next(); // TODO error handling when user not found
                const hash = crypto.createHash('sha256').
                    update(req.body.password).
                    digest('hex');
                if(user.password === hash) {
                    req.session.userid = user._id;
                    req.session.beleve = true;
                    return res.redirect('/user');
                };
            })
            .catch(err => {
                console.log(`[${colors.cyan("MW")}][❌] Error finding user:\n`, err);
                return res.redirect('/login');
            });
    }
}
