<template>
  <div class="wrap">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="/">首页</BreadcrumbItem>
      <BreadcrumbItem to="/blocks">{{ $t('title.all_blocks')}}</BreadcrumbItem>
      <BreadcrumbItem >{{ $t('title.block_detail')}}</BreadcrumbItem>
    </Breadcrumb>
    <Card border="none">
      <h3 slot="title">{{$t('title.block_detail')}}: <span>&nbsp&nbsp#{{height}}</span> </h3>
        <Row class="info">
          <Col span="4" >ID:</Col>
          <Col span="18">{{block.id}}</Col>
        </Row>
        <Row class="info">
          <Col span="4" >Number:</Col>
          <Col span="18">{{block.number}}</Col>
        </Row>
        <Row class="info">
          <Col span="4" >Transactions:</Col>
          <Col span="18"><span class="tip">{{block.transactions.split(',').length}}</span> in this block </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Hash:</Col>
          <Col span="18">{{block.hash}}</Col>
        </Row>
        <Row class="info">
          <Col span="4" >ParentHash:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.parentHash}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Sha3Uncles:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.sha3Uncles}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Mined By:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.miner}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Difficulty:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.difficulty}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >TotalDifficulty:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.totalDifficulty}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Size:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.size}} bytes
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Gas Used:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.gasUsed}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Gas Limit:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.gasLimit}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Nonce:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.nonce}}
          </Col>
        </Row>
        <Row class="info">
          <Col span="4" >Extra Data:</Col>
          <Col span="18">
            <!-- <router-link :to="block.parentHash">{{block.parentHash}}</router-link> -->
            {{block.extraData.slice(0, 60)}}
          </Col>
        </Row>
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
</style>


<script>
import { mapState } from 'vuex'
import store from "../store";
export default {
  name: 'block-detail',
  props: ['height'],
  created() {
    const height = 87;
    store.dispatch('get_get_block_detail_async', height);
  },
  computed: {
    ...mapState({
      block: state => state.block_component.block
    })
  }
}
</script>

