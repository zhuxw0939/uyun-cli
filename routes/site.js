"use strict";

var express = require('express');
var router = express.Router();
var request = require('request');

var site = require('../controllers/site');

var authModel = require('../models/auth');

var logger = require('../common/logger');


router.get('/', authModel.checkQueryType, site.home);  // 首页

router.get('/forie', site.forie);  // 浏览器升级提示

router.get('/user/logout', site.logout);  // 退出登录

router.get('/logs', site.logs);  // 浏览器升级提示

module.exports = router;
