import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    latest_block: 0,
    block_component: {
      blocks: [],
    }
  },
  mutations: {
    get_latest_block(state,latest_block) {
      state.latest_block = latest_block
    },
    get_all_blocks(state, blocks) {
      state.block_component.blocks = blocks;
    },
    error() {
      
    }
  },
  actions: {
    get_latest_block_async({commit}) {
      Api.getLeastBlock().then(res => {
        commit('get_latest_block', res.data)
      }).catch(err => {
        commit('error', err)
      })
    },
    get_blocks_async({commit}) {
      Api.getAllBlocks().then(res => {
        commit('get_all_blocks', res.data.datas)
      })
    }
  }
})
