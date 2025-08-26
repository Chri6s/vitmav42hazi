const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const BookModel = requireOption(objectRepository, 'BookModel');
    const LoanModel = requireOption(objectRepository, 'LoanModel');
    const UserModel = requireOption(objectRepository, 'UserModel');
    
    return async function(req, res, next) {
        if (req.method !== 'POST' || !req.params.id) {
            return next();
        }
        
        if (!req.session.userid) {
            return res.status(401).json({
                success: false,
                message: "You must be logged in to borrow books"
            });
        }
        
        try {
            const user = await UserModel.findById(req.session.userid);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }
            
            const book = await BookModel.findOne({ id: req.params.id });
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }
            
            if (!book.status) {
                return res.status(400).json({
                    success: false,
                    message: "Book is not available for borrowing"
                });
            }
            
            const existingLoan = await LoanModel.findOne({ 
                userId: user.id,
                bookId: book.id,
                returnDate: null,
                status: true
            });
            
            if (existingLoan) {
                return res.status(400).json({
                    success: false,
                    message: "You have already borrowed this book"
                });
            }
            
            const lastLoan = await LoanModel.findOne().sort('-id');
            const newId = lastLoan ? lastLoan.id + 1 : 1;
            
            const newLoan = new LoanModel({
                id: newId,
                userId: user.id,
                bookId: book.id,
                borrowedDate: Date.now(),
                returnDate: null,
                status: true
            });
            
            await newLoan.save();
            
            book.status = false;
            await book.save();
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(200).json({
                    success: true,
                    message: "Book borrowed successfully",
                    loan: newLoan
                });
            }
            
            req.session.successMessage = "Book borrowed successfully";
            return res.redirect('/user');
            
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error borrowing book:`, err);
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(500).json({
                    success: false,
                    message: "An error occurred while borrowing the book"
                });
            }
            
            res.locals.error = "An error occurred while borrowing the book";
            return next();
        }
    };
};
