import { canSaveProgressStep } from '~/constant/imah-aing-status'

// Data tersimpan Update Progress per ID usulan, hanya di memori (hilang saat reload).
// shortcut: tanpa API, diisi dari data contoh; sambungkan ke BE setelah kontraknya ada.
export const state = () => ({
  /** { [complaintId]: [filesBuktiTransfer, filesTahap1, filesTahap2, filesTahap3] } */
  records: {},
})

export const mutations = {
  INIT_RECORD(state, { id, steps }) {
    if (!state.records[id]) {
      state.records = { ...state.records, [id]: steps.map((files) => [...files]) }
    }
  },
  SET_STEP(state, { id, step, files }) {
    // Object URL preview hidup selama file tersimpan; file data contoh sudah membawa `url`
    const stored = files.map((file) =>
      file.url ? file : Object.assign(file, { url: URL.createObjectURL(file) })
    )
    const next = state.records[id].map((saved, i) => (i === step ? stored : saved))
    state.records = { ...state.records, [id]: next }
  },
  RESET_STATE(state) {
    Object.values(state.records)
      .flat(2)
      .filter((file) => file.url?.startsWith('blob:'))
      .forEach((file) => URL.revokeObjectURL(file.url))
    state.records = {}
  },
}

export const actions = {
  /** @returns {boolean} false bila urutan dilanggar, sudah tersimpan, atau jumlah file tidak memenuhi */
  saveStep({ state, commit }, { id, step, files }) {
    const saved = state.records[id]
    if (!saved || !canSaveProgressStep(saved, step, files)) {
      return false
    }
    commit('SET_STEP', { id, step, files })
    return true
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
