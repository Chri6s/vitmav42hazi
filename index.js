const express = require("express");
const mongoose = require('mongoose');
const { ConfigHandler } = require("./lib/js/ConfigHandler");
let app = express();
let configHandler = new ConfigHandler();
let port = configHandler.get("serverOptions", "port");

mongoose.connect('mongodb://127.0.0.1:27017/test');
const Cat = mongoose.model('Cat', { name: String });



app.get("/", (req, res, next) => {
    const kitty = new Cat({ name: 'Zildjian' });
    kitty.save().then(() => console.log('meow'));
    res.send(`I'm running on port: ${configHandler.get("serverOptions", "port")}`);

});

let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})