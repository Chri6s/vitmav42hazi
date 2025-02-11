const express = require("express");
let app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/test');
const Cat = mongoose.model('Cat', { name: String });

let port = 3000;

app.get("/", (req, res, next) => {
    const kitty = new Cat({ name: 'Zildjian' });
    kitty.save().then(() => console.log('meow'));
    res.send('<h1>Hello vro<3 I did something in the background!</h1>');

});

let server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})