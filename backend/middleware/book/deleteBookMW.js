const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");

module.exports = function(objectRepository) {
    const BookModel = requireOption(objectRepository, 'BookModel');
    const LoanModel = requireOption(objectRepository, 'LoanModel');
    
    return async function(req, res, next) {
        if (req.method !== 'DELETE' || !req.params.id) {
            return next();
        }
        
        try {
            const book = await BookModel.findOne({ id: req.params.id });
            
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: "Book not found"
                });
            }
            
            const activeLoans = await LoanModel.findOne({ 
                bookId: req.params.id,
                returnDate: null, 
                status: true 
            });
            
            if (activeLoans) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot delete book with active loans"
                });
            }
            
            await BookModel.deleteOne({ id: req.params.id });
            
            return res.status(200).json({
                success: true,
                message: "Book deleted successfully"
            });
            
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error deleting book:`, err);
            return res.status(500).json({
                success: false,
                message: "An error occurred while deleting the book"
            });
        }
    };
};