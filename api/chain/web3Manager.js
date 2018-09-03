const Web3 = require('genaro-web3')
const logger = require('../log')

let web3
function makeWeb3 () {
    let provider = new Web3.providers.WebsocketProvider('ws://47.100.107.16:8547')
    let _web3 = new Web3(provider)
    if (typeof provider.connection.onerror === 'function') {
        let oldOnclose = provider.connection.onerror
        provider.connection.onclose = function (err) {
            logger.error('websocket error: ' + err)
            oldOnclose()
            setTimeout(() => {
                logger.info('recreating web3')
                web3 = makeWeb3()
            }, 3000)
        }
    }
    return _web3
}
web3 = makeWeb3()

function getWeb3 () {
    return web3
}
module.exports = getWeb3
