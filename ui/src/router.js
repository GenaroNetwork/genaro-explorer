import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import Blocks from './views/Blocks.vue'
import BlockDetail from './views/BlockDetail.vue'


Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/blocks',
      name: 'blocks',
      component: Blocks,
      props: true
    },
    {
      path: '/blocks/:height',
      name: 'block_detail',
      component: BlockDetail,
      props: true,
    }
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
