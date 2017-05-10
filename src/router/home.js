import Vue from 'vue'
import Router from 'vue-router'

// 首页
import Home from '../components/home/index'
// 考试列表
import Examlist from '../components/home/examlist'
// 404
import NotFoundComponent from '../components/common/404'

//
// // 首页
// const Home = r => require.ensure([], () => r(require('../components/home/index')), 'part_home');
// // 考试列表
// const Examlist = r => require.ensure([], () => r(require('../components/home/examlist')), 'part_examlist');
// // 404
// import NotFoundComponent from '../components/common/404'

Vue.use(Router);

let router = new Router({
	mode: 'history',
	// base: '/home/',
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	},
	routes: [
		{ path: '/', component: Home },// 首页

		{ path: '/examlist', component: Examlist }, //考试列表

		{ path: '*', component: NotFoundComponent }
	]
});

export default router;




