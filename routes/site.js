"use strict";

var express = require('express');
var router = express.Router();
var request = require('request');

var config = require('../common/config');
var logger = require('../common/logger');

var site = require('../controllers/site');
var authModel = require('../models/auth');

router.get('/', authModel.checkQueryType, site.index);  // 首页

router.get('/app', authModel.checkQueryType, site.home);  // 首页

router.get('/forie', site.forie);  // 浏览器升级提示

router.get('/user/logout', site.logout);  // 退出登录

// 仅开发环境
if(config.debug){
	router.get('/dist/:id', site.webpackHotReload);  // dist热更新
}

module.exports = router;
