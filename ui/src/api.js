const axios = require('axios');

const { LEASTED_BLOCK, ALL_BLOCKS, BLOCK_DETAIL } = require('./constant');

class Api {
  static getLeastBlock() {
    return axios.get(LEASTED_BLOCK);
  }

  static getAllBlocks() {
    return axios.get(ALL_BLOCKS);
  }

  static getBlockDetail(height) {
    return axios.get(BLOCK_DETAIL(height));
  }
}

export default Api;