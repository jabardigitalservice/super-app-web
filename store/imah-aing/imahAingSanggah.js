import { SANGGAH_USER_NOTES_FALLBACK, mapSanggahError } from '~/constant/imah-aing-sanggah'
import { UPLOAD_TIMEOUT_MS } from '~/constant/upload'
import { mapUploadError } from '~/utils/upload'

const isUnauthorizedError = (error) => error?.response?.status === 401

const getDefaultState = () => ({
  complaintId: '',
  /** Catatan penolakan usulan (`complaint_status_note`) — dikirim sebagai `user_notes`, bukan input user */
  statusNote: '',
  category: '',
  /** Field dinamis per kategori: data-kependudukan → idType + idNumber, desil → desil */
  idType: '', // 'nik' | 'no_kk'
  idNumber: '',
  desil: '',
  description: '',
  agreement: false,
  /** Slot upload bukti: null | { file, url, progress, status: UPLOADING|SUCCESS|ERROR, errors } */
  bukti: null,
  statusSubmit: 'NONE', // NONE | LOADING | SUCCESS | ERROR | SESSION_EXPIRED
  errorMessage: '',
  errorRetryable: true,
})

const isImageFile = (file) => (file?.type || '').toLowerCase().startsWith('image/')

/**
 * Field tambahan per kategori. Di luar kategori yang sesuai, nilainya `null` (default BE):
 * - data-kependudukan → `identity_number` (NIK/No KK koreksi, string) + `flagging` (`nik` | `no_kk`)
 * - desil → `desil` (number)
 */
const buildExtraFields = (state) => {
  const isIdentity = state.category === 'data-kependudukan'
  const isDesil = state.category === 'desil'
  const desil = Number(state.desil)
  return {
    identity_number: isIdentity && state.idNumber ? String(state.idNumber) : null,
    flagging: isIdentity && state.idType ? state.idType : null,
    desil: isDesil && state.desil !== '' && Number.isFinite(desil) ? desil : null,
  }
}

/**
 * Payload sanggah sesuai kontrak BE (`POST /aduan/appeals/complaints/{id}`).
 * `complaint_id` ada di path, `agreement` hanya FE (tidak dikirim). `user_notes` = catatan
 * penolakan usulan, bukan input user. Kategori/bukti tambahan BE ditambahkan di sini.
 */
export const buildPayload = (state, userId) => ({
  user_id: userId,
  category: state.category,
  description: (state.description || '').trim(),
  user_notes: state.statusNote || SANGGAH_USER_NOTES_FALLBACK,
  ...buildExtraFields(state),
  ...(state.bukti?.url && {
    evidence_documents: [
      {
        ...(isImageFile(state.bukti.file) && { type: 'image' }),
        url: state.bukti.url,
        name: state.bukti.file?.name,
      },
    ],
  }),
})

export const state = () => getDefaultState()

export const mutations = {
  SET_COMPLAINT_ID(state, id) {
    state.complaintId = id
  },
  SET_STATUS_NOTE(state, note) {
    state.statusNote = note || ''
  },
  SET_ERROR_INFO(state, { message, retryable }) {
    state.errorMessage = message
    state.errorRetryable = retryable
  },
  SET_CATEGORY(state, category) {
    // Ganti kategori → buang isian field dinamis kategori sebelumnya
    if (state.category !== category) {
      state.idType = ''
      state.idNumber = ''
      state.desil = ''
    }
    state.category = category
  },
  SET_ID_TYPE(state, idType) {
    state.idType = idType
    state.idNumber = ''
  },
  SET_ID_NUMBER(state, idNumber) {
    state.idNumber = idNumber
  },
  SET_DESIL(state, desil) {
    state.desil = desil
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

  async submitSanggah({ commit, state, rootState }) {
    if (state.statusSubmit === 'LOADING') return
    commit('SET_STATUS_SUBMIT', 'LOADING')

    try {
      const { metaPayload } = rootState.imahAingHistory
      // BASE_URL_MAIN hanya menerima token user dari query `meta`, bukan Keycloak client_credentials
      const metaToken = metaPayload?.token || ''
      // user_id = user login (bukan item.user_id) — BE mencocokkan dengan pemilik aduan
      const payload = buildPayload(state, metaPayload.id)

      try {
        await this.$gatewayPartnerMainAPI.post(
          `/aduan/appeals/complaints/${state.complaintId}`,
          payload,
          { headers: metaToken ? { Authorization: `Bearer ${metaToken}` } : {} }
        )
      } catch (error) {
        if (isUnauthorizedError(error)) {
          commit('SET_STATUS_SUBMIT', 'SESSION_EXPIRED')
        } else {
          commit('SET_ERROR_INFO', mapSanggahError(error))
        }
        throw error
      }

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
        }, { timeout: UPLOAD_TIMEOUT_MS })
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
      setSlot({ file, url: '', progress: 0, status: 'ERROR', errors: [mapUploadError(error)] })
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
