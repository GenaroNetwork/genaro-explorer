
const LEASTED_BLOCK = `block-number`;
const ALL_BLOCKS = `block`;
const ALL_TRANSACTIONS = `transaction`;


const BLOCK_DETAIL = function(height) {
  return `block/${height}`
};

const TRANSACTION_DETAIL = function(hash) {
  return `transaction/${hash}`
};

const TRANSACTION_FOR_BLOCK = function(height) {
  return `block/${height}/transaction`
}

const ACCOUNT_DETAIL = function(addr) {
  return `address/${addr}`
}

const ACCOUNT_TRANSACTIONS= function(account) {
  return `address/${account}/transaction`
}

const RECHARGE_URL = function(address) {
  return `recharge/${address}`
}

const SENDTRANSACTION_URL = `sendTransaction`

const GET_CURRENT_COMMITTEE_URL = `currentCommittee`
const GET_PREV_COMMITTEE_URL = `prevCommittee`
const GET_COMMITEE_INFO_URL = `commiteeInfo`

const VERIFY_CONTRACT_URL = `contract/verify`

const TRANSACTION_COUNT_IN_LATEST_TEN_BLOCK_URL = `charts/transactionCountInLatestTenBlock`
const GNX_USED_IN_LATEST_TEN_BLOCK_URL = `charts/gnxUsedInLatestTenBlock`
const GNX_USED_IN_LATEST_TEN_TX_URL = `charts/gnxUsedInLatestTenTx`


const POOL_ACCOUNT_ADDRESS = '0x75cfd81d9ecc6ffa0012625029add6aef4111bae';
const POOL_ACCOUNT_ADDRESS_PK = '33B9BF81F6F84A1050D0AD9CE53AB2B0C3C3D145BEB60F62A7A046E13E2F60E9';
export {
  LEASTED_BLOCK,
  ALL_BLOCKS,
  BLOCK_DETAIL,
  ALL_TRANSACTIONS,
  TRANSACTION_DETAIL,
  TRANSACTION_FOR_BLOCK,
  ACCOUNT_DETAIL,
  ACCOUNT_TRANSACTIONS,
  POOL_ACCOUNT_ADDRESS,
  POOL_ACCOUNT_ADDRESS_PK,
  RECHARGE_URL,
  GET_CURRENT_COMMITTEE_URL,
  GET_PREV_COMMITTEE_URL,
  GET_COMMITEE_INFO_URL ,
  SENDTRANSACTION_URL,
  VERIFY_CONTRACT_URL,
  TRANSACTION_COUNT_IN_LATEST_TEN_BLOCK_URL,
  GNX_USED_IN_LATEST_TEN_BLOCK_URL,
  GNX_USED_IN_LATEST_TEN_TX_URL
}