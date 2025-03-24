const state = () => ({
  logSpan: [],
  fileAduan: [],
  fileDokumenBukti: [],
  refreshTokenKeycloak: '',
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
}

export default {
  namespaced: true,
  state,
  mutations,
}
