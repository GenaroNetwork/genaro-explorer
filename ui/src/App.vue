<template>
  <div>
    <div id="header">
       <Menu mode="horizontal" theme="dark" active-name="1">
         <MenuItem name="1" to="/">
          <Icon type="ios-home" />
          {{ $t("title.home")}}
         </MenuItem>
         <MenuItem name="2" to="/blocks">
           <Icon type="ios-paper" />
          {{ $t("title.all_blocks")}}
         </MenuItem>
        <MenuItem name="3" to="/transaction">
          <Icon type="ios-people" />
          {{ $t("title.all_transactions")}}
        </MenuItem>
        </Menu>
    </div>
    <div id="main">
      <transition>
        <router-view></router-view>
      </transition>
    </div>
    <div id="footer">
      <span class="c-info">@Genaro Explorer</span>
    </div>
  </div>

</template>


<style lang="scss" scoped>
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