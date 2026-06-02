import { imahAingMockData } from '~/constant/imah-aing-mock-data'

const getDefaultState = () => ({
  /** Data dari decoded meta query param */
  metaPayload: {
    name: '',
    phone: '',
    email: '',
    nik: '',
    kk: '',
    id: '',
    role: '',
    token: '',
  },

  /** Daftar complaint / usulan */
  items: [],

  /** Array ID yang dipilih untuk dibatalkan */
  selectedIds: [],

  /** Pagination */
  pagination: {
    page: 1,
    limit: 5,
    total: 0,
    hasMore: false,
  },

  /** Auth token dari Keycloak (client_credentials) — BUKAN dari metaPayload.token */
  authToken: null,

  /** Status */
  status: 'IDLE', // IDLE | LOADING | SUCCESS | ERROR | CANCELLING | CANCELLED
  errorMessage: '',

})

export const state = () => getDefaultState()

export const mutations = {
  SET_META_PAYLOAD(state, payload) {
    state.metaPayload = { ...state.metaPayload, ...payload }
  },
  SET_AUTH_TOKEN(state, token) {
    state.authToken = token
  },
  SET_ITEMS(state, items) {
    state.items = items
  },
  APPEND_ITEMS(state, items) {
    state.items = [...state.items, ...items]
  },
  SET_SELECTED_IDS(state, ids) {
    state.selectedIds = ids
  },
  TOGGLE_SELECT_ID(state, id) {
    const idx = state.selectedIds.indexOf(id)
    if (idx === -1) {
      state.selectedIds.push(id)
    } else {
      state.selectedIds.splice(idx, 1)
    }
  },
  REMOVE_ITEMS(state, ids) {
    state.items = state.items.filter((item) => !ids.includes(item.id))
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination }
  },
  SET_STATUS(state, status) {
    state.status = status
  },
  SET_ERROR(state, message) {
    state.errorMessage = message
  },
  RESET_STATE(state) {
    const def = getDefaultState()
    Object.keys(def).forEach((k) => {
      state[k] = def[k]
    })
  },
}

export const actions = {
  setAuthToken({ commit }, token) {
    commit('SET_AUTH_TOKEN', token)
  },

  /** Muat data mock tanpa memanggil API (dipakai saat ?use_mock=true) */
  loadMockData({ commit }) {
    commit('SET_ITEMS', imahAingMockData)
    commit('SET_PAGINATION', {
      total: imahAingMockData.length,
      hasMore: false,
    })
    commit('SET_STATUS', 'SUCCESS')
  },

  async fetchHistory({ commit, state }) {
    const { metaPayload, pagination } = state
    const { id, role, kk } = metaPayload

    const roleLower = (role || '').trim().toLowerCase()
    const params = {
      limit: pagination.limit,
      page: pagination.page,
      'complaint_category_id[0]': 'imah-aing',
      phase: 'verification',
      current_user_id: id,
    }

    if (roleLower && roleLower !== 'warga') {
      params.user_id = id
    } else {
      params.user_kk = kk
    }

    commit('SET_STATUS', 'LOADING')

    try {
      // Gunakan authToken dari Keycloak, BUKAN metaPayload.token
      const res = await this.$gatewayPartnerAPI.get('/aduan/complaints', {
        params,
        headers: state.authToken
          ? { Authorization: `Bearer ${state.authToken}` }
          : {},
      })

      // Response structure (verified 2026-05-26):
      // { status, message, code, data: { data: [...], page_size, page, total_pages, total_data }, meta: {...} }
      const responseData = res.data?.data || {}
      const items = Array.isArray(responseData.data)
        ? responseData.data
        : []

      if (pagination.page === 1) {
        commit('SET_ITEMS', items)
      } else {
        commit('APPEND_ITEMS', items)
      }

      const total = responseData.total_data || 0
      commit('SET_PAGINATION', {
        ...pagination,
        total,
        hasMore: pagination.page * pagination.limit < total,
      })
      commit('SET_STATUS', 'SUCCESS')
    } catch (error) {
      commit('SET_STATUS', 'ERROR')
      commit(
        'SET_ERROR',
        error?.response?.data?.message || error.message || 'Gagal memuat riwayat'
      )
    }
  },

  cancelSubmissions({ commit, state }) {
    const { selectedIds } = state
    if (!selectedIds.length) {
      return
    }

    commit('SET_STATUS', 'CANCELLING')

    // TODO(BE): Integrasi endpoint DELETE saat backend sudah ready.
    // Untuk sekarang hanya menghapus dari state store (tanpa API call).
    // Contoh integrasi nanti:
    // await Promise.all(
    //   selectedIds.map((id) =>
    //     this.$gatewayPartnerAPI.delete(`/aduan/complaints/${id}`, {
    //       headers: state.authToken
    //         ? { Authorization: `Bearer ${state.authToken}` }
    //         : {},
    //     })
    //   )
    // )

    commit('REMOVE_ITEMS', selectedIds)
    commit('SET_SELECTED_IDS', [])
    commit('SET_STATUS', 'CANCELLED')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
