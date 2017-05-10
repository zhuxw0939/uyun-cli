<template>
	<div class="leftbar">
		<div class="_logo">
			<a href="/home">
				<img src="./logo.png" alt="生学教育">
				<span>{{userName}}<br>教学质量监控平台</span>
			</a>
		</div>
		<div class="_menu">
			<el-menu :default-active="currentPage" class="el-menu-vertical-demo" theme="dark" router>
				<el-submenu index="#">
					<template slot="title"><i class="iconfont">&#xe62c;</i>考试概况</template>
					<el-menu-item index="townShipAnalysis?type=4" v-if="userLevel=='city'" @click="town(4)">区市县</el-menu-item>
					<el-menu-item index="townShipAnalysis?type=1" v-if="userLevel=='county'&&examLevel==0" @click="town(1)">区县</el-menu-item>
					<el-menu-item index="townShipAnalysis?type=2" v-if="userLevel=='county'&&(examPhase==2||examPhase==3)&&hasDistinct" @click="town(2)">学区</el-menu-item>
					<el-menu-item index="townShipAnalysis?type=3" v-if="userLevel=='county'&&(examPhase==2||examPhase==3)&&hasTown" @click="town(3)">乡镇</el-menu-item>
					<el-menu-item index="schoolAnalysis" v-if="userType!='schoolCourse' && userType!='schoolTeacher' && examLevel !='2' && examLevel != '3'">学校</el-menu-item>
					<el-menu-item index="classAnalysis" v-if="userLevel=='school'">班级</el-menu-item>
					<el-menu-item index="teacherAnalysis" v-if="userLevel=='school'">任课教师</el-menu-item>
					<el-menu-item index="studentAnalysis" v-if="userLevel=='school'">学生</el-menu-item>
					<el-menu-item index="paperAnalysis" v-if="examType==1">试卷</el-menu-item>
				</el-submenu>
				<el-menu-item index="brother" v-if="userLevel=='school' && (examLevel==0 || examLevel==1)"><i class="iconfont">&#xe62d;</i>兄弟学校对比</el-menu-item>

				<!--校级特优生、踩线生-->
				<el-menu-item index="schoolSpecial" v-if="userLevel=='school' && examLevel!=3"><i class="iconfont">&#xe62e;</i>特优生</el-menu-item>
				<el-menu-item index="schoolStepLine" v-if="userLevel=='school' && examLevel!=3"><i class="iconfont">&#xe62b;</i>踩线生</el-menu-item>

				<!--区县级特优生，踩线生-->
				<el-menu-item index="regionSpecial" v-if="userLevel=='county'"><i class="iconfont">&#xe62e;</i>特优生</el-menu-item>
				<el-menu-item index="regionStepLine" v-if="userLevel=='county'"><i class="iconfont">&#xe62b;</i>踩线生</el-menu-item>

				<el-menu-item index="target" v-if="userLevel=='school' && examLevel !=3 "><i class="iconfont">&#xe62f;</i>目标参照</el-menu-item>
				<el-menu-item index="report"><i class="iconfont">&#xe630;</i>自定义报表</el-menu-item>
			</el-menu>
		</div>
	</div>
</template>

<script>
import "../../static/css/leftbar.css"

export default {
	data() {
		return {
			userName: backUser.name,
			userType: backUser.type,
			userLevel: backUser.level,
			examId: backExamData.id,
			examType: backExamData.type, // type=0普通考试 1网阅考试
			examLevel: backExamData.level, // level=0市 1县 2校 3班
			examPhase: backExamData.phase,
			hasDistinct: backExamData.hasDistinct,
			hasTown: backExamData.hasTown,
			currentPage: "classAnalysis"
		}
	},
	created() {
		let path = this.$route.path.split("/")[2] + (this.$route.query.type?'?type='+this.$route.query.type:'');
		if(path=='StudentDetail'||path=='StudentCompare') path='studentAnalysis';
		this.currentPage = path;
	},
	methods:{
		town(val){
			this.$router.push({path: 'townShipAnalysis', query:{'type':val}});
		}
	}
}
</script>
