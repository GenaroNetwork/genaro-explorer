import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api';
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  // plugins: [createLogger()],
  state: {
    latest_block: 0,
    home_component: {
      blocks: {
        data: [],
        loading: true
      },
      transactions: {
        data: [],
        loading: false
      }
    },
    block_component: {
      blocks: [],
      loading: true,
      block: null,
      error: null
    },
    transaction_component: {
      transactions: [],
      loading: true,
      transaction: null,
      error: null
    },
    account_component: {
      transactions: [],
      account: null,
      loading: true,
      error: null
    },
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

    // 区块
    get_all_blocks_start(state) {
      state.block_component.loading = true;
    },
    get_all_blocks_complete(state, blocks) {
      state.block_component.blocks = blocks;
      state.block_component.loading = false;
    },
    get_block_detail_complete(state, block) {
      state.block_component.block = block;
      state.block_component.loading = false;
    },

    get_block_detail_error(state, error) {
      state.block_component.error = error;
    },
    
    // 交易
    get_all_transactions_start(state) {
      state.transaction_component.loading = true;
    },
    get_all_transactions_complete(state, transactions) {
      state.transaction_component.transactions = transactions;
      state.transaction_component.loading = false;
    },
    get_transaction_detail_complete(state, transaction) {
      state.transaction_component.transaction = transaction;
      state.transaction_component.loading = false;
    },
    get_transaction_detail_error(state, error) {
      state.transaction_component.error = error;
    },
    get_account_transactions_start(state) {
      state.account_component.loading = true;
    },
    get_account_transactions_complete(state, transactions) {
      state.account_component.transactions = transactions;
      state.account_component.loading = false;
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

    get_home_blocks_start(state) {
      state.home_component.blocks.loading = true;
    },
    get_home_blocks_complete(state, blocks) {
      state.home_component.blocks.data = blocks;
      state.home_component.blocks.loading = false;
    },

    get_home_transactions_start(state) {
      state.home_component.transactions.loading = true;
    },

    get_home_transactions_complete(state, transactions) {
      state.home_component.transactions.data = transactions;
      state.home_component.transactions.loading = false; 
    },

    get_account_detail(state, account) {
      state.account_component.account = account;
    },

    get_account_detail_error(state, error) {
      state.account_component.error = error;
    }
  },
  
  actions: {
    get_latest_block_async({commit}) {
      Api.getLeastBlock().then(res => {
        commit('get_latest_block', res.data);
      }).catch((error) => {
        commit('set_error_message', error.message);
      })
    },
    get_blocks_async({commit}, {offset, limit}) {
      commit('get_all_blocks_start');
      Api.getAllBlocks(offset, limit).then(res => {
        commit('get_all_blocks_complete', res.data.data);
        commit('change_data_total',res.data.meta.total);
      }).catch((error) => {
        commit('set_error_message', error.message);
      })
    },
    get_get_block_detail_async({commit}, height) {
      Api.getBlockDetail(height).then(res => {
        commit('get_block_detail_complete', res.data);
      }).catch(err => {
        let status = err.response.status;
        let message;
        switch (status) {
          case '404':
            message = '没找到数据'
            break;
        
          default:
            message = '未知错误'
            break;
        }
        commit('get_block_detail_error', message)
      });
    },

    // 交易
    get_transactions_async({commit}, {offset, limit}) {
      commit('get_all_transactions_start');
      Api.getAllTransactions(offset, limit).then(res => {
        commit('get_all_transactions_complete', res.data.data);
        commit('change_data_total',res.data.meta.total);
      }).catch((error) => {
        commit('set_error_message', error.message);
      })
    },

    get_transaction_detail_async({commit}, hash) {
      Api.getTransactionDetail(hash).then(res => {
        commit('get_transaction_detail_complete', res.data)
      }).catch(err => {
        let status = err.response.status;
        let message;
        switch (status) {
          case '404':
            message = '没找到数据'
            break;
        
          default:
            message = '未知错误'
            break;
        }
        commit('get_block_detail_error', message)
      });
    },
    get_transaction_for_block_async({commit}, height) {
      commit('get_all_transactions_start');
      Api.getTransactionForBlock(height).then(res => {
        commit('get_all_transactions_complete', res.data)
      })
    },

    get_account_transactions_async({commit}, {addr, offset, limit}) {
      commit('get_account_transactions_start');
      Api.getAccountTransactions(addr, offset, limit).then(res => {
        commit('get_account_transactions_complete', res.data.data)
        commit('change_data_total',res.data.meta.total);
      });
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

    get_home_blocks_async({commit}) {
      commit('get_home_blocks_start')
      Api.getHomeBlocks().then(res => {
        commit('get_home_blocks_complete', res.data.data)
      })
    },

    get_home_transactions_async({commit}) {
      commit('get_home_transactions_start')
      Api.getHomeTransaction().then(res => {
        commit('get_home_transactions_complete', res.data.data)
      })
    },
    
    get_account_detail_async({commit}, addr) {
      Api.getAccountDetail(addr).then(res => {
        commit('get_account_detail', res.data)
      }).catch(error => {
        let status = error.response.status;
        let message;
        switch (status) {
          case '404':
            message = '没找到数据'
            break;
        
          default:
            message = '未知错误'
            break;
        }
        commit('get_account_detail_error', message)
      })
    }

  }
})
