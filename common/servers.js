'use strict';

var express = require('express');
var async = require('async');
var eventproxy = require('eventproxy');
var request = require('request');

var config = require('../common/config');
var redisDB = require('../common/redisDB');
var logger = require('../common/logger');



// POST
exports.POST = function(obj, callback){
	logger.debug("向servers发送POST请求："+obj.url);
	exports.sendRequest(obj, callback, "post");
};

// GET
exports.GET = function(obj, callback){
	logger.debug("向servers发送GET请求："+obj.url);
	exports.sendRequest(obj, callback, "get");
};

// DELETE
exports.DELETE = function(obj, callback){
	logger.debug("向servers发送DELETE请求："+obj.url);
	exports.sendRequest(obj, callback, "delete");
};

// PUT
exports.PUT = function(obj, callback){
	logger.debug("向servers发送PUT请求："+obj.url);
	exports.sendRequest(obj, callback, "put");
};

// 需要考虑redis的post方法
exports.sendRequest = function(obj, callback, type){

	// logger.info(obj);
	if(typeof(obj.body)=="object"){
		for(let prop in obj.body){
			if(obj.body[prop]==="" || obj.body[prop]===undefined){
				logger.info("body参数中："+prop+"属性为空，已忽略！");
				delete obj.body[prop];
			}
		}
	}
	if(typeof(obj.query)=="object"){
		for(let prop in obj.query){
			if(obj.query[prop]==="" || obj.query[prop]===undefined){
				logger.info("form参数中："+prop+"属性为空，已忽略！");
				delete obj.query[prop];
			}
		}
	}

	// 请求完毕是否向redis中写入数据
	var redisWrite = false;


	if( (config.mock.open&&(obj.servers==undefined||obj.servers!=true)) || obj.mock!=undefined&&obj.mock==true ){
		logger.info("将从mock中取值:");
		var formData = {
			url: obj.url,
			v_id: config.mock.v_id,
			swagger_id: obj.swaggerId!=undefined?obj.swaggerId:"",
			data: obj.data
		};
		logger.info(config.mock.url);
		logger.info(formData);

		// 开始post请求
		var t = new Date();
		request.post({
			url: config.mock.url,
			form: formData,
			headers: config.mock.headers
		}, function (error, response, body) {

			var rTime = new Date()-t;
			logger.info('POSTMock', '::: back :::', obj, ( rTime + 'ms').green);
			logger.info(JSON.stringify(obj, null, "\t"));
			logger.info(body);

			// 保存api，仅debug环境
			if(config.mock.apiSave){
				apiSaves("POST", "mock", config.mock.url, obj, body, rTime, obj.swaggerId);
			}
			goBack(error, response, body, callback);

		});
	} else {

		let url = obj.host!=undefined ? obj.host+obj.url : config.servers.host+obj.url;
		let bodyObj = obj.body;
		let queryObj = obj.query;
		let headers = obj.header!=undefined ? obj.header : config.servers.headers;
		logger.info("向servers发送请求:"+url);

		if(obj.token!=undefined){
			headers.TOKEN = obj.token;
		}

		// 组装参数
		var sendObj;
		if(type=="post" || type=="put"){
			sendObj = {
				url: url,
				json: true,
				headers: headers
			};
			// 如果传了body
			if(bodyObj){
				sendObj.body = bodyObj
			}
			if(queryObj){
				 var formPropsIndex=0;
				 for(var formProps in queryObj){
					 if(formPropsIndex==0){
						sendObj.url += "?"+formProps+"="+queryObj[formProps]
					 } else {
						sendObj.url += "&"+formProps+"="+queryObj[formProps]
					 }
					 formPropsIndex ++ ;
				 }
			}
		} else if(type=="get" || type=="delete"){
			if(queryObj){
				var formPropsIndex=0;
				for(var formProps in queryObj){
					if(formPropsIndex==0){
						url += "?"+formProps+"="+queryObj[formProps]
					} else {
						url += "&"+formProps+"="+queryObj[formProps]
					}
					formPropsIndex ++ ;
				}
			}
			sendObj = {
				url: url,
				json: true,
				headers: headers
			};
			// 如果传了body则忽略form
			/*if(queryObj){
			 sendObj.qs = queryObj
			 }*/
		} else if(0){
            /*sendObj = {
                url: url,
                headers: headers
            };
            // 如果传了body则忽略form
            if(queryObj){
                sendObj.qs = queryObj
            }*/
        }
		// logger.debug(sendObj);

		// 开始post请求
		var t = new Date();
		if(type=="post"){
			request.post(sendObj, function (error, response, body) {

				goLogs(error, response, body, sendObj, t, "POST");

				// 保存api，仅debug环境
				if(config.mock.apiSave){
					apiSaves("POST", "servers", obj.url, sendObj, body, new Date()-t, obj.swaggerId);
				}

				goBack(error, response, body, callback);
			});
		} else if(type=="get"){
			request.get(sendObj, function (error, response, body) {

				goLogs(error, response, body, sendObj, t, "GET");

				// 保存api，仅debug环境
				if(config.mock.apiSave){
					apiSaves("GET", "servers", obj.url, sendObj, body, new Date()-t, obj.swaggerId);
				}

				goBack(error, response, body, callback);
			});
		} else if(type=="delete"){
            request.delete(sendObj, function (error, response, body) {

				goLogs(error, response, body, sendObj, t, "DELETE");

                // 保存api，仅debug环境
				if(config.mock.apiSave){
                    apiSaves("DELETE", "servers", obj.url, sendObj, body, new Date()-t, obj.swaggerId);
                }

                goBack(error, response, body, callback);
            });
        } else if(type=="put"){
            request.put(sendObj, function (error, response, body) {

				goLogs(error, response, body, sendObj, t, "PUT");

                // 保存api，仅debug环境
				if(config.mock.apiSave){
                    apiSaves("PUT", "servers", obj.url, sendObj, body, new Date()-t, obj.swaggerId);
                }

                goBack(error, response, body, callback);
            });
        }

	}

};


