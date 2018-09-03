const Hapi = require('hapi')
const service = require('./service')
const db = require('../db')
const chain = require('../chain')

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

server.route({
    method: 'GET',
    path: '/block',
    handler: function (request, h) {
        let offset = parseInt(request.query.offset)
        let limit = parseInt(request.query.limit)
        if (!offset || offset > 10000) {
            offset = 0 // consider return 4xx error
        }
        if (!limit || limit > 100) {
            limit = 30 // consider return 4xx error
        }
        return service.getLatestBlocks(offset, limit)
    }
})

server.route({
    method: 'GET',
    path: '/block/{blockNum}',
    handler: function (request, h) {
        return db.getBlockByNum(request.params.blockNum)
    }
})

server.route({
    method: 'GET',
    path: '/transaction',
    handler: function (request, h) {
        let offset = parseInt(request.query.offset)
        let limit = parseInt(request.query.limit)
        if (!offset || offset > 10000) {
            offset = 0 // consider return 4xx error
        }
        if (!limit || limit > 100) {
            limit = 30 // consider return 4xx error
        }
        return service.getLatestTxs(offset, limit)
    }
})

server.route({
    method: 'GET',
    path: '/transaction/{txHash}',
    handler: function (request, h) {
        return db.getTransaction(request.params.txHash)
    }
})

server.route({
    method: 'GET',
    path: '/block/{blockNum}/transaction',
    handler: function (request, h) {
        return db.getTransactionsByBlockNum(request.params.blockNum)
    }
})

server.route({
    method: 'GET',
    path: '/address/{address}',
    handler: function (request, h) {
        return chain.getAddressInfo(request.params.address)
    }
})

server.route({
    method: 'GET',
    path: '/address/{address}/transaction',
    handler: function (request, h) {
        let offset = parseInt(request.query.offset)
        let limit = parseInt(request.query.limit)
        if (!offset || offset > 10000) {
            offset = 0 // consider return 4xx error
        }
        if (!limit || limit > 100) {
            limit = 30 // consider return 4xx error
        }
        return service.getTransactionsByAddress(request.params.address, offset, limit)
    }
})

async function run () {
    console.log('start api')
    await server.start()
    console.log('Server running at:', server.info.uri)
}

module.exports = {
    run
}
