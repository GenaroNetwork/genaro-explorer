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
    <v-layout>
      <v-flex>
        <v-card>
          <v-card-title primary-title>
              <template v-if="active == 0">
                <v-layout
                  wrap
                  row>
                  <v-flex md2 xs12>
                     <h3>本届委员会:</h3>
                  </v-flex>
                  <v-flex md2 xs12>
                     <span class="extraInfo">
                      第{{ session }}届委员会
                      
                    </span>
                  </v-flex>
                  <v-flex md2 xs12>
                    <span class="extraInfo">
                      更新区块: {{thisRoundFirstBlock}}
                    </span>
                  </v-flex>
                  <v-flex md3 xs12>
                    <span class="extraInfo">
                      次届委员会更新区块: {{nextRoundFirstBlock}}
                    </span>
                  </v-flex>
                </v-layout>
              </template>
              <template v-else-if="active == 1">
                <v-layout
                  row
                  wrap>
                  <v-flex md2 xs12>
                    <h3>当前出块节点:</h3>
                  </v-flex>
                  <v-flex md2 xs12>
                    <span class="extraInfo">
                      第{{ session - 1 }}届委员会
                      
                    </span>
                  </v-flex>
                  <v-flex md2 xs12>
                    <span class="extraInfo">
                      更新区块: {{thisRoundFirstBlock - 86400 }}
                    </span>
                  </v-flex>
                  <v-flex md3 xs12>
                    <span class="extraInfo">
                      次届委员会更新区块: {{nextRoundFirstBlock - 86400}}
                    </span>
                  </v-flex>
                </v-layout>
              </template>
          </v-card-title>
          <v-card-text>
            <v-tabs
              v-model="active">
              <v-tab
                key="1">
                本届委员会
              </v-tab>
              <v-tab
                key="2">
                当前出块节点
              </v-tab>
              <v-tab-item
                key="1">
                <committee-list :data="currentCommittee" :loading="loading" />
              </v-tab-item>
              <v-tab-item
                key="2">
                <committee-list :data="prevCommittee" :loading="loading" />
              </v-tab-item>
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<style lang="scss" scoped>
.extraInfo {
  font-size: 13px;
  color: #828282;
  font-weight: normal;
}
</style>


<script>
import { mapState } from "vuex";
import CommitteeList from "@/components/CommitteeList.vue";
import store from "@/store";

export default {
  name: "committee",
  components: { CommitteeList },
  data() {
    return {
      active: 0,
      tabIndex: "1",
      items: [
        {
          title: '首页',
          to: '/',
          disabled: false
        },
        {
          title: this.$i18n.t('title.committee'),
          to: '/transaction',
          disabled: true
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  methods: {
    switchTab(name) {
      switch (name) {
        case "1":
          this.tabIndex = "1";
          break;
        case "2":
          this.tabIndex = "2";
          break;
        default:
          break;
      }
    },
    getData() {
      store.dispatch("get_current_committee_async");
      store.dispatch("get_prev_committee_async");
      store.dispatch("get_committee_info");
    }
  },
  computed: {
    ...mapState({
      loading: state => state.committee_component.loading,
      currentCommittee: state => state.committee_component.currentCommittee,
      prevCommittee: state => state.committee_component.prevCommittee,
      thisRoundFirstBlock: state =>
        state.committee_component.thisRoundFirstBlock,
      nextRoundFirstBlock: state =>
        state.committee_component.nextRoundFirstBlock,
      session: state => state.committee_component.session
    })
  }
};
</script>

