const Hapi = require('hapi')
const service = require('./service')
const db = require('../db')

const server = Hapi.server({
    host: '0.0.0.0',
    port: 8000,
    routes: {
      cors: true 
    }
})

server.route({
    method: 'GET',
    path: '/block-number',
    handler: function (request, h) {
      return db.getStat().latestBlock
    }
})

// 区块列表
server.route({
  method: 'GET',
  path: '/block',
  handler: function(request, h) {
    let offset = parseInt(request.query.offset)
    let limit = parseInt(request.query.limit)
    if (!offset || offset > 10000) {
        offset = 0 // consider return 4xx error
    }
    if (!limit || limit > 100) {
        limit = 30 // consider return 4xx error
    }
    const data = db.getLatestBlocks(offset, limit)
    const total = db.getStat().blockCount
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
})

// http://127.0.0.1:8000/block/87
server.route({
  method: 'GET',
  path: '/block/{blockNum}',
  handler: function(request, h) {
    return db.getBlockByNum(request.params.blockNum)
  }
})

// 获取所有交易
server.route({
  method: 'GET',
  path: '/trasaction',
  handler: function(request, h) {
    return {
      meta: {
        total: 2,
        offset: 1000,
        limit: 900
      },
      data: [
        {
          tx_hash: '0xd97cf494abcef7d5805310fab4d00aea92b410717d1fc3cba0493dc55597ceff',
          block: 2902501,
          timestamps: 1535598141,
          from: '0xea086c4c7bc13144e90dc4dfd6c2fb03bb139f43',
          to: '0xf6eee0e99431d7373c7980011cde5d161fbbfdba',
          value: 0,
          tx_fee: 57106
        },
        {
          tx_hash: '0xd97cf494abcef7d5805310fab4d00aea92b410717d1fc3cba0493dc55597ceff',
          block: 2902501,
          timestamps: 1535598141,
          from: '0xea086c4c7bc13144e90dc4dfd6c2fb03bb139f43',
          to: '0xf6eee0e99431d7373c7980011cde5d161fbbfdba',
          value: 0,
          tx_fee: 57106
        }
      ]
    }
  }
})

// http://127.0.0.1:8000/trasaction/0xe57e7b805ca05f7fbd8659547f5f553cd2fa6cb0dec9371611f4337a9122bdaa
server.route({
  method: 'GET',
  path: '/trasaction/{txHash}',
  handler: function(request, h) {
      return db.getTransaction(request.params.txHash)
  }
})

// http://127.0.0.1:8000/block/87/transaction
server.route({
  method: 'GET',
  path: '/block/{blockNum}/transaction',
  handler: function(request, h) {
    return db.getTransactionsByBlockNum(request.params.blockNum)
  }
})

// server.route({
//   method: 'GET',
//   path: '/accounts',
//   handler: function(request, h) {
//   }
// })

server.route({
  method: 'GET',
  path: '/address/{address}/transaction',
  handler: function(request, h) {
    // todo: add query limit
    return db.getTransactionsByAddress(request.params.address)
  } 
})

async function run() {
  console.log('start api')
  try {
    await server.start()
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
  console.log('Server running at:', server.info.uri)
}

module.exports = {
    run
}