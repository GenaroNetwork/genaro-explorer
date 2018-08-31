const API_BASE = 'http://localhost:8000';
const LEASTED_BLOCK = `${API_BASE}/block-number`;
const ALL_BLOCKS = `${API_BASE}/block`;
const ALL_TRANSACTIONS = `${API_BASE}/trasaction`;


const BLOCK_DETAIL = function(height) {
  return `${API_BASE}/block/${height}`
}
export {
  LEASTED_BLOCK,
  ALL_BLOCKS,
  BLOCK_DETAIL,
  ALL_TRANSACTIONS
}