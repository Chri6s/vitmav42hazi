const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const BookModel = requireOption(objectRepository, 'BookModel');
    
    return async function(req, res, next) {
        if (req.method !== 'POST' || !req.body || !req.params.id) {
            return next();
        }
        
        try {
            if (!req.body.title || !req.body.author || !req.body.ISBN) {
                res.locals.error = "Title, author, and ISBN are required";
                return next();
            }
            
            const updatedBook = await BookModel.findOneAndUpdate(
                { id: req.params.id },
                {
                    title: req.body.title,
                    author: req.body.author,
                    ISBN: req.body.ISBN,
                    category: req.body.category || "Uncategorized",
                    status: req.body.status !== undefined ? req.body.status : true
                },
                { new: true }
            );
            
            if (!updatedBook) {
                res.locals.error = "Book not found";
                return next();
            }
            
            req.session.successMessage = "Book updated successfully";
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(200).json({
                    success: true,
                    message: "Book updated successfully",
                    book: updatedBook
                });
            }
            
            return res.redirect('/search');
            
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error updating book:`, err);

            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(500).json({
                    success: false,
                    message: "An error occurred while updating the book"
                });
            }
            
            res.locals.error = "An error occurred while updating the book";
            return next();
        }
    };
};
