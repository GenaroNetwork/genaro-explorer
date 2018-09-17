import Api from '@/api';

const moduleAccount = {
  namespaced: true,
  state: {
    transactions: [],
    account: null,
    loading: true,
    error: null,
    total: 0,
    current_page: 1,
    offset: 0,
    limit: 30, 
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
    },

    change_current_page_async({commit, dispatch, state}, { page, extra} ) {
      commit('change_current_page', page);
      dispatch('get_account_transactions_async', {
        offset: state.offset,
        limit: state.limit,
        addr: extra
      });
    },
    change_page_limit_async({commit}, page_limit) {
      commit('change_page_limit', page_limit);
    },
  }
};

export default moduleAccount;
