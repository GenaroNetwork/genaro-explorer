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
          <v-card-title primary-title style="line-height: 32px">
            <v-layout
              wrap>
              <v-flex md2 xs12>
                <h3 class="headline mb-0">
                  {{$t('title.transaction_detail')}}:
                </h3>
              </v-flex>
              <v-flex
                md9 xs12>
                <h4 class="tx-info-title">
                  <a class="clipboard"
                    style="position: relative; top: -2px"
                    v-clipboard:copy="hash"
                    @click="handleClipboard">
                    <Icon type="md-clipboard" />
                  </a>
                  <span>
                    {{hash}}
                  </span>
                </h4>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-card-text style="border: 1px solid #EFEFEF">
            <transaction-info :transaction="transaction" :error="error"/> 
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
  data() {
    return {
      items: [
        {
          title: '首页',
          to: '/',
          disabled: false
        },
        {
          title: this.$i18n.t('title.all_transactions'),
          to: '/transaction',
          disabled: false
        },
        {
          title: this.$i18n.t('title.transaction_detail'),
          disabled: true
        }
      ]
    }
  },
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
