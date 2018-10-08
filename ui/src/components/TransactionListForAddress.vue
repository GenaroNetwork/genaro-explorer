<template>
  
  <v-data-table
      :headers="headers"
      :items="data"
      :pagination.sync="pagination"
      :total-items="total"
      :rows-per-page-items="[10, 25, 35]"
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
          <router-link :to='`/accounts/${props.item.from}`' v-if="props.item.from !== addr.toLowerCase()">
            {{props.item.from}}
          </router-link>
          <template v-else>
            {{props.item.from}}
          </template>
        </td>
        <td class="text-xs-left">
          <template v-if="props.item.from === props.item.to">
            <span class="tag primary"> SALE </span>
          </template>
          <template v-else-if="props.item.from === addr.toLowerCase()">
            <span class="warning tag">OUT</span>
          </template>
          <template v-else-if="props.item.to === addr.toLowerCase()">
            <span class="tag success">IN</span>
          </template>
        </td>
        <td class="text-xs-left tx-addr-table">
           <router-link :to='`/accounts/${props.item.to}`' v-if="props.item.to !== addr.toLowerCase()">
            {{props.item.to}}
          </router-link>
          <template v-else>
            {{props.item.to}}
          </template>
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

export default {
  name: 'transaction_list',
  props: ['data', 'loading', 'addr', 'total', 'onChangeLimit', 'onChangePage'],
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
          align: 'left',
          sortable: false
        },
        {
          text: this.$i18n.t('transaction.timestamp'),
          align: 'left',
          class: 'timestamp',
          sortable: false
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
      this.onChangePage(page)
    },
    changePageLimit(limit) {
      this.onChangeLimit(limit)
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
        const { sortBy, descending, page, rowsPerPage } = this.pagination
        this.changePageLimit(rowsPerPage)
        this.changePgae(page)
      }
    }
  }
}
</script>
