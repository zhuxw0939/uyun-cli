<template>

	<div>
		<div class="box box_min">
			<div class="title_tab">
				<router-link class="current" to="scorePaper">编辑双向细目表</router-link>
				<router-link to="importTicket">导入准考证号</router-link>
			</div>
			<div class="_form">
				<div class="form_header cf">
					<el-select v-model="coursesOptionsChoiceId" placeholder="选择考试科目" @change="onChangeExamCourses" class="fl">
						<el-option v-for="item in coursesOptions" :label="item.courseName" :value="item.id">
							{{ item.courseName }}
							<font v-if="item.state" color="#777">&nbsp;&nbsp;&nbsp;（已完成）</font>
							<font v-else color="#bbb">&nbsp;&nbsp;&nbsp;（未完成）</font>
						</el-option>
					</el-select>
					<div class="sx_tabs fl">
						<a href="javascript:void(0)" :class="{current:questionsTab==1}" @click="onClickChoiceTabA">I选择题</a>
						<a href="javascript:void(0)" :class="{current:questionsTab==2}" @click="onClickChoiceTabB">II非选择题</a>
					</div>
					<div class="goright scorepage_right">
						<a href="javascript:void(0)" @click="onClickUpFile">
							<i class="iconfont">&#xe637;</i>
							表格上传
							<i class="iconfont" @click.stop="explainVisible=true" style="color: #019ce7">&#xe624;</i>
						</a>
						<a href="javascript:void(0)" @click="addNewQuestionVisible=true"><i class="iconfont">&#xe647;</i> 新增题目</a>
					</div>
				</div>
				<div class="form_chosescore">
					已设分值：<font color="#ea5e5e">{{sumPoints}}</font><i>/</i>满分：<font color="#333">{{totalPoints}}</font>
				</div>
				<div class="form_list" style="position: relative">
					<el-checkbox-group v-model="choiceRows" @change="onChangeChoiceRows">
					<table class="sx_table edit_table2">
						<thead>
							<tr class="tfoot">
								<td colspan="10">
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length!=1||String(choiceRows[0]).indexOf('.')!=-1}" @click="onEditAddRowsChildren"><i class="iconfont">&#xe647;</i>新增小题</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length==0}" @click="onEditGetUpRows"><i class="iconfont">&#xe63c;</i>上移</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length==0}" @click="onEditGetDownRows"><i class="iconfont">&#xe63d;</i>下移</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length<2}" @click="onEditMerge"><i class="iconfont">&#xe63e;</i>合并选考题</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length<2}" @click="onEditCancleMerge"><i class="iconfont">&#xe6a6;</i>取消选考题</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length==0}" @click="onEditDeleteRows"><i class="iconfont">&#xe63b;</i>删除</a>
								</td>
							</tr>
						</thead>
						<thead>
						    <tr>
							    <th width="8%">选择</th>
							    <th width="12%">题号</th>
							    <th width="8%">分值</th>
							    <th width="45%">知识点</th>
							    <th width="20%">能力层级</th>
							    <th width="10%">预测难度系数</th>
						    </tr>
					    </thead>
						<tbody v-if="questionsData.length>0" v-for="(item, index) in questionsData">
							<tr v-show="item.question.questionType==questionsTab">
								<td align="center">
									&nbsp;<el-checkbox :label="index">&nbsp;</el-checkbox>
								</td>
								<td class="td_tihao" :class="{line_1:item.children.length>0}">
									<input type="text" v-model="item.question.questionNum" class="edit_input">
									<span style="color: #f76565" v-if="item.question.chooseQuestion">选考题</span>
								</td>
								<!--分值-->
								<td v-if="item.children.length>0">
									<!--<input type="number" class="edit_input" :value="item.question.point" readonly>-->
									<!--<input type="text" class="edit_input">-->
								</td>
								<td v-else>
									<!--<el-input-number v-model="item.question.point" @change="onChangePointInput" class="edit_input" :controls="false"></el-input-number>-->
									<input type="number" step="0.01" v-model="item.question.point" class="edit_input" @change="onChangePointInput(item.question.point, index)">
									<!--<el-input-number v-model="item.question.point" @blur="onChangePointInput" class="edit_input" :controls="false"></el-input-number>-->
								</td>
								<!--知识点-->
								<td v-if="item.children.length>0"></td>
								<td v-else>
									<input type="text" v-model="item.pointsChoiceNames" @focus="hasFx(index)" @blur="notFx($event)" class="edit_input edit_input_left ellipsis">
								</td>
								<!--能力等级-->
								<td v-if="item.children.length>0"></td>
								<td v-else>
									<el-select class="el-select-text" v-model="item.levelsChoiceIds" multiple placeholder="请选择" @change="onChangeSelectLevels(index)">
										<el-option v-for="itemSon in levelsOptions" :label="itemSon.levelName" :value="itemSon.levelId"></el-option>
									</el-select>
								</td>
								<!--难度系数-->
								<td v-if="item.children.length>0"></td>
								<td v-else>
									<input type="number" v-model="item.question.coefficient" class="edit_input" @change="onChangeCoefficientInput(item.question.coefficient, index)">
								</td>
							</tr>
							<!--和上面一样-->
							<!-- itemChildren indexChildren -->
							<tr v-if="item.children.length>0" v-for="(itemChildren, indexChildren) in item.children" v-show="itemChildren.question.questionType==questionsTab">
								<td align="center">
									&nbsp;<el-checkbox :label="index+'.'+indexChildren">&nbsp;</el-checkbox>
								</td>
								<td class="line_2 td_tihao">
									<input type="text" v-model="itemChildren.question.questionNum" class="edit_input">
									<span style="color: #f76565" v-if="itemChildren.question.chooseQuestion">选考题</span>
								</td>
								<td>
									<input type="number" step="0.01" v-model="itemChildren.question.point"  class="edit_input" @change="onChangePointInput(itemChildren.question.point, index, indexChildren)">
								</td>
								<td>
									<input type="text" v-model="itemChildren.pointsChoiceNames" @focus="hasFx(index, indexChildren)" @blur="notFx($event)" class="edit_input edit_input_left ellipsis">
								</td>
								<td>
									<el-select class="el-select-text" v-model="itemChildren.levelsChoiceIds" multiple placeholder="请选择" @change="onChangeSelectLevels(index, indexChildren)">
										<el-option v-for="itemSon in levelsOptions" :label="itemSon.levelName" :value="itemSon.levelId"></el-option>
									</el-select>
								</td>
								<td><input type="number" v-model="itemChildren.question.coefficient" class="edit_input" @change="onChangeCoefficientInput(itemChildren.question.coefficient, index, indexChildren)"></td>
							</tr>
						</tbody>
						<tbody v-if="!questionsData || questionsData.length==0">
							<tr>
								<td colspan="10" class="no_data"><i class="iconfont">&#xe649;</i><br>请用表格导入或者新增题目来创建考题</td>
							</tr>
						</tbody>
						<tfoot>
							<tr class="tfoot">
								<td colspan="10">
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length!=1||String(choiceRows[0]).indexOf('.')!=-1}" @click="onEditAddRowsChildren"><i class="iconfont">&#xe647;</i>新增小题</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length==0}" @click="onEditGetUpRows"><i class="iconfont">&#xe63c;</i>上移</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length==0}" @click="onEditGetDownRows"><i class="iconfont">&#xe63d;</i>下移</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length<2}" @click="onEditMerge"><i class="iconfont">&#xe63e;</i>合并选考题</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length<2}" @click="onEditCancleMerge"><i class="iconfont">&#xe6a6;</i>取消选考题</a>
									<a href="javascript:void(0)" :class="{no_edit:choiceRows.length==0}" @click="onEditDeleteRows"><i class="iconfont">&#xe63b;</i>删除</a>
								</td>
							</tr>
						</tfoot>
					</table>
					</el-checkbox-group>
					<!--已完成编辑-显示遮罩层-->
					<div class="question_not_edit" title="如需修改请点击再次编辑。" @click="onClickDialogCantEdit" v-if="questionsDataStatus"></div>
				</div>
				<!--已完成编辑-显示遮罩层-->
				<div class="exam_create_footer" v-if="questionsDataStatus">
					<el-button class="el-button-longer" type="success" icon="edit" @click="onSubmitAgain" size="large">再次编辑</el-button>
				</div>
				<div class="exam_create_footer" v-else>
					<el-button class="el-button-longer" @click="onResetForm()" size="large">暂存 </el-button>
					<el-button class="el-button-longer" type="primary" @click="onSubmitForm" size="large">完成编辑</el-button>
				</div>
			</div>
		</div>


		<el-dialog title="选择知识点" v-model="dialogVisible" size="larger" top="10%">
			<div class="know_cf cf">
				<el-row>
					<el-col :span="16">
						<div class="know_search">
							<el-input placeholder="请输入一级知识点关键词" v-model="searchChoiceData" @change="querySearch">
								<el-button slot="append" icon="search"></el-button>
							</el-input>
						</div>
						<div class="know_box">
							<el-tree
									:data="pointsOptionsArray"
									:default-checked-keys="defaultCheckedKeys"
									empty-text="没有查询到知识点"
									show-checkbox=""
									check-strictly=""
									node-key="id"
									ref="tree"
									:default-expanded-keys="defaultExpandedKeys"
									:props="defaultProps"
									:filter-node-method="filterNode"
									@check-change="checkChange"
									@current-change="currentChange">
							</el-tree>
						</div>
					</el-col>
					<el-col :span="8">
						<div class="knowchose_box">
							<h5>我的选择</h5>
							<dl v-if="currentCheckedArray.length>0">
								<div v-for="(item, index) in currentCheckedArray">
									<dt v-if="item.level==2">{{item.name}} <i @click="onClickRemovePointsById(item.id)">×</i></dt>
									<dd v-else>{{item.name}} <i @click="onClickRemovePointsById(item.id)">×</i></dd>
								</div>
							</dl>
							<div class="knowchose_no_data" v-else>还没有选择任何数据呢！ </div>
						</div>
					</el-col>
				</el-row>
			</div>

			<div class="know_footer">
				<el-button @click="dialogVisible = false" class="el-button-longer">取 消</el-button>
				<el-button type="primary" @click="onClickSaveChocePoints" class="el-button-longer">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="表格导入须知" v-model="explainVisible">
			<div class="explain_box">
				<p>1、一道题存在多个不同类型的一级知识点时用“##”隔开，例如：一级知识点>二级知识点1｜二级知识点2 ##一级知识点>二级知识点；
				<p>2、一道题存在多个不同类型的二级知识点时用“｜”隔开，例如：一级知识点>二级知识点1｜二级知识点2｜二级知识点3；</p>
				<p>3、每道题一、二级知识点个数分别不超过10个。</p>
				<p>4、请下载试卷编辑模板进行编辑</p>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="downloadTemplate"><i class="iconfont iconfont_left">&#xe638;</i>试卷编辑模板下载</el-button>
					<span class="goright"><el-button @click="explainVisible=false" class="el-button-longer">确 定</el-button></span>
				</div>
			</div>
		</el-dialog>

		<el-dialog title="新增题目" v-model="addNewQuestionVisible" size="tinyer">
			<div class="addnew_box">
				<el-form :model="formAddNewQuestion" ref="formAddNewQuestion" label-width="150px" class="demo-ruleForm">
					<el-form-item label="新增题型:">
						<el-select v-model="formAddNewQuestion.type" class="el-select-text" placeholder="请选择" prop="type">
							<el-option label="选择题" :value="1"></el-option>
							<el-option label="非选择题" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="新增题数:" prop="num">
						<el-input type="number" v-model="formAddNewQuestion.num" placeholder="在此输入新增题数"></el-input>
					</el-form-item>
					<el-form-item label="起始题号:" prop="star">
						<el-input type="number" v-model="formAddNewQuestion.star" placeholder="在此输入起始题号"></el-input>
					</el-form-item>
					<el-form-item label="小题分值:" prop="point">
						<el-input type="number" v-model="formAddNewQuestion.point" placeholder="在此输入小题分值"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="addNewQuestionVisible=false" class="el-button-longer">取 消</el-button>
					<el-button type="primary" @click="onSubmitAddNewQuestion('formAddNewQuestion')" class="el-button-longer">确 定</el-button>
				</div>
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
			examId:　backExamInfo.id,
			userType:　backUser.type,

			// 考试科目
			coursesOptions: [],
			coursesOptionsChoiceId: "",
			coursesOptionsSubjectId: "", //考试科目云平台id
			coursesOldId: "",
			coursesLoader: false,

			// 能力层级数据池
			levelsOptions: [],
			// 知识点数据池
			pointsOptions: [],
			pointsOptionsArray: [],

			// 双向细目表
			questionsDataStatus: "",
			questionsData: [],
			questionsDataIndex: "",  // 当前编辑哪一行
			questionsDataSave: [],
			sumPoints: 0, // 当前分数
			totalPoints: 0,  // 科目总分

			// 编辑
			choiceRows: [],
			notEdit: 0,
			notEditMore: 0,

			// 选择题非选择题切换，默认选择题
			questionsTab: 1,

			// 弹出层 -- 选择的知识点
			pointsNowChoiceIds: [],
			nowKnowCheckList: [],
			// 搜索知识点
			searchChoiceData: '',
			searchBackData: [],

			// 新增题目
			formAddNewQuestion: {
				type: 1,
				num: "",
				star: "",
				point: ""
			},
			rulesAddNewQuestion: {
				type: [
				],
				num: [
					{ required: true, message: '请输入新增题数', trigger: 'blur' }
				],
				star: [
					{ required: true, message: '请输入起始题号', trigger: 'blur' },
				],
				point: [
					{ required: true, message: '请输入小题分值', trigger: 'blur' },
				]
			},

			dialogVisible: false,
			explainVisible: false,
			addNewQuestionVisible: false,

			ajaxLock: false,

			currentCheckedArray: [],
			defaultCheckedKeys: [],
			filterText: "",
			defaultExpandedKeys: [],
			defaultProps: {
				children: 'children',
				label: 'name'
			}

		};
	},
	watch: {
		'$route.query' () {
//			console.info("watch $route change");
//			this.onChangeHappen(this.$route.query.course_id);
		}
		//'checkList': 'checkListChange',
		//'checkList222': 'checkList222Change'
	},
	created() {
		console.info("scorePaper created");
		console.info(backExamInfo);
		console.info(this.examId);
		vm.currentRouter = "/examlist";
		// 根据考试id获取考试科目，并默认获取第一个考试科目的双向细目表数据
		this.ajaxGetCoursesOptionsByExamId();
	},
	mounted() {
		console.info("scorePaper mounted");
	},
	methods: {
		onClickUpFile() {
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
		getCheckedNodes() {
			console.json(this.$refs.tree.getCheckedNodes());
		},
		getCheckedKeys() {
			console.json(this.$refs.tree.getCheckedKeys());
		},
		setCheckedNodes() {
			this.$refs.tree.setCheckedNodes([{
				id: 5,
				label: '二级 2-1'
			}, {
				id: 9,
				label: '三级 1-1-1'
			}]);
		},
		setCheckedKeys() {
			this.$refs.tree.setCheckedKeys([1875, 1877, 1879]);
		},
		resetChecked() {
			console.info("resetChecked");
			console.info(this.defaultExpandedKeys);
			console.info(this.$refs.tree.getCheckedKeys());
			this.$refs.tree.setCheckedKeys([]);
			let arr = this.$refs.tree.getCheckedKeys();
			console.info(this.$refs.tree.getCheckedKeys());
			for(let i=0; i<arr.length; i++){
				let item = arr[i];
				this.$refs.tree.setChecked(item, false);
			}
			console.info(this.$refs.tree.getCheckedKeys());
			this.defaultExpandedKeys = [];
			console.info(this.defaultExpandedKeys);
		},
		setChecked() {
			console.info("setChecked coming");
			this.$refs.tree.setChecked({
				id: 1877
			});
		},
		filterNode(value, data) {
			if (!value) return true;
			return data.name.indexOf(value) !== -1;
		},

		checkChange(data, checked, indeterminate) {
			console.info("checkChange");
			// 传递给 data 属性的数组中该节点所对应的对象
			console.json(data);
			// 节点本身是否被选中
			console.info("节点本身是否被选中："+checked);
			// 节点的子树中是否有被选中的节点
			console.info("节点的子树中是否有被选中的节点："+indeterminate);
			/*if(!data.children){
			 this.$refs.tree.setCheckedNodes([{id: 1877 }])
			 }*/
			// console.json(this.$refs.tree.getCheckedKeys());
			// this.$refs.tree.setCheckedKeys([1877]);


			let checkedKeys = this.$refs.tree.getCheckedKeys();
			let checkedNodes = this.$refs.tree.getCheckedNodes();

			console.info(checkedKeys);
			console.json(checkedNodes);

			if(!data.children){
				// 是子级知识点
				if(checked && checkedKeys.findIndex(item => item==data.pid)==-1){
					console.info("选中子级知识点，但这个子级知识点的父级知识点没有被选中："+data.pid);
					this.$refs.tree.setChecked(data.pid, true);
				}
			} else {
				// 是父级知识点
				if(!checked){
					for(let i=0; i<data.children.length; i++){
						let itemChildren = data.children[i];
						if(checkedKeys.findIndex(item => item==itemChildren.id)!=-1){
							console.info("选中父级知识点，但这个父级知识点的子级知识点有被选中的："+itemChildren.id);
							this.$refs.tree.setChecked(itemChildren.id, false);
						}
					}
				}
			}
			this.currentCheckedArray = checkedNodes;

			/*	setTimeout(() => {
			 this.$refs.tree.setCheckedKeys([1883, 1885]);
			 }, 500)*/

			/*	var newArray = this.$refs.tree.getCheckedKeys();
			 console.json(this.$refs.tree.getCheckedKeys());
			 newArray.push(1877);
			 // console.json(newArray);
			 // this.$refs.tree.setCheckedKeys([1875, 1877]);
			 this.$refs.tree.setCheckedKeys([1877]);
			 console.json(this.defaultCheckedKeys);*/

			/*

			 setTimeout(() => {
			 this.$refs.tree.setCheckedKeys(newArray);
			 }, 200)
			 */



		},
		currentChange(a, b) {
			console.info("currentChange");
			console.info(a);
			console.info(b);
		},
		onChangeChoiceRows(val) {
			// 选择项发生变化时
//				 console.info(val);
//				 console.info(this.choiceRows);
		},
		onChangeExamCourses(value) {
			// 考试科目发生变化时
			console.info("考试科目发生变化："+value);
			// 初次打开某科目
//			if(!this.coursesLoader){
//				console.info("初次打开某科目");
//				this.onChangeHappen(value);
//				this.coursesLoader = true;
//			} else {
//				console.info("不是初次打开某科目");
//				this.ajaxQuestionTempSave(this.coursesOldId, () => {
//					console.info("ajaxQuestionTempSave back");
//					this.onChangeHappen(value);
//					// window.location.href= "/exam/scorePaper?exam_id="+this.examId+"&course_id="+value;
//				});
//			}
			this.onChangeHappen(value);
			this.coursesOldId = value;
			for(let item of this.coursesOptions){
				if(item.id==value){
					this.totalPoints = item.totalScore
				}
			}
		},
		onChangeHappen(value) {
			this.coursesOptionsSubjectId = this.coursesOptions.find((item) => item.id==value).courseId;
			console.info(this.coursesOptionsSubjectId);
			// 获取能力层级数据池
			this.ajaxGetLevelsOptionsByCourseId();
			// 获取知识点数据池
			this.ajaxGetPointsOptionsByCourseId();

			// 获取该科目的导入状态
			this.ajaxGetQuestionStatusByCourseId(value);

			// 获取双向细目表
			this.ajaxGetQuestionByCourseId(value);

			// 统一切换到选择题
			this.onClickChoiceTabA();
		},
		onClickChoiceTabA() {
			// 选择题-切换
			if(this.questionsTab==1) return false;
			this.questionsTab=1;
			this.choiceRows = [];
		},
		onClickChoiceTabB() {
			// 非选择题-切换
			if(this.questionsTab==2) return false;
			this.questionsTab=2;
			this.choiceRows = [];
		},
		onChangeCoefficientInput(value, index, index2) {
			if( !/^[0-9]+(.[0-9]{1,10})?$/.test(value) ){
				this.$alert("请输入0-1的数字！");
				if(index2 == undefined){
					this.questionsData[index].question.coefficient = "";
				} else {
					this.questionsData[index].children[index2].question.coefficient = "";
				}
			} else {
				value = Number(value);
				if(value>=0 && value<=1){
				} else {
					this.$alert("难度系数必须是0-1的数字！");
					if(index2 == undefined){
						this.questionsData[index].question.coefficient = "";
					} else {
						this.questionsData[index].children[index2].question.coefficient = "";
					}
				}
			}
		},
		onChangePointInput(value, index, index2) {
			if( !/^[0-9]+(.[0-9]{1,10})?$/.test(value) ){
				this.$alert("请输入数字！");
				if(index2 == undefined){
					this.questionsData[index].question.point = "";
				} else {
					this.questionsData[index].children[index2].question.point = "";
				}
			} else {
				value = Number(value);
				if(value>=0 && value<=150){
				} else {
					this.$alert("分值必须为0-150的数字！");
					if(index2 == undefined){
						this.questionsData[index].question.point = "";
					} else {
						this.questionsData[index].children[index2].question.point = "";
					}
				}
			}
			// 重新计算总分
			this.countSumPoints();
		},
		hasFx(index, childIndex) {
			// 选中编辑某行知识点
			//var el = event.currentTarget;
			console.info("选择了index:"+index+" - "+childIndex);

			// 打开层
			this.dialogVisible = true;

			// 设置当前正在编辑的rows
			if(childIndex==undefined){
				this.questionsDataIndex = index;
			} else {
				this.questionsDataIndex = [index, childIndex];
			}

			// 清除搜索结果
			this.searchChoiceData = "";
			this.defaultCheckedKeys = [];

			// 获取当前正在编辑的rows的知识点
			setTimeout(() => {
				this.resetChecked();
				this.getNowCurrentCheckedArray();
			}, 100)

			//this.getNowPointsChoiceIds();
			//this.checkNowPointsChildrenIsShow();
		},
		getNowCurrentCheckedArray() {
			// 获取当前正在编辑的rows的知识点
			let newArray = [];
			let currentIndex = this.questionsDataIndex;
			if(typeof currentIndex === "number"){
				newArray = this.questionsData[currentIndex].points;
			} else {
				newArray = this.questionsData[currentIndex[0]].children[currentIndex[1]].points;
			}
			console.json(newArray);

			for(let i=0; i<newArray.length; i++){
				let item = newArray[i];
				this.$refs.tree.setChecked(item.pointId, true);
				this.defaultExpandedKeys.push(item.pointId);
			}

			/*

			 for(let i=0; i<newArray.length; i++){
			 let item = newArray[i];
			 this.$refs.tree.setChecked(item.pointId, true);
			 }
			 */




			/*let backArray = [];
			 for(let i=0; i<newArray.length; i++){
			 let item = newArray[i];
			 backArray.push(Number(item.pointId));
			 }
			 console.info(backArray);
			 this.defaultCheckedKeys = backArray;
			 setTimeout(() => {
			 this.currentCheckedArray = this.$refs.tree.getCheckedNodes();
			 }, 200)*/
		},
		notFx (event) {
			// 取消选中编辑某行知识点
			console.info("notFx");
		},
		onChangePointsRows() {
			console.info("onChangePointsRows happing");
			// 弹出窗口-选择的知识点发生变化时
			console.info(this.pointsNowChoiceIds);

			// 排序
			let arr = this.pointsNowChoiceIds.slice(0);
			arr.sort(function(a, b){return a-b});
			// console.info("排序完成：");
			// console.json(arr);

			// 查询所有父级的id，备用
			let parentArray = [];
			for(let i=0; i<arr.length; i++){
				let itemId = arr[i];
				// console.warn(itemId);
				let item = this.pointsOptions.find((itemPoints) => itemPoints.id == itemId);
				// console.json(item);
				if(item.level==3){
					parentArray.push(item.pid);
				}
			}
			// console.info("查询所有父级id完成：");
			// console.json(parentArray);

			let newArray = [];
			for(let i=0; i<arr.length; i++){
				let itemId = arr[i];
				// console.warn(itemId);
				let item = this.pointsOptions.find((itemPoints) => itemPoints.id == itemId);
				// console.json(item);

				if(item.level==3 && item.pid!=undefined && arr.findIndex((itemArr) => itemArr == item.pid)==-1){
					// 查询这个item是否有父级，有的话看有没有把他的pid加上去
					// 没有，加上去，退出循环
					// console.warn("父级未选");
					this.pointsNowChoiceIds.push(item.pid);
					newArray = "break";
					break;
				} else if(item.level==2 && item.id!=undefined && parentArray.findIndex((itemArr) => itemArr == item.id)==-1){
					// 查询这个item是否是父级，是的话看有没有子级选择了的
					// 没有，删除这个父级
					// console.warn("我就是父级，并且没有我的任何子级选中");
					// console.info("没有，删除这个父级");
					// console.info(item.id);
					// console.info(this.pointsNowChoiceIds.indexOf(item.id));
					this.pointsNowChoiceIds.splice(this.pointsNowChoiceIds.indexOf(item.id), 1);
					// this.pointsNowChoiceIds.
					newArray = "break";
					break;
				} else {
					// 有，不管
					// console.info("不管，添加选中成功");
					newArray.push({
						level: item.level,
						parentId: item.pid,
						pointId: item.id,
						pointName: item.name
					});
				}
			}
			// this.questionsData[this.questionsDataIndex].points = newArray;
			// console.info("newArray完成：");
			// console.json(newArray);

			if(newArray==="break"){
				// 2017.4.10 bug vue或element版本问题？
				console.warn("手动触发 onChangePointsRows事件");
				this.onChangePointsRows();
			} else {
				let currentIndex = this.questionsDataIndex;
				if(typeof currentIndex === "number"){
					this.questionsData[currentIndex].points = newArray;
				} else {
					this.questionsData[currentIndex[0]].children[currentIndex[1]].points = newArray;
				}
			}

			/*return false;
			 // 选择知识点-弹框 改变或取消选中某行时
			 var el = event.currentTarget;
			 this.dialogVisible = true;
			 console.info($(el));
			 console.info($(el).is(':checked'));
			 if($(el).is(':checked')){
			 $(el).closest("li").addClass("current");
			 //this.nowKnowCheckText=$(el).closest("li").find(".el-checkbox__label").text();
			 } else if($(el).closest("li").hasClass("current")) {
			 $(el).closest("li").removeClass("current");
			 }*/
		},
		onChangeChildrenPointsRow(){
		},
		onClickRemovePointsById(id) {
			console.info("onClickRemovePointsById");
			this.$refs.tree.setChecked(id, false);

			// this.pointsNowChoiceIds.splice(this.pointsNowChoiceIds.indexOf(id), 1);
			// 2017.4.10 bug vue或element版本问题？
			// console.warn("手动触发 onChangePointsRows事件");
			// this.onChangePointsRows();
		},
		currentQuestionsDataPoints() {
			let currentIndex = this.questionsDataIndex;
			if(typeof currentIndex === "number"){
				return this.questionsData[currentIndex].points;
			} else {
				return this.questionsData[currentIndex[0]].children[currentIndex[1]].points;
			}
		},
		getNowPointsChoiceIds() {
			// 获取当前编辑的知识点ids
			let arr = this.currentQuestionsDataPoints();
			let newArray = [];
			for(let i=0; i<arr.length; i++){
				let item = arr[i];
				newArray.push(Number(item.pointId));
			}
			this.pointsNowChoiceIds = newArray;
		},
		checkNowPointsChildrenIsShow() {
			return false;
			// 查询当前知识点，如果父级知识点被选择了，则展开这个知识点
			// console.info(this.pointsOptionsArray);
			// console.info(this.pointsNowChoiceIds);
			let arr = this.pointsOptionsArray;
			let idsArr = this.pointsNowChoiceIds;
			for(let i=0; i<arr.length; i++){
				let item = arr[i];
				// console.info(i);
				// console.info(item);
				// console.info(item.data.id);
				if(idsArr.findIndex((itemId) => itemId == item.data.id)!=-1){
					// 有
					this.pointsOptionsArray[i].show = true;
				} else {
					// 没有
					this.pointsOptionsArray[i].show = false;
				}
			}
		},
		onClickSaveChocePoints() {
			// 保存知识点-提交
			this.dialogVisible = false;

			let arr = this.currentCheckedArray;

			let pointsArray = [];
			let namesArray = [];
			for(let i=0; i<arr.length; i++){
				let item = arr[i];
				namesArray.push(item.name);
				pointsArray.push({
					pointId: item.id,
					parentId: item.pid,
					pointName: item.name,
					level: item.level
				})
			}

			let currentIndex = this.questionsDataIndex;
			if(typeof currentIndex === "number"){
				this.questionsData[currentIndex].points = pointsArray;
				this.questionsData[currentIndex].pointsChoiceNames = this.getChoiceNames(pointsArray);
			} else {
				this.questionsData[currentIndex[0]].children[currentIndex[1]].points = pointsArray;
				this.questionsData[currentIndex[0]].children[currentIndex[1]].pointsChoiceNames = this.getChoiceNames(pointsArray);
			}



			// let arr = this.currentQuestionsDataPoints();
			// let newArray = [];
			// for(let i=0; i<arr.length; i++){
			// 	let item = arr[i];
			// 	newArray.push(item.pointName);
			// }

			// let newArray = this.currentCheckedArray;
			//
			// let currentIndex = this.questionsDataIndex;
			// if(typeof currentIndex === "number"){
			// 	this.questionsData[currentIndex].points = newArray;
			// 	this.questionsData[currentIndex].pointsChoiceNames = newArray;
			// } else {
			// 	this.questionsData[currentIndex[0]].children[currentIndex[1]].points = newArray;
			// 	this.questionsData[currentIndex[0]].children[currentIndex[1]].pointsChoiceNames = newArray;
			// }
		},
		getChoiceNames(points){
			console.json(points);
			// 一级知识点>二级知识点1｜二级知识点2 ## 一级知识点>二级知识点
			// 一级知识点>二级知识点1｜二级知识点2｜二级知识点3
			let str = "";
			let firstOnePointsIndex=0;
			let firstTwoPointsIndex=0;
			for(let i=0; i<points.length; i++){
				let item = points[i];

				let thisName;
				if(item.name){
					thisName = item.name;
				} else if(item.pointName){
					thisName = item.pointName;
				}

				if(item.level==2){
					if(firstOnePointsIndex==0){
						str += ""+thisName;
					} else {
						str += " ## "+thisName;
					}
				} else {
					if(firstTwoPointsIndex==0){
						str += " > "+thisName;
					} else {
						str += " | "+thisName;
					}
				}
				if(item.level==2) {
					firstOnePointsIndex = 1;
					firstTwoPointsIndex = 0;
				} else if(item.level==3) {
					firstTwoPointsIndex = 1;
				}
			}
			return str;
		},
		pointsNowChoiceIdsChange() {
			// 选择知识点-弹框 选中值改变时
			console.info("pointsNowChoiceIdsChange +++ ");
			console.info(this.pointsNowChoiceIds);
			this.nowKnowCheckList = [];
			for(var i=0;i<this.pointsNowChoiceIds.length;i++){
				console.info(i);
				this.nowKnowCheckList.push({
					id: this.pointsNowChoiceIds[i],
					name: "选择的知识点文字"
				})
			}
			console.info(this.nowKnowCheckList);
		},
		querySearch(queryString) {
			this.$refs.tree.filter(queryString);
			return false;
			// 搜索知识点
			console.info("搜索知识点："+queryString);
			// 调用 callback 返回建议列表的数据
			var _this = this;
			if(queryString==""){
				_this.makingPoints(this.pointsOptions, false);
				_this.checkNowPointsChildrenIsShow();
			} else {
				this.ajaxGetQuerySearch(queryString, function(data){
					console.json(data);
					_this.makingPoints(data, true);
				});
			}
		},
		onChangeSelectLevels(index, childIndex) {
			// 修改了某个能力层级时 - (提交)
			if(childIndex==undefined){
				// 一级知识点
				let arr = this.questionsData[index].levelsChoiceIds;
				let newArray = [];
				for(let i=0; i<arr.length; i++){
					// console.info(i);
					let itemId = arr[i];
					// console.info(itemId);
					let item = this.levelsOptions.find((itemLevel) => itemLevel.levelId == itemId);
					newArray.push({
						levelId: item.levelId,
						levelName: item.levelName
					});
				}
				this.questionsData[index].levels = newArray;
			} else {
				// 二级知识点
				let arr = this.questionsData[index].children[childIndex].levelsChoiceIds;
				let newArray = [];
				for(let i=0; i<arr.length; i++){
					// console.info(i);
					let itemId = arr[i];
					// console.info(itemId);
					let item = this.levelsOptions.find((itemLevel) => itemLevel.levelId == itemId);
					newArray.push({
						levelId: item.levelId,
						levelName: item.levelName
					});
				}
				this.questionsData[index].children[childIndex].levels = newArray;
			}
		},
		onEditGetUpRows() {
			if(this.choiceRows.length==0) return false;

			// 编辑-上移
			this.choiceRows.sort(function(a, b){ return a>b});

			if(this.checkRowsIsChildren()==0){
				// 所选的行全部是一级栏目
				let i=0;
				for(var item of this.choiceRows){
					// 已经移到最上面的话则不操作
					item = Number(item);
					if(item==0) break;
					for(let j=0;j<100;j++){
						if(this.questionsData[item-1].question!=undefined && this.questionsData[item-1].question.questionType!=this.questionsTab){
							this.exchangeRows(item, item-1);
							this.choiceRows[i] = item-1;
							item--;
						} else {
							this.exchangeRows(item, item-1);
							this.choiceRows[i] = item-1;
							break;
						}
					}
					i++;
				}
			} else if(this.checkRowsIsChildren()==this.choiceRows.length) {
				// 所选的行全部是二级栏目
				if(this.checkRowsChildrenIsOneParent()){
					// 所选的二级栏目是同一个一级栏目下的
					let i=0;
					for(let item of this.choiceRows){
						let itemArray = String(item).split(".");
						let itemParent =  itemArray[0];
						item = Number(itemArray[1]);
						// 已经移到最下面的话则不操作
						if(item==0) break;
						this.exchangeChildrenRows(itemParent, item, item-1);
						item--;
						this.choiceRows[i] = itemParent+"."+item;
						i++;
					}
				} else {
					// 所选的二级栏目是不同的一级栏目下的
					alert("只有选择同一个栏目下的子栏目才能移动！");
				}
			} else {
				// 只有选择同一级别的栏目才能移动
				alert("只有选择同一级别的栏目才能移动");
				// todo 把子节点全部删掉，并保留上级的index，去重
			}
		},
		onEditGetDownRows() {
			if(this.choiceRows.length==0) return false;

			// 编辑-下移
			this.choiceRows.sort(function(a, b){ return a<b});

			if(this.checkRowsIsChildren()==0){
				// 所选的行全部是一级栏目
				let i=0;
				for(var item of this.choiceRows){
					// 已经移到最下面的话则不操作
					item = Number(item);
					if(item==this.questionsData.length-1) break;
					for(let j=0;j<100;j++){
						if(this.questionsData[item+1].question!=undefined && this.questionsData[item+1].question.questionType != this.questionsTab){
							this.exchangeRows(item, item+1);
							this.choiceRows[i] = item+1;
							item++;
						} else {
							this.exchangeRows(item, item+1);
							this.choiceRows[i] = item+1;
							break;
						}
					}
					i++;
				}
			} else if(this.checkRowsIsChildren()==this.choiceRows.length) {
				// 所选的行全部是二级栏目
				if(this.checkRowsChildrenIsOneParent()){
					// 所选的二级栏目是同一个一级栏目下的
					let i=0;
					for(let item of this.choiceRows){
						let itemArray = String(item).split(".");
						let itemParent =  itemArray[0];
						item = Number(itemArray[1]);
						// 已经移到最下面的话则不操作
						if(item==this.questionsData[itemParent].children.length-1) break;
						this.exchangeChildrenRows(itemParent, item, item+1);
						item++;
						this.choiceRows[i] = itemParent+"."+item;
						i++;
					}
				} else {
					// 所选的二级栏目是不同的一级栏目下的
					alert("只有选择同一个栏目下的子栏目才能移动！");
				}
			} else {
				// 只有选择同一级别的栏目才能移动
				alert("只有选择同一级别的栏目才能移动");
				// todo 把子节点全部删掉，并保留上级的index，去重
			}
		},
		exchangeRows(index1, index2) {
			// 交换questionData的某个元素的顺序
			index1 = Number(index1);
			index2 = Number(index2);
			this.questionsData[index1] = this.questionsData.splice(index2, 1, this.questionsData[index1])[0];
		},
		exchangeChildrenRows(pIndex, index1, index2) {
			// 交换questionData Children中的某个元素的顺序
			pIndex = Number(pIndex);
			index1 = Number(index1);
			index2 = Number(index2);
			this.questionsData[pIndex].children[index1] = this.questionsData[pIndex].children.splice(index2, 1, this.questionsData[pIndex].children[index1])[0];
		},
		checkRowsIsChildren() {
			// 检查当前所选的行是否是子节点，是的话返回个数，否则返回0
			var arr = this.choiceRows;
			let backNum = 0;
			for(let item of arr){
				if(String(item).indexOf(".")!=-1){
					backNum++
				}
			}
			return backNum;
		},
		checkRowsChildrenIsOneParent() {
			// 检查当前所选的所有二级栏目是同一个一级栏目下的
			var arr = this.choiceRows;
			let backData = false;
			let newArray = [];
			for(let item of arr){
				newArray.push(String(item).split(".")[0]);
			}
			let str1 = newArray.join("");
			let str2 = "";
			for(let item of newArray){
				str2 += String(newArray[0])
			}
			if(str1==str2){
				backData = true;
			}
			return backData;
		},
		onEditMerge() {
			if(this.choiceRows.length<2) return false;
			// 编辑-合并选考题
			console.info("合并选考题");
			// console.info(this.choiceRows);

			// 判断是否已存在选考题
			if(this.checkMergeNum().length != 0) {
				return this.$alert("请取消当前选考题后再操作！", {type: "error"});
			}

			// 判断选择的题目数量
			if(this.choiceRows.length <= 1) {
				return this.$alert("请选择两道以上的题目进行合并！", {type: "error"});
			}

			// 判断选择的题目数是否大于2
			// if(this.choiceRows.length > 2) {
			// 	return this.$alert("仅能选择两道大题或两道小题合并！", {type: "error"});
			// }

			// 判断选择的题型是否相同：仅大题和大题，小题和小题
			// if(typeof this.choiceRows[0] !== typeof this.choiceRows[1]){
			// 	return this.$alert("只允许大题和大题合并，或者小题和小题合并！", {type: "error"});
			// }


			// 判断选择的题型是否相同：仅大题和大题，小题和小题
			if(this.checkRowsPointTypeIsSame()){
				return this.$alert("只允许大题和大题合并，或者小题和小题合并！", {type: "error"});
			}

			// 检查分值是否相等
			if(this.checkRowsPointIsSame()){
				return this.$alert("请选择分值相等的题目，否则无法合并！", {type: "error"});
			}

			// 验证通过
			for(let item of this.choiceRows){
				// console.info(item);
				let itemStr = String(item);
				if(itemStr.indexOf(".")!=-1){
					item = itemStr.split(".");
					// console.info(item);
					this.questionsData[item[0]].children[item[1]].question.chooseQuestion = 1;
				} else {
					this.questionsData[item].question.chooseQuestion = 1;
				}
			}
			this.choiceRows = [];
			// 重新计算总分
			this.countSumPoints();
		},
		onEditCancleMerge() {
			if(this.choiceRows.length<2) return false;
			// 编辑-取消选考题
			console.info(this.checkRowsIsMerge());
			console.info(this.checkMergeNum());
			if(this.checkMergeNum().length == 0) {
				alert("没有选考题怎么取消选择？");
			} else if(this.checkMergeNum().length == this.checkRowsIsMerge().length){
				for(let item of this.choiceRows){
					console.info(item);
					let itemStr = String(item);
					if(itemStr.indexOf(".")!=-1){
						item = itemStr.split(".");
						this.questionsData[item[0]].children[item[1]].question.chooseQuestion = 0;
					} else {
						this.questionsData[item].question.chooseQuestion = 0;
					}
				}
				this.choiceRows = [];
				// 重新计算总分
				this.countSumPoints();
			} else {
				alert("请选择所有选考题后再取消！");
			}
		},
		onEditAddRowsChildren() {
			if(this.choiceRows.length!=1||String(this.choiceRows[0]).indexOf('.')!=-1) return false;

			let nums = Number(this.questionsData[this.choiceRows[0]].question.questionNum);
			if(isNaN(nums)){
				nums = ""
			} else {
				nums = nums+"."+(this.questionsData[this.choiceRows[0]].children.length+1)
			}
			// 编辑-新增小题
			this.questionsData[this.choiceRows[0]].children.push({
				levels: [],
				points: [],
				children: [],
				levelsChoiceIds: [],
				pointsChoiceIds: [],
				pointsChoiceNames: "",
				question: {
					questionType: this.questionsTab,
					questionNum: nums,
					// questionNum: this.choiceRows[0]+".1",
					point: ""
				}
			});
			// 重新计算总分
			this.countSumPoints();
		},
		onEditDeleteRows() {
			if(this.choiceRows.length==0) return false;

			// 编辑-删除
			console.info("onEditDeleteRows");
			console.info(this.choiceRows);
			if(this.choiceRows.length<=0) return false;
			if(this.choiceRows.length>1){
				this.choiceRows.sort(function(a, b){ return a<b});
			}
			for(let item of this.choiceRows){
				// 删除子元素
				let itemStr = String(item);
				if(itemStr.indexOf(".")!=-1){
					item = itemStr.split(".");
					if(this.questionsData[item[0]] && this.questionsData[item[0]].children){
						if(this.questionsData[item[0]].children[item[1]].question.chooseQuestion) {
							// 删除了一个选考题，那么要将所有选考题的状态取消
							this.removeAllChooseQuestion();
						}
						this.questionsData[item[0]].children.splice(item[1], 1);
					}
				} else {
					if(this.questionsData[item].question.chooseQuestion) {
						// 删除了一个选考题，那么要将所有选考题的状态取消
						this.removeAllChooseQuestion();
					}
					this.questionsData.splice(item, 1);
				}
			}
			this.choiceRows = [];
			// 重新计算总分
			this.countSumPoints();
			this.questionsDataIndex = "";
		},
		removeAllChooseQuestion() {
			// 移除所有选考题的状态
			let i = 0;
			for(let item of this.questionsData){
				if(item.children!=undefined && item.children.length>0){
					//*** 有大题
					if(item.question.chooseQuestion){
						//** 这个大题是选考题
						item.question.chooseQuestion = 0;
					} else {
						//** 这个大题不是选考题
						let j = 0;
						for(let itemSon of item.children){
							if(itemSon.question.chooseQuestion){
								itemSon.question.chooseQuestion = 0;
							}
							j++;
						}
					}
				} else {
					//*** 没有大题
					if(item.question && item.question.chooseQuestion){
						item.question.chooseQuestion = 0;
					}
				}
				i++;
			}
		},
		getQuestionsDataRowsByIndex(index){
			// 根据某个索引返回questionsData 主要用于：索引有可能是子索引
			let backData;
			let indexStr = String(index);
			if(indexStr.indexOf(".")!=-1){
				backData = indexStr.split(".");
				backData = this.questionsData[backData[0]].children[backData[1]];
			} else {
				backData = this.questionsData[index];
			}
			return backData;
		},
		checkRowsPointTypeIsSame() {
			// 检查当前选择选考题的题型
			var arr = this.choiceRows;
			var newArray = [];
			for(let item of arr){
				// newArray.push(typeof item);
				item = this.getQuestionsDataRowsByIndex(item);
				if(item.children!=undefined && item.children.length>0){
					newArray.push("y");
				} else {
					newArray.push("n");
				}
			}
			console.info(newArray);

			let backData = false;
			let str1 = newArray.join("");
			let str2 = "";
			for(let item of newArray){
				str2 += newArray[0]
			}
			if(str1!=str2){
				backData = true;
			}
			return backData;
		},
		checkRowsPointIsSame() {
			// 检查当前选择的Rows的分值point是否相等
			var arr = this.choiceRows;
			console.info("检查当前选择Rows的分值是否相等");
			console.json(arr);

			var newArray = [];
			for(let item of arr){
				item = this.getQuestionsDataRowsByIndex(item);
				// console.json(item);
				if(item.children!=undefined && item.children.length>0){
					let newCount = 0;
					for(let itemSon of item.children) {
						newCount += Number(itemSon.question.point);
					}
					console.info("选了有小题的题目，分值为："+newCount);
					newArray.push(newCount);
				} else {
					console.info("选了没有小题的题目，分值为："+item.question.point);
					newArray.push(item.question.point);
				}
			}
			console.json(newArray);


			let backData = false;
			let str1 = newArray.join("");
			let str2 = "";
			for(let item of newArray){
				if(item=="" || item==0){
					str2 = "分数不能为空或为0";
					break;
				} else {
					str2 += String(newArray[0])
				}
			}
			if(str2=="分数不能为空或为0" || str1!=str2){
				backData = true;
			}

			console.warn(backData);
			console.info(str1);
			console.info(str2);
			return backData;


			/*
			 for(let item of arr){
			 item = this.getQuestionsDataRowsByIndex(item);
			 console.json(item);
			 if(item.children!=undefined && item.children.length>0){
			 newArray = "break";
			 break;
			 /!*for(let itemSon of item.children){
			 newArray.push(itemSon.question.point);
			 }*!/
			 } else {
			 newArray.push(item.question.point);
			 }
			 }
			 let backData = false;
			 if(newArray==="break"){
			 console.info("不能选取有小题的大题合并选考题");
			 backData = true;
			 } else {
			 let str1 = newArray.join("");
			 let str2 = "";
			 for(let item of newArray){
			 str2 += String(newArray[0])
			 }
			 if(str1!=str2){
			 backData = true;
			 }
			 }
			 console.error(backData);
			 return backData;*/
		},
		checkRowsIsMerge() {
			// 检查当前数据是否含有选考题，返回0或选数量
			var arr = this.choiceRows;
			console.info("checkRowsIsMerge");
			console.info(arr);
			let backArray = [];
			let i = 0;
			for(let item of arr){
				item = this.getQuestionsDataRowsByIndex(item);
				if(item.children!=undefined && item.children.length>0){
					//*** 有大题
					if(item.question.chooseQuestion){
						//** 这个大题是选考题
						backArray.push(i);
					} else {
						//** 这个大题不是选考题
						let j = 0;
						for(let itemSon of item.children){
							if(itemSon.question.chooseQuestion){
								backArray.push(i+'.'+j);
							}
							j++;
						}
					}
				} else {
					//*** 没有大题
					if(item.question && item.question.chooseQuestion){
						backArray.push(i);
					}
				}
				i++;
			}
			return backArray;
		},
		checkMergeNum() {
			// 检查questionsData含有选考题的数量
			let backArray = [];
			let i = 0;
			for(let item of this.questionsData){
				if(item.children!=undefined && item.children.length>0){
					//*** 有大题
					if(item.question.chooseQuestion){
						//** 这个大题是选考题
						backArray.push(i);
					} else {
						//** 这个大题不是选考题
						let j = 0;
						for(let itemSon of item.children){
							if(itemSon.question.chooseQuestion){
								backArray.push(i+'.'+j);
							}
							j++;
						}
					}
				} else {
					//*** 没有大题
					if(item.question && item.question.chooseQuestion){
						backArray.push(i);
					}
				}
				i++;
			}
			return backArray;
		},
		countSumPoints() {
			console.info("重新计算所有题目的分数");
			// 重新计算所有题目的分数
			let thisSumPoints = 0;
			let ischooseQuestionLock = false;
			for(let item of this.questionsData){
				if(item.children!=undefined && item.children.length>0){
					// *** 有小题，属于大题
					if(item.question.chooseQuestion=="1"){
						//** 这个大题是选考题
						if(!ischooseQuestionLock){
							// 还没有计算过
							let newCount = 0;
							for(let itemSon of item.children) {
								newCount += Number(itemSon.question.point);
							}
							thisSumPoints += newCount;
							ischooseQuestionLock = true;
						} else {
							// 已经计算过了
						}
					} else {
						//** 这个大题不是选考题
						let newCount = 0;
						for(let itemSon of item.children) {
							if(itemSon.question.chooseQuestion=="1"){
								//* 这个小题是选考题
								if(!ischooseQuestionLock){
									// 还没有计算过
									newCount += Number(itemSon.question.point);
									ischooseQuestionLock = true
								} else {
									// 已经计算过了
								}
							} else {
								//* 这个小题不是选考题
								newCount += Number(itemSon.question.point);
							}
						}
						thisSumPoints += newCount;
					}
				} else {
					// *** 没有小题
					if(item.question.chooseQuestion!="1" || !ischooseQuestionLock){
						// 选考题还没有计算过（只计算一次分）
						thisSumPoints += Number(item.question.point);
					}
					if(item.question.chooseQuestion=="1"){
						ischooseQuestionLock = true
					}
				}
			}
			if(thisSumPoints>this.totalPoints){
				console.error("已设分值大于满分");
			}
			this.sumPoints = thisSumPoints;
		},
		onSubmitAddNewQuestion(formName) {
			// 新增题目-提交
			// console.info(this.formAddNewQuestion.type); //type 1为选择题2为非选择题
			// console.info(this.formAddNewQuestion.num); //num 数量
			// console.info(this.formAddNewQuestion.star); //star 开始题号
			// console.info(this.formAddNewQuestion.point); //分值

			// 新增题目
			this.addNewQuestions(this.formAddNewQuestion.type, this.formAddNewQuestion.num, this.formAddNewQuestion.star, this.formAddNewQuestion.point);
			// 关闭弹窗，初始化弹窗data
			this.addNewQuestionVisible = false;
			this.formAddNewQuestion = {
				type: 1,
				num: "",
				star: "",
				point: ""
			}
		},
		addNewQuestions(type, num, star, point) {
			type = Number(type);
			num = Number(num);
			star = Number(star);
			point = Number(point);
			// 批量新增题目
			for(let i=0;i<Number(num);i++){
				console.info(i);
				this.questionsData.push({
					levels: [],
					points: [],
					children: [],
					levelsChoiceIds: [],
					pointsChoiceIds: [],
					pointsChoiceNames: "",
					question: {
						questionType: type,
						questionNum: star+i,
						point: point
					}
				});
			}
			this.sumPoints += num*point;
		},
		onResetForm() {
			// 暂存
			console.info("resetForm");
			this.ajaxQuestionTempSave(this.coursesOptionsChoiceId, () => {
				this.$alert("暂存成功！");
			});
		},
		onSubmitForm() {
			// 完成编辑
			console.info("完成编辑");
			this.ajaxSaveQuestionsData();
			return false;
		},
		onClickDialogCantEdit() {
			// 提示不能编辑
			this.$alert("已禁止修改，如需编辑请选择下方再次编辑按钮。");
		},
		onSubmitAgain() {
			// 再次编辑
			this.ajaxChangeQuestionsStatus();
		},
		upFileSuccess(fileName, host) {
			// 表格导入成功回调
			console.info(host+fileName);
			setTimeout(() => {
				this.$msgbox({
					title: '导入提示',
					message: '上传成功，正在写入导入数据，请稍候！',
					type: "info",
					customClass: "no_closed only_txt",
					showConfirmButton: false,
					closeOnClickModal: false,
					closeOnPressEscape: false
				});
				setTimeout(() => {
					this.ajaxUpFileExamQuestionImportData(fileName);
				}, 800)
			}, 300)
		},
		downloadTemplate() {
			// this.explainVisible=false

			// 下载双向细目表Excel导入模板 (郑强) #2017-03-17#
			this.$http.post("/api/servers/downloadQuestionExcelTemplate").then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data){
						data.windowOpen();
					} else {
						alert("下载失败");
					}
					this.explainVisible=false
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});

		},
		ajaxGetCoursesOptionsByExamId(isOnlyRefreshStatus) {
			// 根据考试ID查询双向细目表下拉数据 (郑强) #2017-03-20#
			this.$http.post("/api/servers/getEditExamAllCourses", {
				examId: this.examId
			}).then(function(data){
				data = data.body;
				console.info("获取考试的所有科目：");
				console.info(data);
				if(data.code==200){
					data = data.data;
					this.coursesOptions = data;
					if(isOnlyRefreshStatus){
						// 仅用来刷新各科目的状态
					} else {
						// 检查是否传了course_id
						if(this.$route.query.course_id){
							let coursesItem = this.coursesOptions.find((item) => item.id== this.$route.query.course_id);
							console.info("传了course_id 传了course_id 传了course_id");
							if(coursesItem){
								// yes
								this.coursesOptionsChoiceId = coursesItem.id;
								this.totalPoints = coursesItem.totalScore;
							} else {
								// 传了，但是没有找到这个科目id，默认选择第一个科目
								this.coursesOptionsChoiceId = data[0].id;
								this.totalPoints = data[0].totalScore;
							}
						} else {
							// 默认选择第一个科目
							this.coursesOptionsChoiceId = data[0].id;
							this.totalPoints = data[0].totalScore;
						}
					}
				} else {
					console.info(data);
				}
			}, function(error){
				console.info(error);
			});
		},
		ajaxGetQuestionStatusByCourseId(courseId) {
			// 查询一个考试科目详情 (陈显官) #2017-03-02#
			this.$http.post("/api/servers/ExamQueryApi_getCourse", {
				examCourseId: courseId
			}).then(function(data){
				console.info("查询一个考试科目详情 ExamQueryApi_getCourse back ++++++++++++++");
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					this.questionsDataStatus = data.state;
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		ajaxGetQuestionByCourseId(courseId) {
			this.questionsData = [];
			this.countSumPoints();
			console.info("ajaxGetQuestionBycourseId coming");
			console.info(courseId);
			// 获取双向细目列表，按考试试题顺序进行排序
			this.$http.post("/api/servers/getQuestionsByCourseId", {
				servers: true,
				courseId: courseId
			}).then(function(data){
				data = data.body;
				console.info("获取双向细目表数据：");
//					let thisSumPoints = 0;
				if(data.code==200|| data.code==204 ){
					data = data.data;
					if(data!=undefined && data!=""){
						// 组装数据
						this.makingQuestionsData(data);
						// 重新计算总分
						this.countSumPoints();
					} else {
						console.info("data返回为空");
					}
				} else {
					console.info(data);
				}
			}, function(error){
				console.info(error);
			});
		},
		makingQuestionsData(data) {
			for(let item of data){
				console.info(item.levels);

//						thisSumPoints += item.question.point;
				item.levelsChoiceIds = [];
				if(!item.levels){
					// levels为空
					item.levels = [];
				} else {
					for(let itemSon of item.levels){
						item.levelsChoiceIds.push(itemSon.levelId);
					}
				}

				item.pointsChoiceIds = [];
				item.pointsChoiceNames = this.getChoiceNames(item.points);
				if(!item.points){
					// points为空
					item.points = [];
				} else {
					for(let itemSon of item.points){
						item.pointsChoiceIds.push(itemSon.pointId);
					}
				}


				if(!item.children){
					item.children = [];
				} else if(item.children.length>0){
					for(let itemChildren of item.children) {
//								thisSumPoints += itemChildren.question.point;

						itemChildren.levelsChoiceIds = [];
						if(!itemChildren.levels){
							// levels为空
							itemChildren.levels = [];
						} else {
							for (let itemSon of itemChildren.levels) {
								itemChildren.levelsChoiceIds.push(itemSon.levelId);
							}
						}

						itemChildren.pointsChoiceIds = [];
						itemChildren.pointsChoiceNames = this.getChoiceNames(itemChildren.points);
						if(!item.points){
							// points为空
							itemChildren.points = [];
						} else {
							for (let itemSon of itemChildren.points) {
								itemChildren.pointsChoiceIds.push(itemSon.pointId);
							}
						}
					}
				}
			}
			console.info(data);
			this.questionsData = data;
		},
		ajaxGetLevelsOptionsByCourseId() {

			// 根据学科ID查询能力层次(向发钧) #2017-03-09#
			this.$http.post("/api/servers/PlatformLevelApi_listPlatformSubjectLevels", {
				subjectId: this.coursesOptionsSubjectId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info("获取能力层级数据池：");
					console.info(data);
					let newArray = [];
					for(let i=0; i<data.length; i++){
						let item = data[i];
						newArray.push({
							levelId: String(item.id),
							levelName: item.name
						});
					}
					this.levelsOptions = newArray;
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});


			// TODO -- 根据某次考试的科目id获取能力层级数据池
			/*this.$http.post("/api/servers/ryl3ZtOqce").then(function(data){
			 data = data.body;
			 console.info("获取能力层级数据池：");
			 console.info(data);
			 if(data.code==200){
			 this.levelsOptions = data;
			 } else {
			 console.info(data);
			 }
			 }, function(error){
			 console.info(error);
			 });*/
		},
		ajaxGetPointsOptionsByCourseId() {

			// 根据学科ID查询知识点(向发钧) #2017-03-09#
			this.$http.post("/api/servers/PlatformLevelApi_listPlatformSubjectPoints", {
				subjectId: this.coursesOptionsSubjectId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info("根据学科ID查询知识点：");
					console.info(data);
					this.pointsOptions = data;
					this.makingPoints(data, false);
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		makingPoints(data, isShow) {
			// 获取所有父级知识点id
			let pointsArray = [];
			for(let i=0; i<data.length; i++){
				let item = data[i];
				if(item.level==2){
					pointsArray.push(item);
				}
			}
			let backArray = [];
			for(let i=0; i<pointsArray.length; i++){
				let item = pointsArray[i];
				let pointsChildrenArray = [];
				// 根据父级id获取子级知识点
				for(let j=0; j<data.length; j++){
					let itemSon = data[j];
					if(itemSon.pid == item.id){
						pointsChildrenArray.push(itemSon);
						// itemSon.pname = item.name;
						// itemSon.plevel = item.level;
					}
				}
				item.children = pointsChildrenArray;
				item.show = isShow;
				backArray.push(item);
			}
			this.pointsOptionsArray = backArray;
		},
		ajaxChangeQuestionsStatus() {
			console.info("ajaxChangeQuestionsStatus");
			// 开始编辑试题数据 (郑强) #2017-05-04#
			this.$http.post("/api/servers/ExamQuestionApi_startEdit", {
				courseId: this.coursesOptionsChoiceId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					// do something
					this.questionsDataStatus = false;
				} else {
					console.warn(data);
				}
				// 刷新科目信息
				this.ajaxGetCoursesOptionsByExamId(1);
			}, function(error){
				console.error(error);
			});
//			this.$router.go(0);
		},
		ajaxSaveQuestionsData() {
			if(this.ajaxLock) return false;
			this.ajaxLock = true;
			console.info(this.questionsData);
			// 保存双向细目表列表数据,保存前会根据课程ID清除原有数据
			this.$http.post("/api/servers/saveQuestionsByCourseId", {
				body: {
					"questionDetails": this.questionsData
				},
				courseId: this.coursesOptionsChoiceId
			}).then(function(data){
				data = data.body;
				this.ajaxLock = false;
				console.info("保存双向细目表返回：");
				console.info(data);
				if(data.code==200){
					data = data.data;
					if(data==true){
						this.$alert('保存成功', {
							callback: () => {
								this.ajaxValidAllScorePaper();
							}
						})
					} else {
						this.$alert(data.message);
					}
				} else {
					console.warn(data);
					this.$alert(data.message);
				}
				// 刷新科目信息
				this.ajaxGetCoursesOptionsByExamId(1);
			}, function(error){
				this.$alert("保存失败，请稍后再试");
			});
		},
		ajaxQuestionTempSave(coursesChoiceId, callback) {
			// 暂时保存双向细目表列表数据,保存前会根据课程ID清除原有数据 (郑强) #2017-04-17#
			this.$http.post("/api/servers/ExamQuestionApi_tempSave", {
				body: {
					"questionDetails": this.questionsData
				},
				courseId: coursesChoiceId
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
		ajaxValidAllScorePaper() {
			this.questionsDataStatus = true;
			this.ajaxGetCoursesOptionsByExamId(1);
			// 根据考试ID查询双向细目表是否已经全部编辑完成 (郑强) #2017-04-12#
			this.$http.post("/api/servers/validAllQuestionPaperCompleteEdit", {
				examId: this.examId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data){
						// 教研员（学科组长）编辑完最后一科试卷时，应该不能跳转至准考证导入页面
						if(this.userType=="teachingStaff" || this.userType=="schoolCourse"){
							this.$alert('恭喜，所有科目都已完成编辑！', {
								callback: () => {
									this.$router.go(0);
								}
							})
						} else {
							this.$alert('恭喜，所有科目都已完成编辑！', {
								callback: () => {
									// 强制刷新一次
									window.location.href = '/home/editexam/'+this.examId+'/importTicket';
//									this.$router.push('importTicket');
								}
							})
						}
					} else {
						// this.$alert('还有未完成的科目，请继续编辑吧！')
						this.$router.push({path: 'scorePaper', query: { course_id: this.coursesOptionsChoiceId }});
						// 获取双向细目表
						this.ajaxGetQuestionByCourseId(this.coursesOptionsChoiceId);
					}
				} else {
					console.warn("无法验证科目是否都完成");
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		ajaxUpFileExamQuestionImportData(fileName) {
			if(this.ajaxLock) return false;
			this.ajaxLock = true;
			// 上传双向细目表Excel数据 (郑强) #2017-03-20#
			this.$http.post("/api/servers/ExamQuestionApi_importData", {
				body: {
					courseId: this.coursesOptionsChoiceId,
					sourceKeyInOss: fileName
				}
			}).then(function(data){
				data = data.body;
				this.ajaxLock = false;
				console.info(data);
				this.$msgbox.close();
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data==true){
						this.$alert('导入成功', {
							callback: () => {
								this.ajaxValidAllScorePaper();
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
				this.$msgbox.close();
				this.$alert("导入失败，请稍候重试");
			});

		},
		ajaxGetQuerySearch(key, callback) {
			//搜索知识点
			// 根据学科ID，知识点搜索内容查询知识点数据 (郑强) #2017-04-11#
			this.$http.post("/api/servers/searchPlatformPoints", {
				subjectId: this.coursesOptionsSubjectId,
				searchWord: key
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.error("搜索知识点 back");
					console.json(data);

				} else {
					console.warn(data);
				}

				data = [];
				callback(data);
			}, function(error){
				console.error(error);
			});

		}
	}
}

</script>

<style>
.question_not_edit {
	position: absolute;
	width: 100%;
	height: 100%;
	/*background: none;*/
	background: #fff;
	opacity: 0.2;
	top: 0;
	left: 0;
	z-index: 2000;
}
</style>