<template>
  <div class="wrap recharge-page">
    <Card
      class="content"
      height="800px">
        <template v-if="running">
          <div class="loading">
            <Spin size="large"></Spin>
          </div>
        </template>
        <div class="recharge">
          <h1>Testnet  GNX Faucet</h1>
          <Input search :enter-button="buttonText" 
                        placeholder="输入地址..."
                        @on-search="recharge" 
                        v-model="address"/>
        </div>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.content {
  height: 400px;
}
.recharge-page {
  margin-top: 100px;
}
.recharge {
  width: 60%;
  text-align: center;
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  h1 {
    margin: 20px 0;
  }
}
</style>

<style lang="scss">
  .loading {
    height: 100px;
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

import { mapState } from 'vuex'
import store from '@/store'

export default {
  name: 're-charge',
  data() {
    return {
      address: '',
      buttonText: 'Give Me GNX'
    }
  },
  methods: {
    recharge() {
      if (!this.running) {
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
        }
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

    },
    'running': function() {
      if (this.running) {
        this.buttonText = '充值中'
      } else {
        this.buttonText = 'Give Me GNX'
      }
    }
  }
}
</script>
