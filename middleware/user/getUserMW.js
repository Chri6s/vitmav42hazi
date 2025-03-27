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
            const user = await UserModel.findById(req.session.userid);
            if (!user) {
                return res.redirect('/login');
            }

            res.locals.user = user;
            
            const loans = await LoanModel.find({ userId: user.id });
            
            const bookIds = loans.map(loan => loan.bookId);
            const books = await BookModel.find({ id: { $in: bookIds } });
            const booksMap = books.reduce((map, book) => {
                map[book.id] = book;
                return map;
            }, {});
            const loanDetails = loans.map(loan => ({
                loan: loan,
                book: booksMap[loan.bookId],
                borrowedDate: new Date(loan.borrowedDate).toLocaleDateString(),
                returnDate: loan.returnDate ? new Date(loan.returnDate).toLocaleDateString() : null
            }));
            
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