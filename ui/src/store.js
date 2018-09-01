import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api';
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createLogger()],
  state: {
    latest_block: 0,
    block_component: {
      blocks: [],
      loading: true,
      block: null,
    },
    transaction_component: {
      transactions: [],
      loading: true,
      transaction: null
    },
    message: {
      error: null,
    },
    paginate: {
      total: 0,
      current_page: 1,
      offset: 0,
      limit: 30, 
    }
  },

  mutations: {
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
      })
    },
    get_transaction_for_block_async({commit}, height) {
      commit('get_all_transactions_start');
      Api.getTransactionForBlock(height).then(res => {
        commit('get_all_transactions_complete', res.data)
      })
    },

    // paginate
    change_current_page_async({commit, dispatch, state}, { page, type} ) {
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
        default:
          break;
      }
    },
    change_page_limit_async({commit}, page_limit) {
      commit('change_page_limit', page_limit);
    }
  }
})
