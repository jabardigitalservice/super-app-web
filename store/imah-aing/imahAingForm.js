const getDefaultState = () => ({
  authToken: null,
  accountType: '',
  currentFormStep: 1,

  consent: {
    hasReadPrivacyPolicy: false,
    isBeneficiaryCandidate: false,
  },

  dataPengusul: {
    name: '',
    phone: '',
    email: '',
    nik: '',
    nomorKk: '',
    avatarUrl: '',
  },

  dokumen: {
    ktp: null,
    kk: null,
    suratMiskin: null,
    suratTanah: null,
    fotoTanah: null,
  },

  lokasiTanah: {
    provinceName: 'Jawa Barat',
    provinceId: '32',
    cityName: '',
    cityId: '',
    districtName: '',
    districtId: '',
    villageName: '',
    villageId: '',
    villageCenterCoords: { lat: 0, lng: 0 },
    dusun: '',
    rw: '',
    rt: '',
    location: { lat: 0, lng: 0 },
    place: { name: '', address: '' },
    addressDetail: '',
  },

  statusSubmitForm: {
    status: 'NONE',
    progress: 0,
    submission_id: '',
  },
})

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    currentFormStep: (state) => state.currentFormStep,
    isFirstStep: (state) => state.currentFormStep === 1,
    isLastStep: (state) => state.currentFormStep === 4,
    startStep: (state) => (state.accountType === 'rt_rw_kades' ? 2 : 1),
    isConsentValid: (state) =>
      state.consent.hasReadPrivacyPolicy && state.consent.isBeneficiaryCandidate,
    isAllDocumentsUploaded: (state) => {
      const { ktp, kk, suratMiskin, suratTanah, fotoTanah } = state.dokumen
      return [ktp, kk, suratMiskin, suratTanah, fotoTanah].every(
        (doc) => doc !== null && doc.status === 'SUCCESS'
      )
    },
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token
    },
    SET_ACCOUNT_TYPE(state, type) {
      state.accountType = type
    },
    SET_CURRENT_FORM_STEP(state, step) {
      state.currentFormStep = step
    },
    SET_CONSENT_PRIVACY(state, val) {
      state.consent.hasReadPrivacyPolicy = val
    },
    SET_CONSENT_BENEFICIARY(state, val) {
      state.consent.isBeneficiaryCandidate = val
    },
    SET_DATA_PENGUSUL_FIELD(state, { field, value }) {
      // map common incoming snake_case fields to camelCase store keys
      const fieldMap = {
        nomor_kk: 'nomorKk',
        avatar_url: 'avatarUrl',
      }
      const targetField = fieldMap[field] || field
      if (Object.prototype.hasOwnProperty.call(state.dataPengusul, targetField)) {
        state.dataPengusul[targetField] = value
      }
    },
    SET_DOKUMEN_SLOT(state, { key, payload }) {
      state.dokumen[key] = payload
    },
    SET_LOKASI_TANAH_FIELD(state, { field, value }) {
      // allow mapping of incoming snake_case to camelCase
      const fieldMap = {
        province_name: 'provinceName',
        province_id: 'provinceId',
        city_name: 'cityName',
        city_id: 'cityId',
        district_name: 'districtName',
        district_id: 'districtId',
        village_name: 'villageName',
        village_id: 'villageId',
        village_center_coords: 'villageCenterCoords',
        address_detail: 'addressDetail',
      }
      const targetField = fieldMap[field] || field
      if (Object.prototype.hasOwnProperty.call(state.lokasiTanah, targetField)) {
        state.lokasiTanah[targetField] = value
      }
    },
    SET_STATUS_SUBMIT(state, status) {
      state.statusSubmitForm.status = status
    },
    SET_SUBMISSION_ID(state, id) {
      state.statusSubmitForm.submission_id = id
    },
    RESET_STATE(state) {
      const def = getDefaultState()
      Object.keys(def).forEach((k) => {
        state[k] = def[k]
      })
    },
  },
  actions: {
    initForm({ commit }, token) {
      commit('SET_AUTH_TOKEN', token)
      // best-effort parse token (if token is JSON string with user data)
      if (!token) return
      try {
        const parsed = typeof token === 'string' ? JSON.parse(token) : token
        if (parsed) {
          if (parsed.name) commit('SET_DATA_PENGUSUL_FIELD', { field: 'name', value: parsed.name })
          if (parsed.phone) commit('SET_DATA_PENGUSUL_FIELD', { field: 'phone', value: parsed.phone })
          if (parsed.email) commit('SET_DATA_PENGUSUL_FIELD', { field: 'email', value: parsed.email })
          if (parsed.avatar_url) commit('SET_DATA_PENGUSUL_FIELD', { field: 'avatar_url', value: parsed.avatar_url })
          if (parsed.accountType) commit('SET_ACCOUNT_TYPE', parsed.accountType)
        }
      } catch (e) {
        // token is not JSON - ignore silent
      }
    },
    nextStep({ commit, state }) {
      commit('SET_CURRENT_FORM_STEP', state.currentFormStep + 1)
    },
    previousStep({ commit, state, getters }) {
      const minStep = getters.startStep
      if (state.currentFormStep > minStep) {
        commit('SET_CURRENT_FORM_STEP', state.currentFormStep - 1)
      }
    },
    // Placeholder upload action - real upload implementation should be added
    uploadDocument({ commit }, { key, file, url }) {
      // store initial slot with UPLOADING status
      const payload = {
        file,
        url: url || '',
        progress: 0,
        status: 'UPLOADING',
        errors: [],
      }
      commit('SET_DOKUMEN_SLOT', { key, payload })
      // Caller should replace this with real upload logic.
      // For now mark as ERROR to indicate no upload was performed.
      commit('SET_DOKUMEN_SLOT', { key, payload: { ...payload, status: 'ERROR', progress: 0, errors: ['not_implemented'] } })
      return Promise.reject(new Error('uploadDocument not implemented in imahAingForm store'))
    },
    async submitForm({ commit, state }, axiosInstance) {
      commit('SET_STATUS_SUBMIT', 'LOADING')
      try {
        const { ktp, kk, suratMiskin, suratTanah, fotoTanah } = state.dokumen
        const photos = [ktp, kk, suratMiskin, suratTanah, fotoTanah].map((doc) => ({ url: doc?.url || '' }))

        const { location, place, cityId, cityName, districtId, districtName, villageId, villageName, dusun, rw, rt, addressDetail } = state.lokasiTanah
        const payload = {
          user_name: state.dataPengusul.name,
          user_email: state.dataPengusul.email || '',
          user_phone: state.dataPengusul.phone,
          user_nik: state.dataPengusul.nik,
          user_kk: state.dataPengusul.nomorKk,
          source_id: 'sapawarga',
          type: 'private',
          photos,
          category_id: 'imah-aing',
          complaint_subcategory_id: 'imah-aing-perbaikan-atau-pembangunan-rumah-tidak-layak-huni',
          title: 'Imah Aing',
          latitude: String(location.lat),
          longitude: String(location.lng),
          address: place.address,
          address_detail: addressDetail || '',
          city_id: cityId,
          city_name: cityName,
          district_id: districtId,
          district_name: districtName,
          village_id: villageId,
          village_name: villageName,
          dusun_name: dusun || '',
          RT: String(rt || ''),
          RW: String(rw || ''),
        }

        if (!axiosInstance) throw new Error('axiosInstance required')

        const response = await axiosInstance.post('/v1/aduan/complaints', payload)
        const submissionId = response.data?.data?.id || response.data?.id || ''

        commit('SET_STATUS_SUBMIT', 'SUCCESS')
        commit('SET_SUBMISSION_ID', submissionId)
        return response
      } catch (error) {
        commit('SET_STATUS_SUBMIT', 'ERROR')
        throw error
      }
    },
    resetForm({ commit }) {
      commit('RESET_STATE')
    },
  },
}
