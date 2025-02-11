const state = () => ({
  logSpan: [],
  fileAduan: [],
  fileDokumenBukti: [],
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
}

export default {
  state,
  mutations,
}
