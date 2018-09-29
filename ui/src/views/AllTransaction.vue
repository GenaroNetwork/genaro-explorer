<template>
  <div>
    <v-breadcrumbs>
      <v-breadcrumbs-item
        v-for="item in items"
        :key="item.text"
        append
        :to="item.to">
        {{ item.title }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-layout
      align-start>
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{$t('title.all_transactions')}}</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <transaction-list
              :onChangePage="changePgae"
              :onChangeLimit="changePageLimit"
              :paginate="true"
              :data="data"
              :total="total"
              :loading="loading"/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div> 
</template>
<script>
import TransactionList from '@/components/TransactionList.vue'
import { mapState } from 'vuex'
import store from '../store'

export default {
  name: 'all_transaction',
  components: {
    TransactionList
  },
  data() {
    return {
      items: [
        {
          title: '首页',
          to: '/'
        },
        {
          title: this.$i18n.t('title.all_transactions'),
        }
      ],
    }
  },
  created() {
    store.dispatch('transaction_component/get_transactions_async', {
      offset: this.offset,
      limit: this.limit
    });
  },
  methods: {
    changePgae(page) {
      store.dispatch('transaction_component/change_current_page_async', { page })
    },
    changePageLimit(limit) {
      store.dispatch('transaction_component/change_page_limit_async', limit);
    }
  },
  computed: {
    ...mapState({
      data: state => state.transaction_component.transactions,
      loading: state => state.transaction_component.loading,
      error: state => state.message.error,
      total: state => state.transaction_component.total,
      offset: state => state.transaction_component.offset,
      limit: state => state.transaction_component.limit,
    })
  },
}
</script>

