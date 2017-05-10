<template>
	<div class="box">
		<h6>导入成绩</h6>
		<div class="b-tip fs12">
			<p v-if="examInfo.type==1">
				温馨提示 ：
				<span>1、表格上传的题号需与试卷的题号名称保持一致</span>
				<span>2、下级题号用下划线区分</span>
				<span>3、表格支持dbf、xls</span>
			</p>
		</div>
		<ul class="subjectListBox hiddens" v-show="importMark">
			<li v-for="item in courseArr">
				<template v-if="item.markState==0">
					<svg class="icon iconBox fl" aria-hidden="true">
						<use xlink:href="#icon-weidaoru"></use>
					</svg>
					<div class="fl">
						<h5 class="importStatus">{{ item.courseName }}</h5>
						<el-button size="large" @click="resetImport(item)" v-if="isEdit">导入成绩</el-button>
						<el-button size="large" @click="importTemplate(item)">模板下载</el-button>
					</div>
				</template>
				<template v-if="item.markState==1">
					<svg class="icon iconBox fl" aria-hidden="true">
						<use xlink:href="#icon-chengjizhengzaidaoru"></use>
					</svg>
					<div class="fl">
						<h5>{{ item.courseName }}</h5>
						<span>正在导入成绩</span>
					</div>
				</template>
				<template v-if="item.markState==2">
					<svg class="icon iconBox fl" aria-hidden="true">
						<use xlink:href="#icon-chengjidaoruchucuo"></use>
					</svg>
					<div class="fl">
						<h5>{{ item.courseName }}</h5>
						<p title="表头错误，请手动对应">表头错误，请手动对应</p>
						<el-button size="large" @click="headerError(item)" v-if="isEdit">对应表头</el-button>
						<el-button size="large" @click="resetImport(item)" v-if="isEdit">重新导入</el-button>
					</div>
				</template>
				<template v-if="item.markState==3">
					<svg class="icon iconBox fl" aria-hidden="true">
						<use xlink:href="#icon-chengjidaoruchucuo"></use>
					</svg>
					<div class="fl">
						<h5>{{item.courseName}}</h5>
						<p :title="item.markStateDesc">{{item.markStateDesc}}</p>
						<el-button size="large" @click="resetImport(item)" v-if="isEdit">重新导入</el-button>
					</div>
				</template>
				<template v-if="item.markState==4">
					<svg class="icon iconBox fl" aria-hidden="true">
						<use xlink:href="#icon-chengjidaoruchenggong"></use>
					</svg>
					<div class="fl">
						<h5>{{item.courseName}}</h5>
						<p style="color:#999;">成功导入:{{item.markSuccessNum}}</p>
						<el-button size="large" @click="resetImport(item)" v-if="isEdit">重新导入</el-button>
						<el-button size="large" @click="seeImportData(item)">查看</el-button>
					</div>
				</template>
			</li>
		</ul>
		<div v-show="!importMark">
			<div class="b-tabs hiddens">
				<ul class="b-tabs-btn">
					<li :class="{activeTab:dataTypes==1}" @click="dataType(1)">成功导入名单({{importData.totalCount}})</li>
					<li :class="{activeTab:dataTypes==2}" @click="dataType(2)">未导入名单({{importErrorData.totalCount}})
					</li>
				</ul>
				<ul class="b-tabs-down fr">
					<li @click="scoreImportFail">
						<i class="iconfont">&#xe636;</i>下载未导入人员名单
					</li>
					<li @click="seeImportData" v-if="isEdit">
						<i class="iconfont">&#xe650;</i>返回至导入
					</li>
				</ul>
			</div>
			<div class="tableData">
				<div class="tableBox">
					<table class="sx_table" v-show="dataTypes==1">
						<thead>
						<tr>
							<th v-for="item in importDataHeader">{{item}}</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="items in importData.dataList">
							<td v-for="item in items.dataArr">{{item}}</td>
						</tr>
						</tbody>
					</table>
					<table class="sx_table" v-show="dataTypes==2">
						<thead>
						<tr>
							<th>序号</th>
							<th>学籍号</th>
							<th>姓名</th>
							<th v-if="examInfo.type==1">准考证号</th>
							<th>备注</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="(item,index) in importErrorData.dataList">
							<td>{{index+1 }}</td>
							<td>{{item.rollNo }}</td>
							<td>{{item.name}}</td>
							<td v-if="examInfo.type==1">{{item.examNo}}</td>
							<td>{{item.reason }}</td>
						</tr>
						</tbody>
					</table>
				</div>
				<el-pagination @size-change="handleSizeChange"
							   @current-change="handleCurrentChange"
							   :current-page="page.currentPage"
							   :page-sizes="page.sizeArr"
							   :page-size="page.totalPage"
							   layout="total,sizes, prev, pager, next"
							   :total="page.totalList">
				</el-pagination>
			</div>
		</div>
		<el-dialog class="errorHeader" title="表头对应" v-model="dialogFormVisible">
			<header>温馨提示：你有{{errorHeader.headers.length}}项未对应，请手动对应。</header>
			<ul class="errorHeaderBox">
				<li v-for="items in errorHeader.headers">
				<span>
					<i v-if="items.isMust" class="red">*</i>
					{{items.need}} :
				</span>
					<el-select v-model="items.mapper" clearable placeholder="请选择">
						<el-option
								v-for="item in errorHeader.selectHeaders" :value="item">
						</el-option>
					</el-select>
				</li>
			</ul>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeHeader" size="large">取 消</el-button>
				<el-button type="primary" size="large" @click="scoreSubmitHeader">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
    import ColorIcon from '../../static/colorFull/iconfont.js'

    export default{
        data() {
			return {
				leftbar: {},
                examInfo: backExamInfo.examInfo,
				dataTypes:1,
				courseArr: [],
				importMark:true,
				importData: [],
				importDataHeader: [],
				importErrorData: [],
				dialogFormVisible: false,
                examCourseId: '',
                errorHeader: {
                    headers:[]
				},
				formLabelWidth: '120px',
				page: {				//分页
					currentPage: 1,
					pageSize: 50,
					totalPage: 1,
					sizeArr: [50, 100],
					totalList: 1
				},
				isEdit: false,
				examId:this.$route.params.id
			};
		},
	    created() {
		    vm.currentRouter = "/examlist";
	    },
		mounted() {
            this.scoreImportGetMarkStates();
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
				case 'school':
                    if(backExamInfo.examInfo.level == 2 && backUser.type == 'admin'){
                        this.isEdit = true;
                    }
                default:
                    if((backExamInfo.examInfo.level == 2 && backUser.type == 'admin') ||
						(backExamInfo.examInfo.level == 3 && backUser.type == 'schoolTeacher')){
                        this.isEdit = true;
                    }
            }
     		setTimeout(function(){
            	var browserWidth = window.innerWidth;
            	var $dom = document.querySelectorAll(".subjectListBox");
            	var cdom = [];
            	if($dom[0]){
            		cdom = $dom[0].querySelectorAll("li");
            	}
            	var len = cdom.length;
				var wids = "25%";
				if(browserWidth < 1600){
					wids = "33%";
				}
				if(len>0){
					for(let i=0;i<len;i++){
						cdom[i].style.width = wids;
					}
				}
			},300);
		},

		methods: {
			dataType(num) {
				this.dataTypes = num;
				this.page.currentPage = 1;
				this.switchScoreTab();
			},
			switchScoreTab(){
                if(this.dataTypes == 1){
                    this.scoreImportListSuccess();
                }else{
                    this.scoreImportListFail();
                }
			},
			importTemplate(item) {
                // 下载成绩导入模板 (陈显官) #2017-03-22#
                this.$http.post("/api/servers/scoreImportDownloadTemplate", {
                    examId: this.examId,
                    examCourseId: item.examCourseId
				}).then(function(data){
                    data = data.body;log(data);
					if(data.code==200){
						data = data.data;
						location.href = data;
					} else {
                        this.$message('下载成绩导入模板失败');
					}
				}, function(error){
					console.info("返回失败："+error);
				});
			},
            scoreImportGetMarkStates() {
			    var $this = this;
                // 查询成绩导入状态 (陈显官) #2017-04-05#
                this.$http.post("/api/servers/scoreImportGetMarkStates", {
                    examId: this.examId
                }).then(function(data){
                    data = data.body;
                    if(data.code==200){
                        data = data.data;
                        this.courseArr = data;	//markState: 成绩导入状态: 0-未导入 1-导入中 2-表头不符 3-未知异常 4-已导入
                        var examState = data[0].examState;
						if (examState == 3) {
							localStorage.setItem('reloadMark',"5");
							setTimeout(function () {
								if($this.$route.path.indexOf("importScore") > -1){
									$this.scoreImportGetMarkStates();
								}
							}, 2000);
						}else if(examState==5){
							if(localStorage.getItem("reloadMark") == "5"){
								localStorage.setItem("reloadMark","4")
                                location.reload();
							}
						}
                    }
                }, function(error){
                    console.error(error);
                });
			},
            resetImport(item) {
                this.examCourseId = item.examCourseId;
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

                // 导入成绩 (陈显官) #2017-03-22#
                this.$http.post("/api/servers/scoreImport", {
                    body: {
						examId: this.examId,
						examCourseId: this.examCourseId,
						fileRemotePath: fileName
                	}
				}).then(function(data){
				    data = data.body;
					if(data.code ==200){

					} else {
                        this.$message.error("导入出错");
					}
				}, function(error){
					console.info("返回失败：");
				});
            },
			seeImportData(item) {
			    this.importMark = !this.importMark;
			    this.examCourseId = item.examCourseId;
			    if(!this.importMark){
					this.scoreImportListHeader();
					this.scoreImportListFail();
				}
			},
			scoreImportFail() {
                // 下载未导入成绩的人员名单 (陈显官) #2017-03-22#
                this.$http.post("/api/servers/scoreImportFail", {
                    examId: this.examId,
                    examCourseId: this.examCourseId
                    }).then(function(data){
                    data = data.body;
					if(data.code==200){
						if(data.data){
						    location.href= data.data;
						}else{
                            this.$message.error('没有未导入人员');
						}
					} else {
                        this.$message.error('下载出错');
					}
				}, function(error){
					console.info("返回失败：");
				});
			},
			scoreImportListHeader() {
			    var param = {
                    examId: this.examId,
                    examCourseId: this.examCourseId
                };
				// 查询导入成功的学生成绩列表表头
				this.$http.post("/api/servers/scoreImportListHeader",param).then(function(data){
                    data = data.body;
					if(data.code==200){
						this.importDataHeader = data.data;
					} else {
                        this.importDataHeader = [];
                        this.$message.error('表头查询失败');
					}
                    this.scoreImportListSuccess();
				}, function(error){
                    this.$message.error('表头查询失败');
				});
			},
			scoreImportListSuccess() {
			    var param = {
                    examId: this.examId,
                    examCourseId: this.examCourseId,
                    pageableDto: {
                        page: this.page.currentPage,
                        size: this.page.pageSize
                    }
                };
                // 查询导入成功的学生成绩列表 (陈显官) #2017-03-22#
                this.$http.post("/api/servers/scoreImportListSuccess",{body:param} ).then(function(data){
				    data = data.body;log(data);
					if(data.code==200){
						data = data.data;
						if(data) this.importData = data;
                        this.$set(this.page,'totalList',this.importData.totalCount);
					} else {
                        this.importData = [];
                        this.$set(this.page,'totalList',1);
						console.info("返回错误");
					}
				}, function(error){
					console.info("返回失败："+error);
				});
			},
			scoreImportListFail() {

				// 查询导入失败的学生列表
				this.$http.post("/api/servers/scoreImportListFail",{
					body: {
                        examId: this.examId,
                        examCourseId: this.examCourseId,
                        pageableDto: {
                            page: this.page.currentPage,
                            size: this.page.pageSize
                        }
                    }
				}).then(function(data){
                    data = data.body;log(data);
					if(data.code==200){
						data = data.data;
						this.importErrorData = data;
                        this.$set(this.page,'totalList',this.importErrorData.totalCount);
					} else {
                        this.importErrorData = [];
                        this.$set(this.page,'totalList',1);
						console.info("返回错误");
					}
				}, function(error){
					console.info("返回失败："+error);
				});
			},
            scoreImportErrorHeader() {				 // 查询不符合的表头情况 (陈显官) #2017-03-22#
			    var param = {
                    examCourseId: this.examCourseId,
                    examId: this.examId
				};
                this.$http.post("/api/servers/scoreImportErrorHeader", param).then(function(data){
                    data = data.body;log(data);
                    if(data.code==200){
                         data = data.data;
                         data.headers.map(function(val){
                             val.mapper = '';
                         });
                         this.errorHeader = data;
                         this.dialogFormVisible = true;
                    } else {
                        this.errorHeader = {
                        	headers:[]
                        };
                        console.info("返回错误");
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });

            },
			headerError(item) {
				this.examCourseId = item.examCourseId;
				this.scoreImportErrorHeader();
			},
			closeHeader() {
				this.dialogFormVisible = false;
			},
            scoreSubmitHeader() {
			    var mark = true;
                for(var i=0,len=this.errorHeader.headers.length;i<len;i++){
                    if(this.errorHeader.headers[i].isMust && !this.errorHeader.headers[i].mapper){
                        mark = false;
                        this.$message({
                            showClose: true,
                            message: '请把表头对应完整!',
                            type: 'error'
                        });
                        break;
                    }
				}
				if(!mark) return;
				var param = {
                    examCourseId: this.examCourseId,
                    examId: this.examId,
                    mappers: this.errorHeader.headers
                };
                // 导入成绩时提交缺失表头的对应数据 (陈显官) #2017-03-22#
                this.$http.post("/api/servers/scoreSubmitHeader", {
                    body:param
                }).then(function(data){
                    data = data.body;log(data);
                    if(data.code==200){

                    } else {
                        this.$message.error('提交缺失表头的对应数据查询失败');
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });

                this.closeHeader();
			},
            handleSizeChange(val) {
                this.page.pageSize = val;
                this.page.currentPage = 1;
                this.handleCurrentChange(1);
            },
            handleCurrentChange(val) {
                this.page.currentPage = val;log(val);
                this.switchScoreTab();
            }
		}
    }

</script>

<style scoped>
	.icon {
	   width: 1em; height: 1em;
	   vertical-align: -0.15em;
	   fill: currentColor;
	   overflow: hidden;
	}
	.box h6{
		border-bottom:1px solid #e5e5e5;
		padding:0 30px;
		line-height:50px;
		color:#333;
		font-weight:600;
	}
	.b-tabs .el-select{
		margin-right:20px;
		float:left;
	}
	.b-tabs .el-input__inner{
		height:40px;
	}
	.subjectListBox{
		padding:0 30px;
	}
	.subjectListBox li{
		float:left;
		width:25%;
		margin:30px 0 30px 0;
	}
	.subjectListBox .iconBox{
		width: 120px;
		height: 160px;
	}
	.subjectListBox li>div{
		margin:20px 0 0 0;
		width:216px;
	}
	.subjectListBox li>div p{
		margin-bottom:28px;
		color:#f00;
		width: 90%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.subjectListBox li>div h5+button{
		margin-top:48px;
	}
	.subjectListBox li>div h5+span{
		display:block;
		margin:36px 0 10px 0;
	}
	.subjectListBox .el-button{
		color:#05bffc;
		border-color:#05bffc;
		width:100px;
	}
	.subjectListBox .el-progress{
		width:180px;
	}
	.wrapper .el-dialog--small{
		width:800px;
	}
	.errorHeader .el-dialog__body{
		padding:30px;
	}
	.errorHeader .el-dialog__body header{
		margin-bottom:30px;
		line-height:40px;
		border:1px solid #e5e5e5;
		background:#fefdf7;
		text-indent: 10px;
	}
	.errorHeader li{
		margin-bottom:10px;
	}
	.errorHeader li span{
		display:inline-block;
		width:33%;
		text-align:right;
	}
	.errorHeader li .el-select{
		width:42%;
	}
	.upfile_box{
		color: #05bffc;
		border: 1px solid #05bffc;
		width: 100px;
		border-radius:3px;
		line-height:38px;
		text-align:center;
		cursor:pointer;
	}
	.errorHeaderBox{
		height:500px;
		overflow-y:auto;
	}

</style>
