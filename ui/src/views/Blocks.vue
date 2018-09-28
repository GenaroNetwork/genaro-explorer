<template>
  <div>
    <v-breadcrumbs divider="/">
      <v-breadcrumbs-item
        v-for="item in items"
        :key="item.text"
        append
        :to="item.to">
        {{ item.title }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <v-layout
      align-start>
      <v-flex>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">{{$t('title.all_blocks')}}</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="data"
              class="elevation-1"
              :loading="loading"
              :pagination.sync="pagination"
              :total-items="total"
            >
              <template slot="items" slot-scope="props">
                <td>
                  <router-link :to='`/blocks/${props.item.number}`'>
                    {{ props.item.number }}
                  </router-link>
                </td>
                <td class="text-xs-left">
                  <router-link :to='`/blocks/${props.item.number}/txs`'>
                    {{count(props.item.transactions) }}
                  </router-link>
                </td>
                <td class="text-xs-left">{{ formatDateTime(props.item.timestamp)}}</td>
                <td class="text-xs-left">{{ count(props.item.uncles) }}</td>
                <td class="text-xs-left">
                  <router-link :to='`/accounts/${props.item.miner.toLowerCase()}`'>
                    {{props.item.miner.toLowerCase()}}
                  </router-link>
                </td>
                <td class="text-xs-left">{{ props.item.gasUsed }}</td>
                <td class="text-xs-left">{{ props.item.gasLimit }}</td>

              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
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
      pagination: {
        rowsPerPage: 25
      },
      items: [
        {
          title: '首页',
          to: '/'
        },
        {
          title: this.$i18n.t('title.all_blocks'),
        }
      ],
      headers: [
          {
            text: this.$i18n.t('blocks.height'),
            align: 'left',
            sortable: false,
            value: 'number'
          },
          {
            text: this.$i18n.t('blocks.txn'),
            align: 'left',
            sortable: false,
            value: 'transactions'
          },
          {
            text: this.$i18n.t('blocks.timestamp'),
            align: 'left',
            sortable: false,
            class: 'timestamp',
            value: 'timestamp'
          },
          {
            text: this.$i18n.t('blocks.uncles'),
            align: 'left',
            sortable: false,
            value: 'timestamp' 
          },
           {
            text: this.$i18n.t('blocks.miner'),
            align: 'left',
            sortable: false,
            value: 'miner' 
          },
          {
            text: this.$i18n.t('blocks.gas_used'),
            align: 'left',
            sortable: false,
            value: 'gasUsed'
          },
           {
            text: this.$i18n.t('blocks.gas_limit'),
            align: 'left',
            sortable: false,
            value: 'gasLimit'
          }
          
        ],
    }
  },

  created() {
    this.initData();
  },


  computed: {
    ...mapState({
      data: state => state.block_component.blocks,
      loading: state => state.block_component.loading,
      error: state => state.message.error,
      total: state => state.block_component.total,
      offset: state => state.block_component.offset,
      limit: state => state.block_component.limit,
    })
  },
  methods: {
    initData() {
      store.dispatch('block_component/get_blocks_async', {
        offset: this.offset,
        limit: this.limit
      });
      store.commit('change_head_menu_index', "2")
    },
    changePgae(page) {
      store.dispatch('block_component/change_current_page_async', { page })
    },
    changePageLimit(pageLimit) {
      store.dispatch('block_component/change_page_limit_async', pageLimit)
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

  watch: {
    '$route': 'initDate',
    "pagination.page": {
      handler() {
        const { sortBy, descending, page, rowsPerPage } = this.pagination
        this.changePgae(page)
      }
    },
    "pagination.rowsPerPage": {
      handler() {
        console.log(this.pagination.rowsPerPage)
        const { sortBy, descending, page, rowsPerPage } = this.pagination
        this.changePageLimit(rowsPerPage)
        this.changePgae(page)

      }
    }
  }
}
</script>

