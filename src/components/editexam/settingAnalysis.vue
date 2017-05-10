<template>

	<div>
		<div class="box">
			<div class="title_tab">
				<a href="#" class="current cursor_default">分数线设置</a><i class="_step">></i>
				<a href="#" class="gray_only cursor_default">计算规则设置</a><i class="_step" v-if="examType!=0">></i>
				<a href="#" class="gray_only cursor_default" v-if="examType!=0">分卷设置</a>
			</div>
			<!--<div class="title_steps">一、分数线设置</div>-->
			<div class="_form">
				<div class="form_header">
					<el-select v-model="scoreLineType" placeholder="" @change="onChangeScoreLineType" class="has_th_background">
						<el-option v-for="item in scoreLineTypeOptions" :label="item.name" :value="item.id"></el-option>
					</el-select>
					<el-checkbox v-if="scoreLineType==1" v-model="scoreLineTypeViewScore" style="margin-left: 30px;">学生/家长手机端查看成绩，只显示分数线相对应等级</el-checkbox>
					<div class="goright">
						<a href="javascript:void(0)" @click="onClickDownExcelModel"><i class="iconfont">&#xe636;</i> 模板下载</a>
						<a href="javascript:void(0)" v-if="scoreLineType!=2" @click="onClickUpFile">
							<i class="iconfont">&#xe637;</i>表格导入
						</a>
						<a href="javascript:void(0)" @click.stop="addNewScoreLineData"><i class="iconfont">&#xe647;</i> 新增</a>
					</div>
				</div>
				<div class="form_list scroll_box">
					<table class="sx_table edit_table">
						<thead>
						    <tr>
							    <th width="150">
								    <span v-if="scoreLineType==1">分数线名称</span>
								    <span v-if="scoreLineType==2">名称</span>
								    <span v-if="scoreLineType==3">比例段名称</span>
							    </th>
							    <th v-for="item in coursesData">{{item.courseName}}<span v-if="scoreLineType==3">(%)</span></th>
							    <th width="300">备注</th>
							    <th>操作</th>
						    </tr>
					    </thead>
						<tbody v-if="scoreLineData.scoreLines && scoreLineData.scoreLines.length>0">
							<tr v-for="(item, index) in scoreLineData.scoreLines">
								<td align="center">
									<input type="text" v-model="item.scoreLine.lineName" class="edit_input" @change="onChangeLineNameInput(item.scoreLine.lineName, index)">
								</td>
								<td v-for="itemChildren in item.scoreLineItems">
									<input type="text" readonly v-model="itemChildren.itemValue" class="edit_input" v-if="scoreLineType==2">
									<input type="text" v-model="itemChildren.itemValue" class="edit_input" v-else>
								</td>
								<td>
									<input type="text" v-model="item.scoreLine.remark" class="edit_input">
								</td>
								<td align="center">
									<span class="cursor_pointer hover_red" @click="onClickDeleteScoreLine(item.scoreLine.id, index)"><i class="iconfont">&#xe63b;</i></span>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td colspan="30" class="no_data"><i class="iconfont">&#xe649;</i><br>还没有分数线数据！</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="exam_create_footer">
					<el-button class="el-button-longer" type="primary" size="large" @click="onSubmit">下一步</el-button>
				</div>
			</div>
		</div>
	</div>

</template>


<script>


