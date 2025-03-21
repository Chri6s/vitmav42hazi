const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");
const crypto = require("crypto");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return async function(req, res, next) {
        if (req.method !== 'POST' || !req.body.gravatarEmail) {
            return next();
        }

        try {
            const gravatarEmail = crypto.createHash('sha256')
                .update(req.body.gravatarEmail.trim().toLowerCase())
                .digest('hex');
            
            await UserModel.findByIdAndUpdate(
                req.session.userid, 
                { gravatarEmail: gravatarEmail }
            );
            req.session.successMessage = "Profile picture updated successfully!";
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(200).json({
                    success: true,
                    message: "Profile picture updated successfully!"
                });
            }
            
            return res.redirect('/user');
            
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error updating gravatar:`, err);
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(500).json({
                    success: false,
                    message: "An error occurred while updating your profile picture."
                });
            }
            
            res.locals.error = "An error occurred while updating your profile picture.";
            return next();
        }
    };
};