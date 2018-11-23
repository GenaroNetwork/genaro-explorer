<template>
  <div class="wrap">
    <template v-if="account">
        <v-layout
          align-start>
          <v-flex md3 xs6 class="vertical-tag">
            GNX余额:
          </v-flex>
          <v-flex md3 xs6 class="ellipsis-text vertical-tag">
            {{ balanceGNX }} GNX
          </v-flex>
        </v-layout>
        <v-layout
          align-start>
          <v-flex md3 xs6 class="vertical-tag">
            交易发出数量:
          </v-flex>
          <v-flex md3 xs6 class="ellipsis-text vertical-tag">
            {{account.transactionCount}}笔
          </v-flex>
        </v-layout>
        <v-layout style="margin-top: 20px;" >
          <v-flex
            grow=1>
             <v-tabs
                style="overflow: scroll"
                v-model="active " >
                <v-tab
                  key="1">
                  {{$i18n.t('title.transactions')}}
                </v-tab>
                <v-tab-item
                  key="1">
                  <transaction-list-for-address 
                    :data="transactions" 
                    :addr="addr" 
                    :loading="loading" 
                    :total="total"
                    :onChangePage="onChangePage"
                    :onChangeLimit="onChangeLimit"/>
                </v-tab-item>
              </v-tabs>
          </v-flex>
        </v-layout>
    </template>
   
  </div>
</template>

<style lang="scss" scoped>
table {
  tr {
    border-bottom: 1px solid #EFEFEF;
  }
  td {
    padding: 10px 0
  }
}
.mar-top {
  margin-top: 20px;
}
</style>


<script>
import { mapState } from 'vuex'
import TransactionListForAddress from '@/components/TransactionListForAddress.vue'
import store from "@/store";

export default {
  name: 'account-info',
  props: ['account', 'transactions', 'addr', 'error', 'total', 'onChangePage', 'onChangeLimit'],
  components: {
    TransactionListForAddress
  },
  data() {
    return {
      active: null
    }
  },
  computed: {
    balanceGNX() {
      return this.$web3Utils.fromWei(this.account.balance, 'ether')
    },
    ...mapState({
      loading: state => state.account_component.loading,
    })

  }
}
</script>
