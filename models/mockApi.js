
var logger = require('../common/logger');



/**
 * Created by mock
 *
 * 获取用户拥有的角色（龚德志） #2017-03-13#
 *
 * @mockUserId 	登录获取到的刷新token-String * @appId 	子系统ID-String
 */
exports.userGetAppRoleList = function (mockUserId, callback) {
	let backJson;
	if(mockUserId == 0){
		backJson = [{
			"accountId": 101,
			"appId": "603",
			"orgId": 0,
			"orgName": "绵阳市",
			"level": 0,
			"roleDTOList": [
				{
					"id": 11,
					"name": "成绩管理员",
					"appId": "603",
					"orgId": 2,
					"roleCode": "CJGLY"
				},
				{
					"id": 12,
					"name": "教育局领导",
					"appId": "603",
					"orgId": 2,
					"roleCode": "JYJLD"
				},
				{
					"id": 13,
					"name": "教研员",
					"appId": "603",
					"orgId": 2,
					"roleCode": "JYY"
				}
			],
			"orgCode": "2-101"
		}]
	} else if(mockUserId == 1){
		backJson = [{
			"accountId": 102,
			"appId": "603",
			"orgId": 6,
			"orgName": "三台县",
			"level": 1,
			"roleDTOList": [
				{
					"id": 21,
					"name": "成绩管理员",
					"appId": "603",
					"orgId": 2,
					"roleCode": "CJGLY"
				},
				{
					"id": 22,
					"name": "教育局领导",
					"appId": "603",
					"orgId": 2,
					"roleCode": "JYJLD"
				},
				{
					"id": 23,
					"name": "教研员",
					"appId": "603",
					"orgId": 2,
					"roleCode": "JYY"
				}
			],
			"orgCode": "6-101306"
		}]
	} else if(mockUserId == 2){
		backJson = [{
			"accountId": 103,
			"appId": "603",
			"orgId": 6,
			"orgName": "三台锦绣中学",
			"level": 2,
			"roleDTOList": [
				{
					"id": 31,
					"name": "成绩管理员",
					"appId": "603",
					"orgId": 6,
					"roleCode": "XXCJGLY"
				},
				{
					"id": 32,
					"name": "学校领导",
					"appId": "603",
					"orgId": 7,
					"roleCode": "XXLD"
				},
				{
					"id": 33,
					"name": "年级主任",
					"appId": "603",
					"orgId": 8,
					"roleCode": "NJZR"
				},
				{
					"id": 34,
					"name": "学科组长",
					"appId": "603",
					"orgId": 9,
					"roleCode": "XKZZ"
				},
				{
					"id": 35,
					"name": "学校老师",
					"appId": "603",
					"orgId": 10,
					"roleCode": "XXLS"
				}
			],
			"orgCode": "6-101306"
		}]
	} else {
		backJson = [{
			status: -1,
			message: "没有找到这个mockUserId"
		}]
	}
	callback(null, backJson);
};

