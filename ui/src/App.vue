<template>
  <v-app id="genaro">
    <v-snackbar v-model="snackbar" :timeout="6000" :top="true" color="error">
      {{ message_text}}
      <v-btn dark flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>

    <v-navigation-drawer class="grey lighten-4" left app fixed v-model="drawer">
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in items">
          <v-layout row v-if="item.heading" align-start :key="i">
            <v-flex xs6>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn small flat>edit</v-btn>
            </v-flex>
          </v-layout>
          <v-divider dark v-else-if="item.divider" class="my-3" :key="i"></v-divider>

          <v-list-group :key="i" prepend-icon="school" v-else-if="item.nested.length > 0">
            <v-list-tile slot="activator">
              <v-list-tile-title>{{item.text}}</v-list-tile-title>
            </v-list-tile>
            <v-list-tile
                    v-for="(n_item,j) in item.nested"
                    :key="j"
                    @click="handleClick(n_item.link)"
            >
              <v-list-tile-title v-text="n_item.text"></v-list-tile-title>
            </v-list-tile>
          </v-list-group>

          <v-list-tile :key="i" v-else @click="handleClick(item.link)">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="indigo darken-4" dark app fixed>
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>
        <span class="title ml-3 mr-5" to="/" @click="toHome">Genaro&nbsp;
          <span class="font-weight-light">explorer</span>
        </span>
      </v-toolbar-title>
      <v-text-field
              solo
              light
              label="Search"
              prepend-inner-icon="search"
              v-model="key"
              @keyup.enter="handleSearch"
              class="search"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-menu right>
        <v-btn @click="setLang" slot="activator" dark icon>
          <span v-if="selecedLocale == 'en_us'">中文</span>
          <span v-else>EN</span>
        </v-btn>
      </v-menu>
      <span class="netMode" v-if="netMode == 'mainNet'">{{ $i18n.t('title.mainNet')}}</span>
      <span class="netMode" v-if="netMode == 'testNet'">{{ $i18n.t('title.testNet')}}</span>
      <v-menu right>
        <v-btn slot="activator" dark icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list dark>
          <v-list-tile v-if="netMode == 'testNet'" @click="setNetMode('mainNet')">
            <v-list-tile-title>{{$i18n.t('title.mainNet')}}</v-list-tile-title>
          </v-list-tile>
          <!--<v-list-tile v-if="netMode == 'mainNet'" @click="setNetMode('testNet')">-->
            <!--<v-list-tile-title>{{$i18n.t('title.testNet')}}</v-list-tile-title>-->
          <!--</v-list-tile>-->
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-content>
      <v-container fluid fill-height class="grey lighten-4">
        <v-layout justify-center align-start>
          <v-flex>
            <transition>
              <router-view :key="$route.fullPath"></router-view>
            </transition>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>


<style lang="scss" scoped>
  $HEAD_CLOLR: #515a6e;

  #header {
    background: $HEAD_CLOLR;
    overflow: hidden;
  }
  .head-nav {
    float: left;
  }
  a {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.7);
  }
  .ivu-menu-item-selected {
    margin-bottom: -1px;
    // border-bottom: 1px solid #000000;
  }
  #footer {
    background: #515a6e;
    height: 40px;
    line-height: 40px;
    padding: 0 30px;
    .c-info {
      color: #ffffff;
    }
  }
  .search {
    float: left;
    margin-left: 30px;
    height: 60px;
    line-height: 60px;
    width: 300px;
  }
  .latest_block {
    height: 60px;
    line-height: 60px;
    color: #ffffff;
    float: right;
    margin-right: 30px;
    text-align: center;
    font-size: 14px;
  }
  .netMode {
    font-size: 16px;
    color: #ffffff;
    font-weight: 400;
    padding: 5px 20px;
    text-align: center;
    line-height: 38px;
  }
  @media screen and (max-width: 768px) {
    .netMode {
      display: none;
    }
  }
  @media screen and (max-width: 425px) {
    .search {
      display: none;
    }
  }
  .v-toolbar__title {
    text-overflow: clip !important;
  }
