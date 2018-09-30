const db = require('../db')
const chain = require('../chain')
const getWeb3 = require('../chain/web3Manager')
const Tx = require('ethereumjs-tx')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dayJs = require('dayjs')
const { BLOCK_COUNT_OF_ROUND } = require('../config')

const adapter = new FileSync('./transferDb.json')
const jsonDb = low(adapter)
jsonDb.defaults({
    recharges: []
}).write()

function getLatestTxs (offset, limit) {
    // TODO: add pending transactions
    const data = db.getLatestTxs(offset, limit)
    const total = db.getStat().transactionCount
    return {
        meta: {
            total,
            offset,
            limit
        },
        data
    }
}

function getTransactionsByAddress (address, offset, limit) {
    const pendingTx = chain.getPendingTxsForAddress(address)
    const dbTxs = db.getTransactionsByAddress(address, offset, limit)
    const total = db.getTransactionCountByAddress(address) + pendingTx.length
    offset += pendingTx.length
    limit += pendingTx.length
    const data = pendingTx.concat(dbTxs)
    return {
        meta: {
            total,
            offset,
            limit
        },
        data
    }
}

function getLatestBlocks (offset, limit) {
    const data = db.getLatestBlocks(offset, limit)
    let total = db.getStat().blockCount
    //if (total > 10000) total = 10000
    return {
        meta: {
            total,
            offset,
            limit
        },
        data
    }
}

function reCharge (address) {
    if (checkRecharge(address)) {
        return transfer(address)
    } else {
        throw new Error('今天已经使用过了，明天再来吧!')
    }
}

function recordRecharge (address) {
    jsonDb.get('recharges').push({
        address,
        date: formatNow()
    }).write()
}

function checkRecharge (address) {
    let r = jsonDb.get('recharges').find({ address: address, date: formatNow() }).value()
    return !r
}

function formatNow () {
    return dayJs().startOf('day').unix()
}

async function transfer (address) {
    let web3 = getWeb3()
    let nonce = await web3.eth.getTransactionCount('0x75cfd81d9ecc6ffa0012625029add6aef4111bae')
    let rawTx = {
        nonce: web3.utils.toHex(nonce),
        gasLimit: web3.utils.toHex(180000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')),
        from: '0x75cfd81d9ecc6ffa0012625029add6aef4111bae',
        to: address,
        value: web3.utils.toHex(web3.utils.toWei('5', 'ether'))
    }
    let privateKey = Buffer.from('33B9BF81F6F84A1050D0AD9CE53AB2B0C3C3D145BEB60F62A7A046E13E2F60E9', 'hex')
    let tx = new Tx(rawTx)
    tx.sign(privateKey)
    let serializedTx = tx.serialize()
    return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).once('transactionHash', hash => {
            console.log(hash)
        }).on('receipt', receipt => {
            resolve(receipt)
            recordRecharge(address)
        })
    })
}

async function getCurrentCommittee () {
    const web3 = getWeb3()
    const bno = await web3.eth.getBlockNumber()
    const thisRoundFirstBlock = bno - bno % BLOCK_COUNT_OF_ROUND
    const { committeeRank: currentCommittee } = await web3.genaro.getExtra(thisRoundFirstBlock)
    return currentCommittee
}

async function getPrevCommittee () {
    const web3 = getWeb3()
    const bno = await web3.eth.getBlockNumber()
    const thisRoundFirstBlock = bno - bno % BLOCK_COUNT_OF_ROUND
    const prevRoundFirstBlock = thisRoundFirstBlock - BLOCK_COUNT_OF_ROUND
    const { committeeRank: prevCommittee } = await web3.genaro.getExtra(prevRoundFirstBlock)
    return prevCommittee
}

async function getCommitteeInfo () {
    const web3 = getWeb3()
    const bno = await web3.eth.getBlockNumber()
    const thisRoundFirstBlock = bno - bno % BLOCK_COUNT_OF_ROUND
    const nextRoundFirstBlock = thisRoundFirstBlock + BLOCK_COUNT_OF_ROUND
    const session = parseInt(bno / BLOCK_COUNT_OF_ROUND) + 1
    return {
        thisRoundFirstBlock,
        nextRoundFirstBlock,
        session
    }
}

module.exports = {
    // trasaction
    getLatestTxs,
    getTransactionsByAddress,
    // block
    getLatestBlocks,
    reCharge,
    getCurrentCommittee,
    getPrevCommittee,
    getCommitteeInfo
}
