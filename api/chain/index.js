const db = require('../db')
const getWeb3 = require('./web3Manager')

function addBlock(block) {
    db.addBlock(block)
}

async function sync() {
    console.log('start sync: ' + Date.now())
    const web3 = getWeb3()
    const latestBlockHave = db.getStat().latestBlock
    const latestBlockReal = await web3.eth.getBlockNumber()
    for(let i = latestBlockHave; i <= latestBlockReal; i ++) {
        const block = await web3.eth.getBlock(i, true);
        console.log('add block: ' + block.number + ' ' + Date.now())
        addBlock(block)
        console.log('end add block ' + Date.now())
    }
    console.log('sync finish' + Date.now())
}

module.exports = {
    sync
}