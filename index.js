const express = require("express");
const { ConfigHandler } = require("./lib/js/ConfigHandler");
let configHandler = new ConfigHandler();
let port = configHandler.get("serverOptions", "port");
let app = express();

app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
    res.send(`I'm running on port: ${configHandler.get("serverOptions", "port")}`);
});

let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})