const db = require('../db')
const chain = require('../chain')
const getWeb3 = require('../chain/web3Manager')
const Tx = require('ethereumjs-tx')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const dayJs = require('dayjs')
const fs = require('fs')
const tmp = require('tmp')
const stringSimilarity = require('string-similarity')
const exec = require('child_process').exec
const { BLOCK_COUNT_OF_ROUND } = require('../config')
const _ = require('lodash')

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
        gasPrice: web3.utils.toHex(web3.utils.toWei('300', 'gwei')),
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
        }).on('error', function (error) { reject(error) })
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
    if (thisRoundFirstBlock === 0) {
        const { committeeRank: currentCommittee } = await web3.genaro.getExtra(thisRoundFirstBlock)
        return currentCommittee
    }
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

async function sendTransaction (rawTx) {
    if (!rawTx) {
        throw new Error('缺少rawTx字段')
    }
    try {
        const web3 = getWeb3()
        const hash = await web3.eth.sendSignedTransaction(rawTx)
        return {
            hash
        }
    } catch (error) {
        throw new Error(`Error submitting transaction: ${error.message}`)
    }
}

async function verifyContract (address, contractName, source, version, optimize) {
    const web3 = getWeb3()
    const code = await web3.eth.getCode(address)
    if (code === '0x') {
        throw new Error('Verify Contract Field')
    }
    let tmpName = tmp.tmpNameSync()
    let outputName = tmp.tmpNameSync()
    let solcCommand = '/usr/local/bin/node ./utils/compile.js ' + tmpName + ' ' + outputName
    const data = {
        source,
        optimize,
        compilerVersion: version
    }
    console.log(solcCommand)
    fs.writeFileSync(tmpName, JSON.stringify(data), 'utf-8')
    return new Promise((resolve, reject) => {
        exec(solcCommand, function (error, stdout, stderr) {
            if (stderr) {
                reject(stderr)
            }
            if (error || !stdout) {
                reject(new Error('Compiler is currently unavailable. Please try again later...'))
            }
            let data = {}
            try {
                data = JSON.parse(fs.readFileSync(outputName).toString())
            } catch (error) {
                reject(new Error('An unexpected error occurred during compilation, please try again later...'))
            }
            let contractBytecode = ''
            for (const contract in data.contracts) {
                if (contract === ':' + contractName || contract === contractName) {
                    contractBytecode = '0x' + data.contracts[contract].bytecode
                }
            }
            if (code !== contractBytecode) {
                let similarity = stringSimilarity.compareTwoStrings(code, contractBytecode)
                let errorStr = 'Unable to verify contract (Similarity: ' + similarity + ') \nGot: ' + contractBytecode + '\n\nExpected:' + code
                reject(new Error(errorStr))
            }
            resolve('Contract verification successful.')
        })
    })
}

async function statisticsData () {
    const { txCount } = db.getDayTxCount()
    console.log(txCount)
    const allAccountCount = db.allAccountCount()
    return {
        txCount,
        allAccountCount
    }
}

async function transactionCountInLatestTenBlock () {
    return db.getTransactionCountInLatestBlocks(10)
}

async function gnxUsedInLatestTenBlock () {
    return db.getGnxUsedInLatestBlock(10)
}

async function gnxUsedInLatestTenTx () {
    return db.getGnxUsedInLatestTx(10)
}

async function getGenBlockCount (startBlock, endBlock, miner) {
    return db.getGenBlockNumberInRangeOfMiner(startBlock, endBlock, miner)
}

async function getGenBlockByMiner (miner, offset, limit) {
    const { data, total } = db.findGenBlockByMiner(miner, offset, limit)
    return {
        meta: {
            total,
            offset,
            limit
        },
        data
    }
}

async function getGenBlocks (session, miner, offset, limit) {
    const { data, total } = db.findGenBlocks(session, miner, offset, limit)
    return {
        meta: {
            total,
            offset,
            limit
        },
        data
    }
}

async function getLossGenBlocks (session, miner) {
    const committeeInThisSession = await getCommitterBySession(session)
    const committeeIndex = committeeInThisSession.indexOf(miner)
    const committeeLength = committeeInThisSession.length
    const blocksInThisSession = []
    for (let index = (session - 1) * BLOCK_COUNT_OF_ROUND; index < session * BLOCK_COUNT_OF_ROUND; index++) {
        blocksInThisSession.push(index)
    }

    const blocksInThisSessionChunk = _.chunk(blocksInThisSession, 5) // 每人连出5块
    const chunkBycommitteeLength = _.chunk(blocksInThisSessionChunk, committeeLength)
    let minerGenBlockInThisSession = []
    for (let index = 0; index < chunkBycommitteeLength.length; index++) {
        minerGenBlockInThisSession.push(chunkBycommitteeLength[index][committeeIndex])
    }
    minerGenBlockInThisSession = _.flatten(minerGenBlockInThisSession)
    return db.getLossGenBlocksByMinerAndSession(miner, minerGenBlockInThisSession)
}

async function getCommitterBySession (session) {
    const web3 = getWeb3()
    let headBlock = (session - 2) * BLOCK_COUNT_OF_ROUND
    if (session < 3) {
        headBlock = 0
    }
    const { committeeRank: currentCommittee } = await web3.genaro.getExtra(headBlock)
    return currentCommittee
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
    getCommitteeInfo,
    sendTransaction,
    verifyContract,
    statisticsData,
    transactionCountInLatestTenBlock,
    gnxUsedInLatestTenBlock,
    gnxUsedInLatestTenTx,
    getGenBlockCount,
    getGenBlockByMiner,
    getGenBlocks,
    getLossGenBlocks
}
