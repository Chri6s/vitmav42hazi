const db = require("../lib/js/db");

const Loan = db.model("Loan", {
    id: Number,
    userId: Number,
    bookId: Number,
    borrowedDate: Number,
    returnDate: Number || null,
    status: Boolean
});

module.exports = Loan;