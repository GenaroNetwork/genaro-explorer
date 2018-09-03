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
      <AccountInfo />
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
    getData();
  },
  methods: {
    getData: function() {
      store.dispatch('get_account_transactions_async', this.addr);
    },
  }
}
</script>
