const mongoose = require('mongoose');
const colors = require("yoctocolors");
const { ConfigHandler } = require('./ConfigHandler');
const configHandler = new ConfigHandler();
mongoose.connect(configHandler.get("serverOptions", "dbEndpoint"), { useNewUrlParser: true })
    .then(() => console.log(`[${colors.magenta("DB")}][✅] - Connected to MongoDB on: ${configHandler.get("serverOptions", "dbEndpoint")}`))
    .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;
