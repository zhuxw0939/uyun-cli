/**
 * @默认配置
 *
 *
 ***/
var path = require('path');

module.exports = {

	// 项目名称
	name: "sxweb.app.score",
	// 描述
	description: "xxx监控平台",
	// 版本号
	v: "0.1.0",

	// 域名
	host: 'http://127.0.0.1',
	// 端口号，必须配置
	port: 6060,

	// 平台登录地址，一般登录失效后会跳到这个地址
	loginAuthUrl: "http://127.0.0.1:3100/",

	// 是否开启debug模式，正式环境可以关闭
	// 日志级别logger.debug()、logger.warn()、logger.error()、logger.fatal()任何时候会打印出来。
	// 开启debug时，logger.info()会以mydebug:logger.info xxx 打印出来，一般用于数据、请求、变量等。
	// 关闭debug时，logger.info()会被取消。
	debug: true,
	logger_level: 'DEBUG',
	logger_save: './.logs/logger.log', // logs文件输出地址，目前没有用到

	// servers配置
	servers: {
		host: 'http://192.168.2.85:8100',
		headers: {
			'Content-Type': 'application/json'
		}
	},

	// redis配置
	redis: {
		host: '192.168.2.56',
		port: '6379',
		pass: 'Sxw@123456',
		db: 6,
		prefix: 'sess:', // redis数据表前辍
		ttl: 60*60*24
	},

	// session失效时间
	sessionMaxAge: 60*60*24,
	// cookie有效期
	cookieMaxAge: 1000*60*60*24,
	// cookie存储的key
	cookieAuthName: "sxweb_token",
	// cookie保存的域名，在测试ip环境下一般留空，正式环境一般为主域名如".sxw.com"
	cookieDomain: "",

	// 正式环境只需要配置host，默认"/dist"
	webpackServer: {
		open: true,
		// host: '/dist'
		host: 'http://127.0.0.1:8989/dist'
	},

	// 正式环境前三个参数都必须关闭，其它参数无所谓
	mock: {
		open: true,
		user: false, // 0-市级 1-区县级 2-校级，不想mock用户时请务必设为空或false
		apiSave: true,
		host: "http://www.uyun.net:3300",
		p_id: "SklRa0r$qg",
		v_id: "SJxRNEcHqx"
	}
};
