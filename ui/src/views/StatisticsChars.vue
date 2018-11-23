<template>
  <v-layout
    align-start>
    <v-flex>
      <v-card>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{$t('title.statistics')}}</h3>
          </div>
        </v-card-title>
        <v-card-text>
          <v-layout
             row wrap>
            <v-flex xs12 md6>
              <v-chart :options="transactionCountInLatestTenBlockOption" :auto-resize="true"/>
            </v-flex>
            <v-flex xs12 md6>
              <v-chart :options="gnxUsedInLatestTenBlockOption" :auto-resize="true"/>
            </v-flex>
            <v-flex xs12 md6>
              <v-chart :options="gnxUsedInLatestTenTxOption" :auto-resize="true"/>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>


<script>
import ECharts from 'vue-echarts/components/ECharts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/geo'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/dataset'

import { mapState } from 'vuex'
import store from '@/store'

export default {
  data: function () {
    return {
      timer_one: null,
      timer_two: null,
      timer_three: null,
    }
  },
  created() {
    store.dispatch('get_transactionCountInLatestTenBlock_async')
    store.dispatch('get_gnxUsedInLatestTenBlock_async')
    store.dispatch('get_gnxUsedInLatestTenTx_async')
    this.timer_one = setInterval(function() {
      store.dispatch('get_transactionCountInLatestTenBlock_async')
    }, 5000)
    this.timer_two = setInterval(function() {
      store.dispatch('get_gnxUsedInLatestTenBlock_async')
    }, 5000)
    this.timer_three = setInterval(function() {
      store.dispatch('get_gnxUsedInLatestTenTx_async')
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer_one)
    clearInterval(this.timer_two)
    clearInterval(this.timer_three)
  },
  computed: {
    ...mapState({
      transactionCountInLatestTenBlockOption: state => {
        const { xAxis, yAxis} = state.statistics_component.transactionCountInLatestTenBlock
        return {
            title: {
              text: '最近10个区块交易量'
            },
            color: ['#3398DB'],
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                  type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data:['交易量']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis : [
              {
                type : 'category',
                data : xAxis,
                axisTick: {
                    alignWithLabel: true
                }
              }
            ],
            yAxis : [
              {
                type : 'value'
              }
            ],
            series : [
              {
                name:'交易量',
                type:'bar',
                barWidth: '60%',
                data: yAxis
              }
            ]
        }
      },
      gnxUsedInLatestTenBlockOption: state => {
        const {xAxis, yAxis } = state.statistics_component.gnxUsedInLatestTenBlock
        return {
          color: ['#3398DB'],
          title: {
            text: '最近10个区块GNX使用量'
          },
          tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data:['GNX使用量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis : [
            {
              type : 'category',
              data : xAxis,
              axisTick: {
                  alignWithLabel: true
              }
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'GNX使用量',
              type:'bar',
              barWidth: '60%',
              data: yAxis
            }
          ]
        }
      },
      gnxUsedInLatestTenTxOption: state => {
        const { xAxis, yAxis } = state.statistics_component.gnxUsedInLatestTenTx
        return {
         color: ['#3398DB'],
        title: {
          text: '最近10个交易GNX使用量'
        },
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
            data:['GNX使用量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : xAxis,
            axisTick: {
                alignWithLabel: true
            },
            show: false
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
            {
              name:'GNX使用量',
              type:'bar',
              barWidth: '60%',
              data: yAxis
            }
          ]
        }
      },
    }),

  },
}
</script>
