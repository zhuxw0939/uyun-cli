<template>
	<div class="exam_dl">
		<div v-if="examList.length>0">
			<dl v-for="item in examList">
				<dt class="hidden">
					<a :href="item.url" target="_blank">
						<img v-if="item.level==3" src="./ex_ban.png">
						<img v-if="item.level==2" src="./ex_xiao.png">
						<img v-if="item.level==1" src="./ex_xian.png">
						<img v-if="item.level==0" src="./ex_shi.png">
						{{item.name}}
					</a>
				</dt>
				<dd class="hidden">
					<span>年级:{{item.gradeName}}</span>
					<span v-if="item.type==0">类型:普通考试</span>
					<span v-if="item.type==1">类型:网阅考试</span>
					<span v-if="item.type==2">类型:网阅考试</span>
					<span>{{item.createAt}}</span>
				</dd>
			</dl>
		</div>
		<div style="padding: 50px; text-align: center; color: #eee" v-else>
			没有数据！
		</div>
	</div>
</template>



<script type="text/ecmascript-6">
	export default {
		props: {
			ajax: {
				type: String,
				default: ""
			},
			count: {
				type: Number,
				default: 6
			}
		},
		data() {
			return {
				userLevel: backUser.level,
				userType: backUser.type,
				examList: []
			}
		},
		mounted() {
			this.ajaxGetList(this.ajax, this.count);
		},
		methods: {
			ajaxGetList(url, count) {
				this.$http.post("/api/servers/"+url, {
					count: count
				}).then(function(data){
					data = data.body;
					console.info(data);
					if(data.code==200 || data.code==204){
						data = data.data;
						for(let item of data){
							// 0-新建考试，1-试卷编辑&上传准考证，3-导入成绩，5-未设置分数线，6-未发布，7-已发布
							if (item.state == 0 || item.state == 1){
								item.url = "/home/editexam/"+item.id+"/ScorePaper";
							} else if (item.state == 3) {
								item.url = "/home/editexam/"+item.id+"/importScore";
							} else if (item.state == 5) {
								item.url = "/home/editexam/"+item.id+"/settingAnalysis";
							} else if (item.state == 6) {
								if (item.level == 3){
									item.url = "/home/editexam/"+item.id+"/editExamTeacher";
								}  else {
									item.url = "/home/editexam/"+item.id+"/editExam";
								}
							} else if (item.state == 7) {
								if (item.level == 0 || item.level == 1){ //市级考试
									if(this.userLevel=="city"){
										// 市级看市级考试
//										item.url = "/analysis/exam/townShipAnalysis?type=4&exam_id="+item.id;
										item.url = "/analysis/"+item.id+"/townShipAnalysis?type=4";
									} else if (this.userLevel=="county") {
										// 区县看市级考试
//										item.url = "/analysis/exam/townShipAnalysis?type=1&exam_id="+item.id;
										item.url = "/analysis/"+item.id+"/townShipAnalysis?type=1";
									} else {
										if(this.userType=="schoolTeacher" || this.userType=="schoolCourse"){
//											item.url = "/analysis/exam/classAnalysis?exam_id="+item.id;
											item.url = "/analysis/"+item.id+"/classAnalysis";
										} else {
//											item.url = "/analysis/exam/schoolAnalysis?exam_id="+item.id;
											item.url = "/analysis/"+item.id+"/schoolAnalysis";
										}
									}
								} else if (item.level == 2 || item.level == 3){ //校级考试或班级考试
//									item.url = "/analysis/exam/classAnalysis?exam_id="+item.id;
									item.url = "/analysis/"+item.id+"/classAnalysis";
								} else {
//									item.url = "/analysis/exam/schoolAnalysis?exam_id="+item.id;
									item.url = "/analysis/"+item.id+"/schoolAnalysis";
								}
							} else {
								item.url = "#";
							}
						}
						this.examList = data;
					} else {
						console.warn("获取考试列表失败："+url);
					}
				}, function(error){
					console.error(error);
					console.error("获取数据失败，请稍候再试！");
				});
			}
		}
	};
</script>


<style lang="stylus" rel="stylesheet/stylus">
.exam_dl
	dl
		border-bottom: 1px solid #e5e5e5
		padding: 15px
		line-height: 25px
		dt
			a
				color: #444
				font-size: 15px
				img
					position: relative
					top: 2px
					margin-right: 5px
		dd
			font-size: 12px
			color: #bbb
			height: 25px
			span
				display: inline-block
				padding-right: 10px
	dl:last-child
		border-bottom 0

</style>



