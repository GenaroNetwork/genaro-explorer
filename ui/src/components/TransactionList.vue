<template>
  <Table
    :columns="columns"
    :data="data"
    :loading="loading"
    ellipsis="true">
  </Table>
</template>


<script>


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
          title: this.$i18n.t('transaction.from'),
          key: 'fromAddress',
          ellipsis: true,
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/accounts/${params.row.fromAddress}`
              }
            }, params.row.fromAddress)
          }
        },
        {
          title: '',
          align: 'center',
          render: (h, params) => {
            return h('b', '=>')
          }
        },
        {
          title: this.$i18n.t('transaction.to'),
          key: 'toAddress',
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
                    to: `/contracts/${params.row.contractAddress}`
                  }
                }, params.row.contractAddress)
              ])
            } else {
             return h('router-link', {
                props: {
                  to: `/accounts/${params.row.toAddress}`
                }
              }, params.row.toAddress); 
            }
          }
        },
        {
          title: this.$i18n.t('transaction.value'),
          key: 'value',
        }
      ]
    }
  }
}
</script>
