'use strict';

var logger = require("../common/logger");




/*学校-分数线*/
exports.schoolAnalysisData = function(values, next) {
	var t = new Date();
	try {
		var theHeader = values.pageData.rows[0].header;
		values.pageData.rows.shift();
		values.pageData = {
			header: theHeader,
			body: values.pageData.rows
		};

		var data_3_names = [];
		for(var i=0;i<values.pageData.body.length;i++){
			data_3_names.push(values.pageData.body[i].schoolName);
		}
		var data_3_rows = {};
		for(var i=0;i<values.pageData.header.length;i++){
			var datas = [];
			for(var j=0;j<values.pageData.body.length;j++){
				datas.push(values.pageData.body[j].lines[i]);
				// datas = datas.concat(values.pageData.body[j].lines);
			}
			data_3_rows[values.pageData.header[i]+"优线"] = datas;
		}
		values.data_3 = {
			names: data_3_names,
			rows: data_3_rows
		};
		logger.debug('making', '::: return :::', "schoolAnalysisData", ((new Date() - t) + 'ms').green);
		return values;
	} catch (error){
		next(error);
	}

/*	values.data_3 = {
		names: ["丰谷中学","东辰实验学校","绵阳三中","南山中学","南山中学实验","绵阳中学","绵阳中学实验","绵阳一中","实验高中","普明中学","外国语学校","南山双语高中部","安县中学","江油中学","江油一中","太白中学","梓潼中学","平武中学","北川中学","三台中学","芦溪中学","三台一中","塔山中学","观桥中学","盐亭中学","开元中学","科学城一中"],
		rows: {
			"A": [0,61,0,291,73,359,102,1,18,1,48,2,0,16,58,30,2,0,0,10,22,0,0,0,0,0,0],
			"B": [0,167,0,674,300,539,318,142,308,128,100,58,54,296,310,357,171,37,45,188,261,133,13,20,21,0,5],
			"C": [2,183,2,735,344,562,345,300,485,307,105,108,189,563,426,495,341,109,134,316,378,373,74,69,108,1,31]
		}
	};*/
};










