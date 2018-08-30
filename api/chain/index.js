const db = require('../db')
const getWeb3 = require('./web3Manager')

function addBlock(block) {
    db.addBlock(block)
}

async function sync() {
    console.log('start sync')
    const web3 = getWeb3()
    for(let i = 0; i < 100; i ++) {
        const block = await web3.eth.getBlock(i, true);
        addBlock(block)
    }
    console.log('sync finish')
}


module.exports = {
    sync
}