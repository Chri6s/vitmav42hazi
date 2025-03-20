const requireOption = require("../../lib/js/requireOption");
const crypto = require('crypto');
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return async function(req, res, next) {
        if (req.method !== 'POST') {
            return next();
        }
        const regInfo = req.body;

        if (!regInfo.username || !regInfo.email || !regInfo.password) {
            res.locals.error = "All fields are required";
            return next();
        }

        try {
            const existingUser = await UserModel.findOne({
                $or: [
                    { username: regInfo.username },
                    { email: regInfo.email }
                ]
            });

            if (existingUser) {
                if (existingUser.username === regInfo.username) {
                    res.locals.error = "Username already taken";
                } else {
                    res.locals.error = "Email already taken";
                }
                return next();
            }
            const hashedPassword = crypto.createHash('sha256')
                .update(regInfo.password)
                .digest('hex');
            
            const lastUser = await UserModel.findOne().sort('-id').exec();
            const newId = lastUser ? lastUser.id + 1 : 1;

            const newUser = new UserModel({
                id: newId,
                username: regInfo.username,
                email: regInfo.email,
                gravatarEmail: null,
                password: hashedPassword,
                type: 'user'
            });

            const savedUser = await newUser.save();
            
            req.session.userid = savedUser._id;

            req.session.successMessage = "Registration successful! Welcome to BookJam!";
            
            if (req.headers['content-type'] === 'application/json') {
                return res.status(201).json({
                    success: true,
                    message: "Registration successful"
                });
            }
            
            return res.redirect('/user');
            
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Registration error:`, err);
            res.locals.error = "An error occurred during registration";
            return next();
        }
    };
};