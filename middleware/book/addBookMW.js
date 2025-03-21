const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const BookModel = requireOption(objectRepository, 'BookModel');
    
    return async function(req, res, next) {
        if (req.method !== 'POST' || !req.body || req.path !== '/book/add') {
            return next();
        }
        
        try {
            if (!req.body.title || !req.body.author || !req.body.ISBN) {
                res.locals.error = "Title, author, and ISBN are required";
                return next();
            }
            
            const lastBook = await BookModel.findOne().sort('-id');
            const newId = lastBook ? lastBook.id + 1 : 1;
            
            const newBook = new BookModel({
                id: newId,
                title: req.body.title,
                author: req.body.author,
                ISBN: req.body.ISBN,
                category: req.body.category || "Uncategorized",
                status: true
            });
            
            await newBook.save();
            
            req.session.successMessage = "Book added successfully";
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(201).json({
                    success: true,
                    message: "Book added successfully",
                    book: newBook
                });
            }
            
            return res.redirect('/search');
            
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error adding book:`, err);
            
            if (req.xhr || req.headers.accept.indexOf('json') > -1) {
                return res.status(500).json({
                    success: false,
                    message: "An error occurred while adding the book"
                });
            }
            
            res.locals.error = "An error occurred while adding the book";
            return next();
        }
    };
};
