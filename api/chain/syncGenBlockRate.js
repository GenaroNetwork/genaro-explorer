const db = require('../db')
const getWeb3 = require('./web3Manager')
const logger = require('../log')
const { BLOCK_COUNT_OF_ROUND } = require('../config')

async function syncRange (startSession, endSession) {
    for (let session = startSession; session <= endSession; session++) {
        await syncSession(session)
    }
}

async function syncSession (session) {
    // logger.info('syncSession: ' + session)
    const committer = await getCommitteeBySession(session)
    const avgBlock = BLOCK_COUNT_OF_ROUND / committer.length
    logger.info('avgBlock', avgBlock)
    committer.forEach(miner => {
        const { COUNT: genBlockNumber } = db.getGenBlockNumberInRangeOfMiner((session - 1) * BLOCK_COUNT_OF_ROUND, session * BLOCK_COUNT_OF_ROUND, miner)
        logger.info('genBlockNumber', genBlockNumber)
        db.insertGenBlockInfo({
            start: (session - 1) * BLOCK_COUNT_OF_ROUND,
            end: session * BLOCK_COUNT_OF_ROUND,
            session: session,
            miner_addr: miner,
            number_of_blocks: genBlockNumber,
            block_rate: TransferToRate(genBlockNumber / avgBlock)
        })
    })
}

// session 从1开始
async function getCommitteeBySession (session) {
    const web3 = getWeb3()
    // const bno = await web3.eth.getBlockNumber()
    let thisRoundFirstBlock = (session - 2) * BLOCK_COUNT_OF_ROUND
    if (session < 3) {
        thisRoundFirstBlock = 0
    }
    const { committeeRank: currentCommittee } = await web3.genaro.getExtra(thisRoundFirstBlock)
    return currentCommittee
}

function TransferToRate (number) {
    return Math.floor(number * 100)
}
async function getCurrentSession () {
    const web3 = getWeb3()
    const bno = await web3.eth.getBlockNumber()
    const thisRoundFirstBlock = bno - bno % BLOCK_COUNT_OF_ROUND
    return (thisRoundFirstBlock / 43200) + 1
}

async function sync () {
    const web3 = getWeb3()
    const latestSyncSession = db.getLatestSession()
    const currentSession = await getCurrentSession()
    const dbLatestBlockNumber = db.getStat().latestBlock
    const chainLatestBlockNumber = await web3.eth.getBlockNumber()
    if (chainLatestBlockNumber - dbLatestBlockNumber > BLOCK_COUNT_OF_ROUND) { // 链上数据还没同步完成
        logger.info('await sync chain data')
        setTimeout(sync, 5 * 60 * 60 * 1000)
    } else if (latestSyncSession == null && currentSession === 1) { // 数据还没同步且当前届还是第一届那就要等待
        logger.info('await codition one')
        setTimeout(sync, 5 * 60 * 60 * 1000)
    } else if (latestSyncSession == null && currentSession > 1) { // 数据还没同步且当前届大于第一届
        logger.info('sync init', 1, currentSession - 1)
        await syncRange(1, currentSession - 1)
        sync()
    } else if (latestSyncSession < currentSession - 1) {
        logger.info('sync', latestSyncSession + 1, currentSession - 1)
        await syncRange(latestSyncSession + 1, currentSession - 1)
        sync()
    } else if (latestSyncSession === currentSession - 1) {
        logger.info('await codition two')
        setTimeout(sync, 5 * 60 * 60 * 1000)
    }
}
module.exports = {
    sync
}
