<template>
  <Table
    :columns="columns"
    :data="data"
    :loading="loading"
    ellipsis="true">
  </Table>
</template>


<script>
import bn from 'big.js/big.min'

export default {
  name: 'transaction_list',
  props: ['data', 'loading'],
  data() {
    return {
      columns: [
        {
          title: this.$i18n.t('transaction.hash'),
          key: 'hash',
          ellipsis: true,
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/transaction/${params.row.hash}`
              }
            }, params.row.hash)
          }
        },
        {
          title: this.$i18n.t('transaction.block_number'),
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/blocks/${params.row.blockNumber}`
              }
            }, params.row.blockNumber)
          }
        },
        {
          title: this.$i18n.t('transaction.timestamp'),
          key: 'timestamp',
          render: (h, params) => {
            return h('span', this.formatDateTime(params.row.timestamp))
          }
        },
        {
          title: this.$i18n.t('transaction.from'),
          key: 'from',
          ellipsis: true,
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/accounts/${params.row.from}`
              }
            }, params.row.from)
          }
        },
        {
          title: '',
          align: 'center',
          render: (h, params) => {
            let to   = params.row.from;
            let from = params.row.to;
            if (to === from) {
              return h('Tag', {
                props: {
                  color: 'primary'
                }
              }, 'SLEF')
            } else {
              return h('img', {
                attrs: {
                  alt: 'out',
                  src: require('@/assets/green-arrow-right.png')
                },
              })
            }
          }
        },
        {
          title: this.$i18n.t('transaction.to'),
          key: 'to',
          ellipsis: true,
          render: (h, params) => {
            let is_contract = params.row.contractAddress? true : false;
            if (is_contract) {
              return h('p', [
                h('Icon', {
                  props: {
                    type: 'md-copy'
                  }
                }),
                h('router-link', {
                  props: {
                    to: `/accounts/${params.row.contractAddress}`
                  }
                }, params.row.contractAddress)
              ])
            } else {
             return h('router-link', {
                props: {
                  to: `/accounts/${params.row.to}`
                }
              }, params.row.to); 
            }
          }
        },
        {
          title: this.$i18n.t('transaction.value'),
          key: 'value',
          render: (h, params) => {
            return h('span', this.formatValueToGnx(params.row.value))
          }
        },
        {
          title: this.$i18n.t('transaction.txfee'),
          key: 'value',
          render: (h, params) => {
            return h('span',[
              this.txFee(params.row)
            ])
          }
        }
      ]
    }
  },
  methods: {
    txFee(tx) {
      let price = bn(tx.gasPrice);
      let gasUsed = bn(tx.gasUsed);
      let value = price * gasUsed;
      return this.$web3Utils.fromWei(value.toString(), 'ether');
    },
    formatDateTime(timestamp) {
      return this.$dayjs(new Date(parseInt(timestamp* 1000))).format('YYYY-MM-DD HH:mm:ss')
    },
    formatValueToGnx(value) {
      return this.$web3Utils.fromWei(value, 'ether');
    }
  }
}
</script>
