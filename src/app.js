var bodyParser = require('body-parser');
var compression = require('compression');
var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');

var dbURL = process.env.MONGOHQ_URL || 'mongodb://localhost/drawdb';

var db = mongoose.connect(dbURL, function(err) {
	if(err) {
		console.log('Could not connect to database');
		throw err;
	}
});

var redisURL = {
    hostname: 'localhost',
    port: 6379
};

var redisPASS;

if(process.env.REDISCLOUD_URL){
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    redisPASS = redisURL.auth.split(":")[1];
}

var router = require('./router.js');

var server;
var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();
app.use('/assets', express.static(path.resolve(__dirname+'../../client/')));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    store: new RedisStore({
        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisPASS
    }),
    secret: 'drawing tool',
    resave: true,
    saveUninitialized: true
}));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

router(app);

server = app.listen(port, function(err) {
	if(err) {
		throw err;
	}
	console.log('Listening on port ' + port);
});

var io = require('socket.io')(server);

io.on('connection', function(socket) {
    onUpdate(socket);
});

var onUpdate = function(socket) {
    socket.on('addDraw', function(data) {
        io.emit('addDraw', data);
    });
}
