const requireOption = require("../../lib/js/requireOption");
const crypto = require('crypto');

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');

    return function(req, res, next) {
        const loginInfo = req.body;
        if (req.method !== 'POST') return next();
        if (!())
    }
}