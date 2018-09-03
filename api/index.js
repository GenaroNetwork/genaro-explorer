const server = require('./server')
const chain = require('./chain')

process.on('unhandledRejection', err => {
    throw err
})

server.run()
chain.sync()
