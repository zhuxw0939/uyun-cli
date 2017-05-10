<template>

	<div class="_center cf">
		<div class="index_left">

			<!--权限：所有人-->
			<div class="box">
				<div class="_title">考试统计：</div>
				<div class="_examtab">
					<el-row>
						<el-col :span="12">考试次数：{{schoolYearExamCounts}}次</el-col>
						<el-col :span="12" align="right">
							<myselect :select-data="schoolYearSelectData" v-if="schoolYearSelectData.list.length>0"></myselect>
						</el-col>
					</el-row>
				</div>
				<div v-show="!schoolYearExamCountsEchartOptionsNoData">
					<Echartbar :options="schoolYearExamCountsEchartOptions" :loading="schoolYearExamCountsEchartOptionsLoading"></Echartbar>
				</div>
				<div class="no_data" style="height: 420px;" v-show="schoolYearExamCountsEchartOptionsNoData"><span>没有数据！</span></div>
			</div>

			<!--权限：区县级、校级所有角色-->
			<div class="box" v-if="user.level=='county' || user.level=='school'">
				<div class="_title">按级别分类：</div>
				<el-row>
					<el-col :span="6"><myprogress :value="levelExamCount.cityCount" :values="levelExamCountSum" title="市级考试" color="#b386dc" link="#"></myprogress></el-col>
					<el-col :span="6"><myprogress :value="levelExamCount.countyCount" :values="levelExamCountSum" title="区县级考试" color="#4babe8" link="#"></myprogress></el-col>
					<!--区县级不显示 校级考试和班级考试的次数统计-->
					<el-col :span="6" v-if="user.level=='school'"><myprogress :value="levelExamCount.schoolCount" :values="levelExamCountSum" title="校级考试" color="#dfb573" link="#"></myprogress></el-col>
					<el-col :span="6" v-if="user.level=='school'"><myprogress :value="levelExamCount.classCount" :values="levelExamCountSum" title="班级考试" color="#55d2ad" link="#"></myprogress></el-col>
				</el-row>
			</div>

			<!--权限：市级所有角色； 校级成绩管理员、学校领导-->
			<div class="box" v-if='user.level=="city" || user.level=="school"&&user.type=="admin" || user.level=="school"&&user.type=="schoolLeader"' v-show="gradeExamCountList.length>0">
				<div class="_title">按年级分类：</div>
				<el-row>
					<el-col :span="6" v-for="item in gradeExamCountList">
						<myprogress :value="Number(item.gradeCount)" :values="gradeExamCountSum" :title="item.gradeName" :color="item.color" link="#"></myprogress>
					</el-col>
				</el-row>
			</div>

			<!--权限：校级(年级主任)-->
			<div class="box" v-if="user.type=='schoolGrade'">
				<div class="_title">按学期分类：</div>
				<el-row>
					<el-col :span="6" v-for="item in semesterExamCountList">
						<myprogress :value="Number(item.semesterCount)" :values="semesterExamCountSum" :title="item.semesterName" :color="item.color" link="#"></myprogress>
					</el-col>
				</el-row>
			</div>

			<!--权限：市级、区县级所有角色-->
			<div class="box" v-if="user.level=='city' || user.level=='county'">
				<div class="_title">
					最近一次考试分数线人数、比率对比：
					<a target="_blank" :href="'/analysis/'+theLastExamsEchartsOptionsId+'/schoolAnalysis'" class="goright" v-if="theLastExamsEchartsOptionsId">查看详情 ></a>
				</div>
				<div class="_chart _chart_hastitle" v-if="!theLastExamsEchartsOptionsNoData">
					<p class="chart_title" style="top: 32px;">
						{{theLastExamsEchartsOptionsTitle}}
					</p>
					<Echartbar :options="theLastExamsEchartsOptions" :loading="theLastExamsEchartsOptionsLoading"></Echartbar>
				</div>
				<div class="no_data" style="height: 500px;" v-else><span>没有数据！</span></div>
			</div>

			<!--权限：校级(学科组长和学校老师)-->
			<div class="box" v-if="user.type=='schoolCourse' || user.type=='schoolTeacher'">
				<div class="_title">
					近一次考试各班分数线人数、比率对比：
					<a target="_blank" :href="'/analysis/exam/classAnalysis?exam_id='+myScoreLineEchartsOptionsId" class="goright" v-if="myScoreLineEchartsOptionsId">查看详情 ></a>
				</div>
				<div class="_chart _chart_hastitle" v-if="!myScoreLineEchartsOptionsNoData">
					<p class="chart_title">
						{{myScoreLineEchartsOptionsTitle}}
						<myselect :select-data="classExamSelectData" v-if="classExamSelectShow"></myselect>
					</p>
					<Echartbar :options="myScoreLineEchartsOptions" :loading="myScoreLineEchartsOptionsLoading"></Echartbar>
				</div>
				<div class="no_data" style="height: 500px;" v-else><span>没有数据！</span></div>
			</div>
		</div>
		<div class="index_right">
			<div class="index_right_box">

				<!--权限：所有级别的成绩管理员和学校老师-->
				<div v-if="user.type=='admin' || user.type=='schoolTeacher'">
					<router-link :to="createExamLink" tag="div"><Blockbtn text="创建考试" image="create"></Blockbtn></router-link>
				</div>

				<!--权限：市级(教研员)+区县级(教研员)+校级(学科组长)-->
				<div class="box" v-if='(user.level=="school"&&user.type=="schoolCourse")||user.type=="teachingStaff"'>
					<div class="_title _title_toediter">待编辑考试</div>
					<Examdl ajax="getToEditerExamList" :count="6"></Examdl>
				</div>

				<!--权限：所有人-->

				<div class="box">
					<div class="_title">最近考试 <router-link to="examlist" class="goright">更多 ></router-link></div>
					<Examdl ajax="getRecentExamList" :count="8"></Examdl>
				</div>
			</div>
		</div>
	</div>

