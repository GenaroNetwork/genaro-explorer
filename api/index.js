const server = require('./server')
const chain = require('./chain')
const logger = require('./log')

process.on('unhandledRejection', err => {
    throw err
})
logger.info('starting')
server.run()
chain.sync()
logger.info('started')
