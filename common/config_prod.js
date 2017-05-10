/**
 * @192.168.2.84测试环境
 *
 *
 ***/
var path = require('path');

module.exports = {

	// 项目名称
	name: "school.app.score",
	// 描述
	description: "教学质量监控平台-生学教育",
	// 版本号
	v: "0.1.0",

	// 域名
	host: 'http://192.168.2.84',
	// 端口号，必须配置
	port: 3004,

	// 平台登录地址，一般登录失效后会跳到这个地址
	loginAuthUrl: "http://192.168.2.84:3100/",

	// appId，当前平台的id，正式环境可以不用修改
	appId: "3",

	// 是否开启debug模式，正式环境可以关闭
	debug: false,
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
		db: 7,
		prefix: 'sess:', // redis数据表前辍
		ttl: 60*60*24
	},

	// oss配置
	oss: {
		OSSAccessKeyId: 'hh8VeIaK3yI5xHfA',
		secret: 'VM9l16oZ8eiURXc1GPBXBnmRH6jlTC',
		host: 'http://jiuhu-sxjy-firstbucket.oss-cn-hangzhou.aliyuncs.com',
		path: "xwcz-web/uploads/"
	},

	// session失效时间
	sessionMaxAge: 60*60*24,
	// cookie有效期
	cookieMaxAge: 1000*60*60*24,
	// cookie存储的key
	cookieAuthName: "sxw_token",
	// cookie保存的域名，在测试ip环境下一般留空，正式环境一般为主域名如".sxw.com"
	cookieDomain: "",

	// 正式环境只需要配置host，默认"/dist"
	webpackServer: {
		open: false,
		host: '/dist',
		host_new: '/dist2'
	},

	// 正式环境前三个参数都必须关闭，其它参数无所谓
	mock: {
		open: false,
		user: false, // 0-市级 1-区县级 2-校级，不想mock用户时请务必设为空或false
		apiSave: true,
		host: "http://192.168.2.56:3300",
		p_id: "SklRa0r$qg",
		v_id: "SJxRNEcHqx"
	}
};
