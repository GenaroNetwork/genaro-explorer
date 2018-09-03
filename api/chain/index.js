const db = require('../db')
const getWeb3 = require('./web3Manager')

let gPendingTxs = []

async function sync() {
    syncPending()
    console.log('start sync: ' + Date.now())
    const web3 = getWeb3()
    const latestBlockHave = db.getStat().latestBlock
    const latestBlockReal = await web3.eth.getBlockNumber()
    for(let i = latestBlockHave + 1; i <= latestBlockReal; i ++) {
        const block = await web3.eth.getBlock(i, true)
        const promiReceipt = block.transactions.map(tx => web3.eth.getTransactionReceipt(tx.hash))
        const receipts = await Promise.all(promiReceipt)
        // merge receipt
        for(let j = 0; j < block.transactions.length; j ++) {
            Object.assign(block.transactions[j], receipts[j]);
        }
        console.log('add block: ' + block.number + ' ' + Date.now())
        db.addBlock(block)
        console.log('end add block ' + Date.now())
    }
    console.log('sync finish' + Date.now())
}

async function syncPending() {
    console.log('sync Pending ' + Date.now())
    const web3 = getWeb3()
    const txIds = await web3.genaro.getPendingTransactions()
    const promiTxDetails = txIds.map(txId => web3.eth.getTransaction(txId))
    gPendingTxs = await Promise.all(promiTxDetails)
    setTimeout(syncPending, 3000)
}

async function getAddressInfo(address) {
    const web3 = getWeb3()
    const balance = await web3.eth.getBalance(address)
    const transactionCount = await web3.eth.getTransactionCount(address)
    return {
        balance,
        transactionCount
    }
}

function getPendingTxs() {
    return gPendingTxs
}

function getPendingTxsForAddress(address) {
    return gPendingTxs.filter(tx => (tx.from === address || tx.to === address))
}

module.exports = {
    sync,
    getPendingTxs,
    getPendingTxsForAddress,
    getAddressInfo
}