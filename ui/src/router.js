import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Blocks from '@/views/Blocks.vue'
import AllTransaction from '@/views/AllTransaction.vue'
import AccountDetail from '@/views/AccountDetail.vue'
import TxSubmit from '@/views/TxSubmit.vue'
import VerifyContract from '@/views/VerifyContract.vue'
import VerifySignature from '@/views/VerifySignature.vue'
import StatisticsChars from '@/views/StatisticsChars.vue'



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
      component: () => import('@/views/BlockDetail.vue'),
      props: true,
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: AllTransaction,
    },
    {
      path: '/accounts/:addr',
      name: 'account_detail',
      component: AccountDetail,
      props: true
    },
    {
      path: '/transaction/:hash',
      name: 'transaction_detail',
      component: () => import('@/views/TransactionDetail.vue'),
      props: true
    },
    {
      path: '/blocks/:height/txs',
      name: 'block_transaction_list',
      component: () => import('@/views/BlockTransactionList.vue'),
      props: true
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: () => import('@/views/ReCharge.vue')
    },
    {
      path: '/committee',
      name: 'committee',
      component: () => import('@/views/Committee.vue')
    },
    {
      path: '/tx/submit',
      name: 'tx_submit',
      component: TxSubmit
    },
    {
      path: '/contract/verify',
      name: 'verify_contract',
      component: VerifyContract
    },
    {
      path: '/signature/verify',
      name: 'verify_signature',
      component: VerifySignature
    },
    {
      path: '/statistics/chars',
      name: 'statistics-chars',
      component: StatisticsChars
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
