<template>
	<el-dialog id="setwin" :title="editwin.curtitle" v-model="editwin.isshow" @close="closeWin('editwin')">
		<div v-if="saving" class="mask"></div>
		<el-form :model="editwin" :rules="rules" ref="editwin" class="demo-ruleForm">
			<el-form-item>
				<div class="tips" v-if="curmodel=='department'">温馨提示：1、请选择要设置学部的年级，然后再勾选相同学部的班级；2、同一个班级只能有一个学部。</div>
				<div class="tips" v-if="curmodel=='classes'">温馨提示：1、请先选择要设置班级层次的年级，然后再勾选相同层次的班级；2、同一个班级只能有一个层次，有文理分科的年级，需按文理设置层次。</div>
			</el-form-item>
			<el-form-item prop="name">
				<el-input v-if="curmodel=='department'" v-model="editwin.name" auto-complete="off" placeholder="在此输入学部名称，可输入10个字以内的中文或数字"></el-input>
				<el-input v-if="curmodel=='classes'"  v-model="editwin.name" auto-complete="off" placeholder="班级层次名称，可输入中文或数字，10个字以内，例如：1"></el-input>
			</el-form-item>
			<el-form-item>
				<el-select v-model="editwin.gradeId" style="width: 100%" @change="curGrade">
					<el-option
							v-for="item in editwin.gradeList"
							:label="item.name"
							:value="item.cityGradeId">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="wIsShow || lIsShow || wlIsShow">
				<el-radio-group v-model="category" @change="switchCategory">
					<el-radio :label="1" v-if="wIsShow">文科</el-radio>
					<el-radio :label="2" v-if="lIsShow">理科</el-radio>
					<el-radio :label="0" v-if="wlIsShow">未分文理</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item class="choiceclass">
				<div class="classes">
					<span>选择班级</span>
				</div>
				<el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
			</el-form-item>
			<div class="nodata" v-if="nodata">该年级暂无班级数据</div>
			<el-form-item class="classlist"  prop="checkedClassNames">
				<el-checkbox-group v-model="editwin.checkedClassNames" @change="handleCheckedChange">
					<el-checkbox v-for="oneClassName in classinfo.names" :label="oneClassName" name="checkedClassNames">{{oneClassName}}</el-checkbox>
				</el-checkbox-group>
			</el-form-item>
		</el-form>
		<div class="errortip">{{errormsg}}</div>
		<div slot="footer" class="dialog-footer">
			<div v-if="!saving">
				<el-button @click="closeWin('editwin')">取 消</el-button>
				<el-button type="primary" @click="submitForm('editwin')">确 定</el-button>
			</div>
			<div v-if="saving">
				<el-button type="primary">正在保存...</el-button>
			</div>
		</div>
	</el-dialog>
