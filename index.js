const express = require("express");
const session = require("express-session");
const { ConfigHandler } = require("./lib/js/ConfigHandler");
let configHandler = new ConfigHandler();
let port = configHandler.get("serverOptions", "port");
const compression = require('compression');
let app = express();


app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use(
    session({
        secret: configHandler.get("serverOptions", "sessionSecret"),
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true
        }
    })
);

require("./route/index")(app);


let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