exports.testServersBack = function (req, res, next, error, data) {

	if(!data) {
		if(req.method !== 'GET'){
			res.status(405).send({
				status: -1,
				message: "serversApi返回data为空",
				data: data
			});
			return false;
		} else {
			next("serversApi返回data为空");
			return false;
		}
	} else if(typeof(data)!="object") {
		res.send({
			status: 0,
			message: "返回不是一个标准的json格式",
			data: data
		});
		return false;
	} else {
		if(data.status=="400"){
			res.send({
				status: 400,
				message: "没有返回200状态",
				data: data
			});
			return false;
		}
	}
	return true;
};



function goBack(error, response, body, callback){
	if(error){
		logger.info("Servers goBack: ~~~~~~ error: "+error);
		// callback('获取数据失败');
		callback(error);
	} else {
		try {
			if(typeof(body) == "object"){
				callback(null, body);
			} else {
				var bodyObject = JSON.parse(body);
				callback(null, bodyObject);
			}
		} catch(error) {
			logger.error("servers goBack catch error: ");
			logger.error(error);
			if(body==undefined) {
				logger.warn('返回为undefined!');
				callback(null, body);
			} else if (body=="") {
				logger.warn('返回为空字符串!');
				callback(null, body);
			} else {
				callback(null, body);
				// callback('返回不是一个标准的json格式：'+body);
				// callback(body);
			}
		}
	}
	return false;


	if(error){
		logger.info("Servers goBack: ~~~~~~ error: "+error);
		// callback('获取数据失败');
		callback(error);
	} else {
		try {
			if(typeof(body) == "object"){
				callback(null, body);
			} else {
				var bodyObject = JSON.parse(body);
				callback(null, bodyObject);
			}
		} catch(error) {
			logger.error("servers goBack catch error: ");
			logger.error(error);
			if(body==undefined) {
				callback('返回为undefined!');
			} else if (body=="") {
				callback('返回为空字符串!');
			} else {
				callback(null, body);
				// callback('返回不是一个标准的json格式：'+body);
				// callback(body);
			}
		}
	}
}


