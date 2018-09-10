<template>
  <div class="wrap">
    <Card
      class="content"
      height="800px">
        <template v-if="!running">
          <div class="recharge">
            <h1>充值中心</h1>
            <Input search enter-button="充值" placeholder="输入地址..." @on-search="recharge" v-model="address"/>
          </div>
        </template>
        <template v-else>
          <div class="loading">
            <Spin size="large"></Spin>
          </div>
        </template>
       
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
  .loading {
    height: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
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

import { mapState } from 'vuex'
import store from '@/store'

export default {
  name: 're-charge',
  data() {
    return {
      address: '',
    }
  },
  methods: {
    recharge() {
      this.rechargeable = true
      if (this.address.length == 0) {
        this.$Message.error('地址不能为空')
        return        
      }
     
      if (!this.$web3Utils.isAddress(this.address)) {
        this.$Message.error('地址格式错误')
        return;
      }
      store.dispatch('recharge_async', this.address)
    },
  },
  computed: {
    ...mapState({
      running: state => state.recharge_component.running,
      error: state => state.recharge_component.error,
      success_tag: state => state.recharge_component.success_tag
    })
  },
  watch: {
    'error': function() {
        if (this.error) {
         this.$Message.error({
          content: this.error,
          duration: 3
          })
        }
        store.commit('clear_info')
    },
    'success_tag': function() {
      if (this.success_tag) {
        this.address = ''
        this.$Message.info({
        content: this.success_tag,
        duration: 3
        }) 
      }
      store.commit('clear_info')

    }
  }
}
</script>
