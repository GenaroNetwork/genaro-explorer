const Database = require('better-sqlite3')
const exitHook = require('exit-hook')
const logger = require('../log')
const dayJs = require('dayjs')
const db = new Database('chain.db')

const begin = db.prepare('BEGIN')
const commit = db.prepare('COMMIT')
const rollback = db.prepare('ROLLBACK')

// prepare statements
let pInsertBlock, pInsertTx
let pGetBlockByHash, pGetBlockByNum, pGetLatestBlock
let pGetTx, pGetTxByBlockNum, pGetTxByAddress, pGetTxCountByAddress, pGetLatestTx
let pUpdateStat, pUpdateStatWithDelete, pGetStat
let pDeleteTxsByBlockNumber, pDeleteBlockByNumber

function addBlock (block) {
    // 0. prepare data
    const txs = block.transactions
    const txIds = block.transactions.map(tx => tx.hash).join(',')
    const uncles = block.uncles.map(u => u.hash).join(',')

    begin.run()
    try {
        // 1. insert block table
        block.transactions = txIds
        block.uncles = uncles
        pInsertBlock.run(block)

        // 2. insert tx table
        txs.forEach(tx => {
            tx.logs = JSON.stringify(tx.logs)
            tx.status = tx.status ? 1 : 0
            tx.timestamp = block.timestamp
            logger.info(`交易: ${JSON.stringify(tx)}`)
            // bug临时解决方案
            if (tx.blockNumber === block.number) {
                pInsertTx.run(tx)
            }
        })

        pUpdateStat.run(block.number, 1, txs.length)
        commit.run()
        logger.info('real insert block:' + block.number)
    } catch (e) {
        throw e
    } finally {
        if (db.inTransaction) rollback.run()
    }
}

