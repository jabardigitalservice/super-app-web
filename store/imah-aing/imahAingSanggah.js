const getDefaultState = () => ({
  complaintId: '',
  category: '',
  description: '',
  agreement: false,
  statusSubmit: 'NONE', // NONE | LOADING | SUCCESS | ERROR | SESSION_EXPIRED
})

export const state = () => getDefaultState()

export const mutations = {
  SET_COMPLAINT_ID(state, id) {
    state.complaintId = id
  },
  SET_CATEGORY(state, category) {
    state.category = category
  },
  SET_DESCRIPTION(state, description) {
    state.description = description
  },
  SET_AGREEMENT(state, agreement) {
    state.agreement = !!agreement
  },
  SET_STATUS_SUBMIT(state, status) {
    state.statusSubmit = status
  },
  RESET_STATE(state) {
    const def = getDefaultState()
    Object.keys(def).forEach((k) => {
      state[k] = def[k]
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
