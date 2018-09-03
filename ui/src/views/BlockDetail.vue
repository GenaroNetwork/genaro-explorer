<template>
  <div class="wrap">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="/">首页</BreadcrumbItem>
      <BreadcrumbItem to="/blocks">{{ $t('title.all_blocks')}}</BreadcrumbItem>
      <BreadcrumbItem >{{ $t('title.block_detail')}}</BreadcrumbItem>
    </Breadcrumb>
    <Card border="none">
      <h3 slot="title">{{$t('title.block_detail')}}: <span>&nbsp&nbsp#{{height}}</span> </h3>
      <template v-if="block">
        <Row class="info">
          <Col span="4" >{{$t('block_detail.id')}}:</Col>
          <Col span="18">{{block.id}}</Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.number')}}:</Col>
          <Col span="18">{{block.number}}</Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.timestamp')}}:</Col>
          <Col span="18">
            {{ block.timestamp | toTime | formatTime}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.transactions')}}:</Col>
          <Col span="18">
            <router-link :to="`/blocks/${block.number}/txs`">{{block.transactions.split(',').length}}</router-link>
           in this block 
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.hash')}}:</Col>
          <Col span="18">{{block.hash}}</Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.parent_hash')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.parentHash}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.sha3uncles')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.sha3Uncles}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.miner')}}:</Col>
          <Col span="18">
            <router-link :to="'/accounts/' + block.miner">{{block.miner}}</router-link>
            <!-- {{block.miner}} -->
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.diffculty')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.difficulty}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.total_diffculty')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.totalDifficulty}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.size')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.size}} bytes
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.gas_used')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.gasUsed}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.gas_limit')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.gasLimit}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.nonce')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.nonce}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >{{$t('block_detail.extra_data')}}:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            <Input 
              type="textarea"
              :autosize="true"
              :value="block.extraData"
              class="input-info"/>
          </Col>
        </Row>
      </template>
      <template v-else>
        <div class="spin-container">
          <Spin size="large"></Spin>
        </div>
      </template>
    </Card>
  </div> 
</template>


<style lang="scss" scoped>
 .info {
    padding: 5px 40px;
  }

  .tip {
    color: #3498db;
  }
  h3 {
    span {
      font-size: 14px;
      font-weight: 400;
    }
  }
  .spin-container {
    display: flex;
    justify-content: center;
  }
</style>


<script>
import { mapState } from 'vuex'
import store from "@/store";
export default {
  name: 'block-detail',
  props: ['height'],
  created() {
    const height = this.height;
    store.dispatch('get_get_block_detail_async', height);
  },
  computed: {
    ...mapState({
      block: state => state.block_component.block
    })
  }
}
</script>

