import Api from '@/api';

const moduleBlocks = {
  state: {
    blocks: [],
    loading: true,
    block: null,
    error: null
  },
  mutations: {
    get_all_blocks_start(state) {
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
  }
};

export default moduleBlocks;