<template>
  <div class="item_wrap">
    <v-layout>
      <v-flex xs12 class="content-box">
        <p> <span class="info-head">{{$i18n.t('home.transaction_hash')}}</span>
          <router-link :to="`/transaction/${transaction.hash}`" class="hash">
            {{transaction.hash}}
          </router-link>
        </p>
        <p>
          <span>{{$i18n.t('home.transaction_from')}}</span>
          <router-link :to="`/accounts/${transaction.from}`">
            {{ transaction.from}}
          </router-link>
        </p>
        <p>
          {{$i18n.t('home.transaction_to')}}
          <router-link :to="`/accounts/${transaction.to}`">
            {{ transaction.to}}
          </router-link>
        </p>
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss" scoped>
.info-head {
  color: #515a6e;
  font-weight: bold;
}
p {
  padding: 5px 0;
}

</style>


<script>
export default {
  name: 'transaction-item',
  props: ['transaction'],
}
</script>

