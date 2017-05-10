import Vue from 'vue'
import VueResource from 'vue-resource';
Vue.use(VueResource);

// app
import App from './app/Home'

// 引入zepto
import $ from 'n-zepto';

// 引入element-ui组件
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(ElementUI);

// 引入依赖css
import './static/css/base.css'
import './static/css/exam_create.css'

// router
import router from './router/home'

new Vue({
	el: '#app',
	router,
	template: '<App/>',
	components: { App }
});