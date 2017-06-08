import Vue from 'vue'
import Router from 'vue-router'
import Index from '../components/index'
import StudentManagement from '../components/studentManagement/studentManagement'
import ApplicationManagement from '../components/applicationManagement/applicationManagement'
import OnApplication from '../components/applicationManagement/onApplication'
import StrategyManagement from '../components/strategyManagement/strategyManagement'
import TimeStep from '../components/timeStep/timestep'

Vue.use(Router)

let router =  new Router({
  mode: 'history',
  base: 'app/',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/studentManagement',
      name:'StudentManagement',
      component:StudentManagement
    },
    {
      path: '/applicationManagement',
      name:'ApplicationManagement',
      component:ApplicationManagement
    },
    {
      path: '/onApplication',
      name: 'OnApplication',
      component: OnApplication
    },
    {
      path: '/strategyManagement',
      name: 'StrategyManagement',
      component: StrategyManagement
    },
    {
      path: '/timeStep',
      name: 'TimeStep',
      component: TimeStep
    },
    {
      path: '*',      // redirect: '/'
      redirect: '/'
    }
  ]
});
/*router.beforeEach((to,from,next)=> {
  console.log(to);
  console.log(from);
  console.log(next);
  next();
});*/
export default router;
