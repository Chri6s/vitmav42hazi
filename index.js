let express = require("express");
let app = express();

let port = 3000;
app.get("/", (req, res, next) => {
    res.send('Hello vro<3');
});

let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})