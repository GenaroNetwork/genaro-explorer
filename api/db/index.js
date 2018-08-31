const Database = require('better-sqlite3')
const exitHook = require('exit-hook')

const db = new Database('chain.db');

const begin = db.prepare('BEGIN');
const commit = db.prepare('COMMIT');
const rollback = db.prepare('ROLLBACK');

// prepare statements
let pInsertBlock, pGetBlockByHash, pGetBlockByNum
let pInsertTx, pGetTx, pGetTxByBlockNum, pGetTxByAddress

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
            console.log(tx)
            pInsertTx.run({
                hash: tx.hash,
                nonce: tx.nonce,
                blockHash: tx.blockHash,
                blockNumber: tx.blockNumber,
                transactionIndex: tx.transactionIndex,
                fromAddress: tx.from, //
                toAddress: tx.to, //
                value: tx.value,
                gasPrice: tx.gasPrice,
                gas: tx.gas,
                input: tx.input
            })
        })

        // 3. TODO: update statistics table
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
        nonce INTEGER,
        blockHash TEXT,
        blockNumber INTEGER,
        transactionIndex INTEGER,
        fromAddress TEXT,
        toAddress TEXT,
        value TEXT,
        gasPrice TEXT,
        gas INTEGER,
        input TEXT
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
        totalTransaction INTEGER
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
        `insert into TX (hash, nonce, blockHash, blockNumber, transactionIndex, fromAddress, toAddress, value, gasPrice, gas, input) 
        values (:hash, :nonce, :blockHash, :blockNumber, :transactionIndex, :fromAddress, :toAddress, :value, :gasPrice, :gas, :input)`
    )

    pGetTx = db.prepare(`select * from TX where hash = ?`)
    pGetTxByBlockNum = db.prepare(`select * from TX where blockNumber = ?`)
    pGetTxByAddress = db.prepare(`select * from TX where fromAddress = ? or toAddress = ?`)

    pGetBlockByHash = db.prepare(`select * from BLOCK where hash = ?`)
    pGetBlockByNum = db.prepare(`select * from BLOCK where number = ?`)
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

// queries: TX
function getTransaction(txHash) {
    return pGetTx.get(txHash)
}

function getTransactionsByAddress(address) {
    return pGetTxByAddress.all(address, address)
}

function getTransactionsByBlockNum(address) {
    return pGetTxByBlockNum.all(address)
}


module.exports = {
    addBlock,
    // query Tx
    getTransaction,
    getTransactionsByAddress,
    getTransactionsByBlockNum,
    // query block
    getBlockByNum,
    getBlockByHash
}