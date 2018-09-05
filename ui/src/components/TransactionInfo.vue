<template>
  <div>
    <template v-if="error">
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
                <Col span="4" >{{$t('transaction_detail.timestamp')}}:</Col>
                <Col span="18">{{transaction.timestamp | toTime | formatTime}}</Col>
              </Row>
              <Row class="info">
                <Col span="4" >{{$t('transaction_detail.status')}}:</Col>
                <Col span="18">
                  <template v-if="statusStr === 'Success'">
                    <span class="text-success">
                      {{ statusStr }}
                    </span>
                  </template>
                  <template v-else-if="statusStr === 'Fail'">
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
                  <router-link :to="`/accounts/${transaction.from}`">
                    {{transaction.from}}
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
                    <router-link :to="`/accounts/${transaction.to}`">
                      {{transaction.to}}
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
                  {{ transaction.gas }}
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
                  {{$t('transaction_detail.fee')}}:
                </Col>
                <Col span="18">
                  {{ txFee }}
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
        <TabPane label="Event Logs" v-if="transaction && hasLogs" >
          <b>Transaction Receipt Event Logs </b>
          <br>
          <br>
          <table>
            <tbody>
              <template v-for="log in logs" >
                <tr :key="log.id">
                  <td>[{{log.logIndex}}]</td>
                  <td>
                    &nbsp;&nbsp;&nbsp;
                    <b>Address</b>
                    &nbsp;&nbsp;&nbsp;
                  </td>
                  <td>
                    <router-link to="`/accounts/${log.address}`">{{log.address}}</router-link>
                  </td>
                </tr>
                <template v-for="(topic, key) in log.topics">
                  <tr :key="topic">
                  <td></td>
                  <td>
                    <template v-if="key == 0">
                      &nbsp;&nbsp;&nbsp;
                      Topics
                      &nbsp;&nbsp;&nbsp;
                    </template>
                  </td>
                  <td>[{{key}}] {{topic}}</td>
                </tr>
                </template>
              </template>
            </tbody>
          </table>
        </TabPane>
      </Tabs>
    </template>
    <template v-else>
      <div class="show-error">
        Unable to locate Transaction #{{this.$route.params.hash}}
      </div>
    </template>
  </div>
  
</template>

<style lang="scss">
 .info {
    padding: 5px 40px;
  }
</style>


<script>
import bn from 'big.js/big.min'
import { mapState } from 'vuex'

export default {
  name: 'transaction-iofo',
  props: ['transaction', 'error'],
  computed: {
    statusStr: function () {
      switch (this.transaction.status) {
        case 1:
          return 'Success'
        case 0:
          return 'Fail';
        default:
          break;
      }
    },

    gasPriceGnx: function() {
      return this.$web3Utils.fromWei(this.transaction.gasPrice, 'ether')
    },

    txFee: function() {
      let price = bn(this.transaction.gasPrice);
      let gasUsed = bn(this.transaction.gasUsed);
      let value = price * gasUsed;
      return this.$web3Utils.fromWei(value.toString(), 'ether');
    },
    hasLogs() {
      return JSON.parse(this.transaction.logs).length > 0;
    },
    logs() {
      return JSON.parse(this.transaction.logs);
    },
  }
}
</script>
