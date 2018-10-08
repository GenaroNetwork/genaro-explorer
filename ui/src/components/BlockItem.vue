<template>
  <div class="item_wrap">
    <v-layout>
      <v-flex xs12 class="content-box">
        <h3>区块:
          <router-link :to="`/blocks/${block.number}`" style="ovflow: hidden; text-overflow: ellipsis;">
             {{ block.number }}
          </router-link>
        </h3>
        <p>由<router-link :to="`/accounts/${block.miner.toLowerCase()}`">{{ block.miner.toLowerCase()}} </router-link>开采
        </p>
        <p>
          <router-link :to="`/blocks/${block.number}/txs`">
            {{count(block.transactions)}}
          </router-link>
          in this block
        </p>
      </v-flex  >
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'block-item',
  props: ['block'],
  methods: {
    count(transactions) {
      if (transactions) {
        return transactions.split(",").length;
      }else{
        return 0;
      }
    },
  }
}
</script>
