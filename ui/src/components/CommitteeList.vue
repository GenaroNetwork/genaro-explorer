<template>
  <v-data-table
          :headers="headers"
          :items="data"
          class="elevation-1"
          :loading="loading"
          :pagination.sync="pagination"
          :total-items="total"
          :rows-per-page-items="[10, 25, 35]"
  >
    <template slot="items" slot-scope="props">
      <td>
        <router-link :to="`/blocks/${props.item.number}`">{{ props.item.number }}</router-link>
      </td>
      <td class="text-xs-left">
        <router-link :to="`/blocks/${props.item.number}/txs`">{{count(props.item.transactions) }}</router-link>
      </td>
      <td class="text-xs-left">{{ formatDateTime(props.item.timestamp)}}</td>
      <td class="text-xs-left">{{ count(props.item.uncles) }}</td>
      <td class="text-xs-left" style="color: blue; font-wight: bold;">
        {{props.item.miner.toLowerCase()}}
      </td>
      <td class="text-xs-left">{{ props.item.gasUsed }}</td>
      <td class="text-xs-left">{{ props.item.gasLimit }}</td>
    </template>
  </v-data-table>
</template>

<script>
  import { mapState } from "vuex";
  import store from "@/store";

  export default {
    name: "gen-block-list",
    props: ["addr"],
    data() {
      return {
        pagination: {
          rowsPerPage: 10
        },
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
      console.log(this.addr)
    },
    methods: {
      initData() {
        store.dispatch('gen_blocks_component/get_gen_blocks_async', {
          addr: this.addr,
          offset: this.offset,
          limit: this.pagination.rowsPerPage
        });
      },
      changePgae(page) {
        store.dispatch("gen_blocks_component/change_current_page_async", {
          page,
          addr: this.addr
        });
      },
      changePageLimit(limit) {
        store.dispatch("gen_blocks_component/change_page_limit_async", {
          addr: this.addr,
          limit});
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
    computed: {
      ...mapState({
        data: state => state.gen_blocks_component.blocks,
        loading: state => state.gen_blocks_component.loading,
        error: state => state.gen_blocks_component.error,
        total: state => state.gen_blocks_component.total,
        offset: state => state.gen_blocks_component.offset,
        limit: state => state.gen_blocks_component.limit
      })
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
  };
</script>

<style>
</style>
