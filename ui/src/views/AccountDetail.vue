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
       
        <a class="clipboard"
           v-clipboard:copy="addr"
           @click="handleClipboard">
          <Icon type="md-clipboard"  
            v-clipboard:copy="addr"/>
        </a>
       
      </h3>
       <template v-if="error">
        <div class="show-error">
          Unable to locate Account #{{addr}}
        </div>
      </template>
      <template v-else>
         <AccountInfo :account="account" :transactions="transactions" :addr="addr" :error="error"/>
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
      </template>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
 h3 {
   line-height: 18px;
    span {
      font-weight: 400;
      color: #969595;
    }
  }
  .clipboard{ 
    color: #969595;
    cursor: pointer;
  }
  .ivu-poptip-inner {
    background-color: rgba(70,76,91,.9) !important;
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
      store.dispatch('account_component/get_account_detail_async', this.addr.toLowerCase());
      store.dispatch('account_component/get_account_transactions_async', {
        addr: this.addr.toLowerCase()
      });
    },
    changePgae(page) {
       store.dispatch('account_component/change_current_page_async', {
        page,
        extra: this.addr
      })
    },
    changePageLimit(limit) {
      store.dispatch('account_component/change_page_limit_async', limit);
    },
    handleClipboard() {
       this.$Message.info(this.$i18n.t('title.copy_success'));
    },
  },
  computed: {
    ...mapState({
      account: state => state.account_component.account,
      error: state => state.account_component.error,
      transactions: state => state.account_component.transactions,
      total: state => state.account_component.total,
      offset: state => state.account_component.offset,
      limit: state => state.account_component.limit,
    })
  },
  watch: {
    '$route': 'getData'
  },
}
</script>
