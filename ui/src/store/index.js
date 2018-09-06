import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/api'
import moduleAccount from './modules/account'
import moduleBlock from './modules/blocks'
import moduleHome from './modules/home'
import moduleTransaction from './modules/transactions'



Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account_component: moduleAccount,
    block_component: moduleBlock,
    home_component: moduleHome,
    transaction_component: moduleTransaction,
  },
  // plugins: [createLogger()],
  state: {
    latest_block: 0,
    message: {
      error: null,
    },
    paginate: {
      total: 0,
      current_page: 1,
      offset: 0,
      limit: 30, 
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

    change_data_total(state, total) {
      state.paginate.total = total;
    },
    change_current_page(state, current_page) {
      state.paginate.current_page = current_page;
      state.paginate.offset = (current_page - 1) * state.paginate.limit
    },
    change_page_limit(state, pageLimit) {
      state.paginate.limit = pageLimit;
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
    // paginate
    change_current_page_async({commit, dispatch, state}, { page, type, extra} ) {
      commit('change_current_page', page);
      switch (type) {
        case 'blocks':
          dispatch('get_blocks_async', {
            offset: state.paginate.offset,
            limit: state.paginate.limit
          });
          break;
        case 'all_transactions':
          dispatch('get_transactions_async', {
            offset: state.paginate.offset,
            limit: state.paginate.limit 
          });
          break;
        case 'account_transactions':
          dispatch('get_account_transactions_async', {
            offset: state.paginate.offset,
            limit: state.paginate.limit,
            addr: extra
          });
          break;
        default:
          break;
      }
    },
    change_page_limit_async({commit}, page_limit) {
      commit('change_page_limit', page_limit);
    },
  }
});