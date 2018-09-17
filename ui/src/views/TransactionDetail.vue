<template>
  <div class="wrap">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="/">首页</BreadcrumbItem>
      <BreadcrumbItem to="/transaction">{{ $t('title.all_transactions')}}</BreadcrumbItem>
      <BreadcrumbItem >{{ $t('title.transaction_detail')}}</BreadcrumbItem>
    </Breadcrumb>
    <Card border="none">
      <h3 slot="title">
        {{$t('title.transaction_detail')}}:
        <span>
          &nbsp&nbsp# {{hash}}
        </span>
        <a class="clipboard"
           v-clipboard:copy="hash"
           @click="handleClipboard">
          <Icon type="md-clipboard" />
        </a>
      </h3>
      <TransactionInfo :transaction="transaction" :error="error"/> 
    </Card>
  </div> 
</template>

<style lang="scss" scoped>
  h3 {
    span {
      font-size: 14px;
      font-weight: 400;
      color: #969595;
    }
  }
  .clipboard{ 
    color: #969595;
    cursor: pointer;
  }

</style>


<script>
import { mapState } from 'vuex'
import TransactionInfo from '@/components/TransactionInfo.vue'
import store from '@/store';

export default {
  name: 'transaction-detail',
  components: {
    TransactionInfo
  },
  props: ['hash'],
  created() {
    store.dispatch('transaction_component/get_transaction_detail_async', this.hash.toLowerCase())
  },
  computed: {
    ...mapState({
      transaction: state => state.transaction_component.transaction,
      error: state => state.transaction_component.error,
    })
  },
  methods: {
    handleClipboard() {
      this.$Message.info(this.$i18n.t('title.copy_success'));
    }
  }
}
</script>
