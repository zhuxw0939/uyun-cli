
var vm = new Vue({
	el: '#wrapper',
	delimiters: ['${', '}'],
	data() {
		return {
			allExams: 0,
			indexExamsOptions: {
				height: 500,
				xAxisData: ['9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
				options: {
					yAxis: [
						{
							type : 'value',
							name : '次数'
						}
					]
				}
			},
			selectData: {
				list: [{
					name: "2015-2016学年",
					value: 101
				}, {
					name: "2016-2017学年",
					value: 102
				}, {
					name: "2017-2018学年",
					value: 103
				}, {
					name: "2018-2019学年",
					value: 104
				}, {
					name: "2020学年",
					value: 105
				}],
				default: 0,
				selectedBack: function(selectedData){
					vm.ajaxGetChart(selectedData.value);
				}
			}
		};
	},
	created() {
	},
	mounted() {
		this.ajaxGetChart(this.selectData.default.value);
	},
	methods: {
		ajaxGetChart(id) {
			console.info(id);


			this.$set(this.indexExamsOptions, 'loadingChart', true);

			// 按学期统计考试数量
			this.$http.post("/api/servers/getIndexExamCounts", {
				startDate: "Number",
				endDate: "Number"
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					data = data.data.list;
					this.$set(this.indexExamsOptions, 'seriesData', [{
						name: "次数",
						type: "bar",
						data: data
					}]);
					var all = 0;
					for(var i=0;i<data.length;i++){
						all += Number(data[i])
					}
					this.allExams=all;
				} else {
					this.$msgbox(data.message, '提示', {
						type: "error"
					});
					this.allExams=0;
					// this.$set(this.indexExamsOptions, 'loadingChart', false);
				}
			}, function(error){
				console.info(error);
				this.$msgbox("网络错误，无法获取数据！", '提示', {
					type: "error"
				});
			});

			return false;

			// 保存双向细目表列表数据,保存前会根据课程ID清除原有数据
			this.$http.post("/api/servers/BJWNbCUtZ9x", {
				body: {
					"questionDetails": [
						{
							"levels": [
								{
									"levelId": 24,
									"levelName": "能力层次BBB",
									"sort": 0
								}
								,{
									"levelId": 25,
									"levelName": "能力层次CCCC",
									"sort": 0
								}

							],
							"parent": {},
							"points": [{
								"parentId": "",
								"pointId": 7,
								"pointName": "世界地理知识1",
								"sort": 0
							}
								,  {
									"parentId": "",
									"pointId": 8,
									"pointName": "世界地理知识2",
									"sort": 0
								}
							],

							"question": {
								"coefficient": 0.8,
								"examCourseId": "111",
								"ischooseQuestion": 0,
								"parentId": "",
								"point": 0,
								"questionNum": "23",
								"questionType": 0,
								"rightAnswer": "C",
								"sort": 0,
								"state": 0
							}
						}
					]
				},
				courseId: "111"
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					// do something
				} else {
					console.info("返回错误");
				}
			}, function(error){
				console.info("返回失败"+error);
			});



			return false;

			// 保存学部设置
			this.$http.post("/api/servers/rJOlbCLKZqe", {
				body: {
					"classGroup": {
						"branch": 0,
						"gradeId": "asfsadfsa",
						"gradeName": "abcdefg",
						"schoolId": "131321213",
						"name": "string"
					},
					"classGroupDetails": [
						{
							"classId": "afbaf123",
							"className": "abade"
						}
					]
				}
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					// do something
				} else {
					console.info("返回错误");
				}
			}, function(error){
				console.info("返回失败"+error);
			});





			return false;

			this.$set(this.indexExamsOptions, 'loadingChart', true);

			// 按学期统计考试数量
			this.$http.post("/api/servers/getIndexCountSemester", {
				startDate: "123456",
				endDate: "124"
			}).then(function(data){
				data = data.body;
				console.info(data);
				if(data.status==0){
					data = data.data.list;
					this.$set(this.indexExamsOptions, 'seriesData', [{
						name: "次数",
						type: "bar",
						data: data
					}]);
					var all = 0;
					for(var i=0;i<data.length;i++){
						all += Number(data[i])
					}
					this.allExams=all;
				} else {
					this.$msgbox(data.message, '提示', {
						type: "error"
					});
					this.allExams=0;
					// this.$set(this.indexExamsOptions, 'loadingChart', false);
				}
			}, function(error){
				console.info("返回失败"+error);
			});

		}
	}
});
