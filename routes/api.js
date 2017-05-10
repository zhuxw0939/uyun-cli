"use strict";

var express = require('express');
var router = express.Router();
var config = require('../common/config');
var api = require('../controllers/api');
var logger = require('../common/logger');

// serversApi
router.post('/servers/:id', api.servers);
// oss
router.get('/oss/getPolicy', api.getPolicy);
// debug
if(config.debug){
	router.get('/servers/:id', api.servers);
	router.get('/writeServersApi', api.writeServersApi);
}
module.exports = router;