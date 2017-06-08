<template>

	<div>
		<div class="box">
			<div class="title_tab">
				<router-link to="settingAnalysis">分数线设置</router-link><i class="_step">></i>
				<a href="#" class="current cursor_default">计算规则设置</a><i class="_step" v-if="examType!=0">></i>
				<a href="#" class="gray_only cursor_default" v-if="examType!=0">试卷分卷设置</a>
			</div>
			<!--<div class="title_steps">二、计算规则设置<span class="info">（请根据区域分析规则设置，设置后成绩将重新计算，请谨慎设置！）</span></div>-->
			<div class="title_notice">温馨提示：1、综合学科是指文综、理综学科，分支学科是指综合学科下的政、史、地、物、化、生。&nbsp;&nbsp;&nbsp;&nbsp;2、综合学科属于单科，适用于单科0分的计算规则。&nbsp;&nbsp;&nbsp;&nbsp;<font color="#e95b5b">（请根据区域分析规则设置，设置后成绩将重新计算，请谨慎设置！）</font></div>
			<div class="_form">
				<div class="form_list">
					<el-form label-width="200px">
						<el-form-item label="0分计算规则：">
							<el-select v-model="analysisRuleA" size="larger" placeholder="--请选择--" >
								<el-option v-for="item in analysisRuleAOptions" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="小数点取舍规则：">
							<el-select v-model="analysisRuleB" size="larger" placeholder="--请选择--" >
								<el-option v-for="item in analysisRuleBOptions" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="综合学科计算规则：" v-if="examHasSplit">
							<el-select v-model="analysisRuleC" size="larger" placeholder="--请选择--" >
								<el-option v-for="item in analysisRuleCOptions" :label="item.name" :value="item.id"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
				<div class="exam_create_footer" v-if="examType==0">
					<el-button class="el-button-longer" type="primary" size="large" @click="onSubmit('last')">保 存</el-button>
					<el-button class="el-button-longer" type="primary" size="large" @click="onStartCompute">开始计算</el-button>
				</div>
				<div class="exam_create_footer" v-else>
					<el-button class="el-button-longer" type="primary" size="large" @click="onSubmit">下一步</el-button>
				</div>
			</div>
		</div>
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
			examType:　backExamInfo.examInfo.type,
			examHasSplit:　backExamInfo.examInfo.hasSplit,

			// data
			ruleData: {
			},

			// 计算规则设置
			analysisRuleA: "",
			analysisRuleAOptions: [],
			analysisRuleB: "",
			analysisRuleBOptions: [],
			analysisRuleC: "",
			analysisRuleCOptions: []
		};
	},
	watch: {
	},
	created() {
		vm.currentRouter = "/examlist";
	},
	mounted() {

		// 0分计算规则
		this.ajaxGetSettingRuleTypeData(1);

		// 小数点取舍规则
		this.ajaxGetSettingRuleTypeData(2);

		// 分科考试-综合学科计算规则
		if(this.examHasSplit){
			this.ajaxGetSettingRuleTypeData(3);
		}

		// 查询考试的计算规则设置
		this.ajaxGetSettingRuleDataByExamId();

	},
	methods: {
		onSubmit(step) {
			let newArray = [{
				examId: this.examId,
				ruleType: 1,
				ruleValue: this.analysisRuleA
			}, {
				examId: this.examId,
				ruleType: 2,
				ruleValue: this.analysisRuleB
			}];
			if(this.examHasSplit){
				newArray.push({
					examId: this.examId,
					ruleType: 3,
					ruleValue: this.analysisRuleC
				});
			}
			console.info(newArray);
			var _this = this;
			if(step==="last"){
				this.ajaxSaveSettingRule(newArray, function(){
//						_this.ajaxFinishAnalysisSettingChangeExamType();
				});
			} else {
				this.ajaxSaveSettingRule(newArray, () => {
					this.$router.push({path: 'settingPaper'});
				});
			}
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
		makingAnalysisRule(data) {
			// 写入计算规则设置
			for(var i=0; i<data.length; i++){
				var item = data[i];
				if(item.ruleType == 1){
					this.analysisRuleA = item.ruleValue;
				} else if(item.ruleType == 2){
					this.analysisRuleB = item.ruleValue;
				} else if(item.ruleType == 3){
					this.analysisRuleC = item.ruleValue;
				}
			}
		},
		ajaxGetSettingRuleTypeData(type){
			// 分析规则设置类型下拉选择 (郑强) type:[1: 2: 3:] #2017-03-14#
			this.$http.post("/api/servers/getSettingRuleTypeData", {
				type: type
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(type==1){
						this.analysisRuleAOptions = data;
					} else if(type==2){
						this.analysisRuleBOptions = data;
					} else if(type==3){
						this.analysisRuleCOptions = data;
					}
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});
		},
		ajaxGetSettingRuleDataByExamId() {
			// 根据考试ID查询考试的计算规则设置 (郑强) #2017-03-14#
			this.$http.post("/api/servers/getSettingRuleDataByExamId", {
				examId: this.examId
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					this.makingAnalysisRule(data);
					// do something
				} else {
					console.warn(data);
				}
			}, function(error){
				console.error(error);
			});

		},
		ajaxSaveSettingRule(saveArray, callback) {
			// 保存考试的计算规则 (郑强) #2017-03-14#
			this.$http.post("/api/servers/saveSettingRule", {
				body: {
					calculateRules: saveArray,
					examId: this.examId
				}
			}).then(function(data){
				data = data.body;
				if(data.code==200){
					data = data.data;
					console.info(data);
					if(data==true){
						this.$alert('保存成功', {
							callback: () => {
								callback();
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
				this.$alert("保存失败，请稍候再试！");
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
</script>