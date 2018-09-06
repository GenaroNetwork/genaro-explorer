import Api from '@/api';

const moduleAccount = {
  state: {
    transactions: [],
    account: null,
    loading: true,
    error: null
  },
  mutations: {
    get_account_transactions_start(state) {
      state.error = null;
      state.loading = true;
    },
    get_account_transactions_complete(state, transactions) {
      state.transactions = transactions;
      state.loading = false;
    },
    get_account_detail(state, account) {
      state.account = account;
    },
    get_account_detail_error(state, error) {
      state.error = error;
    }
  },
  actions: {
    get_account_transactions_async({commit}, {addr, offset, limit}) {
      commit('get_account_transactions_start');
      Api.getAccountTransactions(addr, offset, limit).then(res => {
        commit('get_account_transactions_complete', res.data.data)
        commit('change_data_total',res.data.meta.total);
      });
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
};

export default moduleAccount;
