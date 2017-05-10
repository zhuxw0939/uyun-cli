<template>
	<div class="top">
		<el-row>
			<el-col :span="12">
				<h3>{{curtitle}}</h3>
			</el-col>
			<el-col :span="6" :offset="6">
				<el-button v-if="other!==true" icon="plus" @click="openwin">新增</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<style>
	.top h3{
		font-size: 15px;
		font-weight: bold;
		margin: 10px 0;
	}
	.top{
		padding: 0 30px;
		background: #f9fafc;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		margin-bottom: 1px;
	}
	.top .el-button{
		float: right;
		padding: 0;
		border: 0;
		margin-top: 15px;
	}
</style>
<script type="text/ecmascript-6">
	export default{
	    props: ["curtitle", "other", "editwin"],
	    data(){
	        return{}
		},
		methods: {
			openwin(){
				this.editwin.isshow = true;
				this.editwin.curtitle = "新增"+this.curtitle;
			}
		}
	}
</script>
