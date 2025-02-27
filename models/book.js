const db = require("../lib/js/db");

const Book = db.model("Book", {
    id: Number,
    title: String,
    author: String,
    ISBN: String,
    category: String,
    status: Boolean // Ha 0 akkor nem elérhető, Ha 1 kölcsönözhető
});

module.exports = Book;