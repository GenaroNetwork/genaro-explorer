<template>
  <div class="item_wrap">
    <Row>
      <Col span="12">
        <h3>区块:
          <router-link :to="`/blocks/${block.number}`">
             {{ block.number }}
          </router-link>
        </h3>
        <p>由<router-link :to="`/accounts/${block.miner}`">{{ block.miner}} </router-link>开采
        </p>
        <p>
          <router-link :to="`/blocks/${block.height}/txs`">
            {{count(block.transactions)}}
          </router-link>
          in this block
        </p>
      </Col>
      <Col span="12">
      </Col>
    </Row>
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
