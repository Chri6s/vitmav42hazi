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
    
    app.use('/login',
         renderMW(objLib, 'login')    
    );
    
    app.use('/', 
        renderMW(objLib, 'index')
    );
}