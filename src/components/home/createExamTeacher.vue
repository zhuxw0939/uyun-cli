<template>
    <div class="_center">
        <tabExam :tab-data="tabData"></tabExam>
        <div class="box examInfo">
            <h6>创建考试</h6>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="考试名称 :" prop="name">
                    <el-input v-model.trim="ruleForm.name" placeholder="在此输入本次考试的名称"></el-input>
                </el-form-item>
                <el-form-item label="考试时间 :" required prop="startDate">
                    <el-date-picker type="date" :editable="false" placeholder="选择考试时间" v-model="ruleForm.startDate" @change="changeTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="选择班级 :" prop="classArr">
                    <el-input v-model="ruleForm.classArr" placeholder="选择考试班级"  @focus="choiceSchools"></el-input>
                </el-form-item>
                <el-form-item label="科目 :" required>
                    <table class="mytable">
                        <thead>
                        <tr>
                            <th>选择</th>
                            <th>科目</th>
                            <th>满分</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="items in subjectData">
                            <td>
                                <el-checkbox v-model="items.ischeck" :checked="items.ischeck"></el-checkbox>
                            </td>
                            <td>{{items.name}}</td>
                            <td>
                                <el-input v-model.number="items.totalScore" placeholder="输入科目总分" type="number" min="1"></el-input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <el-form-item>
                        <el-button @click="resetForm('ruleForm')" size="large">取消创建</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')" size="large" class="btn-sure" :disabled="createExamBtn">确定创建</el-button>
                    </el-form-item>
            </el-form>
            <el-dialog title="选择班级" v-model="dialogVisible">
                <section class="schoolsBox fl classBox">
                    <div class="s-top">
                        <el-checkbox v-model="isAll" @change="isAllClass(isAll)">全选</el-checkbox>
                        <label class="cgray">共选择 {{ schools.length }} 个班级</label>
                    </div>
                    <div class="shoolList hiddens">
                        <el-checkbox v-for="item in classList" v-model="item.checked" @change="changeClassCheck(item)">{{item.classname}}</el-checkbox>
                    </div>
                </section>
                <span slot="footer" class="dialog-footer">
					<el-button @click="closeDialog" size="large">取 消</el-button>
					<el-button type="primary" @click="examSchool" size="large" class="btn-sure">确 定</el-button>
				  </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import CreateCss from '../../static/css/exam_create.css'
    import TabExam from '../models/tab_exam'
    export default{
        components: { TabExam },
        data() {
            return {
                leftbar: {},
                tabData: {
                    show:0,
                    hide: 1
                },
                examInfo: {
                    gradeId: 0,
                    gradeName: "",
                    name: "",
                    phase: 0,
                    releaseTime: 0,
                    startTime: 0,
                    semesterId: 0,
                    hasSplit: false,
                    level: 3,
                    remark: "",
                    type: 0
                },
                schools: [],
                ruleForm: {
                    name:'',
                    startDate: '',
                    classArr:  '',
                    classList:[]
                },
                dialogVisible: false,
                classList: [],
                isAll: false,
                rules: {
                    name: [
                        { required: true, message: '请输入考试名称', trigger: 'blur' },
                        { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }
                    ],
                    startDate: [
                        { type: 'date', required: true, message: '请选择考试日期' }
                    ],
                    classArr: [
                        { required: true,message: '请选择考试班级/学校',trigger: 'change'}
                    ],
                    subjectArr: [
                        { required: true,message: '请选择绑定的老师'}
                    ]
                },
                subjectData: [],
                terms: {},
                createExamBtn: false
        };
    },
    mounted() {
        this.querySubject();
    },
    methods: {
        querySubject() {

            // 根据老师ID查询当前学期老师所教科目(向发钧) #2017-03-14#
            this.$http.post("/api/servers/listTeacherSubject", {
                teacherId:  backUser.info.id,
                tenantId: backUser.info.tenantid
            }).then(function(data){
            	data = data.body;
                if(data.code==200){
					data = data.data;
					data.map(function(val){
						val.ischeck = false;
						val.totalScore = '';
					});
					this.subjectData = data;
                } else {
					this.subjectData = [];
                    this.$message({
					  message: data.message,
					  type: 'warning'
					});
                }
            }, function(error){
                console.info("返回失败："+error);
            });
        },
        choiceSchools() {
            this.dialogVisible = true;
            this.isAllClass(this.isAll);
        },
        changeTime() {
            if(this.ruleForm.startDate) {
                // 通过一个时间来查询学期(向发钧) #2017-03-09#
                this.$http.post("/api/servers/timeFindTerm", {
                    time: this.ruleForm.startDate.getTime(),
                    count: 1,
                    tenantId: backUser.info.tenantid
                }).then(function (data) {
                	data = data.body;
                    if (data.code == 200) {
                        data = data.data;
                        this.terms = data[0];
                        this.switchClass();
                    } else {
                    	this.terms = {};
                    	this.classList = [];
                        this.$message({
						  message: data.message,
						  type: 'warning'
						});
                    }
                }, function (error) {
                    console.info("返回失败：" + error);
                });
                this.ruleForm.classArr = '';
            }
        },
        examSchool() {
            var len = this.schools.length;
            if(len > 0){
                this.ruleForm.classArr = '共选择'+len+'个班级';
            }else{
                this.ruleForm.classArr = '';
            }
            this.closeDialog();
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        switchClass() {
            // 查询某个老师某个学期所教班级(胡君) #2017-03-15#
            this.$http.post("/api/servers/teacherFindClass", {
                teacherId: backUser.info.id,
                termId: this.terms.id
            }).then(function(data){
            	data = data.body;
                if(data.code==200){
                    data = data.data;
                    data.map(function(val){
                        val.checked =false;
                    });
                    this.classList = data;
                    if(data[0] && data[0].gradeid){
                        this.findCityGradeId(data[0].gradeid);
                    }
                    this.isAllClass(false);
                } else {
                    this.$message({
					  message: data.message,
					  type: 'warning'
					});
                }
            }, function(error){
                console.info("返回失败："+error);
            });
        },
        isAllClass(mark){
            this.classList.map(function(val){
                val.checked = mark;
            });
            this.totalClass();
        },
        changeClassCheck() {
            this.totalClass();
        },
        totalClass() {
            this.schools = this.classList.filter(function(val){
                return val.checked;
            });
            this.isAll = (this.schools.length == this.classList.length);
        },
        findCityGradeId(id) {
            // 根据校级年级ID查询市级年级(向发钧) #2017-03-17#
            this.$http.post("/api/servers/findCityGradeId", {
                schoolGradeId: id
            }).then(function(data){
            	data = data.body;
                if(data.code==200){
                    data = data.data;
                    if(data){
                        this.examInfo.gradeId = data.id;
                        this.examInfo.gradeName = data.name;
                        this.examInfo.phase = data.phase;
                    }
                } else {
                	this.examInfo.gradeId = '';
                	this.examInfo.gradeName = '';
                	this.examInfo.phase = '';
                    this.$message({
					  message: data.message,
					  type: 'warning'
					});
                }
            }, function(error){
                console.error(error);
            });
        },
        submitForm(formName) {
            var classes = [];
            var course = [];
            var $this = this;
            if(!this.createExamBtn){
                this.createExamBtn = true;
            }
            setTimeout(function(){
                $this.createExamBtn = false;
            },6000);
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var subjectData = this.subjectData;
                    for(let i=0,len=subjectData.length;i<len;i++){
                        if(subjectData[i].ischeck){
                            if(subjectData[i].totalScore < 1  || subjectData[i].totalScore > 150) {
                                this.$msgbox("请设置"+subjectData[i].name+"的分数在1-150之间");
                                valid = false;
                                return;
                            }
                            course.push({
                                artCategory: 0,
                                courseId: subjectData[i].subjectId,
                                courseName: subjectData[i].name,
                                totalScore: subjectData[i].totalScore
                            });
                        }
                    }
                    if(course.length == 0){
                        this.$msgbox("请选择科目");
                        return;
                    }
                    this.examInfo.name = this.ruleForm.name;
                    this.examInfo.releaseTime = this.examInfo.startTime = this.ruleForm.startDate.getTime();
                    this.examInfo.semesterId = this.terms.id;
                    this.schools.map(function(val,index){
                        classes[index] = {
                            artCategory : 0,
                            classId : val.id,		//要改成市级年级ID
                            className : val.classname,
                            studentCount : val.studentnum
                        };
                    });
                    // 创建班级考试
                    this.$http.post("/api/servers/createExam", {
                        body: {
                            examInfo: this.examInfo,
                            courses: course,
                            classes: classes
                        }
                    }).then(function(data){
                        data = data.body;
                        if(data.code==200 && data.data){
                        	location.href = '/home/editexam/'+data.data+'/importScore';
                        } else {
                            this.$msgbox("创建失败");
                        }
                    }, function(error){
                        console.info("返回失败"+error);
                    });
                } else {
                    log('error submit!!');
                }
            });
        },
        resetForm(formName) {
             this.$router.push({path: '/'});
        }
    }
   }
</script>

<style scoped>

</style>
