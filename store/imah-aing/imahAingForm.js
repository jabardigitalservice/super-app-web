const getDefaultState = () => ({
  /** Dari query `source_id` (mis. sapawarga), diisi saat `initForm` */
  sourceId: '',
  accountType: '',
  currentFormStep: 0,

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

/** Base64url-safe JSON dari query `meta` (UTF-8) */
function decodeMetaQueryParam(encoded) {
  if (!encoded || typeof encoded !== 'string' || typeof atob === 'undefined') {
    return null
  }
  try {
    const normalized = encoded.trim().replace(/-/g, '+').replace(/_/g, '/')
    const padLen = (4 - (normalized.length % 4)) % 4
    const padded = normalized + '='.repeat(padLen)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0))
    const text = new TextDecoder('utf-8').decode(bytes)
    return JSON.parse(text)
  } catch {
    return null
  }
}

function applyQueryMetaToDataPengusul(commit, data) {
  if (!data || typeof data !== 'object') {
    return
  }
  const setField = (field, value) => {
    if (value != null && String(value).trim() !== '') {
      commit('SET_DATA_PENGUSUL_FIELD', { field, value: String(value).trim() })
    }
  }
  setField('name', data.name)
  setField('phone', data.phone)
  setField('email', data.email)
  setField('nik', data.nik)
  const kkVal = data.kk != null ? data.kk : data.nomor_kk
  setField('nomorKk', kkVal)
}

