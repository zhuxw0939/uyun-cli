<template>

	<div>
		<div class="box">
			<div class="title_tab">
				<router-link to="settingAnalysis">分数线设置</router-link><i class="_step">></i>
				<router-link to="settingRule">计算规则设置</router-link><i class="_step">></i>
				<a href="#" class="current cursor_default">分卷设置</a>
			</div>
			<!--<div class="title_steps title_steps_line">三、试卷分卷设置<span class="info">（试卷分卷设置可根据用户要求按题号自定义分卷，分卷设置后在成绩分析即可查看分卷成绩分析。）</span></div>-->
			<div class="title_notice">温馨提示：试卷分卷设置可根据用户要求按题号自定义分卷，分卷设置后在成绩分析即可查看分卷成绩分析。</div>
			<div class="_form">
				<div class="form_header">
					<el-select v-model="coursesChoiceId" placeholder="选择考试科目" @change="onChangeExamCourses" >
						<el-option v-for="item in coursesChoicesOptions" :label="item.courseName" :value="item.id"></el-option>
					</el-select>
					<div class="goright">
						<a href="javascript:void(0)" @click="addNewSplit"><i class="iconfont">&#xe647;</i> 新增分卷</a>
					</div>
				</div>
				<div class="form_list">
					<table class="sx_table edit_table">
						<thead>
						    <tr>
							    <th width="15%" class="gleft">试卷分卷名称</th>
							    <th width="70%" class="gleft">分卷题号</th>
							    <th width="15%">操作</th>
						    </tr>
					    </thead>
						<tbody v-if="splitInfoData.length>0">
							<tr v-for="(item, index) in splitInfoData">
								<td>
									<input type="text" v-model="item.paperSplit.splitName" class="edit_input edit_input_left">
								</td>
								<td>
									<input type="text" :value="item.questioinItemsArray.join(',')"  class="edit_input edit_input_left" @focus="onFocusSplitInfo(index, $event)" @blur="onBlurSplitInfo(index)">
									<input type="hidden" v-model="item.questioinItemsArray" >
								</td>
								<td align="center">
									<span class="cursor_pointer hover_red" @click="removeSplitInfoData(item.paperSplit.questionId, index)"><i class="iconfont">&#xe63b;</i></span>
								</td>
							</tr>
						</tbody>
						<tbody v-else>
							<tr>
								<td colspan="10" class="no_data"><i class="iconfont">&#xe649;</i><br>还没有分卷数据！</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="exam_create_footer">
					<el-button class="el-button-longer" @click="onSumbit" size="large">保 存</el-button>
					<el-button class="el-button-longer" type="primary" size="large" @click="onStartCompute">开始计算</el-button>
				</div>
			</div>
		</div>

		<el-dialog title="选择分卷题号" v-model="dialogEditSplitVisible" custom-class="el-dialog-split">
			<div class="dialogbox_split">
				<el-row>
					<el-col :span="4">
						<ul class="col_a">
							<li v-for="(item, index) in splitInfoData" :class="{current:index==splitInfoIndex}" @click="onClickEditThisSplitInfoData(index)">
								{{item.paperSplit.splitName}}
							</li>
						</ul>
					</el-col>
					<el-col :span="9">
						<ul class="col_b">
							<el-checkbox-group v-model="questionsChoiceRows" @change="onChangeQuestionsChoiceRows">
							<li v-for="(item, index) in allQuestions" v-if="validQuestionCanChoice(item.id)">
								<el-checkbox :label="item.id">&nbsp;&nbsp;{{item.questionNum}}</el-checkbox>
								<!--<el-checkbox :label="item.splitid" @change="questionsCheckboxChange($event, item.questionno)">{{item.questionno}}</el-checkbox>-->
							</li>
							</el-checkbox-group>
						</ul>
					</el-col>
					<el-col :span="2">
						<div class="clo_d">
							<img src="/img/row_right.png" alt="">
						</div>
					</el-col>
					<el-col :span="9">

						<ul class="col_c" v-if="splitInfoData[splitInfoIndex]">
						<!--	<li v-for="(item, index) in questionsChoiceRows">
								{{allQuestions[item].questionNum}} <i class="iconfont" @click="deleteSplitInfoRow(item)">&#xe6a6;</i>
							</li>-->

							<li v-for="(item, index) in splitInfoData[splitInfoIndex].questioinItems">
								{{item.questionNum}} <i class="iconfont" @click="deleteSplitInfoRow(item.questionId, index)">&#xe6a6;</i>
							</li>

						<!--<li v-for="(item, index) in splitInfoNowEdit">
							{{item.name}} <i class="iconfont" @click="deleteSplitInfoRow(index)">&#xe6a6;</i>
						</li>-->
						</ul>
					</el-col>
				</el-row>
			</div>

			<div class="know_footer">
				<el-button @click="dialogEditSplitVisible = false" class="el-button-longer">取 消</el-button>
				<el-button type="primary" @click="onSubmitEditSplit" class="el-button-longer">确 定</el-button>
			</div>
		</el-dialog>

	</div>

