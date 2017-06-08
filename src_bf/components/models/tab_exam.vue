<template>
	<nav class="examTab">
		<a href="#" :class="{active:activeTab==0,complete:examId}" @click="activeNav(0,$event)"  :style="{width:awidth}">
			<i class="iconfont">&#xe642;</i>创建考试
		</a>
		<a href="#" :class="{active:activeTab==1,complete:examId}" @click="activeNav(1,$event)"
		   :style="{width:awidth}" v-if="examInfo.type==1">
			<i class="iconfont">&#xe643;</i>编辑双向细目表 / 导入准考证号
		</a>
		<a href="#" :class="{active:activeTab==2,complete:state>1}" @click="activeNav(2,$event)"  :style="{width:awidth}">
			<i class="iconfont">&#xe644;</i>导入成绩
		</a>
		<a href="#" :class="{active:activeTab==3,complete:state>3}" @click="activeNav(3,$event)"  :style="{width:awidth}">
			<i class="iconfont">&#xe645;</i>分析设置
		</a>
	</nav>
</template>

<script type="text/ecmascript-6">

	export default {
		data() {
			return {
				awidth: 0,
				examInfo:{
				    type: 1
				},
				activeTab: 0,
				user:backUser,
				state: 0,
				examId:this.$route.params.id
			}
		},
		created() {
			var $this = this;
			if(this.examId){
				this.examInfo = backExamInfo.examInfo;
				this.state = this.examInfo.state;
			}
			setTimeout(function(){
				$this.tabWidth();
			},120);
			setTimeout(function(){
				$this.tabWidth();
			},500);
			var path = this.$route.path;
			if(path.indexOf('editExam') > -1 || path.indexOf('createExam') > -1){
				this.activeTab = 0;
			}else if(path.indexOf('scorePaper') > -1 || path.indexOf('importTicket') > -1){
				this.activeTab = 1;
			}else if(path.indexOf('importScore') > -1){
				this.activeTab = 2;
			}else{
				this.activeTab = 3;
			}
		},
		methods:{
			tabLocation (path) {
				var isIe9 = false;
				if(navigator.userAgent.indexOf("MSIE 9.0")>0){
					isIe9 = true;
				}
				if(isIe9){
					location.href = "/home/editexam/"+this.examId+'/'+path;
				}else{
					this.$router.push({path: path});
				}
			},
			activeNav:function(index,event){
			    if(this.examId){
					switch(index){
						case 0:
							let path = 'editExam';
							if(this.examInfo.level == 3){
								path =  'editExamTeacher';
							}
							this.tabLocation(path);
							//this.$router.push({path: path});
							this.activeTab = index;
							break;
						case 1:
							this.tabLocation('scorePaper');
							//this.$router.push({path: 'scorePaper'});
							this.activeTab = index;
							break;
						case 2:
							if(this.state > 1){
								this.tabLocation('importScore');
								//this.$router.push({path: 'importScore'});
								this.activeTab = index;
							}else{
								this.dislogs('请先编辑双向细目表/导入准考证号');
							}
							break;
						case 3:
							if(this.state > 3){
								this.tabLocation('settingAnalysis');
								//this.$router.push({path: 'settingAnalysis'});
								this.activeTab = index;
							}else if(this.state == 3){
								this.dislogs('请先导入成绩');
							}else{
								this.dislogs('请先编辑双向细目表/导入准考证号');
							}
							break;
						default:
							this.activeTab = index;
					}
				}else{
			        if(event.target.innerHTML.indexOf("创建考试") == -1){
						this.dislogs('请先创建考试');
					}
				}
			},
			tabWidth() {
				var tabBox = document.querySelectorAll(".examTab")[0];
				var adom = tabBox.querySelectorAll("a");
				var len = adom.length;
				this.awidth = 100/len+'%';
			},
			dislogs(name) {
				this.$message({
					message: name,
					type: 'warning'
				});
			}
		}
	};
</script>

<style scoped>
	.examTab{
	    overflow:hidden;
		padding-bottom: 20px;
	}
	.examTab a{
    	float:left;
		text-align:center;
		line-height:60px;
		color:#bebebe;
		position:relative;
		background-color:#fff;
	}
	.examTab a.complete{
		color:#666;
	}
	.examTab a:nth-child(n+2):before{
		content:'';
		width:36px;
		top:0;
		position:absolute;
		bottom:0;
		left:0;
		z-index:10;
		background:url('/img/tab-white.png') no-repeat;
		background-color:#eee;
	}
	.examTab a:after{
		content:'';
		border:10px solid #fff;
		position:absolute;
		bottom:0;
		left:48%;
		z-index:10;
	}
	.examTab a.active{
		color:#05bffc;
	}
	.examTab a.active:after{
		border-left:10px solid #eaedf1;
		border-right:10px solid #eaedf1;
		border-bottom:10px solid #eaedf1;
		bottom:-20px;
	}
	.examTab a i{
		margin-right:4px;
	}
</style>
