<template>

	<div class="echarts_box echarts_notitle" :class="{echarts_notitle:options.title==''}">
		<div :id="canvasId"></div>
		<div v-if="loading" class="_loading"><div class="spinner_sm_box"><div class="spinner_sm"><i></i></div>loading..</div></div>
		<div v-else class="noChartData" v-show="chartDataEmpty"><span>暂无数据！</span></div>
	</div>

</template>



<script type="text/javascript">
'use strict';

// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入柱状图
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/radar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/dataZoom'

//import echarts from 'echarts'

// 引入主题
import macarons from './macarons.json'
echarts.registerTheme('macarons', macarons);
import '../../static/script/util'


export default {
	props: {
		options: {
			type: Object,
			deafult: {
				list: [],
				defaultIndex: 0,
				selectedBack: function(){
				}
			}
		},
		loading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			canvasId: "",
			chartDataEmpty: false
		}
	},
	watch: {
		'options.seriesData': 'seriesDataChange',
		'options.options': 'seriesDataChange'
	},
	created() {
		this.canvasId = "echarts_"+Math.floor(Math.random()*100000);
		// console.info("------------created---------");
	},
	computed() {
		// console.info("------------computed---------");
	},
	mounted() {
		// console.log(JSON.stringify(this.options));
		// console.log("---------this.options.grid--");
		// console.log(JSON.stringify(this.options.grid));
		setTimeout(() => {
			this.createEcharts(this.canvasId, this.options);
		}, 10);
	},
	methods: {
		seriesDataChange: function(){
			this.createEcharts(this.canvasId, this.options);
		},
		createEcharts(id, obj){

			// console.info(obj.options.tooltip);

			/* extend obj */
			var defaultObj = {
				type: "bar",
				width: "auto",
				height: 500,
				legend_show: false, //是否显示图例组件，默认不显示
				legend_top: "", //
				legend_right: 50, //
				legend_hidden: [], //不显示图例组件的seriesData.name(legend_show为true时有效，默认空)
				dataZoom: [],  //dataZoom
				dataZoom_show: false,  //是否zoom横向缩放，默认不显示
				dataZoom_lock: false,  //是否锁定滚动区域，默认不锁定
				itemStyle_show: true,
				barMaxWidth: "80px",
				itemStyle_min: 0,
				xRotate: 0,             // x轴文字的旋转度数
				xAxisData: [],
				seriesData: [],
				options: {}
			};
			var dataLen = 0;
			if(obj.seriesData){
				dataLen = obj.seriesData.length;
			}
			if(obj.options && obj.options.series){
				dataLen = obj.options.series.length;
			}
			if(dataLen == 0){
				this.chartDataEmpty = true;
			}else{
				this.chartDataEmpty = false;
			}

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
				} else if(typeof(obj.title)=="object"){
					obj.options.title = obj.title;
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

			obj = Object.assign(defaultObj, obj);

			/* 生成series数据 */
			var series = [];

			// 数组，多维
			if(obj.seriesData.length>0 && typeof(obj.seriesData[0])=="object"){
				series = obj.seriesData;

//		series = {
//			"name": obj.options.yAxis[0].name,
//			"type": obj.type,
//			"data": obj.seriesData
//		};
			} else if(obj.seriesData.length>0) { // 数组，一维
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
			/* making legend(图例组件) */
			var legend={};
			if(obj.legend_show){
				var legendArray = [];
//		for(var prop in obj.seriesData){
//			legendArray.push(prop);
//		}

				// 多维
				if(obj.seriesData.length>0 && typeof(obj.seriesData[0])=="object"){
					for(var i=0;i<obj.seriesData.length;i++){
						legendArray.push(obj.seriesData[i].name);
					}
				}
				if(obj.legend_hidden.length>0){
					var selectedData = {};
					for(var i=0;i<obj.legend_hidden.length;i++){
						selectedData[obj.legend_hidden[i]]=false;
					}
				}
				legend = {
					data: legendArray,
					align: 'right',
					selected: selectedData,
					top: obj.legend_top==undefined ? 0 : obj.legend_top,
					right: obj.legend_right ? obj.legend_right:45
				}
			}

			/* making dataZoom */
			var dataZoom = [];
			if(obj.dataZoom && obj.dataZoom.length>0){
				dataZoom = obj.dataZoom;
			} else if(obj.dataZoom_show){
				var roomIndex = obj.xAxisData.length;
				var zoomEnd = obj.dataZoom_end ? obj.dataZoom_end : 100-((roomIndex-6)/roomIndex*100);
				if(roomIndex>10){
					dataZoom = [{
						show: true,
						zoomLock: obj.dataZoom_lock,
						start: 0,
						end: zoomEnd
					}]
				}
			}

			/* barMaxWidth */
			var barMaxWidth;
			if(obj.barMaxWidth){
				barMaxWidth = obj.barMaxWidth;
			} else {
				barMaxWidth = "60%";
			}

			/* extend options */
			var defaults = {
				// 默认图表位置
				grid: {
					top: 40,
					left: 60,
					right: 50,
					bottom: obj.dataZoom_show?80:60
				},
				// 图例组件
				legend: legend,
				// barWidth-bar的宽
//		barWidth: "60%",
				barMaxWidth: barMaxWidth,
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
						axisLine: {onZero: false},
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



			if(obj.options!=undefined && obj.options.series!=undefined && obj.options.series[0].type=="radar"){
				defaults.xAxis=[];
				defaults.yAxis=[];
			}

			// console.info(defaults.tooltip);
			// console.info(obj.options.tooltip);



			var echartOptions = Object.assign(defaults, obj.options);


			// console.info(echartOptions);
			// console.info("echartOptions -COMING");
			// console.info(JSON.stringify(echartOptions));

			/* create myChart */
			if(obj.height!=="auto"){
				document.getElementById(id).style.height=obj.height+"px";
			}
			if(obj.width!=="auto"){
				document.getElementById(id).style.width=obj.width+"px";
			}

			/*			console.info("echartOptions -COMING");
			 console.info("js_myabc");
			 console.info(typeof echarts);
			 setTimeout(function(){
			 var getElement = document.getElementById("js_myabc");
			 var myChart = echarts.init(getElement);
			 }, 1000);*/


//			console.info("createEcharts ***");
//			console.info(id);
//			console.info(document.getElementById(id));
//			console.info(echarts);
////			console.info(echarts.init);
//			console.info(echarts.init(document.getElementById("js_myabc")));

//	console.info(echarts.init);
//	var myChart = echarts.init(getElement);

//	var myChart = echarts.init(document.getElementById(id));


			var myChart = echarts.init(document.getElementById(id), 'macarons');
			myChart.setOption(echartOptions);
			window.onresize = myChart.resize;
		}
	}
};


</script>


<style lang="stylus" rel="stylesheet/stylus">
.echarts_box
	padding: 20px
	position relative
	min-height 300px
	._loading, .noChartData
		position absolute
		width 100%
		height 100%
		top 0
		left 0
		background rgba(255, 255, 255, 0.85)
.noChartData span
	display inline-block
	position: absolute;
	top: 50%;
	left: 0;
	margin-top: -12px;
	color #c4c6cd
	line-height 24px;
	width 100%
	text-align center
.spinner_sm_box
	position: absolute;
	top: 50%;
	left: 50%;
	margin-top: -24px;
	margin-left: -32px;
	font-size 15px;
	color #ddd
.spinner_sm {
	display: inline-block;
	position relative
	width: 24px;
	height: 24px;
	margin: 0 auto;
	border-radius: 50%;
	box-shadow: inset 0 0 0 2px #e4e7ec;
	top 6px
	margin-right 8px;
}
.spinner_sm i {
	position: absolute;
	clip: rect(0, 24px, 24px, 12px);
	width: 24px;
	height: 24px;
	animation: spinner_sm-circle-clipper 1s ease-in-out infinite;
}
@keyframes spinner_sm-circle-clipper {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(180deg);
	}
}
.spinner_sm i:after {
	position: absolute;
	clip: rect(0, 24px, 24px, 12px);
	width: 24px;
	height: 24px;
	content: '';
	animation: spinner_sm-circle 1s ease-in-out infinite;
	border-radius: 50%;
	box-shadow: inset 0 0 0 2px #019ce7;
}
@keyframes spinner_sm-circle {
	0% {
		transform: rotate(-180deg);
	}
	100% {
		transform: rotate(180deg);
	}
}

</style>