function initTables () {
    logger.info('checking or creating tables')

    const tableSQLs = []
    const indexSQLs = []

    const blockTableSQL = `create table if not exists BLOCK
    (
        id INTEGER PRIMARY KEY,
        number INTEGER,
        hash TEXT,
        parentHash TEXT,
        nonce TEXT,
        sha3Uncles TEXT,
        logsBloom TEXT,
        transactionsRoot TEXT,
        stateRoot TEXT,
        miner TEXT,
        difficulty TEXT,
        totalDifficulty TEXT,
        extraData TEXT,
        size INTEGER,
        gasLimit INTEGER,
        gasUsed INTEGER,
        timestamp INTEGER,
        transactions TEXT,
        uncles TEXT
    );`
    tableSQLs.push(blockTableSQL)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_block_num ON BLOCK (number)`)
    indexSQLs.push(`create unique INDEX IF NOT EXISTS index_block_hash ON BLOCK (hash)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_block_miner ON BLOCK (miner)`)

    const transactionTableSQL = `create table if not exists TX
    (
        id INTEGER PRIMARY KEY,
        hash TEXT,
        status INTEGER,
        nonce INTEGER,
        blockHash TEXT,
        blockNumber INTEGER,
        transactionIndex INTEGER,
        "from" TEXT,
        "to" TEXT,
        value TEXT,
        gasPrice TEXT,
        gas INTEGER,
        gasUsed INTEGER,
        timestamp INTEGER,
        contractAddress TEXT,
        cumulativeGasUsed INTEGER,
        input TEXT,
        extraInfo TEXT,
        logs TEXT
    );`
    tableSQLs.push(transactionTableSQL)
    indexSQLs.push(`create unique INDEX IF NOT EXISTS index_tx_hash ON TX (hash)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_tx_blockHash ON TX (blockHash)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_tx_blockNumber ON TX (blockNumber)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_tx_from ON TX ("from")`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_tx_to ON TX ("to")`)

    const blockSyncSQL = `create table if not exists statistics
    (
        latestBlock INTEGER,
        blockCount INTEGER,
        transactionCount INTEGER
    );`
    tableSQLs.push(blockSyncSQL)

    const committeeStateSyncSql = `
        create table if not exists committee_state (
            start INTEGER,
            end INTEGER,
            session INTEGER,
            miner_addr TEXT,
            number_of_blocks INTEGER,
            block_rate INTEGER,
            id INTEGER PRIMARY KEY
        )
    `
    tableSQLs.push(committeeStateSyncSql)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_committee_state_session ON committee_state(session)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_committee_state_miner_addr ON committee_state(miner_addr)`)

    tableSQLs.forEach(sql => {
        db.exec(sql)
    })
    indexSQLs.forEach(sql => {
        db.exec(sql)
    })

    pInsertBlock = db.prepare(
        `insert into BLOCK (number, hash, parentHash, nonce, sha3Uncles, logsBloom, transactionsRoot, stateRoot, miner, difficulty, totalDifficulty, extraData, size, gasLimit, gasUsed, timestamp, transactions, uncles) 
        values (:number, :hash, :parentHash, :nonce, :sha3Uncles, :logsBloom, :transactionsRoot, :stateRoot, :miner, :difficulty, :totalDifficulty, :extraData, :size, :gasLimit, :gasUsed, :timestamp, :transactions, :uncles)`
    )

    pInsertTx = db.prepare(
        `insert into TX (hash, status, nonce, blockHash, blockNumber, transactionIndex, "from", "to", value, gasPrice, gas, gasUsed, timestamp, contractAddress, cumulativeGasUsed, input, extraInfo, logs) 
        values (:hash, :status, :nonce, :blockHash, :blockNumber, :transactionIndex, :from, :to, :value, :gasPrice, :gas, :gasUsed, :timestamp, :contractAddress, :cumulativeGasUsed, :input, :extraInfo, :logs)`
    )

    pGetTx = db.prepare(`select * from TX where hash = ?`)
    pGetTxByBlockNum = db.prepare(`select * from TX where blockNumber = ?`)
    pGetTxByAddress = db.prepare(
        `select * from TX 
        where "from" = ? or "to" = ? 
        order by blockNumber desc, transactionIndex desc 
        LIMIT ? OFFSET ?`
    )
    pGetTxCountByAddress = db.prepare('select count(1) count from TX where "from" = ? or "to" = ?')
    pGetLatestTx = db.prepare('select * from TX order by blockNumber desc, transactionIndex desc LIMIT ? OFFSET ?')

    pGetBlockByHash = db.prepare(`select * from BLOCK where hash = ?`)
    pGetBlockByNum = db.prepare(`select * from BLOCK where number = ?`)
    pGetLatestBlock = db.prepare(`select * from BLOCK order by number desc LIMIT ? OFFSET ?`)

    pUpdateStat = db.prepare('update statistics set latestBlock = ?, blockCount = blockCount + ?, transactionCount = transactionCount + ?')
    pUpdateStatWithDelete = db.prepare('update statistics set latestBlock = ?, blockCount = blockCount - ?, transactionCount = transactionCount - ?')
    pGetStat = db.prepare('select * from statistics limit 1')

    pDeleteTxsByBlockNumber = db.prepare(`delete from TX where "blockNumber" = ?`)
    pDeleteBlockByNumber = db.prepare(`delete from BLOCK where "number" = ?`)
    // init statistics data
    const count = db.prepare('select count(1) count from statistics limit 1').get().count
    if (count === 0) {
        db.exec('insert into statistics (latestBlock, blockCount, transactionCount) values (0, 0, 0)')
    }
}

try {
    logger.info('init db')
    initTables()
} catch (error) {
    logger.error(error)
    process.exit()
}

exitHook(() => {
    logger.error('closing db')
    if (db.open) {
        db.close()
    }
    logger.error('db closed')
})

// queries: BLOCK
function getBlockByNum (blockNum) {
    return pGetBlockByNum.get(blockNum)
}

function getBlockByHash (hash) {
    return pGetBlockByHash.get(hash)
}

function getLatestBlocks (offset, limit) {
    return pGetLatestBlock.all(limit, offset)
}

function getLatestBlock () {
    return db.prepare('select * from block order by number desc limit 1').get()
}

// queries: TX
function getTransaction (txHash) {
    return pGetTx.get(txHash)
}

function getTransactionsByAddress (address, offset, limit) {
    return pGetTxByAddress.all(address, address, limit, offset)
}

// consider use another statistics table
function getTransactionCountByAddress (address) {
    return pGetTxCountByAddress.get(address, address).count
}

function getTransactionsByBlockNum (address) {
    return pGetTxByBlockNum.all(address)
}

function getLatestTxs (offset, limit) {
    return pGetLatestTx.all(limit, offset)
}

// queries: stat
function getStat () {
    return pGetStat.get()
}

function delBlock (block) {
    const number = block.number
    const { txCount } = db.prepare('select count(*) as txCount from tx where blockNumber = ? ').get(number)
    begin.run()
    try {
        pDeleteTxsByBlockNumber.run(number)
        pDeleteBlockByNumber.run(number)
        pUpdateStatWithDelete.run(number - 1, 1, txCount)
        logger.info('delBlock' + number)
        commit.run()
    } catch (e) {
        throw e
    } finally {
        if (db.inTransaction) {
            logger.debug('delBlock Rollback' + number)
            rollback.run()
        }
    }
}

// TODO 待实现 实时总账户数
function allAccountCount () {
    return 10
}

// 查询一天交易量
function getDayTxCount () {
    const startTime = dayJs().subtract(1, 'day').startOf('day').unix()
    const endTime = dayJs().subtract(1, 'day').endOf('day').unix()
    const querySql = `SELECT COUNT(*) AS txCount FROM TX WHERE timestamp >= ${startTime} AND timestamp <= ${endTime}`
    return db.prepare(querySql).get()
}

// 获取指定数量的各个区块的交易数统计
function getTransactionCountInLatestBlocks (count) {
    const querySql = `SELECT number, transactions FROM BLOCK ORDER BY number DESC LIMIT ${count}`
    const datas = db.prepare(querySql).all()
    const xAxis = datas.map(data => {
        return data.number
    })
    const yAxis = datas.map(data => {
        let txs = 0
        if (data.transactions.length > 0) {
            txs = data.transactions.split(' ').length
        }
        return txs
    })
    return {
        xAxis,
        yAxis
    }
}

// 获取指定数量的各个区块的Gnx使用量统计
function getGnxUsedInLatestBlock (count) {
    const querySql = `SELECT number, gasUsed FROM BLOCK ORDER BY number DESC LIMIT ${count}`
    const datas = db.prepare(querySql).all()
    const xAxis = datas.map(data => {
        return data.number
    })
    const yAxis = datas.map(data => {
        return data.gasUsed
    })
    return {
        xAxis,
        yAxis
    }
}

// 获取指定数量的各个交易的Gnx使用量统计
function getGnxUsedInLatestTx (count) {
    const querySql = `SELECT hash, gasUsed FROM TX ORDER BY id DESC LIMIT ${count}`
    const datas = db.prepare(querySql).all()
    console.log(datas)

    // const result = {}
    // datas.forEach(data => {
    //     result[data.hash] = data.gasUsed
    // })
    const xAxis = datas.map(data => {
        return data.hash
    })
    const yAxis = datas.map(data => {
        return data.gasUsed
    })
    return {
        xAxis,
        yAxis
    }
}

function getGenBlockNumberInRangeOfMiner (startBlock, endBlock, miner) {
    const querySqlStatement = db.prepare('SELECT COUNT(*) AS COUNT FROM BLOCK WHERE number >= ? AND number < ? AND LOWER(miner) = ?')
    return querySqlStatement.get(startBlock, endBlock, miner)
}

function findGenBlockByMiner (miner, offset, limit) {
    const querySqlStatement = db.prepare('SELECT * FROM BLOCK WHERE LOWER(miner) = ? ORDER BY number desc  LIMIT ? OFFSET ? ')
    return querySqlStatement.all(miner, limit, offset)
}

function findGenBlocks (session, miner, offset, limit) {
    let querySqlStatement = db.prepare('SELECT * FROM committee_state WHERE session = ?  AND miner_addr = ? LIMIT ? OFFSET ? ')
    let queryCountSqlStatement = db.prepare('SELECT count(*) as count FROM committee_state WHERE session = ?  AND miner_addr = ? ')

    if (session == null && miner == null) {
        querySqlStatement = db.prepare('SELECT * FROM committee_state LIMIT ? OFFSET ? ')
        queryCountSqlStatement = db.prepare('SELECT count(*) as count FROM committee_state')
        return {
            data: querySqlStatement.all(limit, offset),
            total: queryCountSqlStatement.get().count
        }
    }
    if (session == null) {
        querySqlStatement = db.prepare('SELECT * FROM committee_state WHERE miner_addr = ? LIMIT ? OFFSET ? ')
        queryCountSqlStatement = db.prepare('SELECT count(*) as count FROM committee_state WHERE miner_addr = ? ')
        return {
            data: querySqlStatement.all(miner, limit, offset),
            total: queryCountSqlStatement.get(miner).count
        }
    }
    if (miner == null) {
        querySqlStatement = db.prepare('SELECT * FROM committee_state WHERE session = ? LIMIT ? OFFSET ? ')
        queryCountSqlStatement = db.prepare('SELECT count(*) as count FROM committee_state WHERE session = ? ')
        return {
            data: querySqlStatement.all(session, limit, offset),
            total: queryCountSqlStatement.get(session).count
        }
    }
    return {
        data: querySqlStatement.all(session, miner, limit, offset),
        total: queryCountSqlStatement.get(session, miner).count
    }
}

function insertGenBlockInfo (data) {
    // console.log(data)
    const stmt = db.prepare('INSERT INTO committee_state(start, end, session, miner_addr, number_of_blocks, block_rate) VALUES(:start, :end, :session, :miner_addr, :number_of_blocks, :block_rate)')
    stmt.run(data)
}

function getLatestSession () {
    return db.prepare('SELECT max(session) as session FROM committee_state').get().session
}

function getLossGenBlocksByMinerAndSession (miner, blocks) {
    const blockQueryString = blocks.join(',')
    const query = db.prepare(`SELECT * FROM BLOCK WHERE LOWER(miner) <> '${miner.toLowerCase()}' AND number IN (${blockQueryString})`)
    console.log(query)
    return query.all().length
}

module.exports = {
    addBlock,
    // query Tx
    getTransaction,
    getTransactionsByAddress,
    getTransactionCountByAddress,
    getTransactionsByBlockNum,
    getLatestTxs,
    // query block
    getBlockByNum,
    getBlockByHash,
    getLatestBlocks,
    // query stat
    getStat,
    delBlock,
    getLatestBlock,
    allAccountCount,
    getDayTxCount,
    getTransactionCountInLatestBlocks,
    getGnxUsedInLatestBlock,
    getGnxUsedInLatestTx,
    getGenBlockNumberInRangeOfMiner,
    findGenBlockByMiner,
    insertGenBlockInfo,
    getLatestSession,
    findGenBlocks,
    getLossGenBlocksByMinerAndSession
}
