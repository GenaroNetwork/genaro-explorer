<template>
  <Tabs type="card">
      <TabPane label="Overview">
        <div>
          <template v-if="transaction">
            <Row class="info">
              <Col span="4" >{{$t('transaction_detail.id')}}:</Col>
              <Col span="18">{{transaction.id}}</Col>
            </Row>
            <Row class="info">
              <Col span="4" >{{$t('transaction_detail.hash')}}:</Col>
              <Col span="18">{{transaction.hash}}</Col>
            </Row>
            <Row class="info">
              <Col span="4" >{{$t('transaction_detail.status')}}:</Col>
              <Col span="18">
                <template v-if="statusStr === 'success'">
                  <span class="text-success">
                    {{ statusStr }}
                  </span>
                </template>
                <template v-else-if="statusStr === 'failed'">
                <span class="text-error">
                    {{ statusStr }}
                  </span> 
                </template>
              </Col>
            </Row>
            <Row class="info">
              <Col span="4" >{{$t('transaction_detail.nonce')}}:</Col>
              <Col span="18">{{transaction.nonce}}</Col>
            </Row>
            <Row class="info">
              <Col span="4">{{$t('transaction_detail.from')}}:</Col>
              <Col span="18">
                <router-link :to="`/accounts/${transaction.fromAddress}`">
                  {{transaction.fromAddress}}
                </router-link>
              </Col>
            </Row>
            <Row class="info">
              <Col span="4">{{$t('transaction_detail.to')}}:</Col>
              <Col span="18">
                <template v-if="transaction.contractAddress">
                  <router-link :to="`/contracts/${transaction.contractAddress}`">
                    Contract Creation
                  </router-link>
                </template>
                <template v-else>
                  <router-link :to="`/accounts/${transaction.toAddress}`">
                    {{transaction.toAddress}}
                  </router-link>
                </template>
              </Col>
            </Row>
            <Row class="info">
              <Col span="4">
                {{$t('transaction_detail.value')}}:
              </Col>
              <Col span="18">
                {{ transaction.value }} GNX
              </Col>
            </Row>
            <Row class="info">
              <Col span="4">
                {{$t('transaction_detail.gas_limit')}}:
              </Col>
              <Col span="18">
                {{ transaction.gasLimit }}
              </Col>
            </Row>
            <Row class="info">
              <Col span="4">
                {{$t('transaction_detail.gas_used')}}:
              </Col>
              <Col span="18">
                {{ transaction.gas }}
              </Col>
            </Row>
            <Row class="info">
              <Col span="4">
                {{$t('transaction_detail.gas_price')}}:
              </Col>
              <Col span="18">
                {{ gasPriceGnx }}
              </Col>
            </Row>
            <Row class="info">
              <Col span="4">
                {{$t('transaction_detail.nonce')}}:
              </Col>
              <Col span="18">
                {{ transaction.nonce }}
              </Col>
            </Row>
            <Row class="info">
              <Col span="4">
                {{$t('transaction_detail.input_data')}}:
              </Col>
              <Col span="18">
                <Input :value="transaction.input"
                       :autosize="true"
                       type="textarea"
                       class="input-info"/>
              </Col>
            </Row>
          </template>
        </div>
      </TabPane>
      <TabPane label="Event Logs">标签二的内容</TabPane>
   </Tabs>
  
</template>

<style lang="scss">
 .info {
    padding: 5px 40px;
  }
</style>


<script>
export default {
  name: 'transaction-iofo',
  props: ['transaction'],
  computed: {
    statusStr: function () {
      switch (this.transaction.status) {
        case 1:
          return 'success'
          break;
        default:
          break;
      }
    },

    gasPriceGnx: function() {
      return this.transaction.gasPrice
    }
  }
}
</script>