</template>


<script>

import Upfile from '../models/upfile'

export default {
	components: {Upfile},
	data() {
		return {
			// 考试id
			examId:　backExamInfo.examInfo.id,
			// examId:　"58be4366e1a06316dcdd28c0",

			// 科目列表-选择的科目
			coursesChoiceId: "",
			coursesChoicesOptions: [],
			coursesOldId: "",
			coursesLoader: false,

			// 某个科目的分卷详情
			splitInfoData: [],
			// 当前正在编辑的allQuestions 的 index
			splitInfoIndex: "",

			// 某个科目的所有试卷题目信息
			allQuestions: [],
			// 除了当前编辑的某个分卷外其它分卷已经设置了的题目ids
			otherChoiceQuestionIds: [],

			// 当前编辑的某个科目的分卷题号
			splitInfoNowEdit: [],
			// 当前编辑选择的试卷题目
			questionsChoiceRows: [],
			// 编辑分卷题号的弹出层
			dialogEditSplitVisible: false

		};
	},
	watch: {
		"splitInfoIndex": "splitInfoIndexChange"
	},
	created() {
		vm.currentRouter = "/examlist";
	},
	mounted() {
		this.ajaxGetCoursesData();
	},
	methods: {

		// 分卷分析设置，科目变化时
		onChangeExamCourses(value) {
			console.info("onChangeExamCourses:: "+value);
			// 初次打开某科目
			if(!this.coursesLoader){
				console.info("初次打开某科目");
				this.onChangeHappen(value);
				this.coursesLoader = true;
			} else {
				console.info("不是初次打开某科目");
				this.ajaxSettingPaperTempSave(this.coursesOldId, () => {
					console.info("ajaxQuestionTempSave back");
					this.onChangeHappen(value);
				});
			}
			this.coursesOldId = value;
		},
		onChangeHappen(value) {
			// 获取当前科目的分卷设置信息
			this.ajaxGetSplitInfo();

			// 获取当前科目的所有题目
			this.ajaxGetQuestions();
		},
		// 新增一个分卷
		addNewSplit() {
			if(!this.coursesChoiceId){
				this.$alert('请先选择一个科目', '提示');
				return false
			}
			this.splitInfoData.push({
				paperSplit: {
					splitName: "分卷"+(this.splitInfoData.length+1)
				},
				questioinItems: [],
				questioinItemsArray: []
			})
		},
		// 删除某个分卷
		removeSplitInfoData(id, index) {
			console.info("removeSplitInfoData");
			this.splitInfoData.splice(index, 1);
		},
		onFocusSplitInfo(index, event) {
			// 编辑某个分卷题号-焦点触发
			console.info("onFocusSplitInfo");

			// 设置当前编辑的rows
			this.splitInfoIndex = index;


			/*// 设置当前编辑的rows
			 let qs =  this.splitInfoData[index].questioinItems;
			 if(qs!=undefined){
			 let newArray = [];
			 for(let i=0; i<qs.length; i++){
			 newArray.push({
			 questionNum: qs[i].questionNum,
			 questionId: qs[i].id
			 });
			 }
			 this.splitInfoNowEdit = newArray;
			 }*/

			// 打开弹出层
			this.dialogEditSplitVisible = true;
		},
		onBlurSplitInfo(index) {
//				console.info("onBlurSplitInfo");
		},
		onChangeQuestionsChoiceRows(arr) {
//				console.error(arr);
//				let arr = this.questionsChoiceRows;

			var by = function(name){
				return function(o, p){
					var a, b;
					if (typeof o === "object" && typeof p === "object" && o && p) {
						a = o[name];
						b = p[name];
						if (a === b) {
							return 0;
						}
						if (typeof a === typeof b) {
							return a < b ? -1 : 1;
						}
						return typeof a < typeof b ? -1 : 1;
					}
					else {
						throw ("error");
					}
				}
			};

			let newArray = [];
			for(let i=0; i<arr.length; i++){
				let itemId = arr[i];
//					console.warn(itemId);
				let item = this.allQuestions.find((itemQuestion) => itemQuestion.id == itemId);
//					console.json(item);
				newArray.push({
					questionNum: isNaN(Number(item.questionNum)) ? item.questionNum : Number(item.questionNum),
//						questionNum: item.questionNum,
					questionId: item.id
				});
			}
			// console.json(newArray);

			// 排序
			let backArray = newArray.slice(0);
			backArray.sort(by("questionNum"));
			// console.info(backArray);

			this.splitInfoData[this.splitInfoIndex].questioinItems = backArray;


//				let arr = this.questionsChoiceRows.join(",");
//				arr = arr.split(",");
//				arr.sort(function(a, b){ return a>b});


			/*
			 let arr = this.questionsChoiceRows;
			 let newArray = [];
			 for(let i=0; i<arr.length; i++){
			 let item = Number(arr[i]);
			 newArray.push({
			 questionNum: this.allQuestions[item].questionNum,
			 questionId: this.allQuestions[item].id
			 });
			 }
			 this.splitInfoNowEdit = newArray;*/
		},
		deleteSplitInfoRow(questionId, index){
			// 删除
			// this.splitInfoData[this.splitInfoIndex].questioinItems;

			this.splitInfoData[this.splitInfoIndex].questioinItems.splice(index, 1);

			var itemIndex = this.questionsChoiceRows.indexOf(questionId);
			if (itemIndex > -1) {
				this.questionsChoiceRows.splice(itemIndex, 1);
			}

			/*
			 for(let i=0; i<this.questionsChoiceRows.length; i++){
			 if(this.questionsChoiceRows[i]==index){
			 this.questionsChoiceRows.splice(i, 1);
			 break;
			 }
			 }*/
		},
		onClickEditThisSplitInfoData(index) {
			// 切换另一个分卷时
			this.saveRowsChange();
			this.splitInfoIndex = index;
			this.questionsChoiceRows = this.splitInfoData[this.splitInfoIndex].questioinItems;
//				this.questionsChoiceRows = this.
		},
		validQuestionCanChoice(id) {
			if(this.otherChoiceQuestionIds.findIndex((item) => item==id)==-1){
				return true;
			} else {
				return false;
			};
		},
		saveRowsChange() {
			// 保存分卷设置
			var newArray = [];
			// console.info(this.splitInfoData[this.splitInfoIndex]);
			// console.info(this.splitInfoData[this.splitInfoIndex].questioinItems);
			for(var i=0; i<this.splitInfoData[this.splitInfoIndex].questioinItems.length; i++){
				var item = this.splitInfoData[this.splitInfoIndex].questioinItems[i];
				newArray.push(item.questionNum);
			}
			this.splitInfoData[this.splitInfoIndex].questioinItemsArray = newArray;
			// console.json(this.splitInfoData[this.splitInfoIndex].questioinItemsArray);

		},
		splitInfoIndexChange() {
			// 当切换编辑某个分卷设置时
			console.warn("切换了某个分卷 ***");
//				console.warn(this.splitInfoIndex);
			this.getOtherChoiceQuestionIds();
			this.getQuestionsChoiceRows();
		},
		getOtherChoiceQuestionIds() {
			console.info("getOtherChoiceQuestionIds coming");
			// 获取除了当前编辑的某个分卷外其它分卷已经设置了的题目ids
			var newArray = [];
			for(var i=0; i<this.splitInfoData.length; i++){
				var item = this.splitInfoData[i];
				if(i==this.splitInfoIndex) {
//							console.info("自己");
				} else {
//							console.info("别人");
					for(var j=0; j<item.questioinItems.length; j++){
						var itemChildren = item.questioinItems[j];
						console.info(itemChildren);
						newArray.push(itemChildren.questionId);
					}
				}
			}
//				console.warn(newArray);
			this.otherChoiceQuestionIds = newArray;
		},
		getQuestionsChoiceRows() {
			// console.error(this.questionsChoiceRows);
			// console.json(this.questionsChoiceRows);

			var newArray = [];
			for(var i=0; i<this.splitInfoData[this.splitInfoIndex].questioinItems.length; i++){
				var item = this.splitInfoData[this.splitInfoIndex].questioinItems[i];


				newArray.push(item.questionId);




				/*
				 item.questionId

				 for(var j=0; j< ;j++){

				 }







				 let arr = this.questionsChoiceRows;
				 let newArray = [];
				 for(let i=0; i<arr.length; i++){
				 let item = Number(arr[i]);
				 newArray.push({
				 questionNum: this.allQuestions[item].questionNum,
				 questionId: this.allQuestions[item].id
				 });
				 }
				 */
			}
			// console.json(newArray);
			this.questionsChoiceRows = newArray;
		},
		onSubmitEditSplit() {
			// 确定选择分卷题号时
			console.info(this.splitInfoNowEdit);
			this.saveRowsChange();
			this.dialogEditSplitVisible = false;
			return false;



			let newArray = [];
			for(let i=0; i<this.splitInfoNowEdit.length; i++){
				let item = this.splitInfoNowEdit[i];
				newArray.push(item.questionNum);
			}
			this.splitInfoData[this.splitInfoIndex].questioinItemsArray = newArray;
			this.splitInfoData[this.splitInfoIndex].questioinItems = this.splitInfoNowEdit;

			this.splitInfoNowEdit = [];
			this.dialogEditSplitVisible = false;

			return false;
			this.splitInfoData[this.splitInfoIndex].questioinItemsArray = this.splitInfoNowEdit;

			// splitInfoIndex
		},
		// 选择一个题号时
		questionsCheckboxChange(value) {
			console.info(value);

			return false;
			console.info(event);
			var el = event.currentTarget;
			console.info($(el));
			console.info($(el).is(':checked'));
			if($(el).is(':checked')){
				$(el).closest("li").addClass("current");
				this.splitInfoNowEdit.push(value);
			} else if($(el).closest("li").hasClass("current")) {
				$(el).closest("li").removeClass("current");
				//this.splitInfoNowEdit.push(value);
			}
		},
		onSumbit() {
			// 保存，表单提交
			console.info(JSON.stringify(this.splitInfoData));

			this.ajaxSaveSettingPaper();
		},
		onStartCompute() {
			// 手动触发计算
			this.$confirm('是否完成分析设置开始计算？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.ajaxFinishAnalysisSettingChangeExamType();
			}).catch(() => {
			});
		},
		// 获取参加考试科目
		ajaxGetCoursesData() {
			// 根据考试ID查询自定义分卷下拉数据 (郑强) #2017-04-21#
			this.$http.post("/api/servers/getSettingPaperAllCourses", {
				examId: this.examId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					// do something
					this.coursesChoicesOptions = data;
					// 默认选择第一个科目
					this.coursesChoiceId = data[0].id;
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		// 获取某个科目分卷详情
		ajaxGetSplitInfo() {
			console.info("获取某个科目分卷详情 ajaxGetSplitInfo");
			// 根据考试科目ID查询科目的分卷设置数据 (郑强) #2017-03-01#
			this.$http.post("/api/servers/getSettingPaperSplitList", {
				courseId: this.coursesChoiceId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info("根据考试科目ID查询科目的分卷设置数据");
					console.info(data);
					for(let i=0; i<data.length; i++){
						let item = data[i].questioinItems;
						var newArray = [];
						for(let j=0; j<item.length; j++){
							newArray.push(item[j].questionNum);
						}
						data[i].questioinItemsArray = newArray;
					}
					console.json(data);
					this.splitInfoData=data;
				} else if(data.code==204) {
					console.warn(data);
					this.splitInfoData = [];
				} else {
					console.warn(data);
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		},
		ajaxGetQuestions() {
			// 根据考试科目查询科目的试题数据 (郑强) #2017-03-01#
			this.$http.post("/api/servers/getQuestionsNumByCourseId", {
				courseId: this.coursesChoiceId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info("*** ajaxGetQuestions ***");
					console.info(data);
					this.allQuestions = data;
				} else {
					console.warn(data);
				}
			}, function(error){
				console.info("返回失败："+error);
			});
		},
		ajaxSaveSettingPaper() {
			var saveArray = this.splitInfoData;
			console.json(saveArray);
			/*for(var i=0; i<saveArray.length; i++){
			 var item = saveArray[i];
			 for(var j=0; j<item.questioinItems.length; j++){
			 item.questioinItems
			 }
			 saveArray.questioinItems[i].questionId = saveArray.questioinItems[i].id
			 }*/
			console.json(saveArray);
			// 保存分卷设置 (郑强) #2017-03-15#
			this.$http.post("/api/servers/ExamPaperSplitApi_save", {
				body: {
					courseId: this.coursesChoiceId,
					splitDetails: saveArray
				}
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data==true){
						this.$alert('保存成功');
					} else {
						this.$alert(data.message);
					}
				} else {
					console.warn(data);
					this.$alert(data.message);
				}
			}, function(error){
				console.error(error);
				this.$alert("保存失败，请稍候再试！");
			});
		},
		ajaxSettingPaperTempSave(oldChoiceId, callback) {
			var saveArray = this.splitInfoData;
			// 临时保存分卷设置 (郑强) #2017-04-21#
			this.$http.post("/api/servers/ExamPaperSplitApi_tempSave", {
				body: {
					courseId: oldChoiceId,
					splitDetails: saveArray
				}
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data){
						callback();
					} else {
						this.$alert("暂存失败！");
					}
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		ajaxFinishAnalysisSettingChangeExamType() {
			// 分析设置完成后，改变考试状态 (陈显官) #2017-03-30#
			this.$http.post("/api/servers/finishAnalysisSettingChangeExamType", {
				examId: this.examId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data==true) {
						this.ajaxStartCountAchievement();
//							this.$alert('更新考试状态成功', {
//								callback: () => {
//									this.ajaxStartCountAchievement();
//								}
//							})
					} else {
						this.$alert(data.message);
					}
				} else {
					console.warn(data);
					this.$alert(data.message);
				}
			}, function(error){
				console.error(error);
				this.$alert("更新考试状态失败，请稍候再试！");
			});
		},
		ajaxStartCountAchievement() {
			// 所有计算触发入口 (向发钧) #2017-04-07#
			this.$http.post("/api/servers/startCountAchievement", {
				examId: this.examId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data){
						this.$alert('触发成绩计算成功', {
							callback: () => {
								this.$router.push("/examlist");
							}
						})
					} else {
						console.warn(data);
						alert("触发成绩计算失败，返回："+data);
					}
				} else {
					console.warn(data);
					alert("触发成绩计算失败！");
				}
			}, function(error){
				console.error(error);
			});
		}
	}
}

$(function(){
	$(".edit_input").live("focus", function(){
		console.info($(this));
		$(this).addClass("has_edit");
	});
	$(".edit_input").live("focusout", function(){
		console.info($(this));
		$(this).removeClass("has_edit");
	});
});
</script>