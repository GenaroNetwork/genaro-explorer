<template>
  <div>
    <template v-if="transaction">
      <v-tabs
        v-model="active">
        <v-tab
          key="1">
          Overview
        </v-tab>
        <v-tab
          v-if="hasLogs"
          key="2">
          Event Logs
        </v-tab>
        <v-tab-item
          key="1">
          <template v-if="transaction">
            <v-container
              grid-list-md 
              >
               <v-layout
                align-start>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.id')}}:
                </v-flex>
                <v-flex md9 xs5>
                  {{transaction.id}}
                </v-flex>
              
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.hash')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  {{transaction.hash}}
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.timestamp')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  {{transaction.timestamp | toTime | formatTime}}
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.status')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
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
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.nonce')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  {{transaction.nonce}}
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.from')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  <router-link :to="`/accounts/${transaction.from}`">
                    {{transaction.from}}
                  </router-link>
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.to')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  <template v-if="transaction.contractAddress">
                    <router-link :to="`/accounts/${transaction.contractAddress}`">
                      Contract Creation
                    </router-link>
                  </template>
                  <template v-else>
                    <router-link :to="`/accounts/${transaction.to}`">
                      {{transaction.to}}
                    </router-link>
                  </template>
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.value')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                 {{ valueGnx }} GNX
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.gas_limit')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  {{ transaction.gas }}
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.gas_used')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  {{ transaction.gasUsed }}
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.gas_price')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  {{ gasPriceGnx }}
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.fee')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  {{ txFee }}
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.nonce')}}:
                </v-flex>
                <v-flex md9 xs5 class="ellipsis-text">
                  {{ transaction.nonce }}
                </v-flex>
              </v-layout>
              <v-layout
                no-wrap>
                <v-flex md3 xs5>
                  {{$t('transaction_detail.input_data')}}:
                </v-flex>
                <v-flex md9 xs5 class="text-container">
                 <v-textarea
                    solo
                    name="input-7-4"
                    :disabled="true"
                    :value="transaction.input"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </template>
        </v-tab-item>
        <v-tab-item
          v-if="hasLogs"
          key="2">
          <v-container
            grid-list-md>
            <b>Transaction Receipt Event Logs</b>
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
                    <td class="tx-addr-table-xs">
                      <router-link :to="`/accounts/${log.address}`">{{log.address}}</router-link>
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
                    <td class="tx-addr-table-xs">[{{key}}] {{topic}}</td>
                  </tr>
                  </template>
                </template>
              </tbody>
            </table>
          </v-container>
        </v-tab-item>
      </v-tabs>
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
import bn from "big.js/big.min";

export default {
  name: "transaction-iofo",
  props: ["transaction", "error"],
  data() {
    return {
      active: null
    };
  },
  computed: {
    statusStr: function() {
      switch (this.transaction.status) {
        case 1:
          return "Success";
        case 0:
          return "Fail";
        default:
          break;
      }
    },

    valueGnx: function() {
      return this.$web3Utils.fromWei(this.transaction.value, "ether");
    },

    gasPriceGnx: function() {
      return this.$web3Utils.fromWei(this.transaction.gasPrice, "ether");
    },

    txFee: function() {
      let price = bn(this.transaction.gasPrice);
      let gasUsed = bn(this.transaction.gasUsed);
      let value = price * gasUsed;
      return this.$web3Utils.fromWei(value.toString(), "ether");
    },
    hasLogs() {
      if (!this.transaction) return false;
      //return JSON.parse(this.transaction.logs).length > 0;
    },
    logs() {
     // return JSON.parse(this.transaction.logs);
    }
  }
};
</script>
