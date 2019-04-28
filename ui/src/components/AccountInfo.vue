<template>
    <div class="wrap">
        <template v-if="account">
            <v-layout align-start>
                <v-flex md3 xs6 class="vertical-tag">{{$t('global.balance')}}:</v-flex>
                <v-flex md3 xs6 class="ellipsis-text vertical-tag">{{ balanceGNX }} GNX</v-flex>
            </v-layout>
            <v-layout align-start>
                <v-flex md3 xs6 class="vertical-tag">{{$t('global.tx_number')}}:</v-flex>
                <v-flex
                        md3
                        xs6
                        class="ellipsis-text vertical-tag"
                >{{account.transactionCount}} {{ $t('global.count')}}</v-flex>
            </v-layout>
            <v-layout style="margin-top: 20px;">
                <v-flex grow="1">
                    <v-tabs style="overflow: scroll" v-model="active ">
                        <v-tab key="1">{{$i18n.t('title.transactions')}}</v-tab>
                        <v-tab key="2">{{$i18n.t('title.gen_blocks')}}</v-tab>
                        <v-tab-item key="1">
                            <transaction-list-for-address :addr="addr"/>
                        </v-tab-item>

                        <v-tab-item key="2">
                            <gen-block-list
                                    :addr="addr">
                            </gen-block-list>
                        </v-tab-item>
                    </v-tabs>
                </v-flex>
            </v-layout>
        </template>
    </div>
</template>

<style lang="scss" scoped>
    table {
        tr {
            border-bottom: 1px solid #efefef;
        }
        td {
            padding: 10px 0;
        }
    }
    .mar-top {
        margin-top: 20px;
    }
</style>


<script>
    import { mapState } from "vuex";
    import TransactionListForAddress from "@/components/TransactionListForAddress.vue";
    import GenBlockList from "@/components/GenBlockList.vue";
    import store from "@/store";
    import Api from '@/api';


    export default {
        name: "account-info",
        props: [
            "addr",
        ],
        components: {
            TransactionListForAddress,
            GenBlockList
        },
        data() {
            return {
                active: null
            }
        },
        created() {
            this.getData()
        },
        computed: {
            ...mapState({
                account: state => state.account_component.account
            }),
            balanceGNX() {
                return this.$web3Utils.fromWei(this.account.balance, "ether");
            }
        },
        methods: {
            getData() {
                store.dispatch('account_component/get_account_detail_async', this.addr)
            }
        },
        watch: {
            '$route': 'getData'
        },
    };
</script>
