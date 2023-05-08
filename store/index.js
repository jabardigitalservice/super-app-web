export const state = () => ({

  logSpan: [],
  dataAduan: []
})

export const mutations = {
  setLogSpan (state, logSpan) {
    state.logSpan = logSpan
  },
  setDataAduan (state, dataAduan) {
    state.dataAduan = dataAduan
  }

}
