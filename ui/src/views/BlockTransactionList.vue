<template>
  <div class="wrap">
     <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="/">首页</BreadcrumbItem>
      <BreadcrumbItem to="/transaction">{{ $t('title.all_transactions')}}</BreadcrumbItem>
    </Breadcrumb>
    <Card
      strip="true"
      board="true">
      <template slot="title">
        <h3>
          Transactions
          <span class="tip">
            For Block {{ height }}
          </span>
        </h3>
      </template>
      <TransactionList
        :data="data"/>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
  .tip {
    font-size: 15px;
    font-weight: normal;
    color: #999999;
  }
</style>


<script>
import { mapState } from 'vuex'
import store from '@/store'
import TransactionList from '@/components/TransactionList.vue';

export default {
  name: 'block-transaction-list',
  props: ['height'],
  components: {
   TransactionList 
  },

  created() {
    store.dispatch('get_transaction_for_block_async', this.height)
  },
  computed: {
    ...mapState({
      data: state => state.transaction_component.transactions,
      loading: state => state.transaction_component.loading,
    }),
    totalData: function() {
      return this.data.lenght
    }
  }
}
</script>
