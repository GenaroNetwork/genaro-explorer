<template>
  <div class="container">
    <div id="header">
      <div class="head-nav">
        <Menu mode="horizontal"
             ref="head_menu"
             theme="dark"
             :active-name="head_menu_index">
          <MenuItem name="1" to="/">
            <Icon type="ios-home" />
            {{ $t("title.home")}}
          </MenuItem>
          <MenuItem name="2" to="/blocks">
            <Icon type="ios-apps" />
            {{ $t("title.all_blocks")}}
          </MenuItem>
          <MenuItem name="3" to="/transaction">
            <Icon type="ios-paper" />
            {{ $t("title.all_transactions")}}
          </MenuItem>
          <MenuItem name="4" to="/recharge" >
            <Icon type="ios-people" />
            {{ $t("title.recharge")}}
          </MenuItem>
          <MenuItem name="5" to="http://sentinel.genaro.network" target="_blank">
            <Icon type="ios-people" />
            {{ $t("title.candidates")}}
          </MenuItem>
         
        </Menu>
      </div>
      <div class="search">
        <Input search :maxlength="100" placeholder="Search by Address / Txhash / Block" @on-search="handleSearch" v-model.trim="key"/>
      </div>
      <div class="latest_block">
        <span>{{$t("title.latest_block")}}:  {{ latest_block }}</span>
      </div>
    </div>
    <div class="wrap-main">
      <div id="main">
        <transition>
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <div id="footer">
      <span class="c-info">@Genaro Explorer</span>
    </div>
  </div>

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
  color: rgba(255,255,255,.7);
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
    color: #FFFFFF;
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
  color: #FFFFFF;
  float: right;
  margin-right: 30px;
  text-align: center;
  font-size: 14px;
}
</style>


<script>
  import { mapState } from 'vuex'
  import store from './store'

  export default {
    data: function() {
      return {
        key: ''
      }
    },
    computed: mapState({
      latest_block: state => state.latest_block,
      head_menu_index: state => state.global.head_menu_index,
    }),
    created() {
      this.getData()
    },
    mounted() {
      console.log('sada');
      this.$nextTick(() => {
        this.$refs['head_menu'].updateActiveName()
      })
    },
    methods: {
      getData() {
        store.dispatch('get_latest_block_async');
      },
      handleSearch() {
        const type = this.checkSearchType(this.key)
        console.log(type);
        switch (type) {
          case "account":
            this.$router.push({
              name: 'account_detail',
              params: {
                addr: this.key
              }
            })
            break;
          case "block":
            this.$router.push({
              name: 'block_detail',
              params: {
                height: this.key
              }
            })
            break;
          case "transaction":
            this.$router.push({
              name: 'transaction_detail',
              params: {
                hash: this.key
              }
            });
            break;
          default:
            this.$Message.warning('请输入正确的值！')
            break;
        }
        this.key = '';
      },
      checkSearchType(key) {
        if (key.startsWith('0x')) {
          if (key.length == 42) {
            return 'account'
          }
          if (key.length == 66 ) {
            return 'transaction'
          }
        }
        if (/^\d+$/.test(key)) {
          return 'block'
        }
        return 'error'
        
      }
    },
    watch: {
      '$route': 'getData'
    }
  }
</script>