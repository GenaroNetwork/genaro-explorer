<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :pagination.sync="pagination"
    :total-items="total"
    :loading="loading">
    <template slot="items" slot-scope="props">
      <td class="tx-hash-table">
        <router-link :to='`/transaction/${props.item.hash}`'>
          {{props.item.hash}}
        </router-link>
      </td>
      <td class="text-xs-left">
        <router-link :to='`/blocks/${props.item.blockNumber}`'>
          {{ props.item.blockNumber}}
        </router-link>
      </td>
      <td class="text-xs-left">
        {{formatDateTime(props.item.timestamp)}}
      </td>
      <td class="text-xs-left tx-addr-table">
        <router-link :to='`/accounts/${props.item.from}`'>
          {{props.item.from}}
        </router-link>
      </td>
      <td class="text-xs-left">
        <template v-if="props.item.from === props.item.to">
          <span> SLEF </span>
        </template>
        <template v-else>
          <img :src="`${require('@/assets/green-arrow-right.png')}`" alt="out">
        </template>
      </td>
      <td class="text-xs-left tx-addr-table">
        <router-link :to='`/accounts/${props.item.to}`'>
          {{props.item.to}}
        </router-link>
      </td>
      <td class="text-xs-left">
        {{formatValueToGnx(props.item.value)}}
      </td>
      <td>
        {{txFee(props.item)}}
      </td>
    </template>
  </v-data-table>
</template>


<script>
import bn from 'big.js/big.min'
import { mapState } from 'vuex'
import store from '../store'

export default {
  name: 'transaction_list',
  data() {
    return {
      pagination: {
        rowsPerPage: 25
      },
      headers: [
        {
          text: this.$i18n.t('transaction.hash'),
          class: 'tx-hash-table',
          sortable: false
        },
        {
          text: this.$i18n.t('transaction.block_number'),
          align: 'left'
        },
        {
          text: this.$i18n.t('transaction.timestamp'),
          align: 'left',
          class: 'timestamp'
        },
        {
          text: this.$i18n.t('transaction.from'),
          align: 'left',
          sortable: false,
          class: 'tx-addr-table'
        },
        {
          text: '',
          align: 'left',
          sortable: false
        },
        {
          text: this.$i18n.t('transaction.to'),
          align: 'left',
          sortable: false,
          class: 'tx-addr-table'
        },
        {
          text: this.$i18n.t('transaction.value'),
          align: 'left',
          sortable: false,
        },
        {
          text: this.$i18n.t('transaction.txfee'),
          align: 'left',
          sortable: false,
        }
      ],
    }
  },
  computed: {
    ...mapState({
      data: state => state.transaction_component.transactions,
      loading: state => state.transaction_component.loading,
      error: state => state.message.error,
      total: state => state.transaction_component.total,
      offset: state => state.transaction_component.offset,
      limit: state => state.transaction_component.limit,
    })
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
    },
    changePgae(page) {
      store.dispatch('transaction_component/change_current_page_async', { page })
    },
    changePageLimit(limit) {
      store.dispatch('transaction_component/change_page_limit_async', limit);
    }
  },
  watch: {
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
