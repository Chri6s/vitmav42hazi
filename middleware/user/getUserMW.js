const requireOption = require("../../lib/js/requireOption");
const colors = require("yoctocolors");
const crypto = require("crypto");

module.exports = function(objectRepository) {
    const UserModel = requireOption(objectRepository, 'UserModel');
    const LoanModel = requireOption(objectRepository, 'LoanModel');
    const BookModel = requireOption(objectRepository, 'BookModel');

    return async function(req, res, next) {
        if (!req.session.userid) {
            return res.redirect('/login');
        }

        try {
            // Fetch the user data
            const user = await UserModel.findById(req.session.userid);
            if (!user) {
                return res.redirect('/login');
            }

            // Set user data in res.locals
            res.locals.user = user;
            
            // Fetch the user's loans with associated book information
            const loans = await LoanModel.find({ userId: user.id });
            
            // Create an array to store loan information with book details
            const loanDetails = [];
            
            // Fetch book details for each loan
            for (const loan of loans) {
                const book = await BookModel.findOne({ id: loan.bookId });
                if (book) {
                    loanDetails.push({
                        loan: loan,
                        book: book,
                        borrowedDate: new Date(loan.borrowedDate).toLocaleDateString(),
                        returnDate: loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : null
                    });
                }
            }
            
            // Set loan data in res.locals
            res.locals.loans = loanDetails;

            // Handle gravatarEmail if it exists
            if (user.gravatarEmail) {
                // Use gravatarEmail as is since it should already be hashed
                res.locals.gravatarHash = user.gravatarEmail;
            } else {
                // If no gravatarEmail, set a default value or null
                res.locals.gravatarHash = null;
            }

            return next();
        } catch (err) {
            console.log(`[${colors.cyan("MW")}][❌] Error fetching user data:`, err);
            return next(err);
        }
    };
};