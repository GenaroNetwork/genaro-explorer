const db = require('../db')



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
    // block
    getLatestBlocks
}