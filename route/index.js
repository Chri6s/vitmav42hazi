const renderMW = require("../middleware/renderMW");
const UserModel = require("../models/user");
const BookModel = require("../models/book");
const LoanModel = require("../models/loan");
//Authentication
const authMW = require("../middleware/auth/authMW");
const loginMW = require("../middleware/auth/loginMW");
const registerMW = require("../middleware/auth/registerMW");
const logoutMW = require("../middleware/auth/logoutMW");
//User
const getUserMW = require("../middleware/user/getUserMW");
const updateGravatarMW = require("../middleware/user/updateGravatarMW");
//Book
const getBooksMW = require("../middleware/book/getBooksMW");
const addBookMW = require("../middleware/book/addBookMW");
const editBookMW = require("../middleware/book/editBookMW");
const deleteBookMW = require("../middleware/book/deleteBookMW");
const borrowBookMW = require("../middleware/book/borrowBookMW");
const returnBookMW = require("../middleware/book/returnBookMW");

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
    app.use('/register',
        registerMW(objLib),
        renderMW(objLib, 'register')
    );
    app.use('/search',
        authMW(objLib),
        getBooksMW(objLib),
        renderMW(objLib, 'search')
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
    
    app.post('/book/add',
        authMW(objLib),
        addBookMW(objLib),
        getBooksMW(objLib),
        renderMW(objLib, 'search')
    );
    app.post('/book/edit/:id',
        authMW(objLib),
        editBookMW(objLib),
        getBooksMW(objLib),
        renderMW(objLib, 'search')
    );
    app.delete('/book/:id',
        authMW(objLib),
        deleteBookMW(objLib)
    );
    app.post('/book/borrow/:id',
        authMW(objLib),
        borrowBookMW(objLib)
    );
    
    app.post('/book/return/:id',
        authMW(objLib),
        returnBookMW(objLib)
    );
    app.use('/',
        renderMW(objLib, 'index')
    );
}