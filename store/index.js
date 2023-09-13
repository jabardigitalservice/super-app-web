export const state = () => ({

  logSpan: [],
  fileAduan: ''
})

export const mutations = {
  setLogSpan (state, logSpan) {
    state.logSpan = logSpan
  },
  setFileAduan (state, fileAduan) {
    state.fileAduan = fileAduan
  }

}
