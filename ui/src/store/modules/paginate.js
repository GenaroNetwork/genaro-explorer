const modulePaginate = {
  state: {
    total: 0,
    current_page: 1,
    offset: 0,
    limit: 30,
  },
  mutations: {
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
    // paginate
    change_current_page_async({commit, dispatch, state}, { page, type, extra} ) {
      commit('change_current_page', page);
      switch (type) {
        case 'blocks':
          dispatch('get_blocks_async', {
            offset: state.offset,
            limit: state.limit
          });
          break;
        case 'all_transactions':
          dispatch('get_transactions_async', {
            offset: state.offset,
            limit: state.limit
          });
          break;
        case 'account_transactions':
          dispatch('get_account_transactions_async', {
            offset: state.offset,
            limit: state.limit,
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
};

export default modulePaginate;