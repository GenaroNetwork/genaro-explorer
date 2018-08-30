const API_BASE = 'http://localhost:8000';
const LEASTED_BLOCK = `${API_BASE}/latest-block`;
const ALL_BLOCKS = `${API_BASE}/blocks`;


const BLOCK_DETAIL = function(height) {
  return `${API_BASE}/blocks/${height}`
}
export {
  LEASTED_BLOCK,
  ALL_BLOCKS,
  BLOCK_DETAIL
}