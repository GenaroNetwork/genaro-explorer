import Api from "../../api";

const moduleStatistics = {
  state: {
    transactionCountInLatestTenBlock: {
      xAxis: [],
      yAxis: [],
      loading: false,
    },
    gnxUsedInLatestTenBlock: {
      xAxis: [],
      yAxis: [],
      loading: false,

    },
    gnxUsedInLatestTenTx: {
      xAxis: [],
      yAxis: [],
      loading: false,
    }
  },
  mutations: {
    get_transactionCountInLatestTenBlock_start(state) {
      state.transactionCountInLatestTenBlock.loading = true
    },
    get_transactionCountInLatestTenBlock_complete(state, data) {
      state.transactionCountInLatestTenBlock.xAxis = data.xAxis
      state.transactionCountInLatestTenBlock.yAxis = data.yAxis
    },
    get_gnxUsedInLatestTenBlock_start(state) {
      state.gnxUsedInLatestTenBlock.loading = true
    },
    get_gnxUsedInLatestTenBlock_complete(state, data) {
      state.gnxUsedInLatestTenBlock.xAxis = data.xAxis
      state.gnxUsedInLatestTenBlock.yAxis = data.yAxis

    },
    get_gnxUsedInLatestTenTx_start(state) {
      state.gnxUsedInLatestTenTx.loading = true
    },
    get_gnxUsedInLatestTenTx_complete(state, data) {
      state.gnxUsedInLatestTenTx.xAxis = data.xAxis
      state.gnxUsedInLatestTenTx.yAxis = data.yAxis
    }
  },
  actions: {
    get_transactionCountInLatestTenBlock_async({commit}) {
      commit('get_transactionCountInLatestTenBlock_start')
      Api.getTransactionCountInLatestTenBlockData().then(res => {
        const data = res.data;
        commit('get_transactionCountInLatestTenBlock_complete', data)
      })
    },
    get_gnxUsedInLatestTenBlock_async({commit}) {
      commit('get_gnxUsedInLatestTenBlock_start')
      Api.getGnxUsedInLatestTenBlockData().then(res => {
        const data = res.data;
        commit('get_gnxUsedInLatestTenBlock_complete', data)
      })
    },
    get_gnxUsedInLatestTenTx_async({commit}) {
      commit('get_gnxUsedInLatestTenTx_start')
      Api.getGnxUsedInLatestTenTxData().then(res => {
        const data = res.data;
        commit('get_gnxUsedInLatestTenTx_complete',data)
      })
    },
  }
};

export default moduleStatistics;