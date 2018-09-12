<template>
  <Table
    :columns="columns"
    :data="data"
    :loading="loading">
  </Table>
</template>

<script>
export default {
  name: 'committee_list',
  props: ['data', 'loading'],
  data() {
    return {
      columns: [
        {
          title: this.$i18n.t('committee.rank'),
          key: 'rank'
        },
        {
          title: this.$i18n.t('committee.address'),
          key: 'address',
          render: (h, params) => {
            return h('router-link', {
              props: {
                to: `/accounts/${params.row.address}`
              }
            }, params.row.address)
          }
        }
      ]
    }
  }
}
</script>

