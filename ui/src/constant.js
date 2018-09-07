const API_BASE = 'http://47.100.212.191';

const LEASTED_BLOCK = `${API_BASE}/block-number`;
const ALL_BLOCKS = `${API_BASE}/block`;
const ALL_TRANSACTIONS = `${API_BASE}/transaction`;


const BLOCK_DETAIL = function(height) {
  return `${API_BASE}/block/${height}`
};

const TRANSACTION_DETAIL = function(hash) {
  return `${API_BASE}/transaction/${hash}`
};

const TRANSACTION_FOR_BLOCK = function(height) {
  return `${API_BASE}/block/${height}/transaction`
}

const ACCOUNT_DETAIL = function(addr) {
  return `${API_BASE}/address/${addr}`
}

const ACCOUNT_TRANSACTIONS= function(account) {
  return `${API_BASE}/address/${account}/transaction`
}

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
  POOL_ACCOUNT_ADDRESS_PK
}