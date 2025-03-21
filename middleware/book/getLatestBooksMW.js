const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const BookModel = requireOption(objectRepository, 'BookModel');
    
    return async function(req, res, next) {
        try {
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            
            let newBooks = [];
            try {
                newBooks = await BookModel.find({ 
                    createdAt: { $gte: firstDayOfMonth } 
                })
                .sort('title')
                .limit(16);
                if (newBooks.length < 16) {
                    newBooks = await BookModel.find({})
                        .sort('-id')  
                        .limit(16);
                }
            } catch (err) {
                console.log(`[${colors.cyan("MW")}][⚠️] Error fetching new books:`, err);
                newBooks = Array.from({ length: 16 }, (_, i) => ({
                    id: i + 5,
                    author: `Author ${i + 5}`,
                    title: `Title ${i + 5}`,
                    date: new Date().toLocaleDateString(),
                    status: true
                }));
            }
            res.locals.newBooks = newBooks;
            
            
            
            return next();
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error rendering main page:`, err);
            res.locals.error = "An error occurred while loading the main page";
            return next();
        }
    };
};