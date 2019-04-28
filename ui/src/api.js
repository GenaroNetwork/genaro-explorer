import { GET_CURRENT_COMMITTEE_URL, GET_PREV_COMMITTEE_URL, GET_COMMITEE_INFO_URL, SENDTRANSACTION_URL, TRANSACTION_COUNT_IN_LATEST_TEN_BLOCK_URL, GNX_USED_IN_LATEST_TEN_BLOCK_URL, GNX_USED_IN_LATEST_TEN_TX_URL, GEN_BLOCKS_RATE_URL} from './constant';

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
  VERIFY_CONTRACT_URL,
  GEN_BLOCK_BY_MINER_URL } = require('@/constant');



class Api {
  static getApiBase() {
    const API_ENV = localStorage.getItem('api_env') || 'testNet'
    if (API_ENV == 'testNet') {
      return 'http://127.0.0.1:9000/prod/';
    } else {
      return 'http://127.0.0.1:9000/prod/';
    }
  }
  static getLeastBlock() {
    return axios.get(this.getApiBase() + LEASTED_BLOCK);
  }

  static getAllBlocks(offset=0, limit=10) {
    return axios.get(this.getApiBase() + ALL_BLOCKS, {
      params: {
        offset,
        limit
      }
    });
  }

  static getBlockDetail(height) {
    return axios.get(this.getApiBase() + BLOCK_DETAIL(height));
  }

  static getAllTransactions(offset=0, limit=10) {
    return axios.get(this.getApiBase() + ALL_TRANSACTIONS, {
      params: {
        offset,
        limit
      }
    })
  }

  static getTransactionDetail(hash) {
    return axios.get(this.getApiBase() + TRANSACTION_DETAIL(hash))
  }

  static getTransactionForBlock(height) {
    return axios.get(this.getApiBase() + TRANSACTION_FOR_BLOCK(height));
  }

  static getAccountTransactions(addr, offset=0, limit=10) {
    return axios.get(this.getApiBase() + ACCOUNT_TRANSACTIONS(addr), {
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
    return axios.get(this.getApiBase() + ACCOUNT_DETAIL(addr))
  }

  static reCharge(address) {
    return axios.post(this.getApiBase() + RECHARGE_URL(address))
  }

  static getCurrentCommittee() {
    return axios.get(this.getApiBase() + GET_CURRENT_COMMITTEE_URL)
  }

  static getPrevCommittee() {
    return axios.get(this.getApiBase() + GET_PREV_COMMITTEE_URL)
  }

  static getCommitteeInfo() {
    return axios.get(this.getApiBase() + GET_COMMITEE_INFO_URL)
  }

  static sendTransaction(rawTx) {
    return axios.post(this.getApiBase() + SENDTRANSACTION_URL, {
      rawTx
    })
  }

  static verifyContract(address, name, source, version, optimize) {
    return axios.post(this.getApiBase() + VERIFY_CONTRACT_URL, {
      address,
      name,
      source,
      version,
      optimize
    })
  }

  static getTransactionCountInLatestTenBlockData() {
    return axios.get(this.getApiBase() + TRANSACTION_COUNT_IN_LATEST_TEN_BLOCK_URL)
  }

  static getGnxUsedInLatestTenBlockData() {
    return axios.get(this.getApiBase() + GNX_USED_IN_LATEST_TEN_BLOCK_URL)
  }

  static getGnxUsedInLatestTenTxData() {
    return axios.get(this.getApiBase() + GNX_USED_IN_LATEST_TEN_TX_URL)
  }

  static getGenBlockRate(addr, session, offset, limit) {
    return axios.get(this.getApiBase() + GEN_BLOCKS_RATE_URL, {
      params: {
        miner: addr,
        session,
        offset,
        limit
      }
    })
  }

  static getGenBlockByMiner(addr, offset, limit) {
    return axios.get(this.getApiBase() + GEN_BLOCK_BY_MINER_URL, {
      params: {
        miner: addr,
        offset,
        limit
      }
    })
  }
}


export default Api;