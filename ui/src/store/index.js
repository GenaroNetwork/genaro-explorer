import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/api'
import moduleAccount from './modules/account'
import moduleBlock from './modules/blocks'
import moduleHome from './modules/home'
import moduleTransaction from './modules/transactions'
import modulePaginate from './modules/paginate';
import moduleRecharge from './modules/recharge';




Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account_component: moduleAccount,
    block_component: moduleBlock,
    home_component: moduleHome,
    transaction_component: moduleTransaction,
    paginate: modulePaginate,
    recharge_component: moduleRecharge,
  },
  // plugins: [createLogger()],
  state: {
    latest_block: 0,
    message: {
      error: null,
    },
    global: {
      head_menu_index: "1"
    },
  },

  mutations: {
    change_head_menu_index(state, index) {
      state.global.head_menu_index = index;
    },
    get_latest_block(state,latest_block) {
      state.latest_block = latest_block;
    },
    set_error_message(state, message) {
      state.message.error = message;
    },

  },
  
  actions: {
    get_latest_block_async({commit}) {
      Api.getLeastBlock().then(res => {
        commit('get_latest_block', res.data);
      }).catch((error) => {
        commit('set_error_message', error.message);
      })
    },
  }
});