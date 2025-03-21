const renderMW = require("../middleware/renderMW");
const UserModel = require("../models/user");
const BookModel = require("../models/book");
const LoanModel = require("../models/loan");
const authMW = require("../middleware/auth/authMW");
const loginMW = require("../middleware/auth/loginMW");
const registerMW = require("../middleware/auth/registerMW");
const logoutMW = require("../middleware/auth/logoutMW");
const getUserMW = require("../middleware/user/getUserMW");
const updateGravatarMW = require("../middleware/user/updateGravatarMW");

module.exports = function(app) {

    const objLib = {
        UserModel: UserModel,
        BookModel: BookModel,
        LoanModel: LoanModel
    }
    // app.post('/register', (req, res, next) => {
    //     console.log('Login Request Body:', req.body);
    //     console.log('Username:', req.body.username);
    //     console.log('Password:', req.body.password);
    //     console.log('Password Again', req.body.passwordAgain);
    //     console.log('Email', req.body.email);
    //     next();
    // });
    app.use('/login',
        loginMW(objLib),
        renderMW(objLib, 'login')
    );
    app.use('/search',
        authMW(objLib),
        renderMW(objLib, 'search')
    );
    app.use('/register',
        registerMW(objLib),
        renderMW(objLib, 'register')
    );
    app.use('/user',
        authMW(objLib),
        getUserMW(objLib),
        updateGravatarMW(objLib),
        renderMW(objLib, 'profile')
    );
    app.use('/logout',
        logoutMW(objLib)
    );
    app.use('/',
        renderMW(objLib, 'index')
    );
}