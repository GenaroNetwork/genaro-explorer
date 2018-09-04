const db = require('../db')
const getWeb3 = require('./web3Manager')
const logger = require('../log')

let gPendingTxs = []

async function sync () {
    syncPending()
    syncBlock()
}

async function syncBlock () {
    const web3 = getWeb3()
    const latestBlockHave = db.getStat().latestBlock
    const latestBlockReal = await web3.eth.getBlockNumber()
    if (latestBlockHave < latestBlockReal) {
        logger.info(`sync from ${latestBlockHave} to ${latestBlockReal}`)
        for (let i = latestBlockHave + 1; i <= latestBlockReal; i++) {
            try {
                const block = await web3.eth.getBlock(i, true)
                const promiReceipt = block.transactions.map(tx => web3.eth.getTransactionReceipt(tx.hash))
                const receipts = await Promise.all(promiReceipt)
                // merge receipt
                for (let j = 0; j < block.transactions.length; j++) {
                    Object.assign(block.transactions[j], receipts[j])
                }
                if (block.number % 1000 === 0) {
                    logger.info('add block: ' + block.number)
                }
                logger.debug('add block: ' + block.number)
                db.addBlock(block)
                logger.debug('add block done: ' + block.number)
            } catch (error) {
                throw error
            }
        }
        logger.info(`sync finished from ${latestBlockHave} to ${latestBlockReal}`)
        syncBlock()
    } else if (latestBlockHave === latestBlockReal) {
        logger.info(`synced at ${latestBlockReal}, wait 2 secend`)
        setTimeout(syncBlock, 2000)
    }
}

async function syncPending () {
    logger.info('sync Pending')
    const web3 = getWeb3()
    const txIds = await web3.genaro.getPendingTransactions()
    const promiTxDetails = txIds.map(txId => web3.eth.getTransaction(txId))
    gPendingTxs = await Promise.all(promiTxDetails)
    setTimeout(syncPending, 3000)
}

async function getAddressInfo (address) {
    const web3 = getWeb3()
    const balance = await web3.eth.getBalance(address)
    const transactionCount = await web3.eth.getTransactionCount(address)
    return {
        balance,
        transactionCount
    }
}

function getPendingTxs () {
    return gPendingTxs
}

function getPendingTxsForAddress (address) {
    return gPendingTxs.filter(tx => (tx.from === address || tx.to === address))
}

module.exports = {
    sync,
    getPendingTxs,
    getPendingTxsForAddress,
    getAddressInfo
}
