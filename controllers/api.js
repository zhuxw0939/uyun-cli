"use strict";

var request = require('request');
var crypto = require('crypto');
var moment = require('moment');
var fs = require('fs');

var servers = require('../common/servers');
var serversApi = require('../models/serversApi')
var config = require('../common/config');
var logger = require('../common/logger');


exports.servers = function (req, res, next) {
	// 检查方法是否存在
	if(req.params.id==undefined || serversApi[req.params.id]==undefined){
		res.send({
			status: 1,
			message: "找不到这个方法："+req.params.id
		});
		return false;
	}
	// 如果设置了登录用户才能访问
	// if(req.body.must_login && !req.body.auth_token){
	// 	res.send({
	// 		status: 9,
	// 		message: "请登录后继续操作"
	// 	});
	// 	return false;
	// }
	// 初始化参数
	// if(req.session.user && req.session.user.auth_token){
	// 	req.body.auth_token = req.session.user.auth_token;
	// }

	// 判断用户状态，只有登录用户才能访问
	let obj = req.body;
	if(req.session.user!=undefined && req.session.user.token!=undefined && req.session.user.token!="undefined"){
		obj.TOKEN = req.session.user.token;
		// 发送请求
		serversApi[req.params.id](obj, function(error, data){
			if(error){
				res.send({
					status: -1,
					message: "请求失败",
					error: error
				});
			} else {
				if(typeof(data)!="object"){
					res.send({
						status: 0,
						message: "返回不是一个标准的json格式",
						data: data
					});
				} else {
					if(data.code==20000){
						logger.error("登录失效，准备跳到登录页面吧");
						res.status(403).send(data);
					} else {
						res.send(data);
					}
				}
			}
		});
	} else {
		res.send({
			status: 1,
			message: "用户未登录，没有token无法访问"
		});
	}

};





exports.writeServersApi = function (req, res, next) {

	var url = config.mock.serversApiFileUrl;
	logger.info(url);
	if(url==undefined || url==""){
		res.send({
			status: 4,
			message: "文件读取地址配置错误，请重新配置",
			url: url
		});
		return false;
	}
	request.get({
		url: url
	}, function (error, response, body) {
		// logger.info(body);
		if(error){
			res.send({
				status: -1,
				message: "文件读取失败",
				url: url,
				data: error
			})
		} else if(body==undefined) {
			res.send({
				status: 1,
				message: "文件读取失败",
				url: url,
				data: "undefined"
			})
		} else if(body=="") {
			res.send({
				status: 2,
				message: "文件读取为空",
				url: url,
				data: ""
			})
		} else {
			fs.writeFile('models/serversApi.js', body, function(err){
				if(err){
					res.send({
						status: 3,
						message: "文件写入失败",
						url: url,
						data: err
					})
				} else {
					res.send({
						status: 0,
						url: url,
						message: "models/serversApi.js 更新成功"
					})
				}
			});
		}
	});
};













exports.getPolicy = function (req, res, next) {
	logger.info("getPolicy coming ************8");
	// 上传后例子：http://cqq.oss-cn-shenzhen.aliyuncs.com/testOSS/1489388301901，若为空，上传的文件则放到object的根目录
	const dirPath = config.oss.path+moment(new Date()).format('YYYYMM')+"/";
	const {OSSAccessKeyId, host, secret} = config.oss;
	let end = new Date().getTime() + 300000;
	let expiration = new Date(end).toISOString();
	let policyString = {
		expiration,
		conditions: [
			['content-length-range', 0, 1048576000],
			['starts-with', '$key', dirPath]
		]
	};
	policyString = JSON.stringify(policyString);
	const policy = new Buffer(policyString).toString('base64');
	const signature = crypto.createHmac('sha1', secret).update(policy).digest('base64');
	/*ctx.OK({
		OSSAccessKeyId: OSSAccessKeyId,
		host,
		policy,
		signature,
		saveName: end,
		startsWith: dirPath
	});
	*/
	logger.info({
		accessid: OSSAccessKeyId,
		host: host,
		policy: policy,
		signature: signature,
		expire: end,
		dir: dirPath
	});
	logger.info("getPolicy coming end");
	res.send({
		accessid: OSSAccessKeyId,
		host: host,
		policy: policy,
		signature: signature,
		expire: end,
		dir: dirPath
	})
};
