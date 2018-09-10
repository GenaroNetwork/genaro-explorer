const Web3 = require('genaro-web3')

let web3 = new Web3(new Web3.providers.WebsocketProvider('ws://47.100.107.16:8547'))

function getWeb3 () {
    return web3
}
module.exports = getWeb3
