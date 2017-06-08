<template>
	<div class="box">
			<div class="title_tab">
				<router-link to="scorePaper">编辑双向细目表</router-link>
				<router-link class="current" to="importTicket">导入准考证号</router-link>
			</div>
			<div class="b-tip fs12">
				温馨提示 ：
				<span>1、支持Excel多sheet导入</span>
				<span>2、请下载模板填写后再上传&gt;</span>
				<a href="#" @click="ticketTemplate">准考证模板下载
					<i class="iconfont">&#xe636;</i>
				</a>
			</div>
			<div class="b-tabs hiddens">
				<ul class="b-tabs-btn">
					<li :class="{activeTab:dataTypes==1}" @click="importDataTab(1)">成功导入名单({{importResult.successStudentsCount || 0}})</li>
					<li :class="{activeTab:dataTypes==2}" @click="importDataTab(2)">未更新准考证({{importResult.notUpdateStudentsCount || 0}})</li>
					<li :class="{activeTab:dataTypes==3}" @click="importDataTab(3)">未在基础数据找到({{importResult.notFoundStudentsCount || 0}})</li>
				</ul>
				<div class="b-tabs-down fr" v-show="importMark">
					<a v-if="importResult.noUpdateDataFile" :href="importResult.noUpdateDataFile">
						<i class="iconfont">&#xe636;</i>
						下载未更新人员名单
					</a>
					<a v-if="importResult.notFoundDataFile" :href="importResult.notFoundDataFile">
						<i class="iconfont">&#xe636;</i>
						下载基础数据未找到人员名单
					</a>
					<a v-if="isEdit" href="#" @click="resetImport">
						<i class="iconfont">&#xe637;</i>
						重新导入
					</a>
				</div>
			</div>
			<div class="tableData">
				<div class="tableBox" style="min-height:200px;">
					<table class="sx_table">
						<thead>
						<tr>
							<th>序号</th>
							<th>姓名</th>
							<th>身份证号</th>
							<th>学籍号</th>
							<th>准考证号</th>
							<th>学校代码</th>
						</tr>
						</thead>
						<tbody>
						<tr v-show="importMark" v-for="(item,index) in ticketList">
							<td>{{index+1}}</td>
							<td>{{item.name}}</td>
							<td>{{item.idNumber}}</td>
							<td>{{item.rollNo}}</td>
							<td>{{item.examNo}}</td>
							<td>{{item.schoolCode}}</td>
						</tr>
						</tbody>
					</table>
				</div>
				<el-pagination v-show="importMark"
							   @size-change="handleSizeChange"
							   @current-change="handleCurrentChange"
							   :current-page="page.currentPage"
							   :page-sizes="page.sizeArr"
							   :page-size="page.totalPage"
							   layout="total,sizes, prev, pager, next"
							   :total="page.totalCount">
				</el-pagination>
				<div class="t-infoBox " v-if="isEdit" v-show="!importMark">
					<p><i class="iconfont cgray importIcon">&#xe649;</i></p>
					<p class="cgray">未有学生准考证号数据，请导入！</p>
					<el-button type="primary" @click="resetImport" size="large">导入准考证号</el-button>
				</div>
			</div>
			<el-dialog title="错误数据" v-model="dialogVisible" size="small" class="downloadDialog" :closeOnClickModal="false">
				<header class="hiddens" style="margin:40px 0;">
				<span  class="cgray">
					共有<font style="color:#f00;font-weight:700;font-size:16px;margin:0 4px;">
					{{importResult.errorStudentsCount}}
				</font>
					条错误数据,请下载修改后再导入准考证
				</span>
					<a :href="importResult.errorDataFile" class="fr" style="color:#333;">
						<i class="iconfont">&#xe638;</i>
						Excel导出
					</a>
				</header>
			</el-dialog>
			<el-dialog title="导入准考证号" v-model="importVisible" size="tiny"
					   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
				<h6 class="centers">准考证号上传成功，正在解析，请稍等！</h6>
				<div style="width:30px;margin:20px auto;">
					<i class="el-icon-loading" style="font-size:20px;"></i>
				</div>
			</el-dialog>
		</div>
