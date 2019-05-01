<template>
  <v-data-table
          :headers="headers"
          :items="data"
          hide-actions
          :loading="loading">
    <template slot="items" slot-scope="props">
      <td>
        {{props.item.rank}}
      </td>
      <td>
        <router-link :to=" `/accounts/${props.item.address}`">
          {{props.item.address}}
        </router-link>
      </td>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: 'committee_list',
    props: ['data', 'loading'],
    data() {
      return {
        headers: [
          {
            text: this.$i18n.t('committee.rank'),
            align: 'left',
            sortable: false,
            value: 'rank'
          },
          {
            text: this.$i18n.t('committee.address'),
            align: 'left',
            sortable: false,
            value: 'address'
          },
        ]
      }
    }
  }
</script>