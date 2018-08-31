const axios = require('axios');

const { LEASTED_BLOCK, ALL_BLOCKS, BLOCK_DETAIL } = require('./constant');

class Api {
  static getLeastBlock() {
    return axios.get(LEASTED_BLOCK);
  }

  static getAllBlocks(offset, limit) {
    return axios.get(ALL_BLOCKS, {
      params: {
        offset,
        limit
      }
    });
  }

  static getBlockDetail(height) {
    return axios.get(BLOCK_DETAIL(height));
  }
}

export default Api;