/** Normalisasi `meta` / `source_id` (termasuk dari `this.$route.query` Vue Router). */
function normalizeInitQueryPayload(payload) {
  if (payload == null) {
    return { meta: '', sourceId: '' }
  }
  const metaRaw = payload.meta
  const meta = Array.isArray(metaRaw) ? metaRaw[0] : metaRaw
  const sidRaw = payload.source_id != null ? payload.source_id : payload.sourceId
  const sourceId = Array.isArray(sidRaw) ? sidRaw[0] : sidRaw
  return {
    meta: meta != null && meta !== '' ? String(meta) : '',
    sourceId: sourceId != null && sourceId !== '' ? String(sourceId) : '',
  }
}

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    currentFormStep: (state) => state.currentFormStep,
    isFirstStep: (state, getters) => state.currentFormStep === getters.startStep,
    isLastStep: (state) => state.currentFormStep === 4,
    startStep: (state) => (state.accountType === 'rt_rw_kades' ? 2 : 1),
    isConsentValid: (state) =>
      state.consent.hasReadPrivacyPolicy && state.consent.isBeneficiaryCandidate,
    isAllDocumentsUploaded: (state) => {
      const keys = ['ktp', 'kk', 'suratMiskin', 'suratTanah', 'fotoTanah']
      return keys.every((k) => state.dokumen[k] && state.dokumen[k].status === 'SUCCESS')
    },
    documentSlotsOrdered: (state) => {
      const keys = ['ktp', 'kk', 'suratMiskin', 'suratTanah', 'fotoTanah']
      return keys.map((k) => ({ key: k, slot: state.dokumen[k] }))
    },
  },
  mutations: {
    SET_SOURCE_ID(state, id) {
      state.sourceId = id || ''
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
    initForm({ commit }, payload) {
      const { meta, sourceId } = normalizeInitQueryPayload(payload)
      commit('SET_SOURCE_ID', sourceId)
      commit('SET_ACCOUNT_TYPE', sourceId === 'sapawarga' ? 'rt_rw_kades' : 'warga')

      if (meta) {
        const decoded = decodeMetaQueryParam(meta)
        if (decoded && typeof decoded === 'object') {
          applyQueryMetaToDataPengusul(commit, decoded)
        }
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
    // Cascading location handlers (mirror citizenComplaintForm patterns)
    handleCitySelected({ state, commit, dispatch, rootState }) {
      const cityName = state.lokasiTanah.cityName
      if (rootState.location.cities.length && cityName) {
        const city = rootState.location.cities.find((c) => c.name === cityName)
        if (city) {
          if (city.id !== state.lokasiTanah.cityId) {
            commit('SET_LOKASI_TANAH_FIELD', { field: 'district_name', value: '' })
            commit('SET_LOKASI_TANAH_FIELD', { field: 'district_id', value: '' })
            commit('SET_LOKASI_TANAH_FIELD', { field: 'village_name', value: '' })
            commit('SET_LOKASI_TANAH_FIELD', { field: 'village_id', value: '' })
            commit('location/SET_VILLAGES', [], { root: true })
          }
          commit('SET_LOKASI_TANAH_FIELD', { field: 'city_id', value: city.id })
          dispatch('location/fetchAreas', { params: { depth: 3, cityId: city.id } }, { root: true })
        }
      } else {
        commit('SET_LOKASI_TANAH_FIELD', { field: 'city_id', value: '' })
        commit('SET_LOKASI_TANAH_FIELD', { field: 'district_name', value: '' })
        commit('SET_LOKASI_TANAH_FIELD', { field: 'district_id', value: '' })
        commit('location/SET_SUB_DISTRICT', [], { root: true })
        commit('SET_LOKASI_TANAH_FIELD', { field: 'village_name', value: '' })
        commit('SET_LOKASI_TANAH_FIELD', { field: 'village_id', value: '' })
        commit('location/SET_VILLAGES', [], { root: true })
      }
    },

    handleSubdistrictSelected({ state, commit, dispatch, rootState }) {
      const districtName = state.lokasiTanah.districtName
      if (rootState.location.subDistricts.length && districtName) {
        const district = rootState.location.subDistricts.find((d) => d.name === districtName)
        if (district) {
          if (district.id !== state.lokasiTanah.districtId) {
            commit('SET_LOKASI_TANAH_FIELD', { field: 'village_name', value: '' })
            commit('SET_LOKASI_TANAH_FIELD', { field: 'village_id', value: '' })
            commit('location/SET_VILLAGES', [], { root: true })
          }
          commit('SET_LOKASI_TANAH_FIELD', { field: 'district_id', value: district.id })
          dispatch('location/fetchAreas', { params: { depth: 4, districtId: district.id } }, { root: true })
        }
      } else {
        commit('SET_LOKASI_TANAH_FIELD', { field: 'district_id', value: '' })
        commit('SET_LOKASI_TANAH_FIELD', { field: 'village_name', value: '' })
        commit('SET_LOKASI_TANAH_FIELD', { field: 'village_id', value: '' })
        commit('location/SET_VILLAGES', [], { root: true })
      }
    },

    handleVillageSelected({ state, commit, rootState }) {
      const villageName = state.lokasiTanah.villageName
      if (rootState.location.villages.length && villageName) {
        const village = rootState.location.villages.find((v) => v.name === villageName)
        if (village) {
          commit('SET_LOKASI_TANAH_FIELD', { field: 'village_id', value: village.id })
        }
      } else {
        commit('SET_LOKASI_TANAH_FIELD', { field: 'village_id', value: '' })
      }
    },
    // Placeholder upload action - real upload implementation should be added
    convertFileToBase64(_, file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64Data = reader.result.split(',')[1]
          resolve(base64Data)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },

    async uploadDocument({ commit, state, dispatch }, { key, file }) {
      const payload = {
        file,
        url: '',
        progress: 0,
        status: 'UPLOADING',
        errors: [],
      }

      commit('SET_DOKUMEN_SLOT', { key, payload })

      try {
        if (this.$config.useMockImahAing && this.$imahAingMock) {
          commit('SET_DOKUMEN_SLOT', { key, payload: { ...payload, progress: 30 } })
          const mockResponse = await this.$imahAingMock.uploadDocument()
          const fileUrl = `${this.$config.urlFile}/${mockResponse.data.path}`

          commit('SET_DOKUMEN_SLOT', {
            key,
            payload: { file, url: fileUrl, progress: 100, status: 'SUCCESS', errors: [] },
          })

          return fileUrl
        }

        // simulate progress
        commit('SET_DOKUMEN_SLOT', { key, payload: { ...payload, progress: 20 } })

        const base64Data = await dispatch('convertFileToBase64', file)

        commit('SET_DOKUMEN_SLOT', { key, payload: { ...payload, progress: 50 } })

        const formData = {
          name: file.name,
          isConfidental: false,
          mimeType: file.type,
          roles: ['admin', 'rw'],
          data: base64Data,
        }

        const response = await this.$axios.post('/file/upload', formData)

        const fileUrl = `${this.$config.urlFile}/${response.data.data.path}`

        commit('SET_DOKUMEN_SLOT', {
          key,
          payload: { file, url: fileUrl, progress: 100, status: 'SUCCESS', errors: [] },
        })

        return fileUrl
      } catch (error) {
        const errMsg = error?.response?.data?.message || error.message || 'upload_failed'
        commit('SET_DOKUMEN_SLOT', { key, payload: { file, url: '', progress: 0, status: 'ERROR', errors: [errMsg] } })
        throw error
      }
    },
    async submitForm({ commit, state }) {
      commit('SET_STATUS_SUBMIT', 'LOADING')
      try {
        // Build photos from the five document slots in fixed order
        const docKeys = ['ktp', 'kk', 'suratMiskin', 'suratTanah', 'fotoTanah']
        const photos = docKeys
          .map((k) => state.dokumen[k]?.url || '')
          .filter((u) => !!u)
          .map((url) => ({ url }))

        const { location, place, cityId, cityName, districtId, districtName, villageId, villageName, dusun, rw, rt, addressDetail } = state.lokasiTanah
        const payload = {
          user_name: state.dataPengusul.name,
          user_email: state.dataPengusul.email || '',
          user_phone: state.dataPengusul.phone,
          user_nik: state.dataPengusul.nik,
          user_kk: state.dataPengusul.nomorKk,
          source_id: state.sourceId || 'sapawarga',
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

        const response =
          this.$config.useMockImahAing && this.$imahAingMock
            ? await this.$imahAingMock.submitForm(payload)
            : await this.$axios.post('/v1/aduan/complaints', payload)
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
