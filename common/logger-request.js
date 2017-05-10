var logger = require('./logger');

var ignore = /^\/(public|agent)/;

exports = module.exports = function (req, res, next) {
	// Assets do not out log.
	if (ignore.test(req.url)) {
		next();
		return;
	}

	var t = new Date();

	// mytest 屏蔽静态资源日志记录
	var mytest = (req.url.substr(0,4)=="/sta" || req.url.substr(0,4)=="/fav" || req.url.substr(0,4)=="/css" || req.url.substr(0,4)=="/scr" || req.url.substr(0,4)=="/img" || req.url.substr(0,4)=="/ima" || req.url.substr(0,4)=="/dis");
	// if(!mytest){
	if(1){
		logger.info('\n\n\n'+'Started', t.toISOString(), req.method, req.url, req.ip, '\n\n');
	}

	res.on('finish', function () {
		var duration = ((new Date()) - t);

		// mytest
		if(!mytest){
			logger.info('Completed'.red, req.method, req.url, res.statusCode, ('(' + duration + 'ms)').green);
		}

	});

	next();
};
