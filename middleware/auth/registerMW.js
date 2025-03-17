const requireOption = require("../../lib/js/requireOption");
const crypto = require('crypto');

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return function(req, res, next) {
        const regInfo = req.body;
        if (req.method !== 'POST') return next();
        if (!(regInfo.username || regInfo.email || regInfo.password)) {
            res.locals.error = "All fields are required";
            return next();
        }
        UserModel.findOne({
            $or: [
                { username: regInfo.username },
                { email: regInfo.email }
            ]
        })
        .then(existingUser => {
            if(existingUser) {
                if(existingUser.username === regInfo.username) {
                    res.locals.error = "Username already taken";
                } else {
                    res.locals.error = "Email already taken";
                }
                return next();
            } 
            const hashedPassword = crypto.createHash('sha256')
                .update(regInfo.password)
                .digest('hex');
            
            UserModel.findOne().sort('-id').exec()
                .then(lastUser => {
                    const newId = lastUser ? lastUser.id + 1 : 1;

                    const newUser = new UserModel({
                        id: newId,
                        username: regInfo.username,
                        email: regInfo.email,
                        gravatarEmail: null,
                        password: hashedPassword,
                        type: 'user'
                    });

                    return newUser.save();
                })
                .then(savedUser => {
                    req.session.userid = savedUser._id;

                    if(req.headers['content-type'] === 'application/json') {
                        return res.status(201).json({
                            success: true,
                            message: "Registration successful"
                        });
                    }
                    return res.redirect('/user');
                })
                .catch(err => {
                    console.log(`[${colors.cyan("MW")}][❌] Error saving user:\n`, err);
                    res.locals.error = "An error occurred during registration";
                    return next();
                });
        })
        .catch(err => {
            console.log(`[${colors.cyan("MW")}][❌] Error checking existing user:\n`, err);
            res.locals.error = "An error occurred during registration";
            return next();
        });
    }
}