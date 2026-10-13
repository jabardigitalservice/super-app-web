import { SANGGAH_BUKTI_FIELD, SANGGAH_SUBMIT_STUB } from '~/constant/imah-aing-sanggah'
import delay from '~/utils/delay'

const isUnauthorizedError = (error) => error?.response?.status === 401

const getDefaultState = () => ({
  complaintId: '',
  category: '',
  description: '',
  agreement: false,
  /** Slot upload bukti: null | { file, url, progress, status: UPLOADING|SUCCESS|ERROR, errors } */
  bukti: null,
  statusSubmit: 'NONE', // NONE | LOADING | SUCCESS | ERROR | SESSION_EXPIRED
})

/**
 * Payload sanggah (kontrak FE, belum dikonfirmasi BE). `photos` maks 1 objek `{ url, field }`.
 */
export const buildPayload = (state) => ({
  complaint_id: state.complaintId,
  category: state.category,
  description: (state.description || '').trim(),
  photos: state.bukti?.url ? [{ url: state.bukti.url, field: SANGGAH_BUKTI_FIELD }] : [],
  agreement: state.agreement,
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
  SET_BUKTI(state, payload) {
    state.bukti = payload
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

export const actions = {
  convertFileToBase64(_, file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  async submitSanggah({ commit, state }) {
    if (state.statusSubmit === 'LOADING') return
    commit('SET_STATUS_SUBMIT', 'LOADING')

    try {
      const payload = buildPayload(state)

      if (!SANGGAH_SUBMIT_STUB) {
        // TODO(plan integrasi BE): panggil endpoint sanggah + token yang benar di sini.
        throw new Error('Submit sanggah belum terintegrasi dengan BE')
      }

      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[sanggah:stub] payload', payload)
      }
      await delay(800)
      commit('SET_STATUS_SUBMIT', 'SUCCESS')
    } catch (error) {
      if (state.statusSubmit !== 'SESSION_EXPIRED') {
        commit('SET_STATUS_SUBMIT', 'ERROR')
      }
      throw error
    }
  },

  /** Upload bukti sanggah ke /file/upload (meniru imahAingForm.uploadDocument). */
  async uploadBukti({ commit, dispatch }, file) {
    const setSlot = (slot) => commit('SET_BUKTI', slot)

    const payload = { file, url: '', progress: 0, status: 'UPLOADING', errors: [] }
    setSlot(payload)

    try {
      setSlot({ ...payload, progress: 20 })
      const base64Data = await dispatch('convertFileToBase64', file)
      setSlot({ ...payload, progress: 50 })

      let response
      try {
        response = await this.$gatewayPartnerAPI.post('/file/upload', {
          name: file.name,
          isConfidental: false,
          mimeType: file.type,
          roles: ['admin', 'rw'],
          data: base64Data,
        })
      } catch (error) {
        if (isUnauthorizedError(error)) {
          commit('SET_STATUS_SUBMIT', 'SESSION_EXPIRED')
        }
        throw error
      }

      const fileUrl = `${this.$config.urlFile}/${response.data.data.path}`
      setSlot({ file, url: fileUrl, progress: 100, status: 'SUCCESS', errors: [] })
      return fileUrl
    } catch (error) {
      const errMsg = error?.response?.data?.message || error.message || 'upload_failed'
      setSlot({ file, url: '', progress: 0, status: 'ERROR', errors: [errMsg] })
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
