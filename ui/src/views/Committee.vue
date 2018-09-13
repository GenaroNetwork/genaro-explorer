<template>
  <div class="wrap">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="/">首页</BreadcrumbItem>
      <BreadcrumbItem >{{ $t('title.committee')}}</BreadcrumbItem>
    </Breadcrumb>
    <Card
      stripe="true"
      board="true">
      <h3 slot="title">
        <template v-if="tabIndex == '1'">
          本届委员会
          <span class="extraInfo">
            &nbsp&nbsp
            第{{ session }}届委员会
            &nbsp&nbsp
            更新区块: {{thisRoundFirstBlock}}
            &nbsp&nbsp&nbsp&nbsp
            次届委员会更新区块: {{nextRoundFirstBlock}}
          </span>
        </template>
        <template v-else-if="tabIndex == '2'">
          当前出块节点
          <span class="extraInfo">
            &nbsp&nbsp
            第{{ session - 1 }}届委员会
            &nbsp&nbsp
            更新区块: {{thisRoundFirstBlock - 86400 }}
            &nbsp&nbsp&nbsp&nbsp
            次届委员会更新区块: {{nextRoundFirstBlock - 86400}}
          </span>
        </template>
       
      </h3>
      <Tabs value="1" @on-click="switchTab">
        <TabPane label="本届委员会" name="1">
          <committee-list :data="currentCommittee" :loading="loading" />
        </TabPane>
        <TabPane label="当前出块节点" name="2">
          <committee-list :data="prevCommittee" :loading="loading" />
        </TabPane>
       </Tabs>
    </Card>
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
      tabIndex: "1"
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

