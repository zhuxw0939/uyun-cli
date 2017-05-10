<template>

	<div class="_center">
		<tabExam :tab-data="tabData"></tabExam>
		<div class="box examInfo">
			<h6>创建考试</h6>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="考试名称 :" prop="name">
					<el-input v-model.trim="ruleForm.name" placeholder="在此输入本次考试的名称"></el-input>
				</el-form-item>
				<el-form-item label="考试类型 :" prop="examType" v-if="examInfo.level!=0">
					<el-radio-group v-model="ruleForm.examType">
						<el-radio label="0">普通考试</el-radio>
						<el-radio label="1">网阅考试</el-radio>
					</el-radio-group>
					<el-tooltip content="网阅考试是指导入阅卷系统生成的小分成绩，并能统计每道题得分及知识点" placement="right" effect="light">
						<i class="iconfont">&#xe624;</i>
					</el-tooltip>
				</el-form-item>
				<el-form-item label="开考时间 :"  prop="startDate">
					<el-date-picker type="date" :editable="false" placeholder="选择考试时间" v-model="ruleForm.startDate" @change="changeTime('start')">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="成绩发布时间 :"  prop="endDate" class="releaseTime">
					<el-date-picker type="date" :editable="false" placeholder="选择成绩预计发布时间" v-model="ruleForm.endDate" @change="changeTime('release')">
					</el-date-picker>
					<el-select v-model="time.hour">
						<el-option v-for="item in hours" :value="item" :label="item"></el-option>
					</el-select>
					<el-select v-model="time.minutes">
						<el-option v-for="item in minutes" :value="item" :label="item"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="年级 :" required>
					<el-select v-model="examInfo.gradeId" @change="choiceParse">
						<el-option v-for="item in ruleForm.classList" :value="item.id" :label="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="文理分科 :" prop="branch" v-show="isHighSchool">
					<el-radio-group v-model="ruleForm.branch" @change="branchSubject">
						<el-radio label="是"></el-radio>
						<el-radio label="否"></el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item :label="'参考'+examNameTag+' :'" prop="classArr">
					<el-input v-model="ruleForm.classArr" :placeholder="'选择考试'+examNameTag"  @focus="choiceSchools"></el-input>
				</el-form-item>

				<el-form-item label="科目 :" required>
					<table class="mytable">
						<thead>
						<tr>
							<th>选择</th>
							<th>科目</th>
							<th>满分</th>
							<th v-show="isBranch && ruleForm.examType==='1'">是否分卷</th>
							<th v-show="ruleForm.examType=='1'">绑定学科负责人</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(items,index) in subjectData">
							<td>
								<el-checkbox v-model="items.ischeck" :checked="items.ischeck"></el-checkbox>
							</td>
							<td>{{ items.name }}</td>
							<td>
								<el-input v-model.number="items.totalScore" placeholder="请输入科目总分" type="number"></el-input>
							</td>
							<td v-show="isBranch && ruleForm.examType==='1'">
								<el-switch v-model="items.hasSplit" on-text="" off-text=""></el-switch>
							</td>
							<td v-show="ruleForm.examType=='1'">
								<div v-show="!items.hasSplit">
									<el-select placeholder="请选择" v-model="items.researcherId" @change="researcher('researcherId',index)">
										<el-option v-for="item in items.researcher" :value="item.accountId" :label="item.accountName">
											{{item.accountName}}
										</el-option>
									</el-select>
								</div>
								<div v-show="items.hasSplit" class="splits">
									文科 :
									<el-select placeholder="请选择" v-model="items.artResearcherId" @change="researcher('artResearcherId',index)">
										<el-option v-for="item in items.artResearcher" :value="item.accountId" :label="item.accountName">
											{{item.accountName}}
										</el-option>
									</el-select>
									理科 :
									<el-select placeholder="请选择" v-model="items.scienceResearcherId" @change="researcher('scienceResearcherId',index)">
										<el-option v-for="item in items.scienceResearcher" :value="item.accountId" :label="item.accountName">
											{{item.accountName}}
										</el-option>
									</el-select>
								</div>
							</td>
						</tr>
						</tbody>
					</table>
					<ul class="comprehensive" v-show="isBranch">
						<li>
							<div class="hiddens">
								<div class="subjectTag">文科综合</div>
								<div class="subjectCombo">
									<span v-for="item in subjectData" v-show="item.arts">{{item.name}}</span>
								</div>
								<a :class="[{courseChange:artBox},'modifiBtn']" href="javascript:void(0)" @click="changeCombo('artBox')">
									修改<i class="iconfont">&#xe641;</i>
								</a>
							</div>
							<div class="subjectBox" v-show="artBox">
								<el-checkbox v-for="item in subjectData" v-model="item.arts">{{item.name}}</el-checkbox>
							</div>
						</li>
						<li>
							<div class="hiddens">
								<div class="subjectTag">理科综合</div>
								<div class="subjectCombo">
									<span v-for="item in subjectData" v-show="item.science">{{item.name}}</span>
								</div>
								<a :class="[{courseChange:scienceBox},'modifiBtn']" href="javascript:void(0)" @click="changeCombo('scienceBox')">
									修改<i class="iconfont">&#xe641;</i>
								</a>
							</div>
							<div class="subjectBox"  v-show="scienceBox">
								<el-checkbox v-for="item in subjectData" v-model="item.science">{{item.name}}</el-checkbox>
							</div>
						</li>
					</ul>
				</el-form-item>
				<el-form-item>
					<el-button @click="resetForm('ruleForm')" size="large">取消创建</el-button>
					<el-button type="primary" @click="submitForm('ruleForm')" size="large" class="btn-sure" :disabled="createExamBtn">确定创建</el-button>
				</el-form-item>
			</el-form>

			<!--权限：校级所有角色-->
			<el-dialog v-if="user.level=='school'" title="选择班级" v-model="dialogVisible">
				<section class="schoolsBox classBox">
					<div class="s-top">
						<el-checkbox v-model="isAll" @change="isAllClass">全选</el-checkbox>
						<label class="cgray">共选择 {{ schools.length }} 个班级</label>
					</div>
					<div class="shoolList">
						<el-checkbox v-for="item in schoolList" v-model="item.checked" @change="totalClass">{{item.classname}}</el-checkbox>
					</div>
				</section>
				<span slot="footer" class="dialog-footer">
					<el-button @click="closeDialog" size="large">取 消</el-button>
					<el-button type="primary" @click="examSchool" size="large" class="btn-sure">确 定</el-button>
				  </span>
			</el-dialog>

			<!--权限：市 区县所有角色-->
			<el-dialog v-if="user.level!='school'" title="选择学校" v-model="dialogVisible">
				<ul class="areaList fl">
					<li v-for="(item,index) in areaList" :class="{areaActive:item.countyId==countyId}" @click="switchArea(item)">
						{{item.countyName+'('+item.activeNum+'/'+item.schools.length+')'}}
					</li>
				</ul>
				<section class="schoolsBox fl">
					<div class="s-top">
						<el-checkbox v-model="isAll" @change="isAllSchool">全选</el-checkbox>
						<label class="cgray">共选择 {{ schools.length }} 所学校</label>
					</div>
					<div class="shoolList hiddens">
						<el-checkbox v-for="item in schoolList" v-model="item.checked" @change="totalSchool">{{item.name}}</el-checkbox>
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

  export default {
  	  components: { TabExam },
	  data() {
        return {
        	user: backUser,
            leftbar: {},
            tabData: {
                show: 0
            },
            examInfo: {
                gradeId: "",
                gradeName: "",
                name: "",
                phase: 0,
                releaseTime: "",
                startTime: "",
                semesterId: 0,
                level: 2,
                remark: "",
                type: 0
            },
            schools: [],
            courses: [],
            ruleForm: {
                name: "",
                examType: "1",
                startDate: "",
                endDate: "",
                branch: '否',
                classArr:  "",
                classList:[]
            },
            time:{
                hour: '00',
                minutes: '00'
            },
            hours:['00','01','02','03','04','05','06','07','08', '09','10',
                '11','12','13','14','15','16','17','18','19','20','21','22','23'],
            minutes:['00','01','02','03','04','05','06','07','08', '09','10', '11','12','13','14','15','16','17','18','19','20',
                '21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40',
                '41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59'],
            dialogVisible: false,
            areaList: [],
            schoolList: [],
            countyId: 0,
            isHighSchool: true,
            isAll: false,
            rules: {
                name: [
                    { required: true, message: '请输入考试名称' },
                    { min: 1, max: 30, message: '长度在 1 到 30 个字符' }
                ],
                examType: [
                    { required: true, message: '请选择考试类型', trigger: 'change' }
                ],
                startDate: [
                    { type: 'date', required: true, message: '请选择考试日期',trigger: 'change'}
                ],
                endDate: [
                    { type: 'date', required: true, message: '请选择成绩发布日期',trigger: 'change'}
                ],
                branch: [
                    { required: true, message: '请选择考试类型' }
                ],
                classArr: [
                    { required: true,message: '请选择考试班级/学校',trigger: 'change'}
                ],
                subjectArr: [
                    { required: true,message: '请选择绑定的老师'}
                ]
            },
            subjectData: [],
            subjectIds: [],
            isBranch: false,
            subjectLeaderName: '教研员',
            examNameTag: '学校',
            hasBranch: true,
            createExamBtn: false,
            scienceBox:false,
            artBox: false
        };
    },
    mounted() {
        this.queryGrade();
        switch(backUser.level){
            case "city":
                this.examInfo.level = 0;
                break;
            case "county":
                this.examInfo.level = 1;
                this.hasBranch = false;
                break;
            case "school":
                this.examInfo.level = 2;
                this.examNameTag = '班级';
                this.subjectLeaderName = '绑定学科负责人';
                break;
            default:
                this.examInfo.level = 3;
        }
    },
    methods: {
        queryGrade() {
            if(backUser.level == 'school'){
                // 查询某学校所有年级 (陈显官) #2017-03-31#
                this.$http.post("/api/servers/PlatformGradeApi_findBySchool", {
                    schoolId: backUser.orgId
                }).then(function(data){
                    data = data.body;
                    if(data.code==200){
                        data = data.data;
                        data.map(function(val){
                            val.id = val.cityGradeId;
                        });
                        this.ruleForm.classList = data;
                        if(data && data.length>0 && data[0].id) {
                            this.examInfo.gradeId = data[0].id;
                            this.examInfo.gradeName = data[0].name;
                        };
                    } else {
                     this.ruleForm.classList = [];
                     this.examInfo.gradeId = '';
                     this.examInfo.gradeName = '';
                        this.$message({
						  message: data.message,
						  type: 'warning'
						});
                    }
                }, function(error){
                    console.error(error);
                });
            }else{
                // 查询一个租户下某一个学段的市级年级(向发钧) #2017-03-09#
                this.$http.post("/api/servers/listPhaseGrades", {
                    tenantId: backUser.info.tenantid
                }).then(function(data){
                 	data = data.body;
                    if(data.code == 200){
                        data = data.data;
                        this.ruleForm.classList = data;
                        if(data && data.length>0 && data[0].id) {
                            this.examInfo.gradeId = data[0].id;
                            this.examInfo.gradeName = data[0].name;
                        };
                    } else {
                    	this.ruleForm.classList = [];
                    	this.examInfo.gradeId = '';
                    	this.examInfo.gradeName = '';
                         this.$message({
						  message: data.message,
						  type: 'warning'
						});
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });
            }
        },
        choiceParse() {
            var $this = this;
            this.ruleForm.classList.map(function(val){
                if(val.id == $this.examInfo.gradeId){
                    $this.examInfo.phase = val.phase;
                    $this.examInfo.gradeName = val.name;
                }
            });
            if(this.examInfo.gradeName.indexOf("初") > -1){
                this.isHighSchool = false;
            }else{
                this.isHighSchool = true;
            }
            this.ruleForm.classArr = "";
            switch(backUser.level){
                case "city":
                    this.queryCounty();
                    break;
                case "county":
                    this.queryCounty();
                    break;
                case "school":
                    this.switchClass();
                    break;
                default:
                    console.log("角色不对");
            }
            this.isAll = false;
            this.schools = [];
            this.querySubject();
        },
        changeTime(type) {
            if(this.ruleForm.startDate){
                if(this.ruleForm.endDate && (this.ruleForm.startDate > this.ruleForm.endDate)) {
                    this.ruleForm.endDate = "";
                }
                if(type == 'release') return;
                var param = {
                    tenantId: backUser.info.tenantid,
                    count: 1,
                    time: this.ruleForm.startDate.getTime()
                };
                // 通过一个时间来查询学期(向发钧) #2017-03-09#
                this.$http.post("/api/servers/timeFindTerm",param ).then(function(data){
                	data = data.body;
                    if(data.code==200){
                        data = data.data;
                        this.terms = data[0];
                    } else {
                    	this.terms = {};
                        this.$message({
						  message: data.message,
						  type: 'warning'
						});
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });
            }
        },
        queryCounty() {
            var firstSchools = {
                countyId: 0,
                countyName: "全部学校",
                schools: [],
                activeNum: 0,
                active: true
            };
            // 查询一个市级的组织机构ID和学段查询区县和学校(郑强) #2017-04-10#
            this.$http.post("/api/servers/listCountyAndSchoolsPhase", {
                orgId: backUser.orgId,
                phase: this.examInfo.phase
            }).then(function(data){
                data = data.body;
                if(data.code==200){
                    data = data.data;
                    data.map(function(vals){
                        vals.activeNum = 0;
                        vals.schools.map(function(val){
                            val.checked = false;
                            val.countyId = vals.countyId;
                            firstSchools.schools.push(val);
                        });
                    });
                    data.unshift(firstSchools);
                    this.areaList = data;
                    this.switchArea(data[0]);
                } else {
                	this.areaList = [];
                    this.$message({
					  message: data.message,
					  type: 'warning'
					});
                }
            }, function(error){
                console.error(error);
            });
        },
        queryInstructor(subData) {
            var param = {
                orgLevel: backUser.level,
                subjectIds: this.subjectIds,
                orgId:backUser.orgId
            };
            // 根据学科ID列表查询教研员列表(胡君) #2017-03-09#
            this.$http.post("/api/servers/listSubjectLeader", {body:param}).then(function(data){
                data = data.body;
                if(data.code == 200){
                    data = data.data;
                    subData.map(function(vals,index){
                        data.map(function(val){
                            if(val.courseId == vals.id){
                                val.selected = false;
                                subData[index].researcher.push(val);
                                subData[index].artResearcher.push(val);
                                subData[index].scienceResearcher.push(val);
                            }
                        });
                    });
                } else {
                    this.$message.error('教研员没有找到');
                }
                this.subjectData = subData;
            }, function(error){
                console.info("返回失败"+error);
            });
        },
        querySubject() {
            var $this = this,
                param = {
                    tenantId: backUser.info.tenantid,
                    phase: this.examInfo.phase
                };
            // 根据租户ID和学段查询所有学科(向发钧) #2017-03-09#
            this.$http.post("/api/servers/listCommonSubjects",param).then(function(data){
            	data = data.body;
            	this.subjectIds = [];
                if(data.code==200){
                    data = data.data;
                    data.map(function(val){
                        val.ischeck = false;
                        val.hasSplit = false;
                        val.totalScore = "";
                        val.researcher = [];
                        val.scienceResearcher = [];
                        val.artResearcher = [];

                        val.researcherId = "";						//教研员 ID，不分科时使用"
                        val.researcherName = "";
                        val.artResearcherId = "";					//文科教研员 ID
                        val.artResearcherName = "";					//文科教研员名字
                        val.scienceResearcherId = "";				//理科教研员 ID
                        val.scienceResearcherName = "";				//理科教研员名字
                        if('物理化学生物'.indexOf(val.name) > -1 ){
                            val.science = true;
                        }else{
                            val.science = false;
                        }
                        if('地理历史政治'.indexOf(val.name) > -1 ){
                            val.arts = true;
                        }else{
                            val.arts = false;
                        }
                        $this.subjectIds.push(val.id);
                    });
                    this.queryInstructor(data);
                } else {
                    this.$message({
					  message: data.message,
					  type: 'warning'
					});
                }
            }, function(error){
                console.info("返回失败"+error);
            });
        },
        researcher(name,index) {
            var subData = this.subjectData[index];
            var id = subData[name];
            var type = name.substring(0,name.length-2);
            for(var i=0,len=subData[type].length;i<len;i++){
                if(id == subData[type][i].accountId){
                    subData[type+"Name"] = subData[type][i].accountName;
                    break;
                }
            }
        },
        choiceSchools() {
            this.dialogVisible = true;
        },
        examSchool() {
            var len = this.schools.length;
            if(len > 0){
                switch(backUser.level){
                    case 'city':
                        this.ruleForm.classArr = '共选择'+len+'所学校';
                        break;
                    case 'county':
                        this.ruleForm.classArr = '共选择'+len+'所学校';
                        break;
                    case 'school':
                        this.ruleForm.classArr = '共选择'+len+'个班级';
                        break;
                    default:
                        this.ruleForm.classArr = "";
                }
            }else{
                this.ruleForm.classArr = "";
            }
            this.closeDialog();
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        switchClass() {
            // 查询某学校某年级所有班级(胡君) #2017-03-09#
            this.$http.post("/api/servers/schoolFindClass", {
                schoolId: backUser.orgId,
                gradeId: this.examInfo.gradeId
            }).then(function(data){
            	data = data.body;
                if(data.code==200){
                    data = data.data;
                    data.map(function(val){
                        val.checked =false;
                    });
                    this.schoolList = data;
                } else {
                	this.schoolList = [];
                    this.$message({
					  message: data.message,
					  type: 'warning'
					});
                }
            }, function(error){
                console.info("返回失败"+error);
            });
        },
        isAllClass(){
            var mark = this.isAll;
            this.schoolList.map(function(val){
                val.checked = mark;
            });
            this.totalClass();
        },
        totalClass() {
            this.schools = this.schoolList.filter(function(val){
                return val.checked;
            });
            if(this.schools.length == this.schoolList.length){
                this.isAll = true;
            }else{
                this.isAll = false;
            }
        },
        branchSubject() {
            if(this.ruleForm.branch == '是'){
                this.isBranch = true;
            }else{
                this.isBranch = false;
            }
            this.subjectData.map(function(val){
                val.hasSplit = false;
            });
        },
        switchArea(item) {
            this.countyId = item.countyId
            this.schoolList = item.schools;
            this.totalSchool();
        },
        isAllSchool() {
            var mark = this.isAll;
            this.schoolList.map(function(val){
                val.checked = mark;
            });
            this.totalSchool();
        },
        totalSchool() {
            var isAll = true;
            var num = 0;
            this.schools = this.areaList[0].schools.filter(function(val){
                return val.checked;
            });
            this.areaList.map(function(vals){
                num = 0;
                vals.schools.map(function(val){
                    if(val.checked){
                        num++;
                    }
                });
                vals.activeNum = num;
            });
            this.schoolList.map(function(val){
                if(!val.checked){
                    isAll = false;
                }
            });
            if(isAll && this.schools.length > 0 ){
                this.isAll = true;
            }else{
                this.isAll = false;
            }
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                this.courses = [];
                var params = {},
                    artCategory =  0,
                    classes = [],
                    $this = this,
                    artCourseIds = [],
                    scienceCourseIds = [],
                    examTypeMark = this.ruleForm.examType == '1'?true:false,
                    params = {};
                if(!valid) return;
                if(!this.createExamBtn){
                    this.createExamBtn = true;
                }
                setTimeout(function(){
                    $this.createExamBtn = false;
                },6000);
                if(this.subjectData.length==0){
                    this.$msgbox("没有科目信息");
                }
                for(let i=0,len =this.subjectData.length;i<len;i++){
                    if(this.subjectData[i].ischeck){
                        if(this.subjectData[i].totalScore < 1) {
                            this.$msgbox(this.subjectData[i].name+"的分数未设置");
                            valid = false;
                            return;
                        }
                        params = {
                            artCategory: artCategory, 					//班级文理属性  0：不分科；1：文科；2：理科",
                            courseId: this.subjectData[i].id,
                            courseName: this.subjectData[i].name,
                            hasSplit: this.subjectData[i].hasSplit,				//是否文理分卷：0：不分卷；1：分卷"
                            totalScore: this.subjectData[i].totalScore
                        };
                        if(examTypeMark){
                            if(this.subjectData[i].hasSplit){
                                if(this.subjectData[i].artResearcherId && this.subjectData[i].scienceResearcherId){
                                    params.artResearcherId = this.subjectData[i].artResearcherId;				//文科教研员 ID
                                    params.artResearcherName = this.subjectData[i].artResearcherName;			//文科教研员名字
                                    params.scienceResearcherId = this.subjectData[i].scienceResearcherId;		//理科教研员 ID
                                    params.scienceResearcherName = this.subjectData[i].scienceResearcherName;	//理科教研员名字
                                }else{
                                    valid = false;
                                    this.$msgbox("请设置"+this.subjectLeaderName);
                                    return;
                                }
                            }else{
                                if(this.subjectData[i].researcherId){
                                    params.researcherId = this.subjectData[i].researcherId;						//教研员 ID，不分科时使用"
                                    params.researcherName = this.subjectData[i].researcherName;					//教研员名字，不分科时使用"
                                } else{
                                    valid = false;
                                    this.$msgbox("请设置"+this.subjectLeaderName);
                                    return;
                                }
                            }
                        }
                        if(this.subjectData[i].arts) artCourseIds.push(this.subjectData[i].id);
                        if(this.subjectData[i].science) scienceCourseIds.push(this.subjectData[i].id);
                        $this.courses.push(params);
                    }
                }
                if(this.courses.length == 0){
                    this.$msgbox("请设置考试科目信息！");
                    return;
                }
                if(!this.examInfo.gradeId){
                    this.$message({
                        type: 'warning',
                        message: '学校年级数据错误'
                    });
                    return;
                }
                if (valid) {
                    this.examInfo.name = this.ruleForm.name;
                    this.examInfo.startTime = this.ruleForm.startDate.getTime();
                    this.examInfo.releaseTime = this.ruleForm.endDate.getTime()+(this.time.hour*3600+this.time.minutes*60)*1000;
                    this.examInfo.type = this.ruleForm.examType;
                    this.examInfo.semesterId = this.terms.id;				//"string 学期 ID"
                    this.examInfo.hasSplit = this.isBranch;					//是否文理分科，指的是页面上文理分科选择"
                    params = {
                        examInfo: this.examInfo,
                        courses: this.courses,
                    };
                    if(backUser.level == 'school'){
                        this.schools.map(function(val){
                            classes.push({
                                artCategory: val.type,
                                classId: val.id,
                                className: val.classname,
                                studentCount: val.studentnum
                            });
                        });
                        params.classes = classes;
                    }else{
                        this.schools.map(function(val){
                            classes.push({
                                orgId: val.id,
                                schoolName: val.name,
                                countyId: val.countyId
                            });
                        });
                        params.schools = classes;
                    }
                    if(this.isBranch){
                        params.artCourseIds = artCourseIds;
                        params.scienceCourseIds = scienceCourseIds;
                    }
                    // 创建考试 (陈显官) #2017-03-23#
                    this.$http.post("/api/servers/createExam", {
                        body: params
                    }).then(function(data){
                        data = data.body;
                        if(data.code==200 && data.data){
                            var page = "/scorePaper";
							if(this.ruleForm.examType == '0' ){
								page = "/importScore";
							}
							location.href = '/home/editexam/'+data.data+page;
                        } else {
                            this.$message.error(data.message);
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
        },
        changeCombo(name){
            this[name] = !this[name];
        }
    }
  }

</script>

