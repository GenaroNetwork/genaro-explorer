<template>
  <div class="wrap">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="/">首页</BreadcrumbItem>
      <!-- <BreadcrumbItem to="/address">{{ $t('title.all_transactions')}}</BreadcrumbItem> -->
      <BreadcrumbItem >{{ $t('title.address_detail')}}</BreadcrumbItem>
    </Breadcrumb>
    <Card
      border="none">
      <h3 slot="title">
        {{$t('title.address_detail')}}
        <span>
          &nbsp&nbsp # {{addr}}
        </span>
      </h3>
      <AccountInfo :account="account" :transactions="transactions" :addr="addr"/>
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

<style lang="scss" scoped>
 h3 {
    span {
      font-weight: 400;
      color: #969595;
    }
  }
</style>

<script>
import { mapState } from 'vuex'
import AccountInfo from '@/components/AccountInfo.vue'
import store from "@/store";

export default {
  name: 'account-detail',
  props: {
    addr: String
  },
  components: {
    AccountInfo
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      store.dispatch('get_account_detail_async', this.addr);
      store.dispatch('get_account_transactions_async', {
        addr: this.addr
      });
    },
    changePgae(page) {
       store.dispatch('change_current_page_async', {
        page,
        type: 'account_transactions',
        extra: this.addr
      })
    },
    changePageLimit(limit) {
      store.dispatch('change_page_limit_async', limit);
    }
  },
  computed: {
    ...mapState({
      account: state => state.account_component.account,
      transactions: state => state.account_component.transactions,
      total: state => state.paginate.total,
      offset: state => state.paginate.offset,
      limit: state => state.paginate.limit,
    })
  }
}
</script>
