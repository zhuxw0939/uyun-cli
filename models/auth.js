var eventproxy = require('eventproxy');
var config = require('../common/config');

var serversApi = require('../models/serversApi');
var mockApi = require('../models/mockApi');
var logger = require('../common/logger');


/**
 * 每次刷新页面时检查登录状态，暂时用于app.js
 */
exports.authUser = function (req, res, next) {

	// 前端静态资源路径，目前未使用
	res.locals.static_host = config.static_host;
	// 前端vue打包资源路径
	res.locals.build_host = config.webpackServer.host;
	// 传入query
	res.locals.query = req.query;
	// 传入user
	res.locals.user = null;
	res.locals.v = config.v;

	// return next();


	// 传了appId进来，则认为是有新用户登录系统了，强制删除掉session，并重新跳到首页
	if(req.query.appId!=undefined && req.query.appId!="" && req.query.appId!="undefined"){
		req.session.appId = req.query.appId;
		delete req.session.user;
		logger.warn("〓〓〓 检测到新用户登录，清除session，跳至首页");
		return res.redirect("/");
	}

	// 如果没有取到用户的session信息，则认为用户未登录
	if(!req.session.user) {

		var myip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(":").pop();
		logger.debug("** 未登录用户：没有取到session" + myip);

		// **从cookie中获取token
		let auth_token = req.cookies[config.cookieAuthName];
		if(!auth_token || auth_token=="undefined"){
			logger.warn("〓〓〓 cookie中没有token，跳至登录页面");
			// ***连token都没有，则跳至登录页面
			return res.redirect(config.loginAuthUrl);
		}
		logger.debug("** 从浏览器cookie获取token成功："+auth_token);

		// **从session中获取appId
		var appId;
		if(req.session.appId!=undefined && req.session.appId!="" && req.session.appId!="undefined"){
			appId = req.session.appId;
		} else {
			if(req.method !== 'GET'){
				return res.send({
					status: -1,
					message: "session中无appId，可能是session失效，请重新登录！"
				});
			} else {
				logger.warn("〓〓〓 有token，但没有session中无appId，可能是session失效，跳至登录页面");
				return res.redirect(config.loginAuthUrl);
			}
		}
		logger.debug("** 从session获取appId成功："+appId);

		// **有token和appId后，获取用户的角色权限
		exports.authToken(auth_token, appId, function(error, data){
			logger.info("** auth.authToken back ");
			if(error) {
				// ***获取角色失败，跳至登录页面
				logger.warn("〓〓〓 获取角色失败，跳至登录页面："+error);
				res.redirect(config.loginAuthUrl);
			} else {
				logger.debug("** 获取用户的角色权限成功：");
				// ***获取角色成功，写入登录信息到session
				exports.writeLoginSession(req, res, next, auth_token, data, function(error, backData){
					logger.info("** auth.writeLoginSession back ");
					if(error){
						next(error);
					} else {
						// 跳至首页
						logger.debug(">>>****** 写入session成功，跳至首页 ******<<<");
						res.redirect("/");
					}
				});
			}
		});

	} else {
		var myip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(":").pop();

		// **用户已登录，开始验证用户的合法性
		logger.info("** 已登录用户，正在验证session的合法性 "+myip);

		// 从session中获取用户信息
		let userData = req.session.user;

		// ***验证用户信息是否完整 TODO
		if(!userData || userData.typeOptions==undefined){
			// ****不完整
			// 跳至登录页面
			logger.debug("〓〓〓 用户session信息不完整 退出重新登录 "+myip);
			return res.redirect("/user/logout");
		}

		try {
			
			// 删除用户的敏感信息，身份证号手机号码等。
			if(userData.info && userData.info.idnumber){
				delete userData.info.idnumber
			}
			if(userData.info && userData.info.phonenumber){
				delete userData.info.phonenumber
			}
			if(userData.info && userData.info.membership){
				delete userData.info.membership
			}

			// 将user信息传入页面
			res.locals.user = {
				appId: req.session.appId,
				roleCode: req.session.roleCode,
				name: userData.name, //用户名称
				ip: userData.ip, //用户名称
				level: userData.level, //级别-市/县/校
				type: userData.type, //权限-成绩管理员/**等
				path: req.path, //当前访问路径，不包括域名，不包括参数
				// examId: userData.examId, //examId，主要是为方便成绩分析页面不传exam_id参数而存在
				query: req.query, //页面query
				orgId: userData.orgId,
				info: userData.info
			};

			// 顶部用户信息传值
			res.locals.topData=  {
				name: userData.info.name,
				defaultValue: userData.type,
				options: userData.typeOptions
			};
			if(req.method === 'GET'){
				logger.debug(">>>****** 已登录用户，session合法，进入路由！ "+myip+" ******<<<");
			}
			next();
		} catch(error) {
			logger.debug("** 页面传值时失败！");
			logger.error(error);
			next("核心数据错误！");
		}
	}
};



