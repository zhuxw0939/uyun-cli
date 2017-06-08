<template>
	<div class="wrapper" id="app" v-cloak>
		<div v-if="pageError">
			{{error}}
			<a href="javascript:void(0)" @click="onClickAgain">重试</a> | <a href="/">返回首页</a><router-link to=""></router-link>
		</div>
		<div v-else>
			<div class="wrapper_left">
				<leftbar :current-router="currentRouter"></leftbar>
			</div>
			<div class="wrapper_right">
				<topbar></topbar>
				<router-view></router-view>
				<upfile :upfile-data="upfileData" ref="upfile_component"></upfile>
			</div>
		</div>
	</div>
</template>

<script>
import "babel-polyfill"

import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);

import Leftbar from '../components/common/leftbar'
import Topbar from '../components/common/topbar'
import Upfile from '../components/models/upfile'

const vuex_store = new Vuex.Store({
	state:{
		upFileCallBack: function(){},
		upFileLock: false
	},
	mutations:{
		startUpFile(state, callback) {
			console.info("startUpFile go");
			if(state.upFileLock) {
				callback({
					status: -1,
					message: "请等待上一次上传完成！"
				})
			} else {
				if(navigator.userAgent.indexOf("MSIE 9.0")>0){
					console.info("是ie9");
					vm.upfileData.showChoiceDialog = true;
					state.upFileCallBack = callback;
				} else {
					console.info("不是ie9");
					console.info(document.getElementById('selectfiles'));
					document.getElementById('selectfiles').click();
					state.upFileCallBack = callback;
				}
			}
		},
		upFileComplete(state, data) {
			state.upFileCallBack(data);
			state.upFileLock = false;
		},
		err_500(state, obj) {
			if(obj && obj.error){
				vm.pageError = true;
				vm.error = obj.error;
				vm.toPath = obj.toPath;
			}
		}
	}
});

export default {
	name: 'app',
	store: vuex_store,
	components: { Leftbar, Topbar, Upfile },
	data() {
		return {
			pageError: false,
			error: "",
			toPath: "",
			currentRouter: "/",
			upfileData: {
				showChoiceDialog: false,
				uploadIngVisible: false,
				upPercent: 0,
				text: "表格导入",
				onComplete(up, file, info, fileName) {
					console.info("::onComplete");
					vm.$refs.upfile_component.onComplete(up, file, info, fileName);
				},
				onError(error) {
					console.info("::onError");
					vm.upfileData.uploadIngVisible = false;
					vm.$store.commit("upFileComplete", error)
				},
				onSuccess(fileName, host) {
					console.info("::onSuccess");
					vm.$store.commit("upFileComplete", {
						status: 0,
						message: "上传成功",
						data: {
							fileName: fileName,
							host: host
						}
					});
				},
				cancelUpFile() {
					console.info("::cancelUpFile");
				}
			}
		}
	},
	created() {
		console.info("Vuex");
		window.vm = this;
	},
	methods: {
		onClickAgain() {
			console.info("onClickAgain ");
			console.info(this.toPath);
			if(this.toPath){
				this.$router.push(this.toPath)
			} else {
				this.$router.push("/")
			}
		}
	}
}
</script>
