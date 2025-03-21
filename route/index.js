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
const getLatestBooksMW = require("../middleware/book/getLatestBooksMW");

module.exports = function(app) {

    const objLib = {
        UserModel: UserModel,
        BookModel: BookModel,
        LoanModel: LoanModel
    }

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
        authMW(objLib),
        getLatestBooksMW(objLib),
        renderMW(objLib, 'index')
    );
}