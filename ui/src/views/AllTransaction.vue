<template>
  <div class="wrap">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="/">首页</BreadcrumbItem>
      <BreadcrumbItem >{{ $t('title.all_transactions')}}</BreadcrumbItem>
    </Breadcrumb>
    <Card
      stripe="true"
      board="true">
      <h3 slot="title">
        {{ $t('title.all_transactions')}}
      </h3>
      <TransactionList :data="data" 
                       :loading="loading"
                       ellipsis="true"
                       size="large"
                       />
      <Page 
        :total="total" 
        show-total
        show-elevator
        show-sizer
        :page-size="limit"
        :page-size-opts="[30,60]"
        @on-change="changePgae"
        @on-page-size-change="changePageLimit"
        class="paginate"/>

    </Card>
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
   created() {
    store.dispatch('get_transactions_async', {
      offset: this.offset,
      limit: this.limit
    });
    store.commit('change_head_menu_index', "3")
  },
  
  computed: {
    ...mapState({
      data: state => state.transaction_component.transactions,
      loading: state => state.transaction_component.loading,
      error: state => state.message.error,
      total: state => state.paginate.total,
      offset: state => state.paginate.offset,
      limit: state => state.paginate.limit,
    })
  },

  methods: {
    changePgae(page) {
      store.dispatch('change_current_page_async', {
        page,
        type: 'all_transactions'
      })
    },
    changePageLimit(limit) {
      store.dispatch('change_page_limit_async', limit);
    }

  }
}
</script>