/**
 * 写入用户登录session
 */
exports.writeUserSession = function (req, res, data) {
	// 写入session
	req.session.user = data;

	// 将用户的登录id写入cookie
	// res.cookie('user_id', data.id, {maxAge: config.maxAge});
	// res.cookie('user_id', data.id);
};

/**
 * 删除用户登录session
 */
exports.delUserSession = function (req, res) {
	// 删除session
	delete req.session.user;
};

/**
 * 验证token
 */
exports.authToken = function (token, appId, callback) {

	if(!appId){
		appId = config.appId;
	}

	var ep = new eventproxy();
	ep.fail(callback);

	ep.all('get_user', 'get_user_info', function (user, userInfo) {
		logger.info("get_user：back");
		logger.info(user);
		logger.info(userInfo);
		if (!user || !userInfo) {
			logger.info("auth_token：没有获取到用户信息");
			callback("auth_token：没有获取到用户信息", null);
		} else if(user.code==200 && userInfo.code==200){
			logger.info("auth_token：success");
			callback(null, {
				user: user.data,
				userInfo: userInfo.data
			});
		} else if(user.code==204) {
			// 用户没有绑定任何权限
			logger.info("auth_token：用户没有绑定任何权限");
			callback("auth_token：用户没有绑定任何权限", null);
		} else {
			// TODO
			logger.info("auth_token：用户信息获取错误");
			callback("auth_token：用户信息获取错误", null);
		}
	});

	// 根据token获取用户角色权限列表
	let auth_token = token;
	if (!auth_token || auth_token=="undefined") {
		logger.info("token不存在");
		return callback("auth_token：token不存在", null);
	} else {
		if(config.mock.userId!=undefined && config.mock.userId!="" && config.mock.userId!=false){
			mockApi.userGetAppRoleList(config.mock.userId, ep.done('get_user'));
			serversApi.getCurrentUserInfos({}, ep.done('get_user_info'));
		} else {
			// 获取用户拥有的角色（龚德志） #2017-03-13#
			serversApi.userGetAppRoleList({
				TOKEN: auth_token,
				appId: appId
			}, ep.done('get_user'));

			// 查询当前用户信息(胡君) #2017-03-14#
			serversApi.getCurrentUserInfos({
				TOKEN: auth_token
			}, ep.done('get_user_info'));
		}
	}

};


/**
 * 刷新token
 */
exports.refreshToken = function (token, appId, roleId, callback) {
	// 用户刷新token（龚德志） #2017-03-13#
	serversApi.authRefreshToken({
		TOKEN: token,
		appId: appId, //应用id
		roleId: roleId //角色id
	}, function(error, data){
		if(error){
			callback(error);
		} else {
			callback(null, data);
		}
	});
};



/**
 * 写入用户登录信息
 */