</template>

<script>

// 引入自定义组件
import Blockbtn from '../models/blockbtn'
import Examdl from '../models/examdl'
import Myprogress from '../echarts/progress'
import Myselect from '../models/select'
import Echartbar from '../echarts/bar'

export default {
	name: 'home',
	components: { Blockbtn, Examdl, Myprogress, Myselect, Echartbar},
	data() {
		return {
			user: backUser,
			createExamLink: backUser.type=='admin'?'createExam':'createExamTeacher',

			// 统计考试次数扇形图，按级别分类 - 权限：区县级、校级所有角色
			levelExamCount: { cityCount: 0, classCount: 0, countyCount: 0, schoolCount: 0 },
			levelExamCountSum: 0,

			// 统计考试次数扇形图，按年级分类 - 权限：市级所有角色
			gradeExamCountList: [],
			gradeExamCountSum: 0,

			// 统计考试次数扇形图，按学期分类 - 权限：校级(年级主任)
			semesterExamCountList: [],
			semesterExamCountSum: 0,

			// 学年数据
			schoolYearSelectData: {
				list: [],
				defaultIndex: 0,
				selectedBack: (selectedData) => {
					this.ajaxGetSchoolYearExamCount(selectedData);
				}
			},
			// 学年考试次数统计
			schoolYearExamCounts: 0,
			schoolYearExamCountsEchartOptionsLoading: true,
			schoolYearExamCountsEchartOptionsNoData: false,
			schoolYearExamCountsEchartOptions: {
				height: 400,
				barMaxWidth: "40px",
				options: {
					yAxis: [{
						type : 'value',
						name : '次数'
					}]
				}
			},

			// 最近一次考试分数线对比
			theLastExamsEchartsOptionsId: "",
			theLastExamsEchartsOptionsData: [],
			theLastExamsEchartsOptionsLoading: true,
			theLastExamsEchartsOptionsNoData: false,
			theLastExamsEchartsOptionsTitle: "",
			theLastExamsEchartsOptions: {
				dataZoom_show: true,
				legend_show: true,
				xRotate: 30,
				barMaxWidth: "40px",
				options: {
					yAxis: [{
						type : 'value',
						name : '人数'
					}],
					grid: {
						top: 100,
						left: 60,
						right: 50,
						bottom: 140
					},
					tooltip: {
						show: true,
						formatter: function (params) {
							let detailsData = vm.theLastExamsEchartsOptionsData[params.dataIndex].details;
							let ratio = "";
							for(let i=0; i<detailsData.length; i++){
								let item = detailsData[i];
								if(item.scoreLineName == params.seriesName){
									ratio = (item.scoreLineRatio*100).toFixed(2);
									break;
								}
							}
							let backTxt = '';
							backTxt += params.name;
							backTxt += '<br>';
							backTxt += params.seriesName + '： ' + params.value + '人，占' + ratio + '%';
							return backTxt;
						}
					}
				}
			},

			// 校级年级组长学校老师角色查看自己班级的考试数据
			myScoreLineEchartsOptionsId: "",
			myScoreLineEchartsOptionsData: [],
			myScoreLineEchartsOptionsLoading: true,
			myScoreLineEchartsOptionsNoData: false,
			myScoreLineEchartsOptionsTitle: "",
			myScoreLineEchartsOptions: {
				dataZoom_show: true,
				legend_show: true,
				xRotate: 30,
				barMaxWidth: "40px",
				options: {
					yAxis: [{
						type : 'value',
						name : '人数'
					}],
					grid: {
						top: 100,
						left: 60,
						right: 50,
						bottom: 120
					}
				}
			},
			classExamSelectShow: false,
			classExamSelectData: {
				list: [{
					name: "文科",
					value: 1
				}, {
					name: "理科",
					value: 2
				}],
				defaultIndex: 0,
				selectedBack: (selectedData) => {
					this.ajaxGetMyScoreLineData(selectedData.value);
				}
			}
		};
		},
		created() {
		},
		mounted() {

		// **获取所有学年数据
		this.ajaxGetMySchoolYears();
		// **统计考试次数扇形图
		if( this.user.level=="county"||this.user.level=="school" ){
			// 区县级、校级所有角色
			this.ajaxGetCountOrgExamNumber();
		}
		if( this.user.level=="city" || this.user.level=="school"&&(this.user.type=="admin" || this.user.type=="schoolLeader") ){
			// 市级所有角色； 校级成绩管理员、学校领导
			this.ajaxGetCountGradeExamNumber();
		}
		if( this.user.type=="schoolGrade" ){
			// 校级(年级主任)
			this.ajaxGetCountSemesterExamNumber();
		}

		// ***最近一次考试分数线人数、比率对比
		if( this.user.level=="city"||this.user.level=="county"){
			// 市级、区县级所有角色
			this.ajaxGetTheLastExamData();
		}

		// ***校级年级组长、学校老师角色查看自己班级的考试数据
		if( this.user.type=="schoolCourse"||this.user.type=="schoolTeacher" ){
			// 校级(学科组长和学校老师)
			this.ajaxGetMyScoreLineData();
		}
		},
		methods: {
		ajaxGetMySchoolYears() {
			// 查询一个租户的所有学年
			this.$set(this.schoolYearExamCountsEchartOptions, 'loadingChart', true);

			// 通过租户ID查询学期 (向发钧) #2017-03-09#
			this.$http.post("/api/servers/listPatformTerms", {
				tenantId: this.user.info.tenantid
			}).then(function(data){
				console.json("back");
				data = data.body;
				if(data.code==200){
					console.json("200");
					data = data.data;
					let newObject = {};
					for(let i=0; i<data.length; i++){
						let item = data[i];
						if(!newObject[item.yearname]){
							newObject[item.yearname] = {};
							newObject[item.yearname].rows = [];
						}
						newObject[item.yearname].rows.push(item);
					}

					let yearArray = [];
					for(var prop in newObject){
						let item = newObject[prop];
						if(item.rows.length==1){
							yearArray.push({
								id: item.rows[0].id,
								value: item.rows[0].id,
								yearName: item.rows[0].yearname,
								name: item.rows[0].yearname,
								termName: item.rows[0].termname,
								startDate: item.rows[0].startdate,
								endDate: item.rows[0].enddate,
								tenantId: item.rows[0].tenantid
							});
						} else if(item.rows.length==2){
							yearArray.push({
								id: item.rows[0].id,
								value: item.rows[0].id,
								yearName: item.rows[0].yearname,
								name: item.rows[0].yearname,
								termName: item.rows[0].termname+"-"+item.rows[1].termname,
								startDate: item.rows[0].startdate,
								endDate: item.rows[1].enddate,
								tenantId: item.rows[0].tenantid
							});
						}
					}
					console.info(JSON.stringify(yearArray));
					this.schoolYearSelectData.list = yearArray;
					// let lastIndex = this.schoolYearSelectData.list.length-1;
					let lastIndex = 0;
					for(let i=0; i<yearArray.length; i++){
						let item = yearArray[i];
						if(item.name.indexOf("-2017")!=-1){
							lastIndex = i;
							break;
						}
					}
					this.schoolYearSelectData.defaultIndex = lastIndex;
					this.ajaxGetSchoolYearExamCount(yearArray[lastIndex]);
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		},
		ajaxGetSchoolYearExamCount(obj) {
			if(!obj || !obj.startDate || !obj.endDate){
				console.error("参数错误，无法获取考试次数统计数据" + obj);
				return false;
			}
			this.schoolYearExamCountsEchartOptionsNoData = false;
			this.schoolYearExamCountsEchartOptionsLoading = true;
			// 首页 - 按学年统计考试数量
			this.$http.post("/api/servers/getSchoolYearExamCount", {
				start: Date.parse(new Date(obj.startDate.replace(/-/g,"/"))),
				end: Date.parse(new Date(obj.endDate.replace(/-/g,"/")))
			}).then(function(data){
				data = data.body;
				if(data.code==200 && data.data && data.data.monthCountDTOs && data.data.monthCountDTOs.length>0){
					data = data.data;

					// 获取月份维度
					let monthsArray = this.getDateArry(obj.startDate, obj.endDate);
					console.info(obj.startDate+" - "+obj.endDate);
					console.info(monthsArray);

					let dataArray = data.monthCountDTOs;
					console.json(dataArray);

					let xAxisArray = [];
					let seriesArray = [];
					let allCount = 0;
					for(let i=0; i<monthsArray.length; i++){
						let item = monthsArray[i];
						xAxisArray.push(Number(item.split("-")[1])+"月");
						seriesArray[i] = 0;
						for(let j=0; j<dataArray.length; j++){
							let itemChildren = dataArray[j];
							if(item==itemChildren.monthKey){
								seriesArray[i] = itemChildren.monthCount;
								allCount += itemChildren.monthCount;
								break;
							}
						}
					}
					console.json(xAxisArray);
					console.json(seriesArray);

					this.schoolYearExamCountsEchartOptions.xAxisData = xAxisArray;
					this.$set(this.schoolYearExamCountsEchartOptions, 'seriesData', [{
						name: "次数",
						type: "bar",
						data: seriesArray
					}]);

					if(allCount==data.count){
						this.schoolYearExamCounts=allCount;
					} else {
						console.warn("前端计算的学年考试次数和后端返回的学年考试次数不同！");
						this.schoolYearExamCounts=allCount;
					}

					this.schoolYearExamCountsEchartOptionsNoData = false;
					this.schoolYearExamCountsEchartOptionsLoading = false;
				} else {
					console.warn(data);
					this.schoolYearExamCountsEchartOptionsLoading = false;
					this.schoolYearExamCountsEchartOptionsNoData = true;
					this.schoolYearExamCounts=0;
				}
			}, function(error){
				console.info(error);
			});
		},
		getDateArry(d1, d2) {
			// var d1 = '2016-02-01';
			// var d2 = '2016-12-30';
			var dateArry = new Array();
			var s1 = d1.split("-");
			var s2 = d2.split("-");
			var mCount = 0;
			if (parseInt(s1[0]) < parseInt(s2[0])) {
				mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1])+1;
			} else {
				mCount = parseInt(s2[1]) - parseInt(s1[1])+1;
			}
			if (mCount > 0) {
				var startM = parseInt(s1[1]);
				var startY = parseInt(s1[0]);
				for (var i = 0; i < mCount; i++) {
					if (startM < 12) {
						dateArry[i] = startY + "-" + (startM>9 ? startM : "0" + startM);
						startM += 1;
					} else {
						dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
						startM = 1;
						startY += 1;
					}
				}
			}
			console.log(dateArry);
			return dateArry;
		},
		ajaxGetCountOrgExamNumber() {
			// 首页 - 按考试级别统计考试数量（按级别分类）
			this.$http.post("/api/servers/getCountOrgExamNumber").then(function(data){
				data = data.body;
				console.info("按考试级别统计考试数量（按级别分类）");
				if(data.code==200){
					data = data.data;
					console.json(data);

					var num = 0;
					for (var item in data){
						data[item] = Number(data[item]);
						num += data[item];
					}
					this.levelExamCount = data;
					this.levelExamCountSum = num;
				} else {
					console.warn(data);
				}
			}, function(error){
				console.info(error);
			});
		},
		ajaxGetCountGradeExamNumber() {
			// 首页 - 按考试班级统计考试数量（按年级分类）
			this.$http.post("/api/servers/getCountGradeExamNumber").then(function(data){
				data = data.body;
				console.info("按考试班级统计考试数量（按年级分类）");
				console.json(data);
				if(data.code==200){
					data = data.data;

					var gradeColorArray = ["#91d4de", "#a4c7de", "#a3a8e5"];
					var num = 0;
					var i = 0;
					for (var item of data){
						num += Number(item.gradeCount);
						data[i].color = gradeColorArray[i];
						i++;
					}
					this.gradeExamCountList = data;
					this.gradeExamCountSum = num;
				} else {
					console.warn(data);
				}
			}, function(error){
				console.info(error);
			});
		},
		ajaxGetCountSemesterExamNumber() {
			// 首页 - 查询校级下指定学期考试次数 （按学期分类）
			this.$http.post("/api/servers/getCountSemesterExamNumber").then(function(data){
				data = data.body;
				console.info("查询校级下指定学期考试次数（按学期分类）");
				if(data.code==200){
					data = data.data;
					console.json(data);

					var gradeColorArray = ["#91d4de", "#a4c7de", "#a3a8e5"];
					var num = 0;
					var i = 0;
					for (var item of data){
						num += Number(item.semesterCount);
						data[i].color = gradeColorArray[i];
						i++;
					}
					this.semesterExamCountList = data;
					this.semesterExamCountSum = num;
				} else {
					console.warn(data);
				}
			}, function(error){
				console.info(error);
			});
		},
		ajaxGetTheLastExamData() {

			// 市级、区县、学校（返回的是班级分数线/平均分）最近一次学校分数线/平均分 #2017-03-29#
			this.$http.post("/api/servers/getTheLastExamScoreLineData", {
				artCategory: ""
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.code==200){
					data = data.data;
					this.makingSchoolScoreLineChartData(data);
				} else {
					console.warn(data);
					this.theLastExamsEchartsOptionsNoData = true;
				}
			}, function(error){
				console.error(error);
			});
		},
		makingSchoolScoreLineChartData(data) {
			// 这儿就从下面改造来的
			if(data.length<=0) return false;
			if(!data[0].details) return false;
			let legendHiddenData = [];
			let xData = [];
			let yData = [];
			this.theLastExamsEchartsOptionsData = data;

			data[0].details.forEach(function(item, index){
				yData.push({
					name: item.scoreLineName,
					type: "bar",
					data: []
				});
				if(index!=0){
					legendHiddenData.push(item.scoreLineName);
				}
			});
			data.forEach(function(item){
				xData.push(item.regionName);
				item.details.forEach(function(itemChildren, childrenIndex){
					yData[childrenIndex].data.push(itemChildren.scoreLineNum);
				})
			});
			// console.info(legendHiddenData);
			// console.info(xData);
			// console.json(yData);

			if(data.length>6){
				this.theLastExamsEchartsOptions.legend_hidden = legendHiddenData;
			}
			this.theLastExamsEchartsOptionsId = data[0].examId;
			this.theLastExamsEchartsOptionsTitle = data[0].examName;
//			this.theLastExamsEchartsOptions.title = {
//				textAlign: 'left',
//				text: data[0].examName,
//				textStyle: {
//					fontSize: 16,
//					color: "#333"
//				},
//				top: -2,
//				left: 15
//			};
			this.theLastExamsEchartsOptions.xAxisData = xData;
			this.$set(this.theLastExamsEchartsOptions, 'seriesData', yData);

			this.theLastExamsEchartsOptionsLoading = false;
			this.theLastExamsEchartsOptionsNoData = false;
		},
		ajaxGetMyScoreLineData(artCategory) {
			if(!artCategory) {
				artCategory = "";
			}
//			this.classExamSelectShow = false;
			// 班级-分数线分析
			// 市级、区县、学校（返回的是班级分数线/平均分）最近一次学校分数线/平均分 #2017-03-29#
			this.$http.post("/api/servers/getTheLastExamScoreLineData", {
				artCategory: artCategory
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.code==200){
					data = data.data;
					this.makingScoreLinesChartData(data);
				} else {
					console.warn(data);
					this.myScoreLineEchartsOptionsNoData = true;
				}
			}, function(error){
				console.error(error);
			});
		},
		makingScoreLinesChartData(data) {
			console.json("data");
			// 这儿和classAnalysis.html代码一样
			if(data.length<=0) return false;
			if(!data[0].details) return false;
			if(data[0].courseIsSplit){
				//
				this.classExamSelectShow = true;
			}
			let legendHiddenData = [];
			let xData = [];
			let yData = [];
			this.myScoreLineEchartsOptionsData = data;

			data[0].details.forEach(function(item, index){
				yData.push({
					name: item.scoreLineName,
					type: "bar",
					data: []
				});
				if(index!=0){
					legendHiddenData.push(item.scoreLineName);
				}
			});
			data.forEach(function(item){
				xData.push(item.regionName);
				item.details.forEach(function(itemChildren, childrenIndex){
					yData[childrenIndex].data.push(itemChildren.scoreLineNum);
				})
			});

			if(data.length>6){
				this.myScoreLineEchartsOptions.legend_hidden = legendHiddenData;
			}
			this.myScoreLineEchartsOptionsId = data[0].examId;
			this.myScoreLineEchartsOptionsTitle = data[0].examName+" （"+data[0].courseName+"）";
//			this.myScoreLineEchartsOptions.title = {
//				textAlign: 'left',
//				text: data[0].examName+" （"+data[0].courseName+"）",
//				// subtext: data[0].courseName,
//				textStyle: {
//					fontSize: 14,
//					fontWeight: 100,
//					color: "#000"
//				},
//				top: -2,
//				left: 15
//			};
			this.myScoreLineEchartsOptions.xAxisData = xData;
			this.$set(this.myScoreLineEchartsOptions, 'seriesData', yData);

			this.myScoreLineEchartsOptionsNoData = false;
			this.myScoreLineEchartsOptionsLoading = false;
		}
	}
}

