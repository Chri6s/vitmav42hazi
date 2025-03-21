const requireOption = require('../lib/js/requireOption');

module.exports = function(objectrepository, viewName, extraVariables = {}) {
    return function(req, res) {
        let renderVariables = {
            successMessage: req.session && req.session.successMessage ? req.session.successMessage : null
        };
        if (res.locals) {
            renderVariables = { ...renderVariables, ...res.locals };
        }
        renderVariables = { ...renderVariables, ...extraVariables };
        
        res.render(viewName, renderVariables);

        if (req.session && req.session.successMessage) {
            req.session.successMessage = null;
        }
    };
};