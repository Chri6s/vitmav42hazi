const db = require("../lib/js/db");


const User = db.model('User', {
    id: Number,
    username: String,
    email: String,
    gravatarEmail: String,
    password: String,
    type: String
});

module.exports = User;