</script>

<style>

.index_right_box {
	padding-left: 20px;
}
.index_right_box .box {
	min-height: 160px;
}
.box ._title {
	padding: 15px;
	border-bottom: 1px solid #e5e5e5;
	line-height: 20px;
	color: #333;
	font-size: 15px;
	position: relative;
}
.box ._title_toediter {
	background: #fffbe3;
	border-radius: 4px 4px 0 0;
}
.box ._title .goright {
	top: 15px;
	right: 15px;
	font-size: 14px;
}
.box ._examtab {
	padding: 30px 60px 10px;
	position: relative;
}
.box ._examtab .goright {
	top: 30px;
	right: 60px;
}
.box .echarts_box {
	padding: 0 20px 20px;
}
.box ._chart {
	padding-top: 30px;
}
.box .myprogress {
	margin-top: 40px;
	margin-bottom: 30px;
}
._chart_hastitle {
	position: relative;
}
._chart_hastitle .chart_title {
	position: absolute;
	/*top: 32px;*/
	top: 18px;
	left: 40px;
	z-index: 20;
	line-height: 20px;
	color: #333;
	font-size: 14px;
}
._chart_hastitle .chart_title .myselect {
	min-width: 100px;
	width: 100px;
	position: relative;
	top: 15px;
	left: -35px;
}

</style>
