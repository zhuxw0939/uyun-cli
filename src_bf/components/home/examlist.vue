<template>
	<div class="_center">
		<search :searchoption="searchoption"
				:termsdata="termsData"
				:examlevelist="examLevelist"
				:gradesdata="gradesData"
				@loadlist="ajaxListData"
		>
		</search>
		<list :searchoption="searchoption" @loadlist="ajaxListData"></list>
	</div>

</template>

<script>
	import Search from '../examlist/search'
	import List from '../examlist/list'

	export default{
	    components: {Search, List},
		data() {
			return {
				//基础数据
				tenantId: backUser.info.tenantid,
				appLevel: backUser.level,//系统级别，市级、县级、校级
				user: backUser.type, //当前角色

				termsData: [],
				examLevelist: [],
				gradesData: [],
				searchoption: {
					currentPage: 1,
					totalCount: 0,
					pageSize: 10,
					loading: true,
					list: [],

					termId: '',
					examLevel: '',
					gradeId: '',
					startDate: '',
					endDate: '',
					examName: '',

					hasDistinct: false, //考试是否有学区
					hasTown: false //考试是否有乡镇
				},
				listdata: "", //初步获取列表数据
				ispreCount: 0 // 列表中成绩预览考试个数
			};
		},
		mounted() {
			this.termslist();
			this.examLevels();
			this.gradeslist();
			this.ajaxListData();
			this.hasDis_Town();
		},
		methods: {
	        hasDis_Town(){
				// 查询当前用户所在区县是否有学区和乡镇设置 (陈显官) #2017-04-27#
				this.$http.post("/api/servers/ExamQueryApi_getHasDistinctAndTown").then(function(data){
					data = data.body;
					console.info("查询当前用户所在区县是否有学区和乡镇设置:"+JSON.stringify(data));
					if(data.code == 200 && data.success == true){
						data = data.data;
						this.searchoption.hasDistinct = data.hasDistinct;
						this.searchoption.hasTown = data.hasTown;
					} else {
						console.warn(data);
					}
				}, function(error){
					console.error(error);
				});
			},
			termslist(){
				// 通过租户ID查询学期 (向发钧) #2017-03-09#
				this.$http.post("/api/servers/listPatformTerms", {
					tenantId: this.tenantId
				}).then(function(data){
					data = data.body;
					if(data.code == 200 && data.success == true){
						console.log("学期1"+JSON.stringify(data));
						data.data.unshift({
							"id": "",
							"termname": "全部学期"
						});
						console.log("学期2"+JSON.stringify(data));
						this.termsData = data.data;
					}else {

					}
				}, function(error){
					console.info("返回失败："+error);
				});
			},
			examLevels(){
				// 查询当前角色可使用的考试级别 (陈显官) #2017-03-16#
				this.$http.post("/api/servers/getCurrentExamLevel").then(function(data){
					var data = data.body, redata = '';
					console.log("考试级别："+JSON.stringify(data));
					if(data.code == 200 && data.success == true){
						redata = data.data;
						redata.unshift({
							"level": "",
							"name": "全部考试"
						});
						this.examLevelist = redata;
					}else {

					}

				}, function(error){
					console.info("返回失败："+error);
				});
			},
			gradeslist(){
				// 查询一个租户下某一个学段的市级年级(向发钧) #2017-03-09#
				this.$http.post("/api/servers/listPhaseGrades", {
					tenantId: this.tenantId,
					phase: ""
				}).then(function(data){
					data = data.body;
					console.log("年级："+JSON.stringify(data));
					if(data.code == 200 && data.success == true){
						data.data.unshift({
							"id": "",
							"name": "全部年级"
						});
						this.gradesData = data.data;
					}
				}, function(error){
					console.info("返回失败："+error);
				});
			},
			ajaxListData(){
				this.searchoption.loading = true;

				var obj = this.searchoption;

				var startime = "", endtime = "";

				if((obj.startDate == "" || obj.startDate == undefined) && (obj.endDate == "" || obj.endDate == undefined)){
					startime = "";
					endtime = "";
				}else if((obj.startDate!= "" && obj.startDate != undefined) && (obj.endDate != undefined && obj.endDate != "")){
					startime = obj.startDate.getTime();
					endtime = obj.endDate.getTime();
				}

				// 根据条件查询考试列表，会根据用户当前选择角色返回对应的数据
				this.$http.post("/api/servers/examlist", {
					body: {
						"pageableDto": {
							"page": obj.currentPage,
							"size": obj.pageSize
						},
						"queryParamDto": {
							"semesterIds": [obj.termId],
							"gradeIds": [obj.gradeId],
							"levels": [obj.examLevel],
							"startDate": startime,
							"endDate": endtime,
							"examName": obj.examName
						}
					}
				}).then(function(data){
					data = data.body;
					if(data.code == 200 && data.success == true){
						data = data.data;
						var list = data.dataList;
						this.searchoption.currentPage = data.currentPage;
						this.searchoption.totalCount = data.totalCount;
						for(var i=0; i<list.length; i++){
							if(list[i].state == 6){ //成绩预览
								this.ispreCount = this.ispreCount + 1;
								this.pre(i, list[i].id, list[i].level, list[i].phase); //查看计算是否完成
							}
						}
						if(this.ispreCount == 0){
							this.searchoption.list = list;
							this.searchoption.loading = false;
						}else {
							this.listdata = list;
						}
						console.info("考试列表："+JSON.stringify(list));
					}else {
						this.searchoption.loading = false;
						this.$message.error('考试列表查询失败!');
					}
				}, function(error){
					this.searchoption.loading = false;
					this.$message.error('考试列表接口错误!');
				});
			},
			//成绩预览
			pre(index, id, level, phase){
				var url = "";
				// 查询成绩计算是否完成 (陈显官) #2017-03-02#
				this.$http.post("/api/servers/ExamQueryApi_isCalculateOver", {
					examId: id
				}).then(function(data){
					data = data.body;
					console.log("查询成绩计算是否完成"+index+"："+JSON.stringify(data));
					if(data.code == 200 && data.success == true){//计算完成
						this.ispreCount = this.ispreCount - 1;
						if(data.data == true){ //计算完成
							console.log(index+":计算完成");
							if(this.appLevel == "city"){//市级
								url = "/analysis/"+id+"/townShipAnalysis?type=4"; //打开成绩分析-区市县
							}else if(this.appLevel == "school"){//校级
								if(level == 2 ||  level == 3 || this.user == "schoolTeacher" || this.user == "schoolCourse"){//校级考试、班级考试、学校老师、学科组长
									url = "/analysis/"+id+"/classAnalysis"; //打开成绩分析-班级
								}else {
									url = "/analysis/"+id+"/schoolAnalysis";//打开成绩分析-学校
								}
							}else if(this.appLevel == "county"){//县级
								if(level == 1){//县级考试
									if(this.searchoption.hasDistinct == true && (phase == 2 || phase == 3)){//有学区，小学或初中
										url = "/analysis/"+id+"/townShipAnalysis?type=2"; //打开成绩分析-学区
									}else {
										if(this.searchoption.hasTown == true && (phase == 2 || phase == 3)){//有乡镇，小学或初中
											url = "/analysis/"+id+"/townShipAnalysis?type=3"; //打开成绩分析-乡镇
										}else {
											url = "/analysis/"+id+"/schoolAnalysis";//打开成绩分析-学校
										}
									}
								}else if(level == 0){ //市级考试
									url = "/analysis/"+id+"/townShipAnalysis?type=1"; //打开成绩分析-区县
								}
							}
						}else {//未计算完
							url = false;
						}
						this.listdata[index].prelink = url;
						if(this.ispreCount == 0){
							this.searchoption.list = this.listdata;
							this.searchoption.loading = false;
						}
						console.log("修改考试列表："+JSON.stringify(this.listdata));
					}else {
						this.searchoption.loading = false;
						this.$message.error('查询成绩计算是否完成接口返回失败!');
					}
				}, function(error){
					this.searchoption.loading = false;
					console.info("返回失败："+error);
					this.$message.error('查询成绩计算是否完成接口错误!');
				});
			}
		}
	}

</script>
