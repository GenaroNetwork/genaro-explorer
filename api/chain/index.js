const db = require('../db')
const getWeb3 = require('./web3Manager')

async function sync() {
    console.log('start sync: ' + Date.now())
    const web3 = getWeb3()
    const latestBlockHave = db.getStat().latestBlock
    const latestBlockReal = await web3.eth.getBlockNumber()
    for(let i = latestBlockHave + 1; i <= latestBlockReal; i ++) {
        const block = await web3.eth.getBlock(i, true)
        const promiReceipt = block.transactions.map(txHash => web3.eth.getTransactionReceipt(txHash))
        const receipts = await Promise.all(promiReceipt)
        // merge receipt
        for(let j = 0; j < block.transactions.length; j ++) {
            Object.assign(block.transactions[j], receipts[j]);
        }
        console.log(block.transactions)
        console.log('add block: ' + block.number + ' ' + Date.now())
        db.addBlock(block)
        console.log('end add block ' + Date.now())
    }
    console.log('sync finish' + Date.now())
}

// function getPending

module.exports = {
    sync
}