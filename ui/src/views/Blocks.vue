<template>
  <div class="wrap">
    <Breadcrumb class="breadcrumb">
      <BreadcrumbItem to="/">首页</BreadcrumbItem>
      <BreadcrumbItem >{{ $t('title.all_blocks')}}</BreadcrumbItem>
    </Breadcrumb>
    <Card
      stripe="true"
      board="true">
      <h3 slot="title">{{ $t('title.all_blocks')}}</h3>
      <Table
        class="table-wrap"
        :columns="columns"
        :data="data"
        :loading="loading"
        ellipsis="true"
        size="large">
      </Table>
      <Page 
        :total="total" 
        size="small"
        show-total
        show-elevator
        show-sizer
        @on-change="changePgae"
        @on-page-size-change="changePageLimit"
        class="paginate"/>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
  .paginate {
    margin-top: 10px;
  }
</style>




<script>
import { mapState } from 'vuex';
import store from '../store';

export default {
  name: 'blocks',
  data() {
    return {
      columns: [
        {
          title: this.$i18n.t('blocks.height'),
          key: 'height',
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/blocks/${params.row.height}`
              },
            }, params.row.height)
          }
        },
        {
          title: this.$i18n.t('blocks.txn'),
          key: 'txn',
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/blocks/${params.row.txn}/txs`
              }
            }, params.row.txn)
          }
        },
        {
          title: this.$i18n.t('blocks.uncles'),
          key: 'uncles',
        },
        {
          title: this.$i18n.t('blocks.miner'),
          key: 'miner',
          ellipsis: true,
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/account/${params.row.miner}`
              },
            }, params.row.miner)
          }
        },
        {
          title: this.$i18n.t('blocks.gas_used'),
          key: 'gas_used',
        },
        {
          title: this.$i18n.t('blocks.gas_limit'),
          key: 'gas_limit',
        }
      ]
    }
  },
  created() {
    store.dispatch('get_blocks_async')
  },

  mounted() {
  },

  computed: {
    ...mapState({
      data: state => state.block_component.blocks,
      loading: state => state.block_component.loading,
      error: state => state.message.error,
      total: state => state.paginate.total
    })
  },
  methods: {
    changePgae(page) {
      store.dispatch('change_current_page_async', {page, type: 'blocks'})
    },
    changePageLimit(pageLimit) {
      store.dispatch('change_page_limit_async', pageLimit)
    }
  },
}
</script>

