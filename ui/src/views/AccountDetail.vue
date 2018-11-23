<template>
  <div class="wrap">
    <v-snackbar
          v-model="snackbar"
          :timeout="6000"
          :top="true"
          color="success"
        >
        {{ message_text}}
        <v-btn
          dark
          flat
          @click="snackbar = false">
            Close
        </v-btn>
    </v-snackbar>
    <v-breadcrumbs divider="/">
      <v-breadcrumbs-item
        v-for="item in items"
        :key="item.text"
        append
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
                <v-flex md1 xs12>
                  <h3 class="headline mb-0">
                    {{$t('title.address_detail')}}:
                  </h3>
                </v-flex>
                <v-flex
                  md11 xs12>
                  <h4 class="tx-info-title">
                    <a class="clipboard"
                      v-clipboard:copy="addr"
                      @click="handleClipboard">
                      <Icon type="md-clipboard"  
                        v-clipboard:copy="addr"/>
                    </a>
                    <span>
                     {{addr}}
                    </span>
                  </h4>
                </v-flex>
              </v-layout>
             
               
          </v-card-title>

          <v-card-text style="border: 1px solid #EFEFEF;">
            <template v-if="error">
               Unable to locate Account #{{addr}}
            </template>
            <template v-else>
              <account-info :account="account" 
                            :transactions="transactions"
                            :addr="addr" 
                            :error="error" 
                            :total="total"
                            :onChangePage="changePage"
                            :onChangeLimit="changePageLimit"
                            />
            </template>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
  data() {
    return {
      items: [
        {
          title: '首页',
          to: '/'
        },
        {
          title: this.$i18n.t('title.address_detail'),
        }
      ],
      snackbar: false,
      message_text: ''
    }
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
    changePage(page) {
       store.dispatch('account_component/change_current_page_async', {
        page,
        extra: this.addr
      })
    },
    changePageLimit(limit) {
      store.dispatch('account_component/change_page_limit_async', limit);
    },
    handleClipboard() {
       this.message_text = this.$i18n.t('title.copy_success')
       this.snackbar = true;
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
