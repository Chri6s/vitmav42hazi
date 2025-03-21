const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const BookModel = requireOption(objectRepository, 'BookModel');
    const LoanModel = requireOption(objectRepository, 'LoanModel');
    
    return async function(req, res, next) {
        if (req.method !== 'POST' || !req.params.id) {
            return next();
        }
        
        if (!req.session.userid) {
            return res.status(401).json({
                success: false,
                message: "You must be logged in to return books"
            });
        }
        
        try {
            const userId = req.session.userid;
            
            const loan = await LoanModel.findOne({
                bookId: req.params.id,
                returnDate: null,
                status: true
            });
            
            if (!loan) {
                return res.status(404).json({
                    success: false,
                    message: "No active loan found for this book"
                });
            }
            
            loan.returnDate = Date.now();
            await loan.save();
            
            const book = await BookModel.findOne({ id: req.params.id });
            if (book) {
                book.status = true;
                await book.save();
            }
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(200).json({
                    success: true,
                    message: "Book returned successfully"
                });
            }
            
            req.session.successMessage = "Book returned successfully";
            return res.redirect('/user');
            
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error returning book:`, err);
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(500).json({
                    success: false,
                    message: "An error occurred while returning the book"
                });
            }
            
            res.locals.error = "An error occurred while returning the book";
            return next();
        }
    };
};