const axios = require('axios');

const { LEASTED_BLOCK, 
        ALL_BLOCKS,
        BLOCK_DETAIL,
        ALL_TRANSACTIONS, } = require('@/constant');

class Api {
  static getLeastBlock() {
    return axios.get(LEASTED_BLOCK);
  }

  static getAllBlocks(offset=0, limit=30) {
    return axios.get(ALL_BLOCKS, {
      params: {
        offset,
        limit
      }
    });
  }

  static getAllTransactions(offset=0, limit=30) {
    return axios.get(ALL_TRANSACTIONS, {
      params: {
        offset,
        limit
      }
    })
  }

  static getBlockDetail(height) {
    return axios.get(BLOCK_DETAIL(height));
  }
}

export default Api;