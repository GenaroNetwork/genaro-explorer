<template>
  <div>
    <div id="header">
       <Menu mode="horizontal" theme="dark" active-name="1">
        <MenuItem name="1">
            <Icon type="ios-paper" />
            <router-link to="/blocks">
              区块
            </router-link>
        </MenuItem>
        <MenuItem name="2">
            <Icon type="ios-people" />
            <router-link to="txs">
              交易
            </router-link>
        </MenuItem>
        <MenuItem name="3">
            <Icon type="ios-construct" />
            <router-link to="accounts">
              账户
            </router-link>
        </MenuItem>
        </Menu>
    </div>
    <div id="main">
      <transition>
        <router-view></router-view>
      </transition>
    </div>
    <div id="footer">
      footer
    </div>
  </div>

</template>


<style lang="scss" scoped>
a {
  text-decoration: none;
  color: rgba(255,255,255,.7);
}
</style>


<script>
  import { mapState } from 'vuex'
  import store from './store'

  export default {
    computed: mapState({
      latest_block: state => state.latest_block
    }),
    created() {
      store.dispatch('get_latest_block_async')
    }
  }
</script>