exports.writeLoginSession = function (req, res, next, auth_token, data, callback) {
	logger.info("*** writeLoginSession");
	// data = {
	// 	user: user,
	// 	userInfo: userInfo
	// }

	// 目前只会有一个角色(市县校三选一)
	// TODO 下个版本支持多角色切换,暂时取数组中的第一个角色
	//let userData = data.user[0];
    let userData = data.user[0];

	if(!userData){
		return callback("登录返回不为能空，无法进入系统！");
	}

	let userInfo = data.userInfo;

	// **获取当前用户的level角色-暂时根据level判断，后面可能会用id判断
	let userCurrentLevel;
	for(let item of config.levelOptions){
		if(item.level==userData.level) {
			userCurrentLevel = item.value;
			break;
		}
	}
	// 判断level是否合法
	if(!userCurrentLevel) {
		return callback("登录返回level错误，无法进入系统！");
	}

	// **获取该用户的所有角色-用id判断
	let userTypeOptions = [];
	logger.debug(userData.roleDTOList);
	if(userData.roleDTOList==undefined || typeof(userData.roleDTOList)!="object" || userData.roleDTOList.length<=0){
		return callback("登录返回角色type不为能空，无法进入系统！");
	}
	for(let item of userData.roleDTOList){
		for(let itemChildren of config.typeOptions){
			if(itemChildren.id.findIndex(arrItem => arrItem==item.roleCode)!=-1) {
				item.value = itemChildren.value;  // 复制一份value给前端vue组件用
				// item.name = item.roleName;  // 取后端返回的角色名
				// item.name = itemChildren.name;  // 取Node配置的角色名
				userTypeOptions.push(item);
				break;
			}
		}
	}
	logger.info(userTypeOptions);
	// 判断level是否合法
	if(userTypeOptions.length==0) {
		return callback("登录返回角色type.length=0，无法进入系统！");
	}

	// **设置用户当前角色type
	let userCurrentType;
	let userCurrentOrgId;
	let userRoleId;
	let userRoleCode;
	let userTypeValueOptions = [];
	for(let item of config.typeOptions){
		userTypeValueOptions.push(item.value);
	}
	if(req.query.type!=undefined && userTypeValueOptions.findIndex(item => item==req.query.type)!=-1){
		// ***传入了角色type by@config里的配置
		// TODO 目前好像不会触发
		userCurrentType = req.query.type;
		for(let item of userTypeOptions){
			if(item.value == req.query.type){
				userCurrentOrgId = item.orgId;
				userRoleId = item.id;
				userRoleCode = item.roleCode;
				break;
			}
		}
	} else {
		// ***没有传入角色type，取默认权限的第一个角色
		userCurrentType = userTypeOptions[0].value;
		userCurrentOrgId = userTypeOptions[0].orgId;
		userRoleId = userTypeOptions[0].id;
		userRoleCode = userTypeOptions[0].roleCode;
	}

	let myip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(":").pop();

	let backData = {
		token: auth_token,
		ip: myip,
		name: userData.orgName,
		orgId: userCurrentOrgId,
		level: userCurrentLevel,
		typeOptions: userTypeOptions,
		type: userCurrentType,
		info: userInfo
	};

    logger.info("backData：。。。。"+JSON.stringify(backData));

	// logger.debug(backData);
	req.session.user = backData;
	req.session.roleId = userRoleId;
	req.session.roleCode = userRoleCode;

	exports.refreshToken(req.session.user.token, req.session.appId, userRoleId, function(error, tokenData){
		if(error){
			return next("刷新token失败");
		} else {
			logger.info("*** 刷新token成功-首次登录");
			// logger.warn(tokenData);
			// logger.warn(tokenData.token);

            logger.info("刷新token:"+JSON.stringify(tokenData));



			// 写入session
		//	req.session.user.token = tokenData.token;
            req.session.user.token = tokenData.data.token;
			// 正常回调
			callback(null, backData);
		}
	});
};

/**
 * 检查是否?type=xxx传值，传值了就认定是切换角色
 * 目前用于首页切换角色时
 */
exports.checkQueryType = function (req, res, next) {
	let type = req.query.type;
	logger.info("checkQueryType coming");
	if (type!=undefined && req.session.user!=undefined && req.session.user.typeOptions!=undefined) {
		logger.info("开始检查首页切换角色 ***");
		// 判断传过来的type是否存在于session中
		let typeOptions = req.session.user.typeOptions;
		let typeTest = false;
		for(let item of typeOptions) {
			if(item.value == type){
				typeTest = true;
				break;
			}
		}
		if(typeTest){
			logger.debug("切换角色 ***"+type);
			// type有效，写入session
			req.session.user.type = type;

			let orgId = "";
			let roleId = "";
			let roleCode = "";
			for(let item of typeOptions){
				if(item.value == type){
					orgId = item.orgId;
					roleId = item.id;
					roleCode = item.roleCode;
					break;
				}
			}
			req.session.user.orgId = orgId;
			req.session.roleId = roleId;
			req.session.roleCode = roleCode;

			exports.refreshToken(req.session.user.token, req.session.appId, roleId, function(error, tokenData){
				if(error){
					return next("刷新token失败");
				} else {

					// 刷新token成功
					logger.debug("*** 刷新token成功-切换角色");
					// 写入session
					//req.session.user.token = tokenData.token;
                    req.session.user.token = tokenData.data.token;
					res.redirect("/home");
					// 跳转至首页
					// if(req.query.new==1) {
					// 	res.redirect("/home/");
					// } else {
					// 	res.redirect("/");
					// }
				}
			});

		} else {
			// type无效
			next();
		}
	} else {
		next();
	}
};



