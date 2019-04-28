import Api from '@/api';

const moduleTransactions = {
  namespaced: true,
  state: {
    transactions: [],
    loading: true,
    transaction: null,
    error: null,
    total: 0,
    current_page: 1,
    offset: 0,
    limit: 10,
  },
  mutations: {
    get_all_transactions_start(state) {
      state.error = null;
      state.loading = true;
    },
    get_all_transactions_complete(state, transactions) {
      state.transactions = transactions;
      state.loading = false;
    },
    get_transaction_detail_complete(state, transaction) {
      state.transaction = transaction;
      state.loading = false;
    },
    get_transaction_detail_error(state, error) {
      state.transaction = null;
      state.error = error;
    },

    change_data_total(state, total) {
      state.total = total;
    },
    change_current_page(state, current_page) {
      state.current_page = current_page;
      state.offset = (current_page - 1) * state.limit
    },
    change_page_limit(state, pageLimit) {
      state.limit = pageLimit;
    },
  },

  actions: {
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
        commit('get_transaction_detail_error', message)
      });
    },
    get_transaction_for_block_async({commit}, height) {
      commit('get_all_transactions_start');
      Api.getTransactionForBlock(height).then(res => {
        commit('get_all_transactions_complete', res.data)
      })
    },
    // paginate
    change_current_page_async({commit, dispatch, state}, { page } ) {
      commit('change_current_page', page);
      dispatch('get_transactions_async', {
        offset: state.offset,
        limit: state.limit
      });
    },
    change_page_limit_async({commit}, page_limit) {
      commit('change_page_limit', page_limit);
    },
  }
};

export default moduleTransactions;