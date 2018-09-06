import Api from '@/api';

const moduleHome = {
  state: {
    blocks: {
      data: [],
      loading: true
    },
    transactions: {
      data: [],
      loading: false
    }
  },
  mutations: {
    get_home_blocks_start(state) {
      state.blocks.loading = true;
    },
    get_home_blocks_complete(state, blocks) {
      state.blocks.data = blocks;
      state.blocks.loading = false;
    },

    get_home_transactions_start(state) {
      state.transactions.loading = true;
    },

    get_home_transactions_complete(state, transactions) {
      state.transactions.data = transactions;
      state.transactions.loading = false; 
    },
  },
  actions: {
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
  }
};

export default moduleHome;