exports.ajaxGet = function(url, obj, callback){

	logger.info("--------------- ajaxGet-----------------");
	logger.info(url);
	logger.info(obj);

	var reg = /((https|http):\/\/)/g;
	if(!reg.test(url)){
		logger.info("url不是以http://https://开头");
		url = config.servers.host+url;
	} else {
		logger.info("url以http://开头");
	}

	logger.info(url);

	// url = config.servers.host+url+"?auth_token="+obj.auth_token;

	// auth

	// 开始post请求
	var t = new Date();
	request.get({
		url: url,
		qs: obj
	}, function (error, response, body) {
		logger.debug('ajaxGet', '::: back ::: '+url, obj, ((new Date() - t) + 'ms').green);
		logger.info(body);

		goBack(error, response, body, callback);
	});
};
function apiSaves(sendType, serverType, url, sendObj, body, time, swaggerId){

	// logger.info("apiSaves function");
	// logger.info(sendType);
	// logger.info(serverType);
	// logger.info(url);
	// logger.info(data);
	// logger.error("apiSaves apiSaves apiSaves");
	// logger.info(body);
	// logger.info(typeof body);
	// logger.info(time);

	// logger.error("apiSaves apiSaves apiSaves");
	// logger.info(config.mock.v_id);

/*	var parametersData = {};
	if(serverType=="mock" && data.url){
		parametersData.url = data.url;
	}
	if(data.token){
		parametersData.TOKEN = data.token;
	}
	if(data.form && typeof(data.form)=="object" && JSON.stringify(data.form)!="{}"){
		parametersData.form = data.form;
	}
	if(data.body && typeof(data.form)=="object" && JSON.stringify(data.body)!="{}"){
		parametersData.body = data.body;
	}*/
	// var parametersData = data;

	var mk_user = "1";
	if(sendObj.headers.TOKEN){
		mk_user = sendObj.headers.TOKEN.slice(-5)
	}
	// 开始post请求
	var t = new Date();
	request.post({
		url: config.mock.saveApiHost,
		form: {
			user: mk_user,
			requests : sendType,
			server_type : serverType,
			url : url,
			swagger_id: swaggerId,
			parameters : JSON.stringify(sendObj),
			back_data : JSON.stringify(body),
			send_time : time,
			project_id : config.mock.p_id,
			version_id : config.mock.v_id
		},
		headers: config.mock.headers
	}, function (error, response, body) {
		var rTime = new Date()-t;
		if(error){
			logger.info(error);
		} else {
			logger.info("apiSaves success "+rTime+"ms");
		}
		// logger.info("apiSaves back+++");
		// logger.debug('apiSaves', '::: back :::', url, ( rTime + 'ms').green);
		// logger.info(body);
	});
}

function goLogs(error, response, body, sendObj, t, type){
	var rTime = new Date()-t;
	if(config.debug){
		logger.info(type, '::: back :::', ( rTime + 'ms').green, sendObj.url);
		logger.info(JSON.stringify(sendObj, null, "\t"));
		logger.info(body);
		logger.info(( rTime + 'ms').magenta);
	} else {
		logger.debug(sendObj);
		if(typeof body ==="object"){
			if(rTime>=200){
				if(body.code==200){
					logger.debug(type, '::: back :::', "time:"+(rTime+'ms').red, "code:"+(body.code+"").green, "message:"+body.message);
				} else {
					logger.debug(type, '::: back :::', "time:"+(rTime+'ms').red, "code:"+(body.code+"").red, "message:"+body.message);
				}
			} else if(body.code!=200) {
				logger.debug(type, '::: back :::', "time:"+(rTime+'ms').green, "code:"+(body.code+"").red, "message:"+body.message);
			} else {
				logger.debug(type, '::: back :::', "time:"+(rTime+'ms').green, "code:"+(body.code+"").green, "message:"+body.message);
			}
		} else {
			logger.debug( "返回不是一个标准json格式！" );
		}
	}
}
