<template>
	<div class="examlist">
		<div class="loading listnodata" v-if="searchoption.loading == true">
			加载中...
		</div>
		<div v-else>
			<div v-if="searchoption.list.length > 0">
				<div class="examrecord" v-for="(item, index) in searchoption.list">
					<el-row :gutter="20">
						<el-col :span="15">
							<div class="info">
								<!--level (integer, optional):考试级别: 0-市级考试; 1-县级考试; 2-校级考试; 3-班级考试. ,-->
								<span v-if="item.level == 3" class="classes">班</span>
								<span v-else-if="item.level == 2" class="school">校</span>
								<span v-else-if="item.level == 1" class="country">县</span>
								<span v-else="item.level == 0" class="city">市</span>
								<h3>
									<a v-if="item.state==7" :href="titleLink(item)" target="_blank">{{item.name}}</a>
									<div v-else>
										<a v-if="(item.state == 6) && (item.prelink == false)" @click="unfinished = true">{{item.name}}</a>
										<a v-else :href="titleLink(item)">{{item.name}}</a>
									</div>
								</h3>
							</div>
							<div class="detail">
								<span>年级：{{item.gradeName}}</span>
								<span v-if="item.level == 0 || item.level == 1">参考学校：{{item.schoolCount}}所</span>
								<span v-if="item.level == 2 || item.level == 3">参考班级：{{item.classCount}}个</span>
								<span>考试时间：{{item.startTime}}</span>
								<span>状态：
									<!-- 0-新建考试，1-试卷编辑&上传准考证，3-导入成绩，5-未设置分数线，6-未发布，7-已发布 -->
									<span v-if="item.state == 0 || item.state == 1 || item.state == 3">
										{{item.stateDetail.desc}}
										<el-tooltip placement="right" effect="light">
										  <div slot="content">
											  <label v-if="item.stateDetail.finishCourseNames">
												   已完成：{{item.stateDetail.finishCourseNames.toString()}}<br/>
											  </label>
											  <label v-if="item.stateDetail.unFinishCourseNames">
												  未完成：{{item.stateDetail.unFinishCourseNames.toString()}}
											  </label>
										  </div>
										  <i class="iconfont">&#xe624;</i>
										</el-tooltip>
										<label v-if="(item.type == 1 && item.state == 0) || (item.hasUploadRollno == false)">未导入准考证号</label>
									</span>
									<span v-if="item.state == 5">未设置分数线</span>
									<span v-if="item.state == 6">未发布</span>
									<span v-if="item.state == 7">已公布</span>
								</span>
							</div>
						</el-col>
						<el-col :span="9">
							<div class="states">
								<span  v-if="item.state == 0 || item.state == 1">
									<span v-if="item.type == 0"> <!--普通考试-->
										<el-button type="primary"  @click="editExam('importScore',item.id)">导入成绩</el-button>
									</span>
									<span v-if="item.type == 1"> <!--网阅考试-->
										<span v-if="user!='schoolCourse' && user!='teachingStaff'">
											<el-button type="primary"  @click="editExam('importTicket',item.id)">导入准考证号</el-button>
										</span>
										<el-button type="primary"  @click="editExam('scorePaper',item.id)">编辑双向细目表</el-button>
									</span>
								</span>
								<span  v-if="item.state == 3">
									<el-button type="primary"  @click="editExam('importScore',item.id)">导入成绩</el-button>
								</span>
								<span  v-if="item.state == 5">
									<el-button type="primary"  @click="editExam('settingAnalysis',item.id)">分析设置</el-button>
								</span>
								<span  v-if="item.state == 6">
									<a :href="item.prelink" target="_blank"><el-button type="primary" @click="isPre(item.prelink)">成绩预览</el-button></a>
									<el-button type="primary"  @click="changeState(item.id)">发布成绩</el-button>
								</span>
								<span  v-if="item.state == 7">
									<el-button type="primary"  @click="analysis(item.id, item.level, item.phase)">成绩分析</el-button>
								</span>
							</div>
						</el-col>
					</el-row>
				</div>
				<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page="searchoption.currentPage"
						:page-sizes="[10, 20, 50]"
						:page-size="searchoption.pageSize"
						layout="total, sizes, prev, pager, next"
						:total="searchoption.totalCount">
				</el-pagination>
			</div>
			<div class="listnodata" v-else>
				暂无数据
			</div>
		</div>

		<el-dialog title="提示" v-model="publish" size="tiny">
			<span class="contip">是否确认发布成绩？</span><br/>
			<span class="notice">注：发布成绩后所有人员均能看到该次考试成绩</span>
			<span slot="footer" class="dialog-footer">
			<el-button @click="publish = false">取 消</el-button>
			<el-button type="primary" @click="publishExam">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="提示" v-model="pubsucc" size="tiny">
			<span class="contip">恭喜您，成绩发布成功！</span>
			<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="pubsucc = false">确 定</el-button>
		  </span>
		</el-dialog>
		<el-dialog title="提示" v-model="unfinished" size="tiny">
			<span class="contip">成绩还未计算完成，请稍后查看！</span>
			<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="unfinished = false">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<style>
	.loading{
		color: #8d8d8d;
	}
	.listnodata{
		text-align: center;
		padding: 150px 0;
	}
	.detail span label{
		display: inline-block;
	}
	.info h3 a{
		color: #333;
	}
	.info h3 a:hover{
		cursor: pointer;
	}
	.info h3 a:hover{
		color: #20a0ff;
	}
	.contip, .notice{
		text-align: center;
		font-size: 15px;
		display: block;
		width: 100%;
	}
	.notice{
		font-size: 12px;
	}
	.el-pagination{
		text-align: center;
	}
	.detail .iconfont{
		color: #4db3ff;
		font-weight: bold;
		font-size: 15px;
		margin: 0 4px;
	}
	.statetip{
		border: 1px solid #4db3ff;
	}
	.examrecord{
		background: #f9fafc;
		padding: 24px 15px 23px;
		border-radius: 6px;
		margin: 20px 0;
	}
	.info span{
		display: inline-block;
		padding: 0 2px;
		border-radius: 2px;
		color: #fff;
		margin-right: 6px;
		font-size: 12px;
	}
	.info .classes{
		background: #55d2ad;
	}
	.info .school{
		background: #dfb675;
	}
	.info .country{
		background: #4babe8;
	}
	.info .city{
		background: #b386dc;
	}
	.info h3{
		display: inline-block;
		font-size: 17px;
	}
	.states button{
		float: right;
		font-size: 13px;
		margin-left: 10px;
		padding: 18px 0 17px;
		width: 170px;
		display: inline-block;
	}
	.detail{
		margin-top: 6px;
	}
	.detail span{
		color: #c5c5c5;
		margin-right: 30px;
		font-size: 13px;
	}
	.el-tooltip__popper.is-light{
		border: 1px solid #4db3ff;
	}
	.el-tooltip__popper {
		font-size: 12px;
		line-height: 1.6;
	}
	body .el-button--primary{
		background: #019ce7;
	}