</template>
<script type="text/ecmascript-6">
	export default{
	    props: ["curmodel", "editwin", "classinfo"],
        data(){
            return {
                nodata: false, //无班级数据
                saving: false,
                isCategory: false, //是否分科
                category: 1, //当前选中项， 1:文科, 2: 理科 ,0：不分科
				wClass: [], //文科班级
				wIsShow: false, //是否显示"文科"分类
				lClass: [], //理科班级
                lIsShow: false,//是否显示"理科"分类
				wlClass: [],//未分文理科班级
                wlIsShow: false,//是否显示"未分文理科"分类
                errormsg: "",
				rules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					checkedClassNames: [
						{type: 'array', required: true, message: '请至少选择一个班级', trigger: 'change' }
					]
				},
				checkAll: false
			};
        },
		mounted() {
			this.listGrades();
		},
		methods: {
			listGrades(){
				var obj = this.editwin;
                // 查询某学校所有年级 (陈显官) #2017-03-31#
                this.$http.post("/api/servers/PlatformGradeApi_findBySchool", {
                    schoolId: obj.orgId
                }).then(function(data){
                    data = data.body;
                    console.info("市级年级："+JSON.stringify(data));
                    if(data.code == 200 && data.success == true){
                        data = data.data;
                        if(data.length > 0){
                            this.editwin.gradeId = data[0].cityGradeId;
                            this.listClass(obj.orgId, data[0].cityGradeId);
                        }
						this.editwin.gradeList = data;
                        console.log("年级："+JSON.stringify(this.editwin.gradeList));
                    }else {
                        this.$message.error('查询年级接口返回失败!');
                    }
                }, function(error){
                    console.info("返回失败："+error);
                    this.$message.error('查询年级接口错误!');
                });

			},
			listClass(schoolId, gradeId){
				this.classinfo.names = [];
                this.wClass = [];
                this.lClass = [];
                this.wlClass = [];
                this.wIsShow = false;
                this.lIsShow = false;
                this.wlIsShow = false;
                // 查询某学校某年级所有班级(胡君) #2017-03-09#
                this.$http.post("/api/servers/schoolFindClass", {
                    schoolId: schoolId,
                    gradeId: gradeId
                }).then(function(data){
                    data = data.body;
                    console.info("班级："+JSON.stringify(data));
                    if(data.code == 200 && data.success == true){
                        data = data.data;
                        if(data.length == 0){
                            this.nodata = true;
                            return;
                        }else {
							this.classinfo.list = data;
                            this.nodata = false;
                            this.handleClassName();
						}
                    }else {
                        this.$message.error('查询班级接口返回失败!');
					}
                }, function(error){
                    console.info("返回失败："+error);
                    this.$message.error('查询班级接口错误!');
                });
			},
			handleClassName(){
				var classes = this.classinfo.list;
				this.classinfo.names = [];
				if(classes.length > 0){
                    if(this.editwin.curtitle ==  "新增学部管理" || this.editwin.curtitle ==  "编辑学部管理"){
                        for(var i=0; i<classes.length; i++){
							this.classinfo.names.push(classes[i].classname);
                        }
					}else { //班级层次管理
						this.wClass = [];
						this.lClass = [];
						this.wlClass = [];
						for(var j=0; j<classes.length; j++){
							if(classes[j].type == 0){ //未分文理
								this.wlClass.push(classes[j].classname);
								continue;
							}else  if(classes[j].type == 1) { //文科
								this.wClass.push(classes[j].classname);
								continue;
							}else if(classes[j].type == 2){ //理科
								this.lClass.push(classes[j].classname);
								continue;
							}
						}
						if(this.wClass.length > 0){
						    this.wIsShow = true;
						}else {
                            this.wIsShow = false;
						}
						if(this.lClass.length > 0){
                            this.lIsShow = true;
						}else {
                            this.lIsShow = false;
						}
                        if(this.wlClass.length > 0){
                            this.wlIsShow = true;
                        }else {
                            this.wlIsShow = false;
                        }
                        if(this.wClass.length > 0){
                            this.category = 1;
							this.classinfo.names = this.wClass;
						}else {
                            if(this.lClass.length > 0){
                                this.category = 2;
								this.classinfo.names = this.lClass;
							}else {
                                if(this.wlClass.length > 0){
                                    this.category = 0;
									this.classinfo.names = this.wlClass;
                                }
							}
						}
					}
				}
            },
		    closeWin(formName){
				var obj = this.editwin;
				obj.id = "";
				obj.name = "";
				obj.gradeId = this.editwin.gradeList[0].cityGradeId;
				obj.checkedClassNames = [];
				obj.isshow = false;
				this.$refs[formName].resetFields();
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.save();
					} else {
						return false;
					}
				});
			},
			handleCheckAllChange(event) {
				this.editwin.checkedClassNames = event.target.checked ? this.classinfo.names : [];
			},
			handleCheckedChange(value) {
				let checkedCount = value.length;
				if(checkedCount == 0){
				    return;
				}
				this.checkAll = checkedCount === this.classinfo.names.length;
			},
			curGrade(value){
		        this.checkAll = false;
				this.editwin.gradeId = value;
                if(this.editwin.editInit == true){
					this.editwin.editInit == false;
				}else {
					this.editwin.checkedClassNames = [];
				}
               // this.$refs['editwin'].resetFields();
				this.listClass(this.editwin.orgId, value);
			},
			//切换文理科
            switchCategory(value){
               // sets.editwin.checkedClassNames = [];
				if(value == 1){
					this.classinfo.names = this.wClass;
				}else if(value == 2){
					this.classinfo.names = this.lClass;
				}else if(value == 0){
					this.classinfo.names = this.wlClass;
                }
			},
			//班级层次新建/编辑不能同时选择文科和理科班级
			branchClass(checkedClass){
				var type1 = checkedClass[0].type;
				for(var i=1; i<checkedClass.length; i++){
					if(type1 != checkedClass[i].type ){
                        this.errormsg = "不能同时选择文科、理科、不分科类别的班级";
					    return false;
					}
				}
                this.errormsg = "";
                return true;
			},
			save(){
				var obj = this,
						gradelist = obj.editwin.gradeList, defaultGradeId = obj.editwin.gradeId, curGradeName = "",
						checkedClass = this.editwin.checkedClassNames, classList = this.classinfo.list, classDetails = [], branch = this.category;
				for(var i=0; i<gradelist.length; i++){
					if(gradelist[i].cityGradeId == defaultGradeId){
						curGradeName = gradelist[i].name;
					    break;
					}
				}
				for(var j=0; j<checkedClass.length;j++){
				    for(var k=0; k<classList.length; k++){
						if(checkedClass[j] == classList[k].classname){
							classDetails.push({
								classId: classList[k].id,
								className: checkedClass[j],
								type: classList[k].type
							});
							break;
						}
					}
				}
				//新增数据
				var newObj = {
                        body: {
                            "classGroup": {
                                "gradeId": defaultGradeId,
                                "gradeName": curGradeName,
                                "name": obj.editwin.name,
                                "schoolId": obj.editwin.orgId,
                                "branch": branch
                            },
                            "classGroupDetails": classDetails
                        }
                    },
					//修改数据
					editObj = {
                        body: {
                            "classGroup": {
                                "id": obj.editwin.id,
                                "gradeId": defaultGradeId,
                                "gradeName": curGradeName,
                                "name": obj.editwin.name,
                                "schoolId": obj.editwin.orgId,
                                "branch": branch
                            },
                            "classGroupDetails": classDetails
                        }
                    };
				if(this.editwin.curtitle ==  "新增学部管理"){
                    this.saving = true;
                    //新建 保存学部设置
                    this.$http.post("/api/servers/saveDeparment", newObj).then(function(data){
                        this.saveCallBack(data);
                    }, function(error){
                        this.errorBack();
                    });
				}else if(this.editwin.curtitle ==  "编辑学部管理"){
                    this.saving = true;
					// 修改学部设置 (郑强) #2017-03-15#
                    this.$http.post("/api/servers/ExamClassPartApi_modify", editObj).then(function(data){
                        this.saveCallBack(data);
                    }, function(error){
                        this.errorBack();
                    });
				}else if(this.editwin.curtitle ==  "新增班级层次管理"){
				    if(this.branchClass(classDetails)){
                        this.saving = true;
                        // 保存班级层次设置 (郑强) #2017-03-15#
                        this.$http.post("/api/servers/ExamClassLevelApi_create", newObj).then(function(data){
                            this.saveCallBack(data);
                        }, function(error){
                            this.errorBack();
                        });
					}
                }else if(this.editwin.curtitle ==  "编辑班级层次"){
                    if(this.branchClass(classDetails)){
                        this.saving = true;
                        // 修改班级层次设置  (郑强) #2017-03-15#
                        this.$http.post("/api/servers/ExamClassLevelApi_modify", editObj).then(function(data){
                            this.saveCallBack(data);
                        }, function(error){
                            this.errorBack();
                        });
					}
                }
			},
			saveCallBack(data){
                this.saving = false;
                var data = data.body;
                console.info("新建/修改："+JSON.stringify(data));
                if(data.code == 200 && data.success == true){
                    this.closeWin('editwin');
					//this.listData();
					this.$emit('loadlist');
                    this.errormsg = "";
                }else {
					this.errormsg = "保存失败："+data.message+"！";
				}
			},
			errorBack(){
                this.saving = false;
                this.$message.error('接口错误！');
			}
		}
    }
</script>
