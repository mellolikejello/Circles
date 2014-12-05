var controllers = require('./controllers');
var mid = require('./middleware');

var router = function(app) {
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
    app.get("/logout", mid.requiresLogin, controllers.Account.logout);
    app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);
    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
    app.get('/', mid.requiresLogin, controllers.Draw.drawPage);
    app.post('/', mid.requiresLogin, controllers.Draw.draw);
};

module.exports = router;
