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
            <!-- <template v-if="error">
               Unable to locate Account #{{addr}}
            </template> -->
            <account-info :addr="addr"/>
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
        snackbar: false,
        message_text: ''
      }
    },

    methods: {
      handleClipboard() {
        this.message_text = this.$i18n.t('title.copy_success')
        this.snackbar = true;
      },
    },
    computed: {
      ...mapState({
        error: state => state.account_component.error,
      }),
      items() {
        return   [
          {
            title: this.$i18n.t('title.home_page'),
            to: '/'
          },
          {
            title: this.$i18n.t('title.address_detail'),
          }
        ]
      }
    }
  }
</script>
