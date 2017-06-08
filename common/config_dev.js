/**
 * @127.0.0.1本地开发环境
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
	host: 'http://127.0.0.1',
	// 端口号，必须配置
	port: 3005,

	// 平台登录地址，一般登录失效后会跳到这个地址
	loginAuthUrl: "http://www.sxw.com:3100/",

	// appId，当前平台的id，正式环境可以不用修改
	appId: "5",

	// 是否开启debug模式，正式环境可以关闭
	debug: true,
	logger_level: 'DEBUG',
	logger_save: './.logs/logger.log', // logs文件输出地址，目前没有用到

	// servers配置
	servers: {
		// host: 'http://101.37.13.152:8100',
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
		db: 2,
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

	// webpackServer配置
	webpackServer: {
		// 是否启用开发者模式，true 时为dev模式，false 时为build模式
		open: true,
		host: 'http://127.0.0.1:8586/dist'
	},

	// 正式环境前三个参数都必须关闭，其它参数无所谓
	mock: {
		open: false,
		user: false, // 1-公司管理员 2-终端管理员
		apiSave: true,
		host: "http://192.168.2.56:3300",
		p_id: "SklRa0r$qg",
		v_id: "SJxRNEcHqx"
	}
};
