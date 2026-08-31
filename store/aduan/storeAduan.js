const state = () => ({
  logSpan: [],
  fileAduan: [],
  fileDokumenBukti: [],
  refreshTokenKeycloak: '',
  accessTokenKeycloak: '',
  accessTokenExpiresAt: 0,
  lastComplaintTicket: '',
})

const mutations = {
  setLogSpan(state, logSpan) {
    state.logSpan = logSpan
  },
  setFileAduan(state, fileAduan) {
    state.fileAduan = fileAduan
  },
  setFileDokumenBukti(state, fileDokumenBukti) {
    state.fileDokumenBukti = fileDokumenBukti
  },
  setRefreshTokenKeycloak(state, refreshTokenKeycloak) {
    state.refreshTokenKeycloak = refreshTokenKeycloak
  },
  setAccessTokenKeycloak(state, { accessToken, expiresIn }) {
    state.accessTokenKeycloak = accessToken
    // Cadangan 15 detik sebelum kedaluwarsa agar tidak memakai token basi
    state.accessTokenExpiresAt = Date.now() + Math.max((expiresIn || 0) - 15, 0) * 1000
  },
  setLastComplaintTicket(state, ticket) {
    state.lastComplaintTicket = ticket
  },
}

export default {
  namespaced: true,
  state,
  mutations,
}
