import Vue from 'vue'
import Vuex from 'vuex'
import Api from './api';
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createLogger()],
  state: {
    latest_block: 0,
    block_component: {
      blocks: [],
      loading: true,
      block: null,
    },
    message: {
      error: null,
    },
    paginate: {
      total: 0,
      current_page: 1,
      limit: 10, 
    }
  },

  mutations: {
    get_latest_block(state,latest_block) {
      state.latest_block = latest_block;
    },
    get_all_blocks_start(state) {
      state.block_component.loading = true;
    },
    get_all_blocks_complete(state, blocks) {
      state.block_component.blocks = blocks;
      state.block_component.loading = false;
    },
    get_block_detail_complete(state, block) {
      state.block_component.block = block;
      state.block_component.loading = false;
    },
    change_data_total(state, total) {
      state.paginate.total = total;
    },
    change_current_page(state, current_page) {
      state.paginate.current_page = current_page;
    },
    change_page_limit(state, pageLimit) {
      state.paginate.limit = pageLimit;
    },
    set_error_message(state, message) {
      state.message.error = message;
    }
  },
  
  actions: {
    get_latest_block_async({commit}) {
      Api.getLeastBlock().then(res => {
        commit('get_latest_block', res.data);
      }).catch((error) => {
        commit('set_error_message', error.message);
      })
    },
    get_blocks_async({commit}) {
      commit('get_all_blocks_start');
      Api.getAllBlocks().then(res => {
        commit('get_all_blocks_complete', res.data.data);
        commit('change_data_total',res.data.meta.total);
      }).catch((error) => {
        commit('set_error_message', error.message);
      })
    },
    get_get_block_detail_async({commit}, height) {
      Api.getBlockDetail(height).then(res => {
        commit('get_block_detail_complete', res.data);
      })
    },
    change_current_page_async({commit, dispatch}, { current_page, type} ) {
      commit('change_current_page', current_page);
      switch (type) {
        case 'blocks':
          dispatch('get_blocks_async');
          break;
        default:
          break;
      }
    },
    change_page_limit_async({commit}, page_limit) {
      commit('change_page_limit', page_limit);
    }
  }
})
