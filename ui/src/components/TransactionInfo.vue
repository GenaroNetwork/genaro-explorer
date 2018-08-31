<template>
  <div>
    <template v-if="transaction">
      <Row class="info">
        <Col span="4" >{{$t('transaction_detail.id')}}:</Col>
        <Col span="18">{{transaction.id}}</Col>
      </Row>
      <Row class="info">
        <Col span="4" >{{$t('transaction_detail.hash')}}:</Col>
        <Col span="18">{{transaction.hash}}</Col>
      </Row>
      <Row class="info">
        <Col span="4" >{{$t('transaction_detail.status')}}:</Col>
        <Col span="18">{{statusStr(transaction.status)}}</Col>
      </Row>
      <Row class="info">
        <Col span="4" >{{$t('transaction_detail.nonce')}}:</Col>
        <Col span="18">{{transaction.nonce}}</Col>
      </Row>
    </template>
  </div>
</template>

<style lang="scss">
 .info {
    padding: 5px 40px;
  }
</style>


<script>
export default {
  name: 'transaction-iofo',
  props: ['transaction'],
  methods: {
    statusStr(status) {
      switch (status) {
        case 1:
          return 'success'
          break;
        default:
          break;
      }
    }
  }
}
</script>
