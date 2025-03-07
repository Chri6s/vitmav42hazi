const renderMW = require("../middleware/renderMW");
const UserModel = require("../models/user");
const BookModel = require("../models/book");
const LoanModel = require("../models/loan");

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
         renderMW(objLib, 'login')
    );
    app.use('/search',
        renderMW(objLib, 'search')
    );
    app.use('/register',
        renderMW(objLib, 'register')
    );
    app.use('/user',
        renderMW(objLib, 'profile')
    );
    app.use('/', 
        renderMW(objLib, 'index')
    );
}