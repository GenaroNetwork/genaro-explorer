<template>
  <div class="wrap">
    <v-breadcrumbs divider="/">
      <v-breadcrumbs-item
        v-for="item in items"
        :key="item.title"
        :disable="item.disabled"
        exact
        :to="item.to">
        {{ item.title }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-layout
      align-start>
      <v-flex>
        <v-card>
          <v-card-title primary-title style="line-height: 32px">
            <h2>
              Transactions
              <span class="tip">
                For Block {{ height }}
              </span>
            </h2>
          </v-card-title>
          <v-card-text>
            <transaction-list
              :paginate="false"
              :data="data"
              :loading="loading"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss" scoped>
  .tip {
    font-size: 10px !important;
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
  data() {
    return {
      items: [
        {
          title: '首页',
          to: '/',
          disabled: false
        },
        {
          title: this.$i18n.t('title.all_transactions'),
          disabled: true
        }
      ]
    }
  },

  created() {
    store.dispatch('transaction_component/get_transaction_for_block_async', this.height)
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
