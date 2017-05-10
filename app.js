
/**
 * node start 入口
 */

// 基本模块
var colors = require('colors');
var path = require('path');
var express = require('express');
var history = require('connect-history-api-fallback');
var favicon = require('serve-favicon');
var swig = require('swig');
var http = require('http');
// 中间件模块
var compression = require('compression');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
// 配置模块
var config = require('./common/config');
// 认证模块
var authModel = require('./models/auth');
// 日志处理模块
var logger = require('./common/logger');
var requestLog = require('./common/logger-request');
// 路由模块
var site = require('./routes/site');
var api = require('./routes/api');


var app = express();
app.use(history({
	rewrites: [
		{
			from: /^.*$/,
			to: '/'
		}
	]
}));

// compression
app.use(compression());

// html template parsing
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Request logger
app.use(requestLog);

// static
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

// middleware
app.use(bodyParser.json({limit: "5mb"}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: false }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	store: new RedisStore(config.redisStoreOptions),
	name: "session_id",
	secret: 'sx_school_app',
	resave: true,
	saveUninitialized: false
	// cookie: {maxAge: config.sessionMaxAge}
}));

// auth TODO
app.use(authModel.authUser);

// routes
app.use('/', site);
app.use('/api', api);


// error handling
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handling
if (config.debug) {
	// development
	app.use(function(err, req, res, next) {
		logger.debug(err);
		if(err.status === 404){
			res.status(err.status || 404);
			res.render('404', {
				env: "development",
				message: err.message,
				error: err
			});
		} else {
			res.status(err.status || 500);
			res.render('500', {
				env: "development",
				message: err.message,
				error: err
			});
		}
	});
} else {
	// production
	app.use(function(err, req, res, next) {
		logger.debug(err);
		if(err.status === 404){
			res.status(err.status || 404);
			res.render('404', {
				env: "production",
				message: err.message,
				error: err
			});
		} else {
			res.status(err.status || 500);
			res.render('500', {
				env: "production",
				message: err.message,
				error: err
			});
		}
	});
}



// node server start
var port = normalizePort(config.port || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			logger.error(bind + ' requires elevated privileges');
			break;
		case 'EADDRINUSE':
			logger.error(bind + ' is already in use');
			break;
		default:
			throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	logger.debug('App start success, listen on ' + config.host + ' ' + bind);
}

function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	if (port >= 0) {
		// port number
		return port;
	}
	return false;
}

module.exports = app;
