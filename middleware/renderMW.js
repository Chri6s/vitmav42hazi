
const requireOption = require('../lib/js/requireOption');

module.exports = function(objectrepository, viewName) {
    return function(req, res) {
        res.render(viewName, {
            successMessage: req.session.successMessage || null
        });
        
        if (req.session.successMessage) {
            req.session.successMessage = null;
        }
    };
};