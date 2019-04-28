<template>
  <!-- <v-container> -->
  <v-container fluid grid-list-md>
    <v-layout
            row
            wrap
            grid-list-md>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title primary-title class="home-title">
            <v-icon>
              dialpad
            </v-icon>
            <h3>Blocks</h3>
            <Button class="view_all" to="/blocks" >View All</Button>
          </v-card-title>
          <v-card-text class="data-content">
            <div v-for="data in blocks" :key="data.hash">
              <BlockItem :block="data" />
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs12 md6>
        <v-card>
          <v-card-title primary-title class="home-title">
            <v-icon>
              business
            </v-icon>
            <h3>Transactions</h3>
            <Button class="view_all" to="/transaction">View All</Button>
          </v-card-title>
          <v-card-text class="data-content">
            <div v-for="data in transactions" :key="data.hash">
              <TransactionItem :transaction="data"/>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <!-- </v-container> -->
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
  .home-title {
    position: relative;
    border-bottom: 1px solid #EFEFEF;
    .view_all {
      position: absolute; right: 20px;
    }
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
