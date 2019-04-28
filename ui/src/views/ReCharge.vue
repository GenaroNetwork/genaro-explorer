<template>
  <div>
     <div class="loading" v-if="running">
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
    </div>

    <div class="wrap recharge-page">
      <v-snackbar
          v-model="snackbar"
          :timeout="6000"
          :top="true"
        >
        {{ message_text}}
        <v-btn
          color="pink"
          flat
          @click="snackbar = false">
            Close
        </v-btn>
      </v-snackbar>
   
      <div class="recharge">
        <v-layout
          justify-center
          no-wrap
          column>
          <v-flex><h1>Testnet  GNX Faucet</h1></v-flex>
          <v-flex >
            <v-text-field
              value="John Doe"
              label="输入地址..."
              solo
              v-model="address"
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-btn color="blue-grey lighten-1" style="color: white" @click="recharge">{{buttonText}}</v-btn>
          </v-flex>
        </v-layout>
      </div>
    </div>
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
      buttonText: 'Give Me GNX',
      message_text: '',
      snackbar: false
    }
  },
  methods: {
    recharge() {
      if (!this.running) {
        this.rechargeable = true
        if (this.address.length == 0) {
          this.show_message('地址不能为空')
          return        
        }
      
        if (!this.$web3Utils.isAddress(this.address)) {
          this.show_message('地址格式错误')
          return;
        }
        store.dispatch('recharge_async', this.address)
      }
    },
    show_message(text) {
      this.message_text = text;
      this.snackbar = true;
    }
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
          this.show_message(this.error)
        }
        store.commit('clear_info')
    },
    'success_tag': function() {
      if (this.success_tag) {
        this.address = ''
        this.show_message(this.success_tag)
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
