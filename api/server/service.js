const db = require('../db')
const chain = require('../chain')

function getLatestTxs(offset, limit) {
  // TODO: add pending transactions
  const data = db.getLatestTxs(offset, limit)
  const total = db.getStat().transactionCount
  return {
    meta: {
      total,
      offset,
      limit
    },
    data
  }
}

function getTransactionsByAddress(address, offset, limit) {
  const pendingTx = chain.getPendingTxsForAddress(address)
  const dbTxs = db.getTransactionsByAddress(request.params.address, offset, limit)
  const total = db.getTransactionCountByAddress(request.params.address) + pendingTx.length
  offset += pendingTx.length
  limit += pendingTx.length
  const data = pendingTx.concat(dbTxs)
  return {
    meta: {
      total,
      offset,
      limit
    },
    data
  }
}

function getLatestBlocks(offset, limit) {
  const data = db.getLatestBlocks(offset, limit)
  let total = db.getStat().blockCount
  if(total > 10000) total = 10000
  return {
    meta: {
      total,
      offset,
      limit
    },
    data
  }
}

module.exports = {
    // trasaction
    getLatestTxs,
    getTransactionsByAddress,
    // block
    getLatestBlocks
}