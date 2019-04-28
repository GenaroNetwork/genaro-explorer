const message = {
    zh_cn: {
        global: {
            by: '由',
            miner: '出块',
            block: '区块',
            tx_number: '交易数量',
            count: '笔',
            balance: 'GNX余额',
            current_committee: '当前委员会',
            current_miner: '当前出块节点',
            updated_block: '更新区块',
            next_updated_block_of_committee: '次届委员会更新区块',
            // committee_count: '第{session}届委员会',
            hello: '{msg} world'
        },
        title: {
            home: 'Genaro 浏览器',
            home_page: '首页',
            all_blocks: '最近区块',
            block_detail: '区块信息',
            all_transactions: '最近交易',
            transaction_detail: '交易信息',
            address_detail: '地址',
            transactions: '交易列表',
            copy_success: '拷贝成功',
            latest_block: '最新块高',
            candidates: '当前委员会',
            recharge: 'Faucet',
            committee: '委员会',
            tool: '工具',
            submit_tx: '发送交易',
            verify_contract: '验证合约',
            verify_signature: '验证签名',
            statistics: '统计数据',
            mainNet: '主链',
            testNet: '测试链',
            block_rate_title: '出块率查询',
            gen_blocks: '出块列表'
        },
        home: {
            transaction_hash: '交易哈希',
            transaction_from: 'From',
            transaction_to: 'To'
        },
        blocks: {
            height: '区块高度',
            txn: '交易数',
            uncles: '叔伯块',
            miner: '矿工',
            gas_used: 'Gas使用量',
            gas_limit: 'Gas上限',
            timestamp: '出块时间'
        },
        block_detail: {
            id: 'ID',
            number: '区块高度',
            transactions: '交易量',
            hash: '哈希',
            parent_hash: '父哈希',
            sha3uncles: '叔伯Sha3值',
            miner: '矿工',
            diffculty: '复杂度',
            total_diffculty: '总复杂度',
            size: '大小',
            gas_used: 'Gas使用量',
            gas_limit: 'Gas上限',
            nonce: 'Nonce',
            extra_data: '额外数据',
            timestamp: '出块时间'
        },
        transaction: {
            block_hash: '区块哈希',
            block_number: '区块号',
            hash: '交易哈希',
            transaction_index: '位置',
            from: 'From',
            to: 'To',
            value: 'Value[GNX]',
            timestamp: '交易时间',
            txfee: 'TxFee'
        },
        transaction_detail: {
            id: 'ID',
            hash: '交易哈希',
            status: '交易状态',
            nonce: 'Nonce',
            from: 'From',
            to: 'To',
            value: 'Value',
            block_number:'区块高度',
            timestamp: '时间',
            gas_limit: 'Gas上限',
            gas_used: 'Gas使用量',
            gas_price: 'Gas价格',
            fee: 'Fee',
            input_data: '输入数据'
        },
        committee: {
            address: '地址',
            rank: '排名'
        },
        gen_block: {
            start: '区块开始',
            end: '区块结束',
            session: '出块届数',
            miner: '出块矿工地址',
            number_of_blocks: '矿工出块数',
            block_rate: '出块率'
        }
    },
    en_us: {
        global: {
            by: 'By',
            miner: 'minerd',
            block: 'Block',
            tx_number: 'Transaction Count',
            count: '',
            balance: 'GNX Balance',
            current_committee: 'The curret Committee',
            current_miner: 'block-generating nodes',
            updated_block: 'Update Block',
            next_updated_block_of_committee: 'Next Update Block of Committee'
        },
        title: {
            home: 'Genaro Explorer',
            home_page: 'Home',
            all_blocks: 'Latest Block',
            block_detail: 'Block Info',
            all_transactions: 'Latest Transactions',
            transaction_detail: 'Transaction Info',
            address_detail: 'Address',
            transactions: 'Transaction List',
            copy_success: 'Copy Success',
            latest_block: 'Lastet BlockHeight',
            candidates: 'Current Committee',
            recharge: 'Faucet',
            committee: 'Committee',
            tool: 'Tool',
            submit_tx: 'Send Transaction',
            verify_contract: 'Verify Contract',
            verify_signature: 'Verify Sign',
            statistics: 'Statistic',
            mainNet: 'MainNet',
            testNet: 'TestNet',
            block_rate_title: 'BlockRate',
            gen_blocks: 'GenerateBlocks'
        },
        home: {
            transaction_hash: 'Transaction Hash',
            transaction_from: 'From',
            transaction_to: 'To'
        },
        blocks: {
            height: 'Block Height',
            txn: 'Transaction Count',
            uncles: 'Uncles',
            miner: ' Miner',
            gas_used: 'Gas Used',
            gas_limit: 'Gas Limit',
            timestamp: 'Timestamp'
        },
        block_detail: {
            id: 'ID',
            number: 'Block Height',
            transactions: 'Transaction Count',
            hash: 'Hash',
            parent_hash: 'Parent Hash',
            sha3uncles: 'Sha3 Uncles',
            miner: 'Miner',
            diffculty: 'Diffculty',
            total_diffculty: 'TotalDiffculty',
            size: 'Size',
            gas_used: 'Gas Used',
            gas_limit: 'Gas Limit',
            nonce: 'Nonce',
            extra_data: 'Extra Data',
            timestamp: 'Timestamp'
        },
        transaction: {
            block_hash: 'Block Hash',
            block_number: 'Block Number',
            hash: 'Transaction Hash',
            transaction_index: 'Index',
            from: 'From',
            to: 'To',
            value: 'Value[GNX]',
            timestamp: 'Timestamp',
            txfee: 'TxFee'
        },
        transaction_detail: {
            id: 'ID',
            hash: 'Transaction Hash',
            status: 'Transaction Status',
            nonce: 'Nonce',
            from: 'From',
            to: 'To',
            value: 'Value',
            block_number:'Block Height',
            timestamp: 'Timestamp',
            gas_used: 'Gas Used',
            gas_limit: 'Gas Limit',
            gas_price: 'Gas Price',
            fee: 'Fee',
            input_data: 'Input Data'
        },
        committee: {
            address: 'Address',
            rank: 'Rank'
        },
        gen_block: {
            start: 'Start',
            end: 'End',
            session: 'Session',
            miner: 'Miner',
            number_of_blocks: 'NumberOfBlocks',
            block_rate: 'BlockRate'
        }
    }
}

export default message;