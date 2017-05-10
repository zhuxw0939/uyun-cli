<template>
	<div class="upfile_box">
		<el-upload


				:action="upfileData.action"
				:data="upData"
				:on-preview="onPreview"
				:on-remove="onRemove"
				:on-success="onSuccess"
				:on-error="onError"
				:on-progress="onProgress"
				:before-upload="beforeUpload"
				:default-file-list="fileList">{{upfileData.text}}</el-upload>

		<el-dialog title="文件上传中" v-model="uploadIngVisible" top="30%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<div class="upload_percent">
				<el-row :gutter="80">
					<el-col :span="16">
						<el-progress :text-inside="true" :stroke-width="18" :percentage="upPercent"></el-progress>
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
			type: Object,
			default: {
				action: "//jsonplaceholder.typicode.com/posts/",
				text: "点击上传",
				upfileBack: function(file){
				}
			}
		}
	},
	data() {
		return {
			upHeaders: {
				'Content-Type': 'multipart/form-data; boundary=----1487157319551',
				'Access-Control-Allow-Origin': "*",
				'Access-Control-Allow-Methods': "POST, GET, OPTIONS, PUT, DELETE"
			},
			upData: {
				type: 0
			},
			uploadIngVisible: false,  // 上传层
			upPercent: 0, // 上传进度
			upSuccess: false, // 当前文件是否上传成功
			upError: false,
			fileList: []
		}
	},
	created() {
	},
	mounted() {
	},
	methods: {
		// on-preview - function(file)
		// 点击已上传的文件链接时的钩子, 可以通过 file.response 拿到服务端返回数据
		onPreview(file) {
			console.info("onPreview");
			console.log(file);
			console.info(JSON.stringify(file));
		},

		// on-remove - function(file, fileList)
		// 文件列表移除文件时的钩子
		onRemove(file, fileList) {
			console.info("onRemove");
			console.log(file, fileList);
		},

		// on-success - function(response, file, fileList)
		// 文件上传成功时的钩子
		onSuccess(response, file, fileList) {
			console.info("onSuccess");
			//console.log(response, file, fileList);

			this.upSuccess = true;
			setTimeout(() => {
				this.uploadIngVisible = false;
				this.upfileData.upfileBack(file);
			}, 1000);
		},

		// on-error - function(err, response, file)
		// 文件上传失败时的钩子
		onError(err, response, file) {
			console.info("onError");
			console.log(err, response, file);
			this.upError = true;
			setTimeout(() => {
				this.uploadIngVisible = false;
			}, 1000);
		},

		// on-progress - function(event, file, fileList)
		// 文件上传时的钩子
		onProgress(event, file, fileList) {
			console.info("onProgress");
			console.info(event.percent);
			this.upPercent = Math.floor(event.percent);
			//console.log(event, file, fileList);
		},

		// before-upload - function(file)
		// 上传文件之前的钩子，参数为上传的文件，若返回 false 或者 Promise 则停止上传。
		beforeUpload(file) {
			console.info("beforeUpload");
			this.upPercent = 0;
			this.uploadIngVisible = true;
			this.upSuccess = false;
			this.upError = false;
			console.log(file);
		},

		// 取消上传
		onClickCancelUpload() {
			this.upError = false;
			this.upSuccess = false;
			this.uploadIngVisible = false;
			window.location.reload();
			// this.upfileData.cancelUploadBack();
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
