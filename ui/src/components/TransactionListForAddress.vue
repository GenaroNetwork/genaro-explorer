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
  props: ['data', 'loading', 'addr'],
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
            let from = params.row.from;
            if (from == this.addr) {
              return h('span', from)
            }
            return h('router-link', {
                props: {
                  to: `/accounts/${from}`
                }
              }, from)
          }
        },
        {
          title: '',
          align: 'center',
          render: (h, params) => {
            let from = params.row.from;
            let to   = params.row.to;
            if (to == from && from == this.addr) {
              return h('Tag', {
                props: {
                  color: 'primary'
                }
              }, 'SALF')
            }
            if (from == this.addr) {
             return h('Tag', {
                props: {
                  color: 'warning'
                }
              }, 'OUT') 
            }
            if (to == this.addr ) {
             return h('Tag', {
                props: {
                  color: 'success'
                }
              }, 'IN')  
            }
          }
        },
        {
          title: this.$i18n.t('transaction.to'),
          key: 'to',
          ellipsis: true,
          render: (h, params) => {
            let is_contract = params.row.contractAddress? true : false;
            let to = params.row.to;
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
            }
            if (to == this.addr) {
              return h('span', to)
            }
            return h('router-link', {
                props: {
                  to: `/accounts/${to}`
                }
              }, to); 
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
