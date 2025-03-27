const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");
const crypto = require("crypto");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return async function(req, res, next) {
        if(req.method !== 'POST') return next();
        if(!req.body.username || !req.body.password) {
            res.locals.errorMessage = "Username and password are required";
            return next();
        }
        
        try {
            const user = await UserModel.findOne({ username: req.body.username });
            if(!user) {
                res.locals.errorMessage = "Invalid username or password";
                return next();
            }
            
            const hash = crypto.createHash('sha256')
                .update(req.body.password)
                .digest('hex');
                
            if(user.password === hash) {
                req.session.userid = user._id;
                req.session.belepve = true;
                return res.redirect('/user');
            } else {
                res.locals.errorMessage = "Invalid username or password";
                return next();
            }
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error finding user:\n`, err);
            res.locals.errorMessage = "An error occurred during login";
            return next();
        }
    };
}
