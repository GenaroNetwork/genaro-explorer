<template>
  <div>
    <v-breadcrumbs>
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
              <h3 class="headline mb-0">{{$t('title.all_transactions')}}</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <transaction-list/>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </div> 
</template>
<script>
import TransactionList from '@/components/TransactionList.vue'

export default {
  name: 'all_transaction',
  components: {
    TransactionList
  },
  data() {
    return {
      items: [
        {
          title: '首页',
          to: '/'
        },
        {
          title: this.$i18n.t('title.all_transactions'),
        }
      ],
    }
  },
}
</script>

