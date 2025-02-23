
const requireOption = require('../lib/js/requireOption');

module.exports = function(objectrepository, viewName) {
    return function(req, res) {
        res.render(viewName);
    };
};