<template id="js_hello">
	<div class="box">
		<h4>考试统计</h4>
		<div>
			<p>
				<el-button>默认按钮</el-button>
<el-button type="primary">主要按钮</el-button>
<el-button type="text">文字按钮</el-button>
			</p>
			<p>
				<el-button type="text" @click="dialogVisible = true">点击打开 Dialog</el-button>
				<el-dialog title="提示" v-model="dialogVisible" size="tiny">
				  <span>这是一段信息</span>
				  <span slot="footer" class="dialog-footer">
				    <el-button @click="dialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
				  </span>
				</el-dialog>
			</p>
			<p>
				<el-progress type="circle" :percentage="0"></el-progress>
				<el-progress type="circle" :percentage="cirs"></el-progress>
				<el-progress type="circle" :percentage="100" status="success"></el-progress>
				<el-progress type="circle" :percentage="50" status="exception"></el-progress>
			</p>
			<p>{{examData}}</p>
			<p>{{examData.typeA}}</p>
		</div>
	</div>
</template>



<script type="text/ecmascript-6">




	export default {
		props: {
			examData: {
				type: Object,
				default: {
					typeA: 0,
					typeB: 0,
					typeC: 0,
					typeD: 0
				}
			}
		},
		data() {
			return {
				dialogVisible: false,
				cirs: 60
			};
		}
	};
</script>


<style>
</style>



