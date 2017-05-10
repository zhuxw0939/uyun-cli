<template>
	<div class="leftbar">
		<div class="_logo">
			<a href="/">
				<img src="./logo.png" alt="生学教育">
				<span>{{userName}}<br>教学质量监控平台</span>
			</a>
		</div>
		<div class="_menu">
			<el-menu :default-active="currentPage" class="el-menu-vertical-demo" theme="dark" router>
				<el-menu-item index="/"><i class="iconfont">&#xe632;</i>首页</el-menu-item>
				<el-menu-item index="/examlist"><i class="iconfont">&#xe633;</i>考试列表</el-menu-item>
				<el-submenu index="#" v-if="isAdmin">
					<template slot="title"><i class="iconfont">&#xe634;</i>设置</template>
					<el-menu-item index="/setDepartment" v-if="isSchoolAdmin">学部管理</el-menu-item>
					<el-menu-item index="/setClass" v-if="isSchoolAdmin">班级层次管理</el-menu-item>
					<el-menu-item index="/setOther" v-if="isSchoolAdmin">其他设置</el-menu-item>
					<el-menu-item index="/setRegion" v-if="isCountryAdmin">学区管理</el-menu-item>
					<el-menu-item index="/setCountry" v-if="isCountryAdmin">乡镇管理</el-menu-item>
					<el-menu-item index="/setSchool" v-if="isCountryAdmin">学校管理</el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
	</div>
</template>

<script>
import "../../static/css/leftbar.css"

export default {
	props: {
		currentRouter: {
			type: String,
			deafult: ""
		}
	},
	data() {
		return {
			userName: backUser.name,
			userLevel: backUser.level,
			userType: backUser.type,
			isAdmin: false, //是否是校级或校级成绩管理员
			isSchoolAdmin: false, //是否是校级成绩管理员
			isCountryAdmin: false, //是否是县级成绩管理员
			currentPage: "/"
		}
	},
	watch: {
		'currentRouter': 'currentRouterChange'
	},
	created() {
		//校级或校级成绩管理员
		if((this.userLevel == 'school' && this.userType == 'admin') || (this.userLevel == 'county' && this.userType == 'admin')){
			this.isAdmin = true;
		}else {
			this.isAdmin = false;
		}
		//校级成绩管理员
		if(this.userLevel == 'school' && this.userType == 'admin'){
			this.isSchoolAdmin = true;
		}else {
			this.isSchoolAdmin = false;
		}
		//县级成绩管理员
		if(this.userLevel == 'county' && this.userType == 'admin'){
			this.isCountryAdmin = true;
		}else {
			this.isCountryAdmin = false;
		}

		let path = this.$route.path;
		if(path=="/examlist" || path=="/setDepartment" || path=="/setClass" || path=="/setOther" || path=="/setRegion" || path=="/setCountry" || path=="/setSchool"){
			this.currentPage = path;
		} else if(path!="/") {
			this.currentPage = "/examlist";
		}
	},
	methods: {
		currentRouterChange() {
			if(this.currentRouter){
				this.currentPage = this.currentRouter;
			}
		}
	}
}
</script>
