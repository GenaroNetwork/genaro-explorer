<template>
  <div class="wrapper">
    <Table
      :columns="columns"
      :data="data">
    </Table> 
  </div> 
</template>




<script>
import { mapState } from 'vuex';
import store from '../store';

export default {
  name: 'blocks',
  data() {

  },
  created() {
    store.dispatch('get_blocks_async')
  },

  computed: {
    ...mapState({
      blocks: state => state.block_component.blocks
    })
  },
  
  methods: {
    linkToTxs(block) {
      this.$router.push(`/blocks/${block.height}/txs`)
    },
    linkToMiner(addr) {
      this.$router.push(`/account/${addr}`)
    }
  },

  watch: {
    '$route' (to, from ) {
      console.log(to);
      console.log(from);
    }
  }
}
</script>

