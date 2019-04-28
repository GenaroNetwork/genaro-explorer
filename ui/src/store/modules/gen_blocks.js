import Api from '@/api';

const moduleGenBlocks = {
    namespaced: true,
    state: {
        blocks: [],
        loading: false,
        error: null,
        total: 0,
        current_page: 1,
        offset: 0,
        limit: 10,
    },
    mutations: {
        get_gen_blocks_start(state) {
            state.error = null
            state.loading = true
        },
        get_gen_blocks_complete(state, blocks) {
            state.blocks = blocks
            state.loading = false
        },
        change_data_total(state, total) {
            state.total = total;
        },
        change_current_page(state, current_page) {
            state.current_page = current_page;
            state.offset = (current_page - 1) * state.limit
        },
        change_page_limit(state, pageLimit) {
            state.limit = pageLimit;
        },

    },
    actions: {
        get_gen_blocks_async({commit}, { addr, offset, limit}) {
            commit('get_gen_blocks_start')
            Api.getGenBlockByMiner(addr, offset, limit).then(res => {
                commit('get_gen_blocks_complete', res.data.data)
                commit('change_data_total', res.data.meta.total)
            })
        },
        change_current_page_async({commit, dispatch, state}, { addr, page }) {
            commit('change_current_page', page);
            dispatch('get_gen_blocks_async', {
                addr,
                offset: state.offset,
                limit: state.limit
            });
        },
        change_page_limit_async({commit, dispatch, state}, {addr, page_limit}) {
            commit('change_page_limit', page_limit);
            dispatch('get_gen_blocks_async', {
                addr,
                offset: state.offset,
                limit: state.limit
            });
        },
    }
}

export default moduleGenBlocks