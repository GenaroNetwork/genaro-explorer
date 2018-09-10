<template>
  <div>
    <template v-if="account">
      <Row>
        <Col span="12">
          <table>
            <tbody>
              <tr>
                <td width="35%">GNX余额</td>
                <td align="right">{{ balanceGNX }} GNX</td>
              </tr>
              <tr>
                <td width="35%">交易发出数量</td>
                <td align="right">{{account.transactionCount}}笔</td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col span="24" class="mar-top">
          <Tabs type="card">
            <TabPane :label="$i18n.t('title.transactions')">
              <TransactionListForAddress :data="transactions" :addr="addr" :loading="loading" />
            </TabPane>
            <!-- <TabPane label="标签二">标签二的内容</TabPane> -->
            <!-- <TabPane label="标签三">标签三的内容</TabPane> -->
        </Tabs>
        </Col>
      </Row>
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
  props: ['account', 'transactions', 'addr', 'error'],
  components: {
    TransactionListForAddress
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
