<template>
	<el-dialog :title="editwin.curtitle" v-model="editwin.isshow" size="small" @close="closeWin('editwin')">
		<div v-if="saving" class="mask"></div>
		<el-form :model="editwin" :rules="rules" ref="editwin" class="demo-ruleForm">
			<el-row :gutter="10" class="countrywin" id="countrywin">
				<el-col :span="18">
						<el-form-item prop="name">
							<el-input v-if="curmodel=='region'" v-model="editwin.name" auto-complete="off" placeholder="在此输入学区名称"></el-input>
							<el-input v-if="curmodel=='country'"  v-model="editwin.name" auto-complete="off" placeholder="在此输入乡镇名称"></el-input>
							<el-input v-if="curmodel=='school'"  v-model="editwin.name" auto-complete="off" placeholder="在此输入分类名称"></el-input>
						</el-form-item>
							<div class="choice">
								<div class="schtype">
									<label>学校类型：</label>
									<el-radio-group v-model="defaultPhase" @change="changePhase">
										<el-radio v-for="phase in phases" :label="phase.id">{{phase.name}}</el-radio>
									</el-radio-group>
								</div>
								<div class="alphabet">
									<label class="tip">首字母筛选：</label>
									<el-radio-group v-model="defaultWord" @change="changeWord">
										<el-radio-button v-for="one in firstWords" :label="one"></el-radio-button>
									</el-radio-group>
								</div>
							</div>
							<el-form-item prop="schoolNames">
							<div v-if="defaultWord == '全部'" class="schoolist">
								<ul v-for="obj in curSchooList">
									<li>{{obj.pinyinTag}}</li>
									<li>
										<el-checkbox-group v-model="editwin.schoolNames">
											<el-checkbox  v-for="school in obj.schools" :label="school.schoolName" name="schoolNames" :disabled="handle(school.schoolName, school.groupId)"></el-checkbox>
										</el-checkbox-group>
									</li>
									<b class="clear"></b>
								</ul>
							</div>
							<div v-else class="schoolist">
								<ul>
									<li>{{curSchooList.pinyinTag}}</li>
									<li>
										<el-checkbox-group v-model="editwin.schoolNames">
											<el-checkbox  v-for="school in curSchooList.schools" :label="school.schoolName" name="schoolNames" :disabled="handle(school.schoolName, school.groupId)"></el-checkbox>
										</el-checkbox-group>
									</li>
									<b class="clear"></b>
								</ul>
							</div>
						</el-form-item>
				</el-col>
				<el-col :span="6">
					<div class="mychoice">
						<h3>我的选择：</h3>
						<ul>
							<li v-for="(school, index) in editwin.schoolNames"><label>{{school}}</label><el-button icon="close" @click="removeSchool(index)"></el-button></li>
							<b class="clear"></b>
						</ul>
					</div>
				</el-col>
			</el-row>
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
		props: ["curmodel", "editwin"],
		data(){
			return {
                saving: false,

				defaultPhase: "", //默认学段key
				phases: [], //所有学段数组
                phasesIds: [], //所有学段id

				defaultWord: "全部", //默认首字母key
				firstWords: ["全部"],//所有首字母数组

				schooList: [], //全部学校详细数据
				schoolDetail: [],//全部学校数组
				curSchooList: [], //当前选择首字母对应的学校列表
				errormsg: "",

				rules: {
					type: [
						{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
					],
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					schoolNames: [
						{ type: 'array', required: true, message: '请至少选择一个学校', trigger: 'change' }
					]
				},
				saveUrl: "",
				querySchoolUrl: ""
			};
		},
		mounted(){
			this.listPhases();
			this.judgeModules();
		},
		methods: {
            handle(schoolName, groupId){
				var editId = this.editwin.id, names = this.editwin.schoolNames, isEditName = false;
				if(editId == ""){
				    if(groupId != ""){
				        return true;
					}else {
                        return false;
					}
				}else {
					for(var i=0; i<names.length; i++){
					    if(schoolName == names[i]){
                            isEditName = true;
                            break;
						}
					}
                    if(groupId != ""){
					    if(isEditName){
					        return false;
						}else {
                            return true;
						}
                    }else {
                        return false;
                    }
				}
			},
		    judgeModules(){
                var module = this.curmodel, editId = this.editwin.id;
                switch (module){
                    case 'region'://学区管理
                        if(editId == ""){ //新建
                            this.saveUrl = "/api/servers/createRegion";
                        }else { //编辑
                            this.saveUrl = "/api/servers/editRegion";
                        }
                        this.querySchoolUrl = "/api/servers/regionList";
                        break;
                    case 'country'://乡镇管理
                        if(editId == ""){
                            this.saveUrl = "/api/servers/ExamTownApi_create";
                        }else {
                            this.saveUrl = "/api/servers/ExamTownApi_modifyByCreate";
                        }
                        this.querySchoolUrl = "/api/servers/countryList";
                        break;
                    case 'school'://学校管理
                        if(editId == ""){
                            this.saveUrl = "/api/servers/ExamSchoolGroupApi_create";
                        }else {
                            this.saveUrl = "/api/servers/ExamSchoolGroupApi_modifyByCreate";
                        }
                        this.querySchoolUrl = "/api/servers/ExamSchoolGroupApi_listSchoolsPinyin";
                        break;
                };
			},
			listPhases(){
				// 查询所有的学段(向发钧) #2017-03-09#
				this.$http.post("/api/servers/listPhases").then(function(data){
					data = data.body;
                    console.info("学段："+JSON.stringify(data));
                    if(data.code == 200 && data.success == true){
                        data = data.data;
                        if(this.curmodel=="region" || this.curmodel=="country" ){//学区或乡镇模块学段只取小学和初中
							data = [{
									"id": 2,
									"name": "小学"
								},{
									"id": 3,
									"name": "初中"
								}];
						}
                        for(var i=0; i<data.length; i++){
                            this.phasesIds.push(data[i].id);
						}
                        data.unshift({
                            "id": "",
                            "name": "全部"
                        });
                        this.phases = data;
                        this.listSchools();
					}else {
                        this.$message.error('查询所有学段接口返回失败!');
					}
				}, function(error){
					console.info("接口错误："+error);
                    this.$message.error('查询所有学段接口错误!');
				});
			},
			changePhase(phaseId){
				this.defaultPhase = phaseId;
                this.defaultWord = "全部";
				this.listSchools();
			},
			requestParam(){
                var obj = this,
					param =  obj.defaultPhase == "" ?
						{
							countyId: obj.editwin.orgId
						}
						:
						{
							countyId: obj.editwin.orgId,
							phase: obj.defaultPhase
						};
                return param;
			},
			changeWord(word){
			    if(word == "全部"){
					this.curSchooList = this.schooList;
				}else {
					var school = this.schooList;
					for(var i=0; i<school.length; i++){
						if(word == school[i].pinyinTag){
							this.curSchooList = school[i];
							//console.log("选择字母学校："+JSON.stringify(this.curSchooList));
						}
					}
				}
			},
			listSchools(){
			    var obj = this, phase = obj.defaultPhase == "" ? this.phasesIds : [obj.defaultPhase];
                obj.curSchooList = [], obj.firstWords = ["全部"];
                obj.changeWord("全部");
               // console.log("查询学段："+phase+",,"+JSON.stringify(phase));
                // 查询当前区县学校列表 (陈显官) #2017-03-10#
                this.$http.post(obj.querySchoolUrl, {
                    body: phase
                }).then(function(data){
                    data = data.body;
                  //  console.log("查询学校列表："+JSON.stringify(data));
                    if(data.code == 200 && data.success == true){
                        data = data.data;
						for(var i=0; i<data.length; i++){
							obj.firstWords.push(data[i].pinyinTag);
						}
                        obj.schooList = data;
                        obj.curSchooList = obj.schooList;
                        //schoolDetail
                        for(var i=0; i<data.length; i++){
                            var del = data[i].schools;
                            for(var j=0; j<del.length; j++){
                                obj.schoolDetail.push(del[j]);
                            }
                        }
                       // console.log("所有学校详细信息："+JSON.stringify(obj.schoolDetail));
                    } else {
                        this.$message.error('查询学校列表接口返回失败!');
                    }
                }, function(error){
                    console.error(error);
                    this.$message.error('查询学校列表接口错误!');
                });
			},
			removeSchool(index){
				this.editwin.schoolNames.splice(index, 1);
			},
			closeWin(formName){

			   // console.log("清除数据");
				this.defaultPhase = "";
				this.defaultWord = "全部";
				this.editwin.name = "";
				this.$refs[formName].resetFields();
               // this.listSchools();
				this.editwin.isshow = false;
                //sets.listData();
				this.$emit('loadlist');
				this.editwin.schoolNames = [];
				document.getElementById("countrywin").scrollTop = 0;
			},
			submitForm(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.save();
					} else {
						return false;
					}
				});
			},
			save(){
			    this.saving = true;
                this.judgeModules();
			    var obj = this,  choice = obj.editwin.schoolNames, schools = obj.schoolDetail, cholist = [];
			    //console.log("保存所有学校："+JSON.stringify(schools));
			   // console.log("所有已选择学校："+JSON.stringify(choice));
			    for(var i=0; i< choice.length; i++){
			        for(var j=0; j< schools.length; j++){
                        if(choice[i] == schools[j].schoolName){
                            cholist.push( {
                                "orgId": schools[j].orgId,
                                "phase": schools[j].phase,
                                "schoolName": choice[i]
                            });
                            break;
                        }
					}
				}
				//console.log("已选择学校详情："+JSON.stringify(cholist));
			    var editId = obj.editwin.id,
					saveData = obj.editwin.id == "" ?
						{
                            "name": this.editwin.name,
                            "schools": cholist
                        }: {
                            "id":  this.editwin.id,
                            "name": this.editwin.name,
                            "regionId":  this.editwin.regionId,
                            "schools": cholist
						};

			   // console.log("保存数据："+JSON.stringify(saveData));
				console.log("保存接口URL："+obj.saveUrl);
				this.$http.post(obj.saveUrl, {
					body: saveData
				}).then(function(data){
                    this.saving = false;
					data = data.body;
					//console.log("保存结果："+JSON.stringify(data));
                    if(data.code == 200 && data.success == true){
						obj.closeWin('editwin');
						this.errormsg = "";
					}else {
                       // this.$message.error('保存数据接口返回失败!');
						this.errormsg = "保存失败："+data.message+"！";
					}
				}, function(error){
                    this.saving = false;
					console.info("返回失败："+error);
                    this.$message.error('保存数据接口错误!');
				});
			}
		}
	}
</script>