</style>

<script type="text/ecmascript-6">
	export default {
		props: ['searchoption'],
		mounted(){},
		data() {
			return {
				publish: false,
				pubExamId: '',
				pubsucc: false,
				unfinished: false,
				isShowExport: true,
				appLevel: backUser.level,//系统级别，市级、县级、校级
				user: backUser.type
			};
		},
		methods: {
			isPre(link){
				if(link == false){
					this.unfinished = true;
				}
			},
			titleLink(row){
				if(row.state == 7){
					return "/analysis/"+row.id+"/examInformation";
				}else {
					if(this.user == 'admin'){ //成绩管理员-编辑考试
						return "/home/editexam/"+row.id+"/editExam";
					}else if(this.user == 'schoolTeacher'){ //学校老师-编辑考试
						return "/home/editexam/"+row.id+"/editExamTeacher";
					}
				}
			},
			editExam(url, id){
			   // console.log('/editexam/'+id+'/'+url);
				//this.$router.push('/editexam/'+id+'/'+url);
				 location.href = '/home/editexam/'+id+'/'+url;
			},
			//成绩分析
			analysis(id, level, phase) {
				// level :考试级别: 0-市级考试; 1-县级考试; 2-校级考试; 3-班级考试.
				// phase :学段：1-学前;2-小学;3-初中;4-高中;5-中职;6-其它. ,
				if(this.appLevel == "city"){//市级
					window.open("/analysis/"+id+"/townShipAnalysis?type=4"); //打开成绩分析-区市县
				}else if(this.appLevel == "school"){//校级
					if(level == 2 ||  level == 3 || this.user == "schoolTeacher" || this.user == "schoolCourse"){//校级考试、班级考试、学校老师、学科组长
						window.open("/analysis/"+id+"/classAnalysis"); //打开成绩分析-班级
					}else {
						window.open("/analysis/"+id+"/schoolAnalysis");//打开成绩分析-学校
					}
				}else if(this.appLevel == "county"){//县级
					if(level == 1){//县级考试
						if(this.searchoption.hasDistinct == true && (phase == 2 || phase == 3)){//有学区，小学或初中
							window.open("/analysis/"+id+"/townShipAnalysis?type=2"); //打开成绩分析-学区
						}else {
							if(this.searchoption.hasTown == true && (phase == 2 || phase == 3)){//有乡镇，小学或初中
								window.open("/analysis/"+id+"/townShipAnalysis?type=3"); //打开成绩分析-乡镇
							}else {
								window.open("/analysis/"+id+"/schoolAnalysis");//打开成绩分析-学校
							}
						}
					}else if(level == 0){ //市级考试
						window.open("/analysis/"+id+"/townShipAnalysis?type=1"); //打开成绩分析-区县
					}
				}
			},
			changeState(id){
				this.publish = true;
				this.pubExamId = id;
			},
			publishExam(){
				// 发布成绩 (陈显官) #2017-03-02#
				this.$http.post("/api/servers/ExamQueryApi_publish", {
					examId: this.pubExamId
				}).then(function(data){
					data = data.body;
					if(data.code == 200 && data.success == true){
						this.pubsucc = true;
						this.publish = false;
						this.$emit('loadlist');
					}else {
						this.publish = false;
						this.unfinished = true;
					}
				}, function(error){
					console.info("返回失败："+error);
					this.$message.error('发布成绩接口错误!');
				});
			},
			handleSizeChange(val) {
				this.searchoption.pageSize = val;
				this.$emit('loadlist');
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.searchoption.currentPage = val;
				this.$emit('loadlist');
				console.log(`当前页: ${val}`);
			}
		}
	}
</script>
