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
        page-size="30"
        size="large">
      </Table>
      <Page 
        :total="total" 
        show-total
        show-elevator
        show-sizer
        :page-size="limit"
        :page-size-opts="[30,60]"
        @on-change="changePgae"
        @on-page-size-change="changePageLimit"
        class="paginate"/>
    </Card>
  </div>
</template>

<style lang="scss">
  .paginate {
    margin-top: 10px;
  }
</style>

<script>
import { mapState } from 'vuex';
import store from '@/store';

export default {
  name: 'blocks',
  data() {
    return {
      columns: [
        {
          title: this.$i18n.t('blocks.height'),
          key: 'number',
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/blocks/${params.row.number}`
              },
            }, params.row.number)
          }
        },
        {
          title: this.$i18n.t('blocks.txn'),
          key: 'txn',
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/blocks/${params.row.number}/txs`
              }
            }, this.count(params.row.transactions))
          }
        },
        {
          title: this.$i18n.t('blocks.timestamp'),
          key: 'txn',
          render: (h, params) => {
            return h('span',[
              this.formatDateTime(params.row.timestamp)
            ])
          }
        },
        {
          title: this.$i18n.t('blocks.uncles'),
          key: 'uncles',
          render: (h, params) => {
            return h('p', this.count(params.row.uncles))
          }
        },
        {
          title: this.$i18n.t('blocks.miner'),
          key: 'miner',
          ellipsis: true,
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/accounts/${params.row.miner}`
              },
            }, params.row.miner)
          }
        },
        {
          title: this.$i18n.t('blocks.gas_used'),
          key: 'gasUsed',
        },
        {
          title: this.$i18n.t('blocks.gas_limit'),
          key: 'gasLimit',
        }
      ]
    }
  },
  created() {
    store.dispatch('get_blocks_async', {
      offset: this.offset,
      limit: this.limit
    })
  },

  mounted() {
  },

  computed: {
    ...mapState({
      data: state => state.block_component.blocks,
      loading: state => state.block_component.loading,
      error: state => state.message.error,
      total: state => state.paginate.total,
      offset: state => state.paginate.offset,
      limit: state => state.paginate.limit,
    })
  },
  methods: {
    changePgae(page) {
      store.dispatch('change_current_page_async', {page, type: 'blocks'})
    },
    changePageLimit(pageLimit) {
      store.dispatch('change_page_limit_async', pageLimit)
    },
    count(transactions) {
      if (transactions) {
        return transactions.split(",").length;
      }else{
        return 0;
      }
    },
    formatDateTime(timestamp) {
      return this.$dayjs(new Date(parseInt(timestamp* 1000))).format('YYYY-MM-DD HH:mm:ss')
    }

  },
}
</script>