</style>


<script>
  import { mapState } from "vuex";
  import store from "./store";

  export default {
    data: function() {
      const API_ENV = localStorage.getItem("api_env");
      const selecedLocale = localStorage.getItem("selectedLocale") || "zh_cn";
      return {
        key: "",
        drawer: false,
        message_text: "",
        snackbar: false,
        netMode: localStorage.getItem("api_env"),
        selecedLocale
      };
    },
    computed: {
      ...mapState({
        latest_block: state => state.latest_block,
        head_menu_index: state => state.global.head_menu_index
      }),
      items() {
        const API_ENV = localStorage.getItem("api_env");

        let items = [
          {
            icon: "domain",
            text: this.$i18n.t("title.all_blocks"),
            link: "/blocks",
            nested: []
          },
          {
            icon: "insert_drive_file",
            text: this.$i18n.t("title.all_transactions"),
            link: "/transaction",
            nested: []
          },
          {
            icon: "attach_money",
            text: this.$i18n.t("title.recharge"),
            link: "/recharge",
            nested: []
          },
          {
            icon: "gavel",
            text: this.$i18n.t("title.block_rate_title"),
            link: "/gen_block_query",
            nested: []
          },
          {
            icon: "group",
            text: this.$i18n.t("title.committee"),
            link: "/committee",
            nested: []
          },
          {
            icon: "tool",
            text: this.$i18n.t("title.tool"),
            link: null,
            nested: [
              {
                text: this.$i18n.t("title.submit_tx"),
                link: "/tx/submit"
              },
              {
                text: this.$i18n.t("title.verify_contract"),
                link: "/contract/verify"
              },
              {
                text: this.$i18n.t("title.verify_signature"),
                link: "/signature/verify"
              }
            ]
          }
        ];
        if (API_ENV == "mainNet") {
          items = items.filter(item => {
            if (item.icon === "tool" || item.icon === "attach_money") {
              return false;
            } else {
              return true;
            }
          });
        }
        return items;
      }
    },
    created() {
      this.getData();
    },
    methods: {
      getData() {
        store.dispatch("get_latest_block_async");
      },
      handleSearch() {
        const type = this.checkSearchType(this.key);
        console.log(type);
        const key = this.key.toLowerCase();
        switch (type) {
          case "account":
            this.$router.push({
              name: "account_detail",
              params: {
                addr: key
              }
            });
            break;
          case "block":
            this.$router.push({
              name: "block_detail",
              params: {
                height: key
              }
            });
            break;
          case "transaction":
            this.$router.push({
              name: "transaction_detail",
              params: {
                hash: key
              }
            });
            break;
          default:
            this.message_text = "请输入正确的值！";
            this.snackbar = true;
            break;
        }
        this.key = "";
      },
      checkSearchType(key) {
        if (key.startsWith("0x")) {
          if (key.length == 42) {
            return "account";
          }
          if (key.length == 66) {
            return "transaction";
          }
        }
        if (/^\d+$/.test(key)) {
          return "block";
        }
        return "error";
      },
      handleClick(to) {
        console.log(to);
        this.$router.push(to);
        this.drawer = !this.drawer;
      },
      toHome() {
        this.$router.push("/");
      },
      setNetMode(netMode) {
        this.netMode = netMode;
        localStorage.setItem("api_env", netMode);
        location.reload();
      },
      setLang() {
        const selecedLocale = this.selecedLocale;
        if (selecedLocale == "zh_cn") {
          this.$i18n.locale = "en_us";
          localStorage.setItem("selectedLocale", "en_us");
          this.selecedLocale = "en_us";
        } else {
          this.$i18n.locale = "zh_cn";
          localStorage.setItem("selectedLocale", "zh_cn");
          this.selecedLocale = "zh_cn";
        }
      }
    },
    watch: {
      $route: "getData"
    }
  };
</script>