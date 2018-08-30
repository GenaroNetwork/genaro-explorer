const Hapi = require('hapi')

const server = Hapi.server({
    host: '0.0.0.0',
    port: 8000
})

server.route({
    method: 'GET',
    path: '/latest-block',
    handler: function (request, h) {
      return 10000
    }
})

// 区块列表
server.route({
  method: 'GET',
  path: '/blocks',
  handler: function(request, h) {
    return {
      meta: {
        total: 2
      },
      datas: [
        {
          height: 2902462,
          timestamps: 1535598141,
          txn: 22,
          uncles: 0,
          miner: 0xda35dee8eddeaa556e4c26268463e26fb91ff74f,
          gas_used: 1770962,
          gas_limit: 7086856,
        },
        {
          height: 2902462,
          timestamps: 1535598141,
          txn: 22,
          uncles: 0,
          miner: 0xda35dee8eddeaa556e4c26268463e26fb91ff74f,
          gas_used: 1770962,
          gas_limit: 7086856,
        }
      ]
    }
  }
})

// 区块详情
server.route({
  method: 'GET',
  path: '/blocks/{height}',
  handler: function(request, h) {
    return {
      height: 2902462,
      timestamps: 1535598141,
      txn: 22, //交易数量
      hash: '0xa3ad8a097a70d69bdd3ac8c58163632c61afecb1b57149cbe0d749d889ec4e5a',
      parent_hash: '0x28eff59a8323c8ca126c774d09c84cb791fbefcc5036596cde6e82bd0cd99eea',
      sha3_uncles: '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',
      miner: '0xda35dee8eddeaa556e4c26268463e26fb91ff74f',
      size: 9160,
      gas_used: 1770962,
      gas_limit: 7086856,
      nonce: '0x0000000000000000',
      block_reward: 0,
      uncles_reward: 0,
      extra_data: '0xd683010810846765746886676f312e3130856c696e75780000000000000000000b7ed5c0e8ec52457766e5835f964ec37fc893ad03a93eaec265c643c6cb162c0bead978f9393cdfb633a40e98ff8be8d934bded3a4b9888c43807c4405d230c01'
    }
  }
})

// 获取所有交易
server.route({
  method: 'GET',
  path: '/txs',
  handler: function(request, h) {
    return {
      meta: {
        total: 2,
      },
      datas: [
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

// 交易详情
server.route({
  method: 'GET',
  path: '/txs/{tx_hash}',
  handler: function(request, h) {
    return {
      parent_tx_hash: '0x6dbf161ddf99f508c6b201f48b0f4317410e130251e9cd83ea9fc4537076ea84',
      tx_hash: '0xa215ff0b9864312b0b3f7db5f4b3901a88081ac86eab5671286e22cbbd2692c1',
      txreceipt_status: 'success', // 三种状态 【success, pending, failed】
      block_height: 2902530,
      timestamps: 1535598141,
      from: '0x4b315b19b1762818b01973ad90d31ab022ac1afa',
      to: '0xae44dc1481a97cba0b383388a2b802c059d985d7',
      value: 0,
      gas_limit: 1000000,
      gas_used: 87000,
      gas_price: 1,
      fee: 1,
      nonce: 728,
      position: 7,
      input_data: '0x2f2d783e000000000000000000000000ae3291f8b99c5c374404ee190f7e92546716b916e5dc5a454e3ec1b716ed5bd248f1b6f34fede9cbf3241b668ba155bb3e343b3e00000000000000000000000000000000000000000000010f0cf064dd59200000'
    }
  }
})

// 某个块下的所有交易
server.route({
  method: 'GET',
  path: '/txs/{block_height}',
  handler: function(request, h) {
    return {
      meta: {
        total: 2
      },
      datas: [
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

// 账户列表
server.route({
  method: 'GET',
  path: '/accounts',
  handler: function(request, h) {
    return {
      meta: {
        total: 2,
      },
      datas: [
        {
          address: '0x31b98d14007bdee637298086988a0bbd31184523',
          balance: 2000,
          tx_count: 15200
        },
        {
          address: '0xc2743412c236a7c0536f35dfefaf92848f1760e3',
          balance: 2000,
          tx_count: 15200
        }
      ]
    }
  }
})

// 获取地址所有交易
server.route({
  method: 'GET',
  path: '/accounts/{address}/txs',
  handler: function(request, h) {
    return {
      meta: {
        total: 2
      },
      datas: [
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
        },
      ]
    }
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