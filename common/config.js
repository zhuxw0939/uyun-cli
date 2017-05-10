
var path = require('path');
// var siteConfig = process.env.NODE_ENV === 'development' ? require('./config_dev') : require('./config_test');
var siteConfig;
if(process.env.NODE_ENV === 'development'){
	// 本地开发环境
	siteConfig = require('./config_dev');
} else {
	// 生产环境
	siteConfig = require('./config_prod');
}

module.exports = {

	// 项目名称
	name: siteConfig.name,
	// 描述
	description: siteConfig.description,
	// 版本号
	v: siteConfig.v,

	// 域名
	host: siteConfig.host,
	// 程序运行的端口
	port: siteConfig.port,
	// 登录云平台地址
	loginAuthUrl: siteConfig.loginAuthUrl,
	appId: siteConfig.appId,

	// debug 为 true 时，用于node后端本地windows开发环境调试
	debug: siteConfig.debug,
	logger_level: siteConfig.logger_level,
	logger_save: siteConfig.logger_save,

	// 接口服务器
	servers: siteConfig.servers,

	// webpackServer 为 true 时，用于本地调试， 为 false 时，用于线上编绎环境，此时需要使用"npm run dev"启动webpack服务器
	webpackServer: siteConfig.webpackServer,
	static_host: "/",

	// mock设置 为 true 时，从mock服务器取数据，为 false 时从servers取数据
	mock: {
		open: siteConfig.mock.open,
		host: siteConfig.mock.host,
		url: siteConfig.mock.host+"/mock/url/",
		userId: siteConfig.mock.user,
		headers: {
			'X-Custom-Header': 'Bumbaway atuna',
			'Content-Type': 'application/json'
		},
		saveApiHost: siteConfig.mock.host+"/looks/writeApi/",
		serversApiFileUrl: siteConfig.mock.host+"/build/"+siteConfig.mock.v_id+".js",
		apiSave: siteConfig.mock.apiSave,
		p_id: siteConfig.mock.p_id,
		v_id: siteConfig.mock.v_id
	},

	// session和cookies配置
	sessionMaxAge: siteConfig.sessionMaxAge,
	cookieMaxAge: siteConfig.cookieMaxAge,
	cookieAuthName: siteConfig.cookieAuthName,
	cookieDomain: siteConfig.cookieDomain,

	// Redis
	redis: {
		host: siteConfig.redis.host,
		port: siteConfig.redis.port,
		pass: siteConfig.redis.pass
	},
	redisStoreOptions: {
		host: siteConfig.redis.host,
		port: siteConfig.redis.port,
		pass: siteConfig.redis.pass,
		db: Number(siteConfig.redis.db),
		prefix: siteConfig.redis.prefix,
		ttl: siteConfig.redis.ttl
	},
	redisClientOptions: {
		host: siteConfig.redis.host,
		port: siteConfig.redis.port,
		password: siteConfig.redis.pass,
		db: Number(siteConfig.redis.db)
	},

	oss: siteConfig.oss,

	levelOptions: [{
		id: [1],
		level: 1,
		name: "市级",
		value: "city"
	}, {
		id: [2],
		level: 2,
		name: "区县级",
		value: "county"
	}, {
		id: [3],
		level: 3,
		name: "校级",
		value: "school"
	}],

	typeOptions: [{
		id: ["CJGLY", "XXCJGLY"],
		name: "成绩管理员",
		value: "admin"
	}, {
		id: ["XXLD"],
		name: "学校领导",
		value: "schoolLeader"
	}, {
		id: ["NJZR"],
		name: "年级主任",
		value: "schoolGrade"
	}, {
		id: ["XKZZ"],
		name: "学科组长",
		value: "schoolCourse"
	}, {
		id: ["XXLS"],
		name: "学校老师",
		value: "schoolTeacher"
	}, {
		id: ["JYJLD"],
		name: "教育局领导",
		value: "moeLeader"
	}, {
		id: ["JYY"],
		name: "教研员",
		value: "teachingStaff"
	}]

};
