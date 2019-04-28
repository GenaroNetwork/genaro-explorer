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

        <!-- Table -->
        <v-layout>
            <v-flex>
                <v-card>
                    <v-card-title>
                        <h3 class="headline mb-0">{{$t('title.block_rate_title')}}</h3>
                        <v-spacer></v-spacer>
                        <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Search"
                                @keyup.enter="searchData"
                                single-line
                                hide-details></v-text-field>
                    </v-card-title>

                    <v-card-text>
                        <v-data-table
                                :headers="heades"
                                :items="data"
                                :loading="loading"
                                :total-items="total"
                                :pagination.sync="pagination"
                                :rows-per-page-items="[10, 25, 35]">

                            <template slot="items" slot-scope="props">
                                <td>
                                    {{ props.item.start}}
                                </td>
                                <td>
                                    {{ props.item.end}}
                                </td>
                                <td>
                                    {{ props.item.session}}
                                </td>
                                <td>
                                    <router-link :to='`/accounts/${props.item.miner_addr.toLowerCase()}`'>
                                        {{props.item.miner_addr.toLowerCase()}}
                                    </router-link>
                                </td>
                                <td>
                                    {{ props.item.number_of_blocks}}
                                </td>
                                <td>
                                    {{ props.item.block_rate}}%
                                </td>
                            </template>

                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </div>

</template>

<style lang="scss" scoped>
    .content {
        height: 400px;
    }
    .recharge-page {
        margin-top: 100px;
    }
    .recharge {
        width: 60%;
        text-align: center;
        position: absolute;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        h1 {
            margin: 20px 0;
        }
    }
</style>

<style lang="scss">
    .loading {
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ivu-input-search {
        background: #515a6e!important;
        border-color:#515a6e!important;
        &:hover {
            background: #686c75!important;
            border-color:#686c75!important;
        }
    }
    .ivu-input {
        &:hover{
            border-color: #686c75 !important;
        }

        &:focus {
            border-color: #686c75 !important;
            box-shadow: none !important;
        }
    }
</style>



<script>

    import { mapState } from 'vuex'
    import store from '@/store'
    import Api from '@/api'

    export default {
        data() {
            return {
                search: null,
                pagination: {
                    rowsPerPage: 10
                },
                heades: [
                    {
                        text: this.$i18n.t('gen_block.start'),
                        align: 'left',
                        sortable: false,
                        value: 'start'
                    },
                    {
                        text: this.$i18n.t('gen_block.end'),
                        align: 'left',
                        sortable: false,
                        value: 'end'
                    },
                    {
                        text: this.$i18n.t('gen_block.session'),
                        align: 'left',
                        sortable: false,
                        value: 'session'
                    },
                    {
                        text: this.$i18n.t('gen_block.miner'),
                        align: 'left',
                        sortable: false,
                        value: 'miner_addr'
                    },
                    {
                        text: this.$i18n.t('gen_block.number_of_blocks'),
                        align: 'left',
                        sortable: false,
                        value: 'number_of_blocks'
                    },
                    {
                        text: this.$i18n.t('gen_block.block_rate'),
                        align: 'left',
                        sortable: false,
                        value: 'block_rate'
                    }
                ],
                data: [],
                total: 0,
                loading: false
            }
        },
        computed: {
            items() {
                return  [
                    {
                        title: this.$i18n.t('title.home_page'),
                        to: '/'
                    },
                    {
                        title: this.$i18n.t('title.block_rate_title'),
                    }
                ]
            }
        },
        created() {
            this.initData(null, null, 0, this.pagination.rowsPerPage)
        },

        methods: {
            initData(addr, session, offset, limit) {
                if (!addr) {
                    addr = null
                }
                this.loading = true
                Api.getGenBlockRate(addr, session, offset, limit).then(res => {
                    this.loading = false
                    console.log(res.data)
                    this.data = res.data.data
                    this.total = res.data.meta.total

                })
            },
            changePgae(page) {
                console.log("page", page)
                this.pagination.page = page
                const offset = (page - 1) * this.pagination.rowsPerPage
                const limit = this.pagination.rowsPerPage
                this.initData(this.search, null, offset, limit)
            },
            changePageLimit(rowsPerPage) {
                this.pagination.rowsPerPage = rowsPerPage
            },
            searchData() {
                console.log(this.search)
                this.initData(this.search, null, 0, this.pagination.rowsPerPage)
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
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    console.log(this.pagination)
                    this.changePageLimit(rowsPerPage)
                    this.changePgae(page)
                }
            }
        }
    }
</script>
