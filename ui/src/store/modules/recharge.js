import Api from '@/api';

const moduleRecharge = {
  state: {
    running: false,
    error: null,
    success_tag: null
  },
  mutations: {
    start_recharge(state) {
      state.running = true
    },
    complete_recharge(state) {
      state.success_tag = '充值成功！'
      state.running = false
    },
    recharge_error(state, error) {
      state.error = error
      state.running = false
    },
    clear_info(state) {
      state.error = null
      state.success_tag = null
    }
  },

  actions: {
    recharge_async({commit}, address) {
      commit('start_recharge')
      Api.reCharge(address).then( () => {
        commit('complete_recharge')
      }).catch( error => {
        commit('recharge_error',error.response.data)
      })
    }
  }
};

export default moduleRecharge;