"use strict";

var config = require('../common/config');
var logger = require('../common/logger');

var request = require('request');


// 首页
exports.index = function (req, res, next) {
	res.redirect("/app");
};

// 首页
exports.home = function (req, res, next) {

	let renderName = "home";
	if(config.webpackServer.open){
		renderName = "home_dev";
	}

	res.render(renderName, {
		title: "晓我课堂学生终端控制中心-生学教育",
		currentPage : 'home'
	});

};



// 成绩分析
exports.analysis = function (req, res, next) {
	res.render('analysis', {
		title: "教学质量监控平台-生学教育",
		currentPage : 'home'
	});
};


// 编辑考试
exports.editexam = function (req, res, next) {
	res.render('editexam', {
		title: "教学质量监控平台-生学教育",
		currentPage : 'home'
	});
};


// webpack热更新代理，用于端口跨域
exports.webpackHotReload = function(req,res){
	request.get({
		url: "http://127.0.0.1:8586/dist/"+req.params.id,
		json: true
	}, function (error, response, body) {
		if(!error){
			res.send(body);
		} else {
			res.send({
				"message": "刷新失败"
			});
		}
	});
};


// 浏览器升级提示
exports.forie = function(req,res){
	res.render('forie', {
		title: "浏览器升级提示"
	});
};


// 退出登录
exports.logout = function (req, res, next) {
	req.session.destroy();
	// res.clearCookie(config.cookieAuthName, { path: '/', domain: config.cookieDomain});
	res.clearCookie(config.cookieAuthName, { path: '/'});
	logger.debug("〓〓〓 退出登录成功 跳至云平台登录页面");
	res.redirect(config.loginAuthUrl);
};


// logs
exports.logs = function (req, res, next) {
	var token = "";
	if(req.session.user.token){
		token = req.session.user.token.slice(-5);
	}
	if(token) {
		res.redirect("http://192.168.2.56:3300/looks/api?p_id=SklRa0r$qg&token="+token);
	} else {
		res.redirect("http://192.168.2.56:3300/looks/api?p_id=SklRa0r$qg");
	}
};