</template>

<script>

    export default{
        data() {
			return {
				leftbar: {},
				dataTypes:1,
				importMark: false,
                ticketListSucces: [],
                ticketListNoUpDate:[],
                ticketListNotFound: [],
				ticketList:[],
				fileList: [],
				dialogVisible: false,
                importVisible: false,
                importResult: [],
				taskId : '',
                errorData: [],
				page: {				//分页
                    currentPage: 1,
                    pageSize: 50,
                    totalPage: 1,
                    sizeArr: [50, 100],
                    totalCount: 1
				},
				isEdit: false,
				examId:this.$route.params.id
			};
		},
	    created() {
		    vm.currentRouter = "/examlist";
	    },
		mounted() {
            this.importDetails();
            switch(backUser.level){
                case 'city':
                    if(backExamInfo.examInfo.level == 0 && backUser.type == 'admin'){
                        this.isEdit = true;
                    }
                    break;
                case 'county':
                    if(backExamInfo.examInfo.level == 1 && backUser.type == 'admin'){
                        this.isEdit = true;
                    }
                    break;
                default:
                    if(backExamInfo.examInfo.level == 2 && backUser.type == 'admin'){
                        this.isEdit = true;
                    }
            }
		},
		methods: {
            resetImport() {
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
                // 表格导入成功回调
                this.importMark = false;
                 // 导入准考证 (龚德志) #2017-03-17#
                this.$http.post("/api/servers/importStudentTicket", {
                    body: {
                        aliyunOssFilePath: fileName,
                        examId: this.examId
                    }
                }).then(function(data){
                    data = data.body;
                    if(data.code == 200){
                        this.taskId = data.data;
                        this.importVisible = true;
                        this.importDetails();
                    } else {
                        this.$msgbox("导入失败！");
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });
            },
            importDetails(){
				var param = {
                    examId: this.examId
				};
				var $this = this;
				if(this.taskId){
                    param.taskId =  this.taskId;		//不传查数据库的数据
                }
                // 导入任务的执行结果 (龚德志) #2017-03-17#
                this.$http.post("/api/servers/importExamStudentResult", param).then(function(data){
                    data = data.body;
                    if(data.code == 200){
                        data = data.data;
                        this.importResult = data;
                        this.taskId = data.importTaskId;
                        if(data.taskStatus == "INIT" || data.taskStatus == "PARSER" || data.taskStatus == "LOAD_BASIC_DATA" ||
							data.taskStatus == "VALIDATION_DATA" || data.taskStatus == "PERSISTENCE"){
                            //this.$msgbox("正在解析,请稍等！");
							setTimeout(function(){
                                $this.importDetails();
							},4000);
                        }else if(data.taskStatus == "FAIL" || data.taskStatus == "INTERRUPT" || data.taskStatus =="UPDATE_ERROR"){
                            this.importVisible = false;
                            this.$message({
                                message: data.errorMsg || '数据验证失败',
                                type: 'warning'
                            });
                            this.importMark = true;
                            this.importError();
                            if(data.errorStudentsCount > 0){
                                this.dialogVisible = true;
							}
                        }else if(data.taskStatus == 'COMPLETE'){
                            if(this.importVisible){
                                location.reload();
							}
                            this.importMark = true;
                            this.$set(this.page,"totalCount",this.importResult.successStudentsCount);
                            this.dataType();
                        }
                    } else {
                       // this.$message.error('查询准考证导入详情失败');
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });
            },
            importError() {
                // 查询导入失败的学生列表 (龚德志) #2017-03-17#
                this.$http.post("/api/servers/examStudentListFail", {
                    taskId: this.importResult.importTaskId
                }).then(function(data){
                    data = data.body;log(data);
                    if(data.code==200){
                        this.errorData = data.data;
                    } else {
                        console.warn(data);
                    }
                }, function(error){
                    console.error(error);
                });
            },
            updateErrorData() {
                this.dialogVisible = false;

                var params = [];
                this.errorData.map(function(val){
                    params.push({
                        examNo: val.examNo,
                        idNumber: val.idNumber,
                        name: val.name,
                        rollNo: val.rollNo,
                        schoolCode: val.schoolCode
					});
				});
                // 导入准考证-修改错误数据 (龚德志) #2017-03-17#
                this.$http.post("/api/servers/updateErrorData", {
                    taskId: this.importResult.importTaskId,
					body:{
                        studentList:params
					}
                }).then(function(data){
                    data = data.body;log(data);
                    if(data.code==200){
                        this.importDetails();
                    } else {
                        this.$message.error('修改失败');
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });

            },
			importDataTab(num){
                this.dataTypes = num;
                if(this.importResult.taskStatus == "FAIL"){
                    this.ticketList = [];
                    return;
				}
                if(this.importMark){
                    this.page.currentPage = 1;
                    this.dataType();
				}
			},
			dataType() {
			    var param = {
                    examId: this.examId,
                        pageableDto: {
                        	page: this.page.currentPage,
							size: this.page.pageSize
                    	},
                    taskId: this.taskId
                };
			    switch(this.dataTypes){
					case 1:
                        this.ticketListSuccess(param);
                        this.$set(this.page,'totalCount',this.importResult.successStudentsCount);
					    break;
					case 2:
                        this.ticketListUpdate(param);
                        this.$set(this.page,'totalCount',this.importResult.notUpdateStudentsCount);
						break;
					case 3:
                        this.ticketNotFound(param);
                        this.$set(this.page,'totalCount',this.importResult.notFoundStudentsCount);
					    break;
					default:
					    console.log(1);
				}
			},
			ticketListSuccess(param) {

				// 导入准考证号 - 查看准考证导入情况 - 成功导入名单数据加载
				this.$http.post("/api/servers/ticketListSuccess", {
				   body:param
				}).then(function(data){
                    data = data.body;log(data);
					if(data.code==200){
						data = data.data;
						this.ticketListSucces = data.dataList;
                        this.ticketList = data.dataList;
					} else {
						console.info("返回错误");
					}
				}, function(error){
					console.info("返回失败："+error);
				});
			},
			ticketListUpdate(param) {

				// 导入准考证号 - 查看准考证导入情况 - 未更新准考证数据加载
				this.$http.post("/api/servers/ticketListUpdate", {
                    body:param
				}).then(function(data){
                    data = data.body;log(data);
					if(data.code==200){
						data = data.data;
						this.ticketListNoUpDate = data.dataList;
                        this.ticketList = data.dataList;
					} else {
						console.info("返回错误");
					}
				}, function(error){
					console.info("返回失败："+error);
				});
			},
			ticketNotFound(param) {

                // 导入准考证号 - 查看准考证导入情况 - 未在基础数据找到数据加载
                this.$http.post("/api/servers/ticketListNotFound", {
                    body:param
                }).then(function(data){
                    data = data.body;
                    if(data.code==200){
                        data = data.data;
                        this.ticketListNotFound = data.dataList;
                        this.ticketList = data.dataList;
                    } else {
                        console.info("返回错误");
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });
			},
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.handleCurrentChange(1);
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;
                this.dataType();
            },
            ticketTemplate() {

                // 下载准考证导入模板 (龚德志) #2017-03-17#
                this.$http.post("/api/servers/downloadStudentTemplate", {
                    examId: this.examId
                }).then(function(data){
                    data = data.body;log(data);
                    if(data.code==200){
                        if(data.data){
                            location.href = data.data;
                        }else{
                            this.$message.error('下载模板出错');
                        }
                    } else {
                        console.info("返回错误");
                    }
                }, function(error){
                    this.importMark = false;
                    console.info("返回失败"+error);
                });
            }
		}
    }
</script>

<style scoped>
    .downloadDialog .el-dialog--small{
		width:500px;
	}
	.t-infoBox .el-button{
	    display: block;
		margin: 40px auto 10px;
		width: 220px;
	}
</style>
