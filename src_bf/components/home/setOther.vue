<template>
	<div class="_center">
		<top curtitle="其他设置" :other="true"></top>
		<div class="other">
			<span class="tip">是否隐藏学生端及家长端市级/区县级（包括学区）考试超越率</span>
			<el-radio-group v-model="showRatio">
				<el-radio :label="1">是</el-radio>
				<el-radio :label="0">否</el-radio>
			</el-radio-group>
			<el-button style="margin-left: 30px;" type="primary" @click="saveOther">保存</el-button>
		</div>
	</div>
</template>

<script type="text/ecmascript-6">

	import '../set/set.css'
	import Top from '../set/top'

    export default{
		components: {Top},
		data(){
			return {
				showRatio: "",
				orgId: backUser.orgId
			};
		},
		mounted(){
			this.search();
		},
		methods:{
			search(){
				// 查询学校超越率显示设置 (郑强) #2017-03-01#
				this.$http.post("/api/servers/searchOther").then(function(data){
					data = data.body;
					console.info("查询学校超越率："+JSON.stringify(data));
					if(data.code == 200 && data.success == true){
						this.showRatio = data.data.showRatio;
					}else {
						this.$message.error('加载学校超越率接口返回失败!');
					}
				}, function(error){
					this.$message.error('加载学校超越率接口错误!');
					console.info("返回失败："+error);
				});
			},
			saveOther(){
				// 保存学校超越率显示设置 (郑强) #2017-03-01#
				this.$http.post("/api/servers/ExamHideRatioRuleApi_create", {
					body: {
						"orgId": this.orgId,
						"showRatio": this.showRatio
					}
				}).then(function(data){
					data = data.body;
					console.log("保存超越率："+JSON.stringify(data));
					if(data.code == 200 && data.success == true){
						this.$message({
							message: '保存成功!',
							type: 'success'
						});
					}else {
						this.$message.error('保存失败!');
					}
				}, function(error){
					this.$message.error('接口错误！');
				});
			}
		}
    }
</script>
