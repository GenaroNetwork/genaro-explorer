import Api from '@/api';

const moduleTransactions = {
  state: {
    transactions: [],
    loading: true,
    transaction: null,
    error: null
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
      state.error = error;
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
        commit('get_block_detail_error', message)
      });
    },
    get_transaction_for_block_async({commit}, height) {
      commit('get_all_transactions_start');
      Api.getTransactionForBlock(height).then(res => {
        commit('get_all_transactions_complete', res.data)
      })
    },
  }
};

export default moduleTransactions;