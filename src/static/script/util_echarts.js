/**
 * Created by zxw on 2017/2/7.
 */

import echarts from 'echarts'

// 引入主题
import macarons from './macarons.json'
echarts.registerTheme('macarons', macarons);




var createEcharts = function (id, obj) {

	console.info(obj.options.tooltip);

	/* extend obj */
	var defaultObj = {
		type: "bar",
		width: "auto",
		height: "auto",
		legend_show: true,
		itemStyle_show: true,
		itemStyle_min: 0,
		dataZoom_show: true,
		zoomLock_lock: false,
		xRotate: 0,             // x轴文字的旋转度数
		xAxisData: [],
		seriesData: {},
		options: {}
	};

	// 图表标题
	if(obj.title!=undefined){
		// 处理字符串格式
		if(typeof(obj.title)=="string"){
			obj.options.title = {
				textAlign: 'left',
				text: obj.title,
				top: 10,
				left: 30
			};
		}
		// 图表有标题时默认位置
		if(obj.options.grid==undefined){
			obj.options.grid = {
				top: 100,
				left: 60,
				right: 50,
				bottom: 60
			}
		}
	}

	obj = Object.assign({}, defaultObj, obj);

	/* 生成series数据 */
	var series = [];
	// 数组，一维
	if(obj.seriesData.length>0){
		series = {
			"name": "",
			"type": obj.type,
			"data": obj.seriesData
		};
	} else {
		for(var prop in obj.seriesData){
			var seriesData = {
				"name": prop,
				"type": obj.type,
				"data": obj.seriesData[prop]
			};
			if(obj.itemStyle_show){
				if(obj.itemStyle_min===0){
					seriesData.itemStyle = {
						"normal": {
							"label": {
								"show": true,
								"position": "top",
								"textStyle": {
									"color": "#333",
									"fontSize": "12"
								}
							}
						}
					}
				} else {
					seriesData.itemStyle = {
						"normal": {
							"label": {
								"show": true,
								"formatter": function(datas){
									return datas.value>=obj.itemStyle_min?datas.value:""
								},
								"position": "top",
								"textStyle": {
									"color": "#333",
									"fontSize": "12"
								}
							}
						}
					}
				}
			}
			series.push(seriesData);
		}
	}
	// console.info(series);

	/* making legend(图例组件) */
	var legend={};
	if(obj.legend_show){
		var legendArray = [];
		for(var prop in obj.seriesData){
			legendArray.push(prop);
		}
		legend = {
			data: legendArray,
			align: 'right',
			top: 30,
			right: 40
		}
	}

	/* making dataZoom */
	var dataZoom = [];
	if(obj.dataZoom_show){
		var roomIndex = obj.xAxisData.length;
		if(roomIndex>12){
			dataZoom = [{
				show: true,
				zoomLock: obj.zoomLock_lock,
				start: 0,
				end: 100-((roomIndex-12)/roomIndex*100)
			}]
		}
	}

	/* extend options */
	var defaults = {
		// 默认图表位置
		grid: {
			top: 40,
			left: 60,
			right: 50,
			bottom: 60
		},
		// 图例组件
		legend: legend,
		// barWidth-bar的宽
		barMaxWidth :"54%",
		// tooltip-鼠标移到bar上显示的提示 默认不显示
		tooltip: {},
		// x轴
		xAxis: [
			{
				type: 'category',
				// x轴单位点显示样式
				axisLabel: {
					interval: 0,
					margin: 15,
					rotate: obj.xRotate,
					textStyle: {
						fontSize: 12
					}
				},
				axisTick: {
					alignWithLabel: true
				},
				// 参考：["丰谷中学", "东辰实验学校", "绵阳三中", "南山中学"]
				data: obj.xAxisData
			}
		],
		// y轴
		yAxis: [
			{
				type : 'value'
			}
		],
		// 区域缩放
		dataZoom: dataZoom,
		// 图表数据
		series: series
	};

	//console.info(defaults.grid);
	//console.info(obj.options.grid);

	console.info(defaults.tooltip);
	console.info(obj.options.tooltip);



	var echartOptions = Object.assign(defaults, obj.options);
	console.info(echartOptions);
	console.info(JSON.stringify(echartOptions));

	/* create myChart */
	if(obj.height!=="auto"){
		document.getElementById(id).style.height=obj.height+"px";
	}
	if(obj.width!=="auto"){
		document.getElementById(id).style.width=obj.width+"px";
	}

	var myChart = echarts.init(document.getElementById(id), 'macarons');
	myChart.setOption(echartOptions);
	window.onresize = myChart.resize;

};


module.exports = createEcharts;
