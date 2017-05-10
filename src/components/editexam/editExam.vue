<template>

	<div class="box examInfo">
		<h6>创建考试</h6>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			<el-form-item label="考试名称 :" prop="name">
				<el-input v-model.trim="ruleForm.name" placeholder="在此输入本次考试的名称" :disabled="isEdit"></el-input>
			</el-form-item>
			<el-form-item label="考试类型 :" required v-if="examInfo.level!=0">
				<el-radio-group v-model="examInfo.type">
					<el-radio label="0" disabled>普通考试</el-radio>
					<el-radio label="1" disabled>网阅考试</el-radio>
				</el-radio-group>
				<el-tooltip content="网阅考试是指导入阅卷系统生成的小分成绩，并能统计每道题得分及知识点" placement="right" effect="light">
					<i class="iconfont">&#xe624;</i>
				</el-tooltip>
			</el-form-item>
			<el-form-item label="开考时间 :" required prop="startTime">
				<el-date-picker type="date" :editable="false" placeholder="选择考试时间" :disabled="isEdit"
								v-model="ruleForm.startTime" @change="changeTime('start')">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="成绩发布时间 :" prop="releaseTime" required class="releaseTime">
				<el-date-picker type="date" :editable="false" placeholder="选择成绩预计发布时间" v-model="ruleForm.releaseTime"
								@change="changeTime('release')" :disabled="isEdit">
				</el-date-picker>
				<el-select v-model="time.hours" :disabled="isEdit">
					<el-option v-for="item in hours" :value="item" :label="item"></el-option>
				</el-select>
				<el-select v-model="time.minutes" :disabled="isEdit">
					<el-option v-for="item in minutes" :value="item" :label="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="年级 :" required>
				<el-input v-model="examInfo.gradeName" disabled></el-input>
			</el-form-item>
			<el-form-item label="文理分科 :" v-show="isHighSchool" required>
				<el-radio-group v-model="examInfo.hasSplit">
					<el-radio label="true" disabled>是</el-radio>
					<el-radio label="false" disabled>否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item :label="'参考'+examNameTag+' :'" required>
				<el-input v-model="schoolStr" @focus="choiceSchools"></el-input>
			</el-form-item>

			<el-form-item label="科目 :" required>
				<table class="mytable">
					<thead>
					<tr>
						<th>选择</th>
						<th>科目</th>
						<th>满分</th>
						<th v-show="isBranch && examInfo.type=='1'">是否分卷</th>
						<th v-show="examInfo.type=='1'">绑定学科负责人</th>
					</tr>
					</thead>
					<tbody>
					<tr v-for="(items,index) in courses">
						<td>
							<el-checkbox checked disabled></el-checkbox>
						</td>
						<td>{{ items.courseName }}</td>
						<td>
							<el-input v-model="items.totalScore" disabled></el-input>
						</td>
						<td v-show="isBranch && examInfo.type=='1'">
							<el-switch v-model="items.hasSplit" on-text="" off-text="" disabled></el-switch>
						</td>
						<td v-show="examInfo.type=='1'">
							<div v-show="!items.hasSplit">
								<el-select v-model="items.researcherId" @change="researcher('researcherId',index)"
										   :disabled="isEdit">
									<el-option v-for="item in items.researcher" :value="item.accountId"
											   :label="item.accountName">
									</el-option>
								</el-select>
							</div>
							<div v-show="items.hasSplit" class="splits">
								文科 :
								<el-select v-model="items.artResearcherId" @change="researcher('artResearcherId',index)"
										   :disabled="isEdit">
									<el-option v-for="item in items.artResearcher" :value="item.accountId"
											   :label="item.accountName">
									</el-option>
								</el-select>
								理科 :
								<el-select v-model="items.scienceResearcherId"
										   @change="researcher('scienceResearcherId',index)" :disabled="isEdit">
									<el-option v-for="item in items.scienceResearcher" :value="item.accountId"
											   :label="item.accountName">
									</el-option>
								</el-select>
							</div>
						</td>
					</tr>
					</tbody>
				</table>
				<ul class="comprehensive" v-show="isBranch">
					<li>
						<span>文科综合</span>
						<el-checkbox v-for="item in initParam.artCourses" checked disabled>{{item}}</el-checkbox>
					</li>
					<li>
						<span>理科综合</span>
						<el-checkbox v-for="item in initParam.scienceCourses" checked disabled>{{item}}</el-checkbox>
					</li>
				</ul>
			</el-form-item>
			<el-form-item>
				<el-button size="large" @click="deleteTip" :disabled="isEdit">删除</el-button>
				<el-button type="primary" @click="submitForm" size="large" class="btn-sure" :disabled="isEdit">保存
				</el-button>
			</el-form-item>
		</el-form>

		<el-dialog :title="'选择'+examNameTag" v-model="dialogVisible">
			<section class="schoolsBox">
				<div class="s-top">
					<label class="cgray">{{ schoolStr }}</label>
				</div>
				<div v-if="examInfo.level==2" class="shoolList hiddens">
					<el-checkbox v-for="item in schools" checked disabled>{{item.className}}</el-checkbox>
				</div>
				<div v-else class="shoolList hiddens">
					<el-checkbox v-for="item in schools" checked disabled>{{item.schoolName}}</el-checkbox>
				</div>
			</section>
			<span slot="footer" class="dialog-footer">
					<el-button @click="closeDialog" size="large">取 消</el-button>
					<el-button type="primary" @click="closeDialog" size="large" class="btn-sure">确 定</el-button>
				  </span>
		</el-dialog>
	</div>

