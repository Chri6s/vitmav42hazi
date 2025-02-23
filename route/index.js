const renderMW = require("../middleware/renderMW");


module.exports = function(app) {
    app.use('/', renderMW(obj, 'index'));
}