const Database = require('better-sqlite3')
const exitHook = require('exit-hook')
const logger = require('../log')

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
            pInsertTx.run(tx)
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
    getLatestBlock
}