</template>

<script>

    export default{
        data() {
            return {
                leftbar: {},
                examInfo: {
                    gradeName: "",
                    name: "",
                    phase: 0,
                    releaseTime: '',
                    startTime: '',
                    hasSplit: "false",
                    phase: 4,
                    semesterId: 0,
                    level: 0,
                    remark: "",
                    type: "1"
                },
                ruleForm: {
                    name:'',
                    startTime: '',
                    releaseTime: '',
                    classList:[]
                },
                rules: {
                    name: [
                        { required: true, message: '请输入考试名称', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    startTime: [
                        { type: 'date', required: true, message: '请选择考试日期'}
                    ],
                    releaseTime: [
                        { type: 'date', required: true, message: '请选择成绩发布日期'}
                    ],
                    subjectArr: [
                        { required: true,message: '请选择绑定的老师'}
                    ]
                },
                time:{
                    hours: '00',
                    minutes: '00'
                },
                hours:['00','01','02','03','04','05','06','07','08', '09','10',
                    '11','12','13','14','15','16','17','18','19','20','21','22','23'],
                minutes:['00','01','02','03','04','05','06','07','08', '09','10', '11','12','13','14','15','16','17','18','19','20',
                    '21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40',
                    '41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
                isHighSchool: false,
                courses: [],
                schoolStr: '',
                schools: [],
                initParam: {
                    artCourses:[],
                    scienceCourses:[]
                },
                isBranch: 0,
                dialogVisible: false,
                subjectIds: [],
                examNameTag: '学校',
                isEdit: true,
                examId:this.$route.params.id
            };
        },
	    created() {
		    vm.currentRouter = "/examlist";
	    },
        mounted() {
            this.examInfo.level = backExamInfo.examInfo.level;
            if(this.examInfo.level == 2){
                this.examNameTag = '班级';
            }
            this.getExamDetail();
            switch(backUser.level){
                case 'city':
                    if(this.examInfo.level == 0 && backUser.type=='admin'){
                        this.isEdit = false;
                    }
                    break;
                case 'county':
                    if(this.examInfo.level == 1 && backUser.type=='admin'){
                        this.isEdit = false;
                    }
                    break;
                default:
                    if(this.examInfo.level == 2 && backUser.type=='admin'){
                        this.isEdit = false;
                    }
            }
        },
        methods: {
            getExamDetail() {
                // 考试详情查询 (陈显官) #2017-03-13#
                this.$http.post("/api/servers/getExamDetail", {
                    examId: this.examId
                }).then(function(data){
                	data = data.body;
                    if(data.code==200){
                        data = data.data;
                        this.initParam = data;
                        this.ruleForm.name = data.examInfo.name;
                        this.examInfo.type = data.examInfo.type.toString();
                        this.examInfo.level = data.examInfo.level;
                        this.ruleForm.startTime = new Date(data.examInfo.startTime);
                        this.ruleForm.releaseTime = new Date(data.examInfo.releaseTime);

                        this.time.hours = this.hours[this.ruleForm.releaseTime.getHours()];
                        this.time.minutes = this.minutes[this.ruleForm.releaseTime.getMinutes()];
                        this.examInfo.gradeName = data.examInfo.gradeName;
                        if(data.examInfo.phase==4){
                            this.isHighSchool = true;
                        }
                        if(data.examInfo.hasSplit) {
                            this.examInfo.hasSplit = data.examInfo.hasSplit.toString();
                            this.isBranch = true;
                        }
                        if(this.examInfo.level == 2){
                            this.schools = data.classes;
                            this.schoolStr = '共选择了'+this.schools.length+'个班级';
                        }else{
                            this.schools = data.schools;
                            this.schoolStr = '共选择了'+this.schools.length+'个学校';
                        }
                        this.queryInstructor(data.courses);
                    } else {
                        console.info("返回错误");
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });
            },
            choiceSchools() {
                this.dialogVisible = true;
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            submitForm() {
                var course = [];
                var paramCourse = {};
                var paramCourse2 = {};
                var examTypeMark = this.examInfo.type == '1';
                this.courses.map(function(val){
                    if(val.hasSplit){
                        paramCourse = {
                            examCourseId: val.artId
                        };
                        paramCourse2 = {
                            examCourseId: val.scienceId
                        };
                        if(examTypeMark){
                            paramCourse.researcherId = val.artResearcherId;
                            paramCourse.researcherName = val.artResearcherName;
                            paramCourse2.researcherId = val.scienceResearcherId;
                            paramCourse2.researcherName = val.scienceResearcherName;
                        }
                        course.push(paramCourse2);
                    }else{
                        paramCourse = {
                            examCourseId: val.id
                        };
                        if(examTypeMark){
                            paramCourse.researcherId = val.researcherId;
                            paramCourse.researcherName = val.researcherName;
                        }
                    }
                    course.push(paramCourse);
                });
                var param = {
                    remark: "",
                    courses: course,
                    id: this.initParam.examInfo.id,
                    name: this.ruleForm.name,
                    releaseTime: new Date(this.ruleForm.releaseTime.toDateString()).getTime()+(this.time.hours*3600+this.time.minutes*60)*1000,
                    startTime: this.ruleForm.startTime.getTime()
                };
                if(!param.name){
                	return this.$message({
					  showClose: true,
					  message: '考试名字不能为空',
					  type: 'error'
					});
                }
                // 修改考试 (陈显官) #2017-03-30#
                this.$http.post("/api/servers/modifyExam", {
                    body: param
                }).then(function(data){
                    if(data.status==200 && data.body.code == 200){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error('保存失败');
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });
            },
            deleteTip() {
                this.$confirm('是否删除本次考试?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteExam();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            deleteExam() {
                // 删除考试 (陈显官) #2017-03-15#
                this.$http.post("/api/servers/deleteExam", {
                    examId: this.examId
                }).then(function(data){
                    if(data.status==200 && data.body.code==200){
                        location.href = "/home/examlist";
                    } else {
                        this.$message({
                            type: 'info',
                            message: '返回错误'
                        });
                    }
                }, function(error){
                    this.$message({
                        type: 'info',
                        message: '返回失败:'+error
                    });
                });
            },
            changeTime(type) {
                if(this.ruleForm.startTime){
                    if(this.ruleForm.startTime > this.ruleForm.releaseTime) {
                        this.ruleForm.releaseTime = '';
                    }
                    if(type == 'release') return;
                    var param= {
                        time: this.ruleForm.startTime.getTime(),
                        count: 1,
                        tenantId: backUser.info.tenantid
                    };
                    // 通过一个时间来查询学期(向发钧) #2017-03-09#
                    this.$http.post("/api/servers/timeFindTerm",param ).then(function(data){
                        data = data.body;
                        this.terms = [];
                        if(data.code==200){
                            this.terms = data.data[0];
                            // this.queryGrade();
                        } else {
                            this.$message.error("学期查询错误");
                        }
                    }, function(error){
                        console.info("返回失败："+error);
                    });
                    this.ruleForm.classArr = '';
                }
            },
            queryInstructor(subData) {
                var $this = this;
                subData.map(function(val){
                    $this.subjectIds.push(val.courseId);
                });
                var param = {
                    orgId:backUser.orgId,
                    orgLevel: backUser.level,
                    subjectIds: this.subjectIds
                };
                // 根据学科ID列表查询教研员列表(胡君) #2017-03-09#
                this.$http.post("/api/servers/listSubjectLeader", {body:param}).then(function(data){
                    data = data.body;
                    if(data.code == 200){
                        data = data.data;
                        subData.map(function(vals,index){
                            subData[index].researcherId = subData[index].researcherId*1;
                            subData[index].artResearcherId = subData[index].artResearcherId*1;
                            subData[index].scienceResearcherId = subData[index].scienceResearcherId*1;
                            subData[index].researcher = [];
                            subData[index].artResearcher = [];
                            subData[index].scienceResearcher = [];
                            data.map(function(val){
                                if(val.courseId == vals.courseId){
                                    val.selected = subData[index].researcherId == val.accountId?true:false;
                                    subData[index].researcher.push(val);
                                    subData[index].artResearcher.push(val);
                                    subData[index].scienceResearcher.push(val);
                               }
                            });
                        });
                        this.courses = subData;
                    } else {
                        this.$message.error('教研员查询失败');
                    }
                }, function(error){
                    console.info("返回失败"+error);
                });
            },
            researcher(name,index) {
                var subData = this.courses[index];
                var id = subData[name];
                var type = name.substring(0,name.length-2);
                for(var i=0,len=subData[type].length;i<len;i++){
                    if(id == subData[type][i].accountId){
                        subData[type+"Name"] = subData[type][i].accountName;
                        break;
                    }
                }
            }
        }
    }

</script>
<style scoped>
    .examInfo .el-dialog__body .schoolsBox{
        width:100%;
    }
    .examInfo .el-dialog__body .s-top .cgray{
        margin-left:80%;
    }

</style>
