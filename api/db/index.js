const Database = require('better-sqlite3')
const exitHook = require('exit-hook')

const db = new Database('chain.db');

const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

// prepare statements
let pInsertBlock, pInsertTx
let pGetBlockByHash, pGetBlockByNum, pGetLatestBlock
let pGetTx, pGetTxByBlockNum, pGetTxByAddress, pGetTxCountByAddress, pGetLatestTx
let pUpdateStat, pGetStat

function addBlock(block) {
    // 0. prepare data
    const txIds = block.transactions.map(tx => tx.hash).join(",")
    const uncles = block.uncles.map(u => u.hash).join(',')

    begin.run();
    try {
        // 1. insert block table
        pInsertBlock.run({
            number: block.number,
            hash: block.hash,
            parentHash: block.parentHash,
            nonce: block.nonce,
            sha3Uncles: block.sha3Uncles,
            logsBloom: block.logsBloom,
            transactionsRoot: block.transactionsRoot,
            stateRoot: block.stateRoot,
            miner: block.miner,
            difficulty: block.difficulty,
            totalDifficulty: block.totalDifficulty,
            extraData: block.extraData,
            size: block.size,
            gasLimit: block.gasLimit,
            gasUsed: block.gasUsed,
            timestamp: block.timestamp,
            transactions: txIds,
            uncles
        })
        
        // 2. insert tx table
        block.transactions.forEach(tx => {
            pInsertTx.run({
                hash: tx.hash,
                status: tx.status ? 1 : 0,
                nonce: tx.nonce,
                blockHash: tx.blockHash,
                blockNumber: tx.blockNumber,
                transactionIndex: tx.transactionIndex,
                fromAddress: tx.from, //
                toAddress: tx.to, //
                value: tx.value,
                gasPrice: tx.gasPrice,
                gas: tx.gas,
                contractAddress: tx.contractAddress,
                cumulativeGasUsed: tx.cumulativeGasUsed,
                input: tx.input,
                logs: JSON.stringify(tx.logs)
            })
        })

        // 3. TODO: update statistics table
        pUpdateStat.run(block.number, 1, block.transactions.length)
        commit.run();
    } catch (e) {
        console.error(e)
    } finally {
        if (db.inTransaction) rollback.run();
    }
}

function initTables() {
    console.log('checking or creating tables')

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
        gasUsed TEXT,
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
        fromAddress TEXT,
        toAddress TEXT,
        value TEXT,
        gasPrice TEXT,
        gas INTEGER,
        contractAddress TEXT,
        cumulativeGasUsed INTEGER,
        input TEXT,
        logs TEXT
    );`
    tableSQLs.push(transactionTableSQL)
    indexSQLs.push(`create unique INDEX IF NOT EXISTS index_tx_hash ON TX (hash)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_tx_blockHash ON TX (blockHash)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_tx_blockNumber ON TX (blockNumber)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_tx_fromAddress ON TX (fromAddress)`)
    indexSQLs.push(`create INDEX IF NOT EXISTS index_tx_toAddress ON TX (toAddress)`)

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
        `insert into TX (hash, status, nonce, blockHash, blockNumber, transactionIndex, fromAddress, toAddress, value, gasPrice, gas, contractAddress, cumulativeGasUsed, input, logs) 
        values (:hash, :status, :nonce, :blockHash, :blockNumber, :transactionIndex, :fromAddress, :toAddress, :value, :gasPrice, :gas, :contractAddress, :cumulativeGasUsed, :input, :logs)`
    )

    pGetTx = db.prepare(`select * from TX where hash = ?`)
    pGetTxByBlockNum = db.prepare(`select * from TX where blockNumber = ?`)
    pGetTxByAddress = db.prepare(
        `select * from TX 
        where fromAddress = ? or toAddress = ? 
        order by blockNumber desc, transactionIndex desc 
        LIMIT ? OFFSET ?`
    )
    pGetTxCountByAddress = db.prepare('select count(1) count from TX where fromAddress = ? or toAddress = ?')
    pGetLatestTx = db.prepare('select * from TX order by blockNumber desc, transactionIndex desc LIMIT ? OFFSET ?')

    pGetBlockByHash = db.prepare(`select * from BLOCK where hash = ?`)
    pGetBlockByNum = db.prepare(`select * from BLOCK where number = ?`)
    pGetLatestBlock = db.prepare(`select * from BLOCK order by number desc LIMIT ? OFFSET ?`)

    pUpdateStat = db.prepare('update statistics set latestBlock = ?, blockCount = blockCount + ?, transactionCount = transactionCount + ?')
    pGetStat = db.prepare('select * from statistics limit 1')
    // init statistics data
    const count = db.prepare('select count(1) count from statistics limit 1').get().count
    if(count === 0) {
        db.exec('insert into statistics (latestBlock, blockCount, transactionCount) values (0, 0, 0)')
    }
}

try {
    console.log('init db')
    initTables()
} catch (error) {
    console.log(error)
    process.exit()
}

exitHook(() => {
    console.log('closing db')
    if(db.open) {
        db.close()
    }
    console.log('db closed')
})

// queries: BLOCK
function getBlockByNum(blockNum) {
    return pGetBlockByNum.get(blockNum)
}

function getBlockByHash(hash) {
    return pGetBlockByHash.get(hash)
}

function getLatestBlocks(offset, limit) {
    return pGetLatestBlock.all(limit, offset)
}

// queries: TX
function getTransaction(txHash) {
    return pGetTx.get(txHash)
}

function getTransactionsByAddress(address, offset, limit) {
    return pGetTxByAddress.all(address, address, limit, offset)
}

// consider use another statistics table
function getTransactionCountByAddress(address) {
    return pGetTxCountByAddress.get(address, address).count
}

function getTransactionsByBlockNum(address) {
    return pGetTxByBlockNum.all(address)
}

function getLatestTxs(offset, limit) {
    return pGetLatestTx.all(limit, offset)
}

// queries: stat
function getStat() {
    return pGetStat.get()
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
    getStat
}