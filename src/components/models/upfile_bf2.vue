<template>
	<div class="upfile_box">
		<font id="selectfiles" v-if="upfileData.button"><el-button :type="upfileData.button">{{upfileData.text}}</el-button></font>
		<font id="selectfiles" v-else>{{upfileData.text}}</font>

		<div style="display: none">
			<form name=theform>
				<input type="radio" name="myradio" value="local_name"/> 上传文件名字保持本地文件名字
				<input type="radio" name="myradio" value="random_name" checked=true /> 上传文件名字是随机文件名, 后缀保留
			</form>
			<div id="ossfile">你的浏览器不支持flash,Silverlight或者HTML5！</div>
			<div id="container">
				<a id="postfiles" href="javascript:void(0);" class='btn'>开始上传</a>
			</div>
			<pre id="console"></pre>
		</div>

		<el-dialog title="上传文件" v-model="upfileData.uploadIngVisible" top="30%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<div class="upload_percent">
				<el-row :gutter="80">
					<el-col :span="16">
						<el-progress :text-inside="true" :stroke-width="18" :percentage="Number(upfileData.upPercent)"></el-progress>
					</el-col>
					<el-col :span="8">
						<el-button v-if="!upSuccess&&!upError" type="small" @click="onClickCancelUpload">&nbsp;&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
						<span class="upsuccess" v-if="upSuccess"><i class="el-icon-check"></i>上传成功</span>
						<span class="uperror" v-if="upError"><i class="el-icon-close"></i>上传失败</span>
					</el-col>
				</el-row>
			</div>
		</el-dialog>

	</div>
</template>



<script type="text/ecmascript-6">

export default {
	props: {
		upfileData: {
			uploadIngVisible: false,
			upPercent: 0,
			text: "点击上传",
			onComplete(up, file, info, fileName) {
			},
			onSuccess(fileName) {
			},
			cancelUpFile() {
			}
		}
	},
	data() {
		return {
			// 当前文件是否上传成功
			upSuccess: false,
			// 是否有错误
			upError: false,
			// key
			upKey: ""
		}
	},
	created() {
	},
	mounted() {
	},
	methods: {
		upFileStart(key) {
			$("#selectfiles").click();
			if(!key){
				this.upKey = "";
			} else {
				this.upKey = key;
			}
		},
		onComplete(up, file, info, fileName) {
//			console.info(JSON.stringify(up));
//			console.info(JSON.stringify(file));
//			console.info(JSON.stringify(info));
//			console.info(fileName);
			if (info.status == 200) {
				// 成功
				this.upSuccess = true;
				setTimeout(() => {
					this.upfileData.uploadIngVisible = false;
					this.upfileData.onSuccess(fileName, up.settings.url+"/", this.upKey);
					// this.upfileData.onSuccess(up.settings.url+"/"+fileName);
				}, 1000);
			} else {
				this.upError = true;
//				console.info(info.response);
			}
		},
		// 取消上传
		onClickCancelUpload() {
			this.upError = false;
			this.upSuccess = false;
			this.upfileData.uploadIngVisible = false;
			// window.location.reload();
			this.upfileData.cancelUpFile();
		}
	}
};
</script>



<style lang="stylus" rel="stylesheet/stylus">
.upfile_box
	display inline-block
	.el-upload
		width auto!important

.el-upload
	.el-upload__files
		display none
		position absolute
		bottom 100px
		right 50px
		border 1px solid red

.upload_percent
	padding 60px 0 70px 15%
	.el-progress
		margin-top 5px
	span.upsuccess
		line-height 28px
		color #13ce66
	span.uperror
		line-height 28px
		color #ff4949

</style>