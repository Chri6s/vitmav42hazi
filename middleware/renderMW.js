
const requireOption = require('../lib/js/requireOption');

module.exports = function(objectrepository, viewName, params) {
    return function(req, res) {
        res.render(viewName, params);
    };
};