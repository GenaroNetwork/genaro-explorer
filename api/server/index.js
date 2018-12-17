const Hapi = require('hapi')
const service = require('./service')
const db = require('../db')
const chain = require('../chain')
const logger = require('../log')
const Boom = require('boom')
const Joi = require('joi')

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
        let offset = parseInt(request.query.offset) || 0
        let limit = parseInt(request.query.limit) || 30
        // if (!offset || offset > 10000) {
        //     offset = 0 // consider return 4xx error
        // }
        // if (!limit || limit > 100) {
        //     limit = 30 // consider return 4xx error
        // }
        return service.getLatestBlocks(offset, limit)
    }
})

server.route({
    method: 'GET',
    path: '/block/{blockNum}',
    handler: function (request, h) {
        return db.getBlockByNum(request.params.blockNum) || Boom.notFound('block not found')
    }
})

server.route({
    method: 'GET',
    path: '/transaction',
    handler: function (request, h) {
        let offset = parseInt(request.query.offset) || 0
        let limit = parseInt(request.query.limit) || 30
        // if (!offset || offset > 10000) {
        //     offset = 0 // consider return 4xx error
        // }
        // if (!limit || limit > 100) {
        //     limit = 30 // consider return 4xx error
        // }
        return service.getLatestTxs(offset, limit)
    }
})

server.route({
    method: 'GET',
    path: '/transaction/{txHash}',
    handler: function (request, h) {
        return db.getTransaction(request.params.txHash) || Boom.notFound('transaction not found')
    }
})

server.route({
    method: 'GET',
    path: '/block/{blockNum}/transaction',
    handler: function (request, h) {
        return db.getTransactionsByBlockNum(request.params.blockNum) || Boom.notFound('block not found')
    }
})

server.route({
    method: 'GET',
    path: '/address/{address}',
    handler: function (request, h) {
        return chain.getAddressInfo(request.params.address) || Boom.notFound('address not found')
    }
})

server.route({
    method: 'GET',
    path: '/address/{address}/transaction',
    handler: function (request, h) {
        let offset = parseInt(request.query.offset) || 0
        let limit = parseInt(request.query.limit) || 30
        // if (!offset || offset > 10000) {
        //     offset = 0 // consider return 4xx error
        // }
        // if (!limit || limit > 100) {
        //     limit = 30 // consider return 4xx error
        // }
        return service.getTransactionsByAddress(request.params.address, offset, limit) || Boom.notFound('address not found')
    }
})

server.route({
    method: 'POST',
    path: '/recharge/{address}',
    handler: async function (request, h) {
        let address = request.params.address
        try {
            const hash = await service.reCharge(address)
            return hash
        } catch (error) {
            const response = h.response(error.message)
            response.statusCode = 400
            return response
        }
    }
})

server.route({
    method: 'GET',
    path: '/currentCommittee',
    handler: function (request, h) {
        return service.getCurrentCommittee()
    }
})

server.route({
    method: 'GET',
    path: '/prevCommittee',
    handler: function (request, h) {
        return service.getPrevCommittee()
    }
})

server.route({
    method: 'GET',
    path: '/commiteeInfo',
    handler: function (request, h) {
        return service.getCommitteeInfo()
    }
})

server.route({
    method: 'POST',
    path: '/sendTransaction',
    handler: async function (request, h) {
        const { rawTx } = request.payload
        try {
            const result = await service.sendTransaction(rawTx)
            return result
        } catch (error) {
            const response = h.response(error.message)
            response.statusCode = 400
            return response
        }
    }
})

server.route({
    method: 'POST',
    path: '/contract/verify',
    handler: async function (request, h) {
        const { address, name, source, version, optimize } = request.payload
        let useOptimize = !!optimize
        try {
            const result = await service.verifyContract(address, name, source, version, useOptimize)
            console.log('result')
            console.log(result)
            return result
        } catch (error) {
            console.log(error)
            const response = h.response('Contract Verify Field')
            response.statusCode = 400
            return response
        }
    }
})

server.route({
    method: 'GET',
    path: '/statistics',
    handler: async function (request, h) {
        return service.statisticsData()
    }
})

server.route({
    method: 'GET',
    path: '/charts/transactionCountInLatestTenBlock',
    handler: async function (request, h) {
        return service.transactionCountInLatestTenBlock()
    }
})

server.route({
    method: 'GET',
    path: '/charts/gnxUsedInLatestTenBlock',
    handler: async function (request, h) {
        return service.gnxUsedInLatestTenBlock()
    }
})

server.route({
    method: 'GET',
    path: '/charts/gnxUsedInLatestTenTx',
    handler: async function (request, h) {
        return service.gnxUsedInLatestTenTx()
    }
})

server.route({
    method: 'GET',
    path: '/extra/getGenBlockCount',
    handler: async function (request, h) {
        let { start, end, miner } = request.query
        miner = miner.toLowerCase()
        return service.getGenBlockCount(start, end, miner)
    },
    options: {
        validate: {
            query: {
                start: Joi.string().required(),
                end: Joi.string().required(),
                miner: Joi.string().required()
            }
        }
    }
})

async function run () {
    logger.info('start Hapi api')
    await server.start()
    logger.info('Hapi Server running at:', server.info.uri)
}

module.exports = {
    run
}
