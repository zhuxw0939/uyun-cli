// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'

// import Axios from 'axios'   //vue 2.0官方request插件
Vue.use(Vuex);
// Vue.use(Axios);
Vue.config.productionTip = false;
//reset.css
import './static/css/reset.css'
import './static/css/base.css'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI);
//vuex
const store = new Vuex.Store({
	state: {
		count: 0,
		maxHeight: '30rem',
		listSize: [50, 100]
	},
	mutations: {
		increment (state) {
			state.count++
		}
	}
});
//console.log(this.$store.state.count)
//this.store.commit('increment')
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: {App}
});

