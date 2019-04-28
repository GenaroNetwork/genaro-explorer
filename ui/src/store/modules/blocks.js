import Api from '@/api';

const moduleBlocks = {
  namespaced: true,
  state: {
    blocks: [],
    loading: true,
    block: null,
    error: null,
    total: 0,
    current_page: 1,
    offset: 0,
    limit: 10, 
  },
  mutations: {
    get_all_blocks_start(state) {
      state.error = null;
      state.loading = true;
    },
    get_all_blocks_complete(state, blocks) {
      state.blocks = blocks;
      state.loading = false;
    },
    get_block_detail_complete(state, block) {
      state.block = block;
      state.loading = false;
    },

    get_block_detail_error(state, error) {
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
    get_blocks_async({commit}, {offset, limit}) {
      commit('get_all_blocks_start');
      Api.getAllBlocks(offset, limit).then(res => {
        commit('get_all_blocks_complete', res.data.data);
        commit('change_data_total',res.data.meta.total);
      }).catch((error) => {
        commit('set_error_message', error.message);
      })
    },
    get_get_block_detail_async({commit}, height) {
      Api.getBlockDetail(height).then(res => {
        commit('get_block_detail_complete', res.data);
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
    change_current_page_async({commit, dispatch, state}, { page }) {
      commit('change_current_page', page);
      dispatch('get_blocks_async', {
        offset: state.offset,
        limit: state.limit
      });
    },
    change_page_limit_async({commit}, page_limit) {
      commit('change_page_limit', page_limit);
    },
  }
};

export default moduleBlocks;