export default {
	data() {
		return {
			// 考试id
			examId:　backExamInfo.examInfo.id,
			examType:　backExamInfo.examInfo.type,

			// data
			scoreLineData: [],
			scoreLineTypeViewScore: false,

			// 考试科目
			coursesData: [],

			// 分数线设置
			scoreLineType: "",
			scoreLineTypeOptions: []
		};
	},
	watch: {
	},
	created() {
		vm.currentRouter = "/examlist";
	},
	mounted() {
		// 获取分数线类型下拉选择
		this.ajaxGetScoreLineTypeData();

		// 根据考试id，查询分数线设置的表格头数据
		this.ajaxGetExamSettingScoreLineHeader();

		// 获取考试科目
		// this.ajaxGetCoursesOptionsByExamId(this.examId);
		// 获取分数线设置data
		// this.ajaxGetExamSettingScoreLine(this.scoreLineType);
	},
	methods: {
		onClickDownExcelModel() {
			// 下载分数线Excel导入模板,返回下载地址URI (郑强) #2017-03-17#
			this.$http.post("/api/servers/ExamScoreLineApi_downloadTemplate", {
				examId: this.examId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					data.windowOpen();
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});

		},
		onClickUpFile() {
			console.info("onClickUpFile");
			this.$store.commit("startUpFile", data => {
				console.info("startUpFile back");
				console.info(data);
				if(data.status==0){
					data = data.data;
					this.upFileSuccess(data.fileName, data.host);
				} else if(data.status==1||data.status==2||data.status==3) {
					this.$alert(data.message);
				} else {
					this.$alert("文件服务暂时不能访问，请稍后再试！");
				}
			});
		},
		upFileSuccess(fileName, host) {
			// 表格上传成功
			console.info(host+fileName);
			// 上传分数线Excel数据 (郑强) #2017-03-17#
			this.$http.post("/api/servers/ExamScoreLineApi_importData", {
				body: {
					examId: this.examId,
					lineType: this.scoreLineType,
					sourceKeyInOss: fileName,
					viewScore: false
				}
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data==true){
						this.$alert('导入成功', {
							callback: () => {
								this.$router.go(0)
							}
						})
					} else {
						this.$alert(data.message);
					}
				} else {
					console.warn(data);
					this.$alert(data.message);
				}
			}, function(error){
				console.error(data);
				this.$alert("导入失败，请稍候重试");
			});

		},
		onChangeLineNameInput(value, index) {
			if(value.length>=9) {
				if(this.scoreLineType == 1){
					this.$alert("分数线名称不能超过8个字符！");
					this.scoreLineData.scoreLines[index].scoreLine.lineName = value.substr(0, 8);
				} else if(this.scoreLineType == 3){
					this.$alert("比例段名称不能超过8个字符！");
					this.scoreLineData.scoreLines[index].scoreLine.lineName = value.substr(0, 8);
				}
			}
		},
		onChangeScoreLineType() {
			// 设置规则改变
			this.ajaxGetExamSettingScoreLine();
		},
		onClickDeleteScoreLine(id, index) {
			this.$confirm('确定删除该分数段吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				// 删除某条分数线设置
				this.ajaxDeleteScoreLineById(id, index);
			}).catch(() => {
				// 取消删除
			})
		},
		addNewScoreLineData(typeName) {
			if(!typeName || typeof(typeName)!="string"){
				typeName = "";
			}
			console.info(this.coursesData);
			console.json(this.scoreLineData);
			// 新增分数线
			let newArray = [];
			for(let i=0; i<this.coursesData.length; i++){
				let item = this.coursesData[i];
				newArray.push({
					itemType: item.type,
					examCourseId: item.courseId,
					itemValue: ""
				});
			}
			this.scoreLineData.scoreLines.push({
				scoreLine: {
					lineName: typeName,
					remark: ""
				},
				scoreLineItems: newArray
			});
			console.json(this.scoreLineData);
		},
		onSubmit() {
			// 保存
			this.ajaxSaveSettingScoreLIne();
		},
		ajaxGetScoreLineTypeData() {
			// 分数线类型下拉选择 (郑强) #2017-03-16#
			this.$http.post("/api/servers/getSettingAnalysisTypeData").then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(JSON.stringify(data));
					// do something
					this.scoreLineTypeOptions = data;
					// 获取当前分数线设置类型
					this.ajaxGetScoreLineType();
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		ajaxGetExamSettingScoreLineHeader() {
			// 根据考试id，查询分数线设置的表格头数据 (郑强) #2017-03-13#
			this.$http.post("/api/servers/ExamScoreLineApi_listHeaders", {
				examId: this.examId
			}).then(function(data){
				console.info("查询分数线设置的表格头数据");
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					console.info(JSON.stringify(data));
					this.coursesData = data;
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});

		},
		ajaxGetScoreLineType() {
			// 根据考试ID查询该考试设置的分数线类型 (郑强) #2017-03-31#
			this.$http.post("/api/servers/ExamScoreLineApi_getLineTypeByExam", {
				examId: this.examId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data==1 || data==2 || data==3){
						this.scoreLineType = data;
					} else {
						this.scoreLineType = 1;
					}
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		ajaxGetExamSettingScoreLine() {
			// 根据考试ID,分数线类型查询分数线设置的详细数据 (郑强) #2017-03-31#
			this.$http.post("/api/servers/ExamScoreLineApi_listByExamAndLineType", {
				examId: this.examId,
				lineType: this.scoreLineType
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);

					if(data.viewScore!==undefined) {
						// 学生/家长手机端查看成绩，只显示分数线相对应等级
						this.scoreLineTypeViewScore = data.viewScore;
					}
					if(data && !data.scoreLines){
						data.scoreLines = [];
					}
					this.scoreLineData = data;
					if(this.scoreLineData.scoreLines.length==0 && this.scoreLineType==2){
						console.info("this.scoreLineType==2");
						this.addNewScoreLineData("平均分");
					}
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		ajaxDeleteScoreLineById(id, index) {
			// 暂时只做前端删除
			this.scoreLineData.scoreLines.splice(index, 1);
			return false;
			// 根据分数线的ID进行分数线删除操作
			this.$http.post("/api/servers/deleteSettingScoreLineById", {
				scoreLineId: id
			}).then(function(data){
				data = data.body;
				console.info(data);

				if(data.code==200){
					data = data.data;
					console.info(JSON.stringify(data));
					// 删除成功
					this.scoreLineData.splice(index, 1);
				} else {
					console.info(data);
				}

			}, function(error){
				console.info("返回失败："+error);
			});
		},
		ajaxGetCoursesOptionsByExamId(examId) {
			// 查询某次考试的所有科目
			this.$http.post("/api/servers/getCoursesByExamId", {
				examId: examId
			}).then(function(data){
				data = data.body;
				console.info("获取某次考试的所有科目：");

				if(data.code==200){
					data = data.data;
					console.info(JSON.stringify(data));
					this.coursesData = data;

				} else {
					console.info(data);
				}

			}, function(error){
				console.info(error);
			});
		},
		ajaxSaveSettingScoreLIne() {
			// 保存分数线列表数据 (郑强) #2017-03-06#
			var saveData = this.scoreLineData;
			if(this.scoreLineType==1){
				saveData.viewScore = this.scoreLineTypeViewScore;
			}

			/*			// 验证分数线列表数据 (郑强) #2017-03-18#
			 this.$http.post("/api/servers/ExamScoreLineApi_validate", {
			 body: saveData
			 }).then(function(data){
			 data = data.body;
			 if(data.code==200){
			 data = data.data;
			 console.info(data);
			 // do something
			 } else {
			 console.warn(data);
			 }
			 }, function(error){
			 console.error(error);
			 });

			 return false;*/
			this.$http.post("/api/servers/saveSettingScoreLIne", {
				body: saveData
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					if(data==true){
						this.$alert('保存成功', {
							callback: () => {
								this.$router.push({path: 'settingRule'});
							}
						})
					} else {
						this.$alert(data.message);
					}
				} else {
					console.warn(data);
					this.$alert(data.message);
				}
			}, function(error){
				console.error(error);
				this.$alert("保存失败，请稍后再试");
			});
		}
	}
}
</script>