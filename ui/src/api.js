import { GET_CURRENT_COMMITTEE_URL, GET_PREV_COMMITTEE_URL, GET_COMMITEE_INFO_URL, SENDTRANSACTION_URL, TRANSACTION_COUNT_IN_LATEST_TEN_BLOCK_URL, GNX_USED_IN_LATEST_TEN_BLOCK_URL, GNX_USED_IN_LATEST_TEN_TX_URL} from './constant';

const axios = require('axios');

const { LEASTED_BLOCK, 
        ALL_BLOCKS,
        BLOCK_DETAIL,
        ALL_TRANSACTIONS,
        TRANSACTION_DETAIL,
        TRANSACTION_FOR_BLOCK,
        ACCOUNT_DETAIL,
        ACCOUNT_TRANSACTIONS,
        RECHARGE_URL,
        VERIFY_CONTRACT_URL } = require('@/constant');

class Api {
  static getLeastBlock() {
    return axios.get(LEASTED_BLOCK);
  }

  static getAllBlocks(offset=0, limit=10) {
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

  static getAllTransactions(offset=0, limit=10) {
    return axios.get(ALL_TRANSACTIONS, {
      params: {
        offset,
        limit
      }
    })
  }

  static getTransactionDetail(hash) {
    return axios.get(TRANSACTION_DETAIL(hash))
  }

  static getTransactionForBlock(height) {
    return axios.get(TRANSACTION_FOR_BLOCK(height));
  }

  static getAccountTransactions(addr, offset=0, limit=10) {
    return axios.get(ACCOUNT_TRANSACTIONS(addr), {
      params: {
        offset,
        limit
      }
    })
  }

  static getHomeBlocks() {
    return this.getAllBlocks(0, 10)
  }

  static getHomeTransaction() {
    return this.getAllTransactions(0, 10)
  }

  static getAccountDetail(addr) {
    return axios.get(ACCOUNT_DETAIL(addr))
  }

  static reCharge(address) {
    return axios.post(RECHARGE_URL(address))
  }

  static getCurrentCommittee() {
    return axios.get(GET_CURRENT_COMMITTEE_URL)
  }
  
  static getPrevCommittee() {
    return axios.get(GET_PREV_COMMITTEE_URL)
  }

  static getCommitteeInfo() {
    return axios.get(GET_COMMITEE_INFO_URL)
  }

  static sendTransaction(rawTx) {
    return axios.post(SENDTRANSACTION_URL, {
      rawTx
    })
  }

  static verifyContract(address, name, source, version, optimize) {
    return axios.post(VERIFY_CONTRACT_URL, {
      address,
      name,
      source,
      version,
      optimize
    })
  }

  static getTransactionCountInLatestTenBlockData() {
    return axios.get(TRANSACTION_COUNT_IN_LATEST_TEN_BLOCK_URL)
  }

  static getGnxUsedInLatestTenBlockData() {
    return axios.get(GNX_USED_IN_LATEST_TEN_BLOCK_URL)
  }

  static getGnxUsedInLatestTenTxData() {
    return axios.get(GNX_USED_IN_LATEST_TEN_TX_URL)
  }
}

export default Api;