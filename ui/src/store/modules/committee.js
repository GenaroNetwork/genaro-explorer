import Api from '@/api';

const moduleCommittee = {
  state: {
    currentCommittee: [],
    prevCommittee: [],
    thisRoundFirstBlock: 0,
    nextRoundFirstBlock: 0,
    session: 0,
    loading: false
  },
  mutations: {
    get_current_committee_start(state) {
      state.loading = true
    },
    get_current_committee_complete(state, currentCommittee) {
      state.loading = false
      state.currentCommittee = currentCommittee
    },
    get_prev_committee_start(state) {
      state.loading = true
    },
    get_prev_committee_complete(state, prevCommittee) {
      state.prevCommittee = prevCommittee
    },
    get_committee_info_complete(state, { current, next, session }) {
      state.thisRoundFirstBlock = current
      state.nextRoundFirstBlock = next
      state.session = session
    }
  },
  actions: {
    get_current_committee_async({commit}) {
      commit('get_current_committee_start')
      Api.getCurrentCommittee().then(res => {
        const data = res.data.map((address, index) => {
          return {
            rank: index+1,
            address
          }
        })
        commit('get_current_committee_complete', data)
      })
    },
    get_prev_committee_async({commit}) {
      commit('get_prev_committee_start')
      Api.getPrevCommittee().then(res => {
        const data = res.data.map((address, index) => {
          return {
            rank: index+1,
            address
          }
        })
        commit('get_prev_committee_complete', data)
      })
    },
    get_committee_info({commit}) {
      Api.getCommitteeInfo().then(res => {
        const { thisRoundFirstBlock, nextRoundFirstBlock, session } = res.data
        commit('get_committee_info_complete', {
          current: thisRoundFirstBlock,
          next: nextRoundFirstBlock,
          session
        })
      })
    }
  }
}

export default moduleCommittee;