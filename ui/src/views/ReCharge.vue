<template>
  <div class="wrap">
    <Card
      class="content"
      height="800px">
      <div class="recharge">
        <h1>充值中心</h1>
        <Input search enter-button="充值" placeholder="输入地址..." @on-search="recharge" v-model="address"/>
      </div>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.content {
  height: 800px;
}
.recharge {
  width: 60%;
  margin: 0 auto;
  margin-top: 400px;
  transform: translateY(-200%);
  text-align: center;
  h1 {
    margin: 20px 0;
  }
}

</style>

<style lang="scss">
.ivu-input-search {
  background: #515a6e!important;
  border-color:#515a6e!important;
  &:hover {
    background: #686c75!important;
    border-color:#686c75!important; 
  }
}
.ivu-input {
  &:hover{ 
    border-color: #686c75 !important;
  }

  &:focus {
    border-color: #686c75 !important;
    box-shadow: none !important;
  }
}
</style>



<script>
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import getWeb3 from '@/web3Manager'
import Tx from 'ethereumjs-tx'

import { POOL_ACCOUNT_ADDRESS, POOL_ACCOUNT_ADDRESS_PK } from '@/constant.js'

const adapter = new LocalStorage('db')
const db = low(adapter)
db.defaults({
  recharges: []
}).write()

const web3 = getWeb3()

export default {
  name: 're-charge',
  data() {
    return {
      address: ''
    }
  },
  methods: {
    recharge() {
      if (this.address.length == 0) {
        this.$Message.error('地址不能为空')
        return        
      }
     
      if (!this.$web3Utils.isAddress(this.address)) {
        this.$Message.error('地址格式错误')
        return;
      }

      if ( this.checkRecharge(this.address)) {
        this.transfer(this.address).then(res => {
          this.$Message.info('充值成功')
          this.address = ''

        });
      } else {
        this.address = ''
        this.$Message.error({
          content: '今天已经充值过了，明天再来吧!',
          duration: 3
        })
      }
    },

    formatNow() {
      return this.$dayjs().startOf('day').unix()
    },

    checkRecharge(address) {
      let r = db.get('recharges').find({address: address, date: this.formatNow()}).value();
      return !r
    },

    recordRecharge(address) {
      db.get('recharges').push({
        address: address,
        date: this.formatNow()
      }).write()
    },

    async transfer(address) {
      this.recordRecharge(address)
      const nonce = await web3.eth.getTransactionCount(POOL_ACCOUNT_ADDRESS, web3.eth.defaultBlock.pending)
      let rawTx = {
        nonce: web3.utils.toHex(nonce++),
        gasLimit: web3.utils.toHex(180000),
        gasPrice: web3.utils.toHex(21000),
        from: POOL_ACCOUNT_ADDRESS,
        to: address,
        value: web3.utils.toHex(web3.utils.toWei('5', 'ether')),
      };
      let privateKey = Buffer.from(POOL_ACCOUNT_ADDRESS_PK, 'hex');
       let tx = new Tx(rawTx);
      tx.sign(privateKey);
      let serializedTx = tx.serialize();
      return new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).once('transactionHash', hash => {
          resolve(hash);
        })
      })

    }
  }
}
</script>
