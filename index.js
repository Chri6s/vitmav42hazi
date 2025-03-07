const express = require("express");
const { ConfigHandler } = require("./lib/js/ConfigHandler");
let configHandler = new ConfigHandler();
let port = configHandler.get("serverOptions", "port");
let app = express();

app.set("view engine", "ejs");
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./route/index")(app);


let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})