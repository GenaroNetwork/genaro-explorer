<template>
  <div class="wrap">
    <v-breadcrumbs divider="/">
      <v-breadcrumbs-item
        v-for="item in items"
        :key="item.title"
        :disable="item.disabled"
        exact
        :to="item.to">
        {{ item.title }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-layout
      align-start>
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{$t('title.block_detail')}}: <span>&nbsp&nbsp#{{height}}</span> </h3>
            </div>
          </v-card-title>
          <v-card-text style="border: 1px solid #EFEFEF">
            <v-container
              grid-list-md 
              v-if="block">
              <v-layout
                row
               class="vertical-tag">
                <v-flex md3 xs5 >
                  {{$t('block_detail.id')}}:
                </v-flex>
                <v-flex md9 xs5 >
                  {{block.id}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5>
                  {{$t('block_detail.number')}}:
                </v-flex>
                <v-flex md9 xs5>
                  {{block.number}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.timestamp')}}:
                </v-flex>
                <v-flex md9 xs5>
                  {{ block.timestamp | toTime | formatTime}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.transactions')}}:
                </v-flex>
                <v-flex md9 xs5>
                  <router-link :to="`/blocks/${block.number}/txs`">{{countTx(block.transactions)}}</router-link>  in this block
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.hash')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                 {{block.hash}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.parent_hash')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                 {{block.parentHash}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.sha3uncles')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                 {{block.sha3Uncles}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.miner')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                  <router-link :to="'/accounts/' + block.miner.toLowerCase()">{{block.miner.toLowerCase()}}</router-link>
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.diffculty')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                  {{block.difficulty}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.total_diffculty')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                  {{block.totalDifficulty}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.size')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                  {{block.size}} bytes
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.gas_used')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                  {{block.gasUsed}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.gas_limit')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                  {{block.gasLimit}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.nonce')}}:
                </v-flex>
                <v-flex md9 xs5 class="tx-hash-detail">
                  {{block.nonce}}
                </v-flex>
              </v-layout>
              <v-layout class="vertical-tag">
                 <v-flex md3 xs5 >
                  {{$t('block_detail.extra_data')}}:
                </v-flex>
                <v-flex md9 sm5 class="tx-hash-detail">
                  <v-textarea
                    solo
                    name="input-7-4"
                    :disabled="true"
                    :value="block.extra_data"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
   
  </div> 
</template>


<style lang="scss" scoped>
  
  .info {
    padding: 5px 40px;
  }

  .tip {
    color: #3498db;
  }
  h3 {
    span {
      font-size: 14px;
      font-weight: 400;
    }
  }
  .spin-container {
    display: flex;
    justify-content: center;
  }
</style>


<script>
import { mapState } from 'vuex'
import store from "@/store";
export default {
  name: 'block-detail',
  props: ['height'],
  data() {
    return {
      items: [
        {
          title: '首页',
          to: '/',
          disabled: false
        },
        {
          title: this.$i18n.t('title.all_blocks'),
          to: '/blocks',
          disabled: false
        },
        {
          title: this.$i18n.t('title.block_detail'),
          disabled: true
        }
      ],
      
    }
  },
  created() {
    this.getData();
  },
  computed: {
    ...mapState({
      block: state => state.block_component.block,
      error: state => state.block_component.error,
    })
  },
  methods: {
    getData() {
      const height = this.height;
      store.dispatch('block_component/get_get_block_detail_async', height);
    },
    countTx(transactions) {
      if (transactions) {
        return transactions.length;
      }else{
        return 0;
      }
    },
  },
  watch: {
    '$route': 'getData'
  }
}
</script>

