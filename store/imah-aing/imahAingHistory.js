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

  /** Status */
  status: 'IDLE', // IDLE | LOADING | SUCCESS | ERROR | CANCELLING | CANCELLED
  errorMessage: '',

  /** Whether mock data is being used (no API data available) */
  isMockData: false,
})

export const state = () => getDefaultState()

export const mutations = {
  SET_META_PAYLOAD(state, payload) {
    state.metaPayload = { ...state.metaPayload, ...payload }
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
  SET_MOCK_DATA(state, value) {
    state.isMockData = value
  },
  RESET_STATE(state) {
    const def = getDefaultState()
    Object.keys(def).forEach((k) => {
      state[k] = def[k]
    })
  },
}

export const actions = {
  async fetchHistory({ commit, state }) {
    const { metaPayload, pagination } = state
    const { id, role, kk, token } = metaPayload

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
      const res = await this.$gatewayPartnerAPI.get('/aduan/complaints', {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      const responseData = res.data?.data || res.data || {}
      const items = Array.isArray(responseData)
        ? responseData
        : responseData.items || responseData.complaints || []

      // Jika API mengembalikan data kosong, gunakan mock data sebagai fallback
      if (items.length === 0 && pagination.page === 1) {
        commit('SET_ITEMS', imahAingMockData)
        commit('SET_PAGINATION', {
          ...pagination,
          total: imahAingMockData.length,
          hasMore: false,
        })
        commit('SET_STATUS', 'SUCCESS')
        commit('SET_MOCK_DATA', true)
        return
      }

      if (pagination.page === 1) {
        commit('SET_ITEMS', items)
      } else {
        commit('APPEND_ITEMS', items)
      }

      const total = responseData.total || responseData.meta?.total || items.length
      commit('SET_PAGINATION', {
        ...pagination,
        total,
        hasMore: pagination.page * pagination.limit < total,
      })
      commit('SET_STATUS', 'SUCCESS')
      commit('SET_MOCK_DATA', false)
    } catch (error) {
      // Jika API gagal, fallback ke mock data (hanya di page 1)
      if (pagination.page === 1) {
        commit('SET_ITEMS', imahAingMockData)
        commit('SET_PAGINATION', {
          ...pagination,
          total: imahAingMockData.length,
          hasMore: false,
        })
        commit('SET_STATUS', 'SUCCESS')
        commit('SET_MOCK_DATA', true)
        commit(
          'SET_ERROR',
          error?.response?.data?.message || error.message || 'Gagal memuat riwayat'
        )
      } else {
        commit('SET_STATUS', 'ERROR')
        commit(
          'SET_ERROR',
          error?.response?.data?.message || error.message || 'Gagal memuat riwayat'
        )
      }
    }
  },

  async cancelSubmissions({ commit, state }) {
    const { selectedIds, metaPayload } = state
    if (!selectedIds.length) {
      return
    }

    commit('SET_STATUS', 'CANCELLING')
    try {
      await Promise.all(
        selectedIds.map((id) =>
          this.$gatewayPartnerAPI.delete(`/aduan/complaints/${id}`, {
            headers: metaPayload.token
              ? { Authorization: `Bearer ${metaPayload.token}` }
              : {},
          })
        )
      )
      commit('REMOVE_ITEMS', selectedIds)
      commit('SET_SELECTED_IDS', [])
      commit('SET_STATUS', 'CANCELLED')
    } catch (error) {
      commit('SET_STATUS', 'ERROR')
      throw error
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
