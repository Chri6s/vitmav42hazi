const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const BookModel = requireOption(objectRepository, 'BookModel');

    return async function(req, res, next) {
        try {
            const searchType = req.query.type || 'title'; // Default search by title
            const searchTerm = req.query.term || '';
            
            let query = {};
            
            if (searchTerm) {
                const regex = new RegExp(searchTerm, 'i');
                
                switch (searchType) {
                    case 'author':
                        query.author = regex;
                        break;
                    case 'ISBN':
                        query.ISBN = regex;
                        break;
                    case 'date': 
                        if (!isNaN(searchTerm)) {
                            query.date = searchTerm;
                        }
                        break;
                    case 'title':
                    default:
                        query.title = regex;
                        break;
                }
            }
            
            // Fetch books matching the query
            const books = await BookModel.find(query).sort('title');
            
            // Add to res.locals for use in rendering
            res.locals.books = books;
            res.locals.searchType = searchType;
            res.locals.searchTerm = searchTerm;
            
            return next();
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error fetching books:`, err);
            res.locals.error = "An error occurred while fetching books";
            return next();
        }
    };
};
