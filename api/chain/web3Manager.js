const Web3 = require('genaro-web3')

let web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.0.74:8545'))

function getWeb3 () {
    return web3
}
module.exports = getWeb3