/**
 * 获取考试数据信息
 * 目前用于成绩分析所有页面
 */
exports.analysis = function (req, res, next) {
	res.locals.analysisPage = 1;

	if(!req.session.user || !req.session.user.token){
		return next("请登录后继续访问！");
	}

	let examId;
	// 没有传exam_id参数
	// if(!req.query.exam_id){
	if(!req.params.id){
		return next("exam_id不能为空！");
		// 从session里取一下，看有没有
		/*if(!req.session.user.examId){
		 return next("exam_id不能为空！");
		 } else {
		 examId = req.session.user.examId;
		 }*/
	} else {
		// 获取examId并写入用户session
		// TODO 只做了写入examId逻辑，没有做清除examId逻辑,目前每次退出登录才会清除
		// req.session.user.examId = examId = req.query.exam_id;
		examId = req.params.id;
	}

	// 分析页面使用，考试详情
	serversApi.getAnalysisInfo({
		TOKEN: req.session.user.token,
		body: {
			examId: examId,
			isNeedClass: true, //是否需要班级列表
			isNeedClassLevel: true, //是否需要班级层次和学部信息
			isNeedSchoolGroup: true //是否需要学校分类
		}
	}, function(error, data){
		if(error){
			next(error);
		} else if(data.code==200) {
			data = data.data;

			// TODO examId不存在的判断

			// 组织机构Id
			if(!req.session.user.orgId){
				return next("抱歉，没有获取到机构Id");
			} else {
				data.orgId = req.session.user.orgId;
			}
			if(data.hasSplit){
				data.artCategoryOptions = [{
					artCategory: 1,
					artCategoryName: "文科"
				}, {
					artCategory: 2,
					artCategoryName: "理科"
				}];
			}
			if(data.hasPastStudent){
				data.pastStudentOptions = [{
					pastStudentType: 0,
					pastStudentName: "应届生"
				}, {
					pastStudentType: 1,
					pastStudentName: "往届生"
				}];
				let newOptions = data.pastStudentOptions.slice(0);
				newOptions.unshift({
					pastStudentType: 2,
					pastStudentName: "全部"
				});
				data.pastStudentOptionsFull = newOptions;
			}
			if(data.courseDetailDTOs && data.courseDetailDTOs.length>0){
				let newOptions = data.courseDetailDTOs.slice(0);
				newOptions.unshift({
					id: 0,
					name: "全部",
					artCategory: 0,
					type: 0
				});
				data.courseDetailDTOsFull = newOptions;
			}
			if(data.classDTOs && data.classDTOs.length>0){
				let newOptions = data.classDTOs.slice(0);
				newOptions.unshift({
					// artCategory: newOptions[0].artCategory,
					artCategory: 0,
					className: "全部",
					id: 0,
					platformClassId: 0,
					classGroupId: 0
				});
				data.classDTOsFull = newOptions;
			}
			if(data.classParts && data.classParts.length>0){
				let newOptions = data.classParts.slice(0);
				newOptions.unshift({
					id: 0,
					name: "全部"
				});
				data.classPartsFull = newOptions;
			}
			if(data.classLevels && data.classLevels.length>0){
				let newOptions = data.classLevels.slice(0);
				newOptions.unshift({
					branch: 0,
					id: 0,
					name: "全部"
				});
				data.classLevelsFull = newOptions;
			}
			if(data.schoolGroups && data.schoolGroups.length>0){
				let newOptions = data.schoolGroups.slice(0);
				newOptions.unshift({
					branch: 0,
					id: 0,
					name: "全部"
				});
				data.schoolGroupsFull = newOptions;
			}
			res.locals.examData = data;
			next();
		} else {
			next("获取考试详情失败");
		}
	});
};