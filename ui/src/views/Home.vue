<template>
  <div class="wrap">
    <Row :gutter="20">
      <Col :sm='24' :md='12'>
        <Card>
          <template
            slot="title">
            <div class="title-wrap">
              <h2 class="title">
                <Icon type="ios-apps" />
                Blocks
              </h2>
              <Button class="view_all" to="/blocks">View All</Button>
            </div>
          </template>
          <div class="data-content">
            <div v-for="data in blocks" :key="data.hash">
              <BlockItem :block="data" />
            </div>
          </div>
        </Card>
      </Col>
      <Col :sm='24' :md='12'>
        <Card>
          <template
            slot="title">
            <div class="title-wrap">
              <h2 class="title">
                <Icon type="ios-paper"/>
                Transactions
              </h2>
              <Button class="view_all" to="/transaction">View All</Button>
            </div>
          </template>
          <div class="data-content">
            <div v-for="data in transactions" :key="data.hash">
              <TransactionItem :transaction="data"/>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<style lang="scss" scoped>
  .title-wrap {
    overflow: hidden !important;
    vertical-align: middle;
    height: 35px;
    line-height: 35px;
    .title {
      font-size: 16px;
      float: left;
      vertical-align: middle;
    }
  }
  .view_all {
    float: right;
  }
  .data-content {
    max-height: 600px;
    overflow: scroll;
  }
</style>


<script>
import { mapState } from 'vuex'
import store from '@/store'
import BlockItem from '@/components/BlockItem.vue'
import TransactionItem from '@/components/TransactionItem.vue'

export default {
  name: 'home',
  components: {
    BlockItem,
    TransactionItem
  },
  computed: {
    ...mapState({
      blocks: state => state.home_component.blocks.data,
      block_loading: state => state.home_component.blocks.loading,
      transactions: state => state.home_component.transactions.data,
      transaction_loading: state => state.home_component.transactions.loading
    })
  },
  created() {
    store.dispatch('get_home_blocks_async');
    store.dispatch('get_home_transactions_async');
  }
}
</script>
