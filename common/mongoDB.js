

/**
 * mongoDB
 */

var mongoose = require("mongoose");
var shortid = require('shortid');
var config = require("../common/config");


var db = mongoose.connect(config.mongodb.host);


var userSchema = new mongoose.Schema({
	id   			: { type:String, default:shortid.generate },
	email	 		: { type:String },
	name	 		: { type:String },
	password	 	: { type:String },
	last_login		: { type:Date, default:Date.now },
	create_time 	: { type:Date, default:Date.now },
	type		 	: { type:Number, default:0 } //状态 0-普通用户,1-管理员,-1-已删除
});

var projectSchema = new mongoose.Schema({
	id   			: { type:String, default:shortid.generate },
	name	 		: { type:String },
	password	 	: { type:String },
	column			: { type:String }, //分类
	user_id 		: { type:String }, //创建人
	user_name		: { type:String }, //创建人名称
	version_id		: { type:String }, //默认版本id
	version_name	: { type:String }, //默认版本名称
	team_ids		: { type:Array }, //项目协作者
	create_time 	: { type:Date, default:Date.now },
	type 			: { type:Number, default:0 } //状态 0-已发布,1-已审核,-1-已删除
});

var projectVersionSchema = new mongoose.Schema({
	id   			: { type:String, default:shortid.generate },
	name	 		: { type:String }, //版本号
	project_id		: { type:String }, //对应项目id
	create_time 	: { type:Date, default:Date.now },
	type 			: { type:Number, default:0 } //状态 0-已发布,1-已审核,-1-已删除
});

var projectGroupSchema = new mongoose.Schema({
	id   			: { type:String, default:shortid.generate },
	name	 		: { type:String }, //栏目名称
	sort			: { type:Number, default:10 }, //排序
	level	 		: { type:String, default:1 }, //栏目等级：支持1级栏目，2级栏目
	father_id	 	: { type:String, default:0 }, //上级栏目的id，默认为0
	project_id		: { type:String },
	version_id		: { type:String },
	create_time 	: { type:Date, default:Date.now },
	type 			: { type:Number, default:0 } //状态 0-已发布,1-已审核,-1-已删除
});

var apiSchema = new mongoose.Schema({
	id   			: { type:String, default:shortid.generate },
	name 			: { type:String }, // 接口名称，不能为空
	url  			: { type:String }, // 请求地址
	parameters		: { type:Array }, // 参数-数组形式 [{name:x, type:x, ismust:x, info:x, default:x,}]
	group_id		: { type:String }, // 所属栏目
	request_type 	: { type:String }, // 请求方式
	description		: { type:String }, // 接口描述
	back_data		: { type:String }, // 返回结果
	back_description: { type:String }, // 接口返回说明
	writes 			: { type:String }, // 备注
	project_id		: { type:String }, // 所属项目id，不能为空
	version_id		: { type:String }, // 所属版本号id，不能为空
	create_id 		: { type:String }, // 创建用户id
	create_name 	: { type:String }, // 创建用户名称，创建后即不能修改
	create_time 	: { type:Date, default:Date.now },
	update_id		: { type:String }, // 最后修改用户id
	update_name		: { type:String }, // 最后修改用户名称
	update_time 	: { type:Date, default:Date.now },
	type 			: { type:Number, default:0 } // 状态 0-已发布,1-已审核,-1-已删除
});

var userEnvSchema = new mongoose.Schema({
	id   			: { type:String, default:shortid.generate },
	name	 		: { type:String },
	host		 	: { type:String },
	header			: { type:String },
	session_id		: { type:String },
	user_id			: { type:String },
	create_time 	: { type:Date, default:Date.now },
	type		 	: { type:Number, default:0 } // 状态 0-已发布,1-已审核,-1-已删除
});

var userMessageSchema = new mongoose.Schema({
	id   			: { type:String, default:shortid.generate },
	title	 		: { type:String }, //消息标题
	info		 	: { type:String }, //消息内容，必须是文本格式
	link		 	: { type:String }, //消息链接，一般为url
	is_read		 	: { type:Boolean, default:false }, //是否已读
	user_id			: { type:String }, //接收者id，不能为空
	send_id			: { type:String, default:0 }, //发送者，默认0-admin
	send_name		: { type:String, default:'系统管理员' }, //发送者名称
	create_time 	: { type:Date, default:Date.now },
	type		 	: { type:Number, default:0 } // 状态 0-已发布,1-已审核,-1-已删除
});

var apiSaveSchema = new mongoose.Schema({
	id   			: { type:String },
	requests 		: { type:String },
	url  			: { type:String },
	parameters		: { type:Object },
	back	 		: { type:String },
	ip	 			: { type:String },
	time 			: { type:Date, default:Date.now }
});



exports.user = db.model('lk_user', userSchema);
exports.project = db.model('lk_project', projectSchema);
exports.projectVersion = db.model('lk_project_version', projectVersionSchema);
exports.projectGroup = db.model('lk_project_group', projectGroupSchema);
exports.api = db.model('lk_api', apiSchema);
exports.userEnv = db.model('lk_user_env', userEnvSchema);
exports.userMessage = db.model('lk_user_message', userMessageSchema);

exports.apiSave = db.model('lk_apisave', apiSaveSchema);



