<template>
  <v-app id='genaro'>
     <v-navigation-drawer
      class="grey lighten-4"
      left
      app
      fixed
      v-model="drawer"
    >
      <v-list
        dense
        class="grey lighten-4"
      >
        <template v-for="(item, i) in items">
          <v-layout
            row
            v-if="item.heading"
            align-start
            :key="i"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-right">
              <v-btn small flat>edit</v-btn>
            </v-flex>
          </v-layout>
          <v-divider
            dark
            v-else-if="item.divider"
            class="my-3"
            :key="i"
          ></v-divider>
          <v-list-tile
            :key="i"
            v-else
            @click="handleClick(item.link)"
          >
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="lime" app fixed >
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5" to="/" @click="toHome">Genaro&nbsp;<span class="font-weight-light">explore</span></span>
      <v-text-field
        solo
        flat
        label="Search"
        prepend-inner-icon="search"
        v-model="key"
        @keyup.enter="handleSearch"
      ></v-text-field>
      <v-spacer></v-spacer>
    </v-toolbar>
     
    <v-content>
      <v-container fluid fill-height class="grey lighten-4">
        <v-layout justify-center align-start>
          <v-flex >
            <transition>
              <router-view></router-view>
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
</style>


<script>
import { mapState } from "vuex";
import store from "./store";

export default {
  data: function() {
    return {
      key: "",
      drawer: false,
      items: [
        { icon: "domain", 
          text: this.$i18n.t("title.all_blocks"),
          link: '/blocks' },
        {
          icon: "insert_drive_file",
          text: this.$i18n.t("title.all_transactions"),
          link: '/transaction',
        },
        { icon: "attach_money", 
          text: this.$i18n.t("title.recharge"),
          link: '/recharge' },
        { icon: "group", 
          text: this.$i18n.t("title.committee"),
          link: '/committee' },
      ]
    };
  },
  computed: mapState({
    latest_block: state => state.latest_block,
    head_menu_index: state => state.global.head_menu_index
  }),
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
          this.$Message.warning("请输入正确的值！");
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
      console.log(to)
      this.$router.push(to);
      this.drawer = !this.drawer;
    },
    toHome() {
      this.$router.push('/')
    }
  },
  watch: {
    $route: "getData"
  }
};
</script>