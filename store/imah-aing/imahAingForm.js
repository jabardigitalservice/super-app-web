/**
 * Pusat peta default / fallback Geolocation
 */
export const IMAH_AING_DEFAULT_LOCATION = {
  lat: -6.949097962580605,
  lng: 107.66734566539526,
}

const getDefaultState = () => ({
  authToken: null,
  /** Dari query `source_id` (mis. sapawarga), diisi saat `initForm` */
  sourceId: '',
  currentFormStep: 0,

  consent: {
    hasReadPrivacyPolicy: false,
    /** Tiga pernyataan — teks UI beda sapawarga vs warga di StepOne */
    stmtSingleHouse: false,
    stmtNoSimilarProgram: false,
    stmtRevocationIfUntrue: false,
  },

  kondisiRumah: {
    penyebabKerusakan: '',
    penyebabKerusakanLainnya: '',
    deskripsiKondisi: '',
  },

  dataPengusul: {
    name: '',
    phone: '',
    email: '',
    nik: '',
    nomorKk: '',
    incomePerMonth: '',
    avatarUrl: '',
  },

  dokumen: {
    ktp: null,
    kk: null,
    suratMiskin: null,
    suratTanah: null,
    /** Multifile — tiap item: { file, url, progress, status, errors } */
    fotoRumah: [],
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

const IMAH_AING_PENYEBAB_LAINNYA = 'imah-aing-other'

const USER_INCOME_PER_MONTH_KEY = 'user_income_per_month'

function incomeDigitsToNumber(digits) {
  const s = String(digits || '').replace(/\D/g, '')
  if (s === '') {
    return NaN
  }
  const n = Number(s)
  return Number.isFinite(n) && n >= 0 ? n : NaN
}

function buildImahAingDescription(kondisiRumah) {
  const deskripsi = String(kondisiRumah?.deskripsiKondisi || '').trim()
  const penyebabLainnya = String(kondisiRumah?.penyebabKerusakanLainnya || '').trim()
  if (kondisiRumah?.penyebabKerusakan === IMAH_AING_PENYEBAB_LAINNYA && penyebabLainnya) {
    return `[Penyebab lainnya: ${penyebabLainnya}] ${deskripsi}`.trim()
  }
  return deskripsi
}

function parseComplaintExistsResponse(response) {
  const body = response?.data
  if (body == null) {
    return false
  }

  const inner = Object.prototype.hasOwnProperty.call(body, 'data') ? body.data : body
  if (typeof inner === 'boolean') {
    return inner
  }

  if (inner && typeof inner === 'object') {
    if (typeof inner.is_exists === 'boolean') {
      return inner.is_exists
    }
    if (typeof inner.exists === 'boolean') {
      return inner.exists
    }
  }

  if (typeof body.is_exists === 'boolean') {
    return body.is_exists
  }
  if (typeof body.exists === 'boolean') {
    return body.exists
  }

  return false
}

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

/**
 * Koordinat opsional dari decoded query `meta` (JSON).
 * Mendukung `latitude`/`longitude` atau `lat`/`lng` (angka atau string yang bisa di-parse).
 */
function parseLocationFromMetaPayload(data) {
  if (!data || typeof data !== 'object') {
    return null
  }
  const latRaw = data.latitude != null ? data.latitude : data.lat
  const lngRaw = data.longitude != null ? data.longitude : data.lng
  if (latRaw == null || lngRaw == null) {
    return null
  }
  const lat = typeof latRaw === 'number' ? latRaw : parseFloat(String(latRaw), 10)
  const lng = typeof lngRaw === 'number' ? lngRaw : parseFloat(String(lngRaw), 10)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null
  }
  return { lat, lng }
}

function applyQueryMetaToLokasiTanah(commit, data) {
  const loc = parseLocationFromMetaPayload(data)
  if (loc) {
    commit('SET_LOKASI_TANAH_FIELD', { field: 'location', value: loc })
  }
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
    authToken: (state) => state.authToken,
    hasAuthToken: (state) => !!state.authToken,
    currentFormStep: (state) => state.currentFormStep,
    isFirstStep: (state, getters) => state.currentFormStep === getters.startStep,
    isLastStep: (state) => state.currentFormStep === 4,
    startStep: () => 1,
    isConsentValid: (state) => {
      const c = state.consent
      return (
        c.hasReadPrivacyPolicy &&
        c.stmtSingleHouse &&
        c.stmtNoSimilarProgram &&
        c.stmtRevocationIfUntrue
      )
    },
    isAllDocumentsUploaded: (state) => {
      const requiredKeys = ['ktp', 'kk', 'suratMiskin', 'suratTanah']
      const baseOk = requiredKeys.every((k) => state.dokumen[k] && state.dokumen[k].status === 'SUCCESS')
      const fr = state.dokumen.fotoRumah || []
      const fotoOk =
        fr.length >= 1 && fr.every((s) => s && s.status === 'SUCCESS')
      return baseOk && fotoOk
    },
    documentSlotsOrdered: (state) => {
      const keys = ['ktp', 'kk', 'suratMiskin', 'suratTanah']
      const base = keys.map((k) => ({ key: k, slot: state.dokumen[k] }))
      const foto = (state.dokumen.fotoRumah || []).map((slot, index) => ({
        key: 'fotoRumah',
        index,
        slot,
      }))
      return [...base, ...foto]
    },
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token
    },
    SET_SOURCE_ID(state, id) {
      state.sourceId = id || ''
    },
    SET_CURRENT_FORM_STEP(state, step) {
      state.currentFormStep = step
    },
    SET_CONSENT_PRIVACY(state, val) {
      state.consent.hasReadPrivacyPolicy = val
    },
    SET_CONSENT_STATEMENT(state, { field, value }) {
      if (Object.prototype.hasOwnProperty.call(state.consent, field)) {
        state.consent[field] = value
      }
    },
    SET_KONDISI_RUMAH_FIELD(state, { field, value }) {
      if (Object.prototype.hasOwnProperty.call(state.kondisiRumah, field)) {
        state.kondisiRumah[field] = value
      }
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
    ADD_FOTO_RUMAH_SLOT(state, payload) {
      state.dokumen.fotoRumah.push(payload)
    },
    UPDATE_FOTO_RUMAH_SLOT(state, { index, payload }) {
      if (index < 0 || index >= state.dokumen.fotoRumah.length) {
        return
      }
      state.dokumen.fotoRumah.splice(index, 1, payload)
    },
    REMOVE_FOTO_RUMAH_SLOT(state, index) {
      if (index < 0 || index >= state.dokumen.fotoRumah.length) {
        return
      }
      state.dokumen.fotoRumah.splice(index, 1)
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
    setAuthToken({ commit }, token) {
      commit('SET_AUTH_TOKEN', token)
    },
    async refreshToken({ state }) {
      try {
        const newToken = await this.$getToken('refresh_token')
        state.authToken = newToken
        return newToken
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Token refresh failed:', error)
        throw error
      }
    },
    initForm({ commit }, payload) {
      const { meta, sourceId } = normalizeInitQueryPayload(payload)
      commit('SET_SOURCE_ID', sourceId)

      if (meta) {
        const decoded = decodeMetaQueryParam(meta)
        if (decoded && typeof decoded === 'object') {
          applyQueryMetaToDataPengusul(commit, decoded)
          applyQueryMetaToLokasiTanah(commit, decoded)
        }
      }
    },
    hydrateLokasiTanahFromGeolocation({ commit, state }) {
      if (!process.client) {
        return
      }
      const { lat, lng } = state.lokasiTanah.location
      if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
        return
      }
      const fallback = () => {
        commit('SET_LOKASI_TANAH_FIELD', {
          field: 'location',
          value: { ...IMAH_AING_DEFAULT_LOCATION },
        })
      }
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        fallback()
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          commit('SET_LOKASI_TANAH_FIELD', {
            field: 'location',
            value: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          })
        },
        fallback
      )
    },
    nextStep({ commit, state }) {
      commit('SET_CURRENT_FORM_STEP', state.currentFormStep + 1)
    },
    previousStep({ commit, state }) {
      if (state.currentFormStep > 1) {
        commit('SET_CURRENT_FORM_STEP', state.currentFormStep - 1)
      }
    },
    /**
     * Cek apakah KK sudah punya pengajuan Imah Aing (double submission).
     * @returns {Promise<boolean>} `true` jika sudah ada pengajuan.
     */
    async checkKkDuplicate({ state, dispatch }) {
      const kk = String(state.dataPengusul.nomorKk || '').replace(/\D/g, '')
      if (!kk) {
        return false
      }

      if (this.$config.useMockImahAing && this.$imahAingMock) {
        const mockRes = await this.$imahAingMock.checkKkDuplicate({ user_kk: kk })
        return parseComplaintExistsResponse(mockRes)
      }

      const params = {
        complaint_category_id: 'imah-aing',
        user_kk: kk,
      }

      const call = () =>
        this.$axios.get('/aduan/complaints/exists', {
          params,
          headers: state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {},
        })

      try {
        const res = await call()
        return parseComplaintExistsResponse(res)
      } catch (error) {
        if (error.response?.status === 401) {
          await dispatch('refreshToken')
          const res = await call()
          return parseComplaintExistsResponse(res)
        }
        throw error
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

    async uploadDocument({ commit, state, dispatch }, { key, file, index }) {
      const isFotoRumah = key === 'fotoRumah'
      if (isFotoRumah) {
        if (index == null || index < 0 || index >= state.dokumen.fotoRumah.length) {
          throw new Error('invalid_foto_rumah_index')
        }
      }

      const setSlot = (slotPayload) => {
        if (isFotoRumah) {
          commit('UPDATE_FOTO_RUMAH_SLOT', { index, payload: slotPayload })
        } else {
          commit('SET_DOKUMEN_SLOT', { key, payload: slotPayload })
        }
      }

      const payload = {
        file,
        url: '',
        progress: 0,
        status: 'UPLOADING',
        errors: [],
      }

      setSlot(payload)

      try {
        if (this.$config.useMockImahAing && this.$imahAingMock) {
          setSlot({ ...payload, progress: 30 })
          const mockResponse = await this.$imahAingMock.uploadDocument()
          const fileUrl = `${this.$config.urlFile}/${mockResponse.data.path}`

          setSlot({ file, url: fileUrl, progress: 100, status: 'SUCCESS', errors: [] })

          return fileUrl
        }

        setSlot({ ...payload, progress: 20 })

        const base64Data = await dispatch('convertFileToBase64', file)

        setSlot({ ...payload, progress: 50 })

        const formData = {
          name: file.name,
          isConfidental: false,
          mimeType: file.type,
          roles: ['admin', 'rw'],
          data: base64Data,
        }

        let response
        try {
          response = await this.$axios.post('/file/upload', formData)
        } catch (error) {
          if (error.response?.status === 401) {
            await dispatch('refreshToken')
            response = await this.$axios.post('/file/upload', formData, {
              headers: {
                Authorization: `Bearer ${state.authToken}`,
              },
            })
          } else {
            throw error
          }
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
    async submitForm({ commit, state, dispatch }) {
      commit('SET_STATUS_SUBMIT', 'LOADING')
      try {
        // photos[] — urutan: KTP, KK, surat miskin, surat tanah, lalu semua foto rumah (multifile)
        const docKeys = ['ktp', 'kk', 'suratMiskin', 'suratTanah']
        const baseUrls = docKeys.map((k) => state.dokumen[k]?.url || '').filter((u) => !!u)
        const fotoUrls = (state.dokumen.fotoRumah || []).map((s) => s?.url || '').filter((u) => !!u)
        const photos = [...baseUrls, ...fotoUrls].map((url) => ({ url }))

        const { location, place, cityId, cityName, districtId, districtName, villageId, villageName, dusun, rw, rt, addressDetail } = state.lokasiTanah
        const userIncomePerMonth = incomeDigitsToNumber(state.dataPengusul.incomePerMonth)
        if (!Number.isFinite(userIncomePerMonth)) {
          commit('SET_STATUS_SUBMIT', 'ERROR')
          throw new Error('invalid_user_income_per_month')
        }

        const payload = {
          user_name: state.dataPengusul.name,
          user_email: state.dataPengusul.email || '',
          user_phone: state.dataPengusul.phone,
          user_nik: state.dataPengusul.nik,
          user_kk: state.dataPengusul.nomorKk,
          [USER_INCOME_PER_MONTH_KEY]: userIncomePerMonth,
          source_id: state.sourceId || 'sapawarga',
          type: 'private',
          photos,
          category_id: 'imah-aing',
          complaint_subcategory_id: state.kondisiRumah.penyebabKerusakan,
          description: buildImahAingDescription(state.kondisiRumah),
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

        const postComplaint = () =>
          this.$axios.post('/aduan/complaints', payload, {
            headers: state.authToken
              ? { Authorization: `Bearer ${state.authToken}` }
              : {},
          })

        let response
        if (this.$config.useMockImahAing && this.$imahAingMock) {
          response = await this.$imahAingMock.submitForm(payload)
        } else {
          try {
            response = await postComplaint()
          } catch (error) {
            if (error.response?.status === 401) {
              await dispatch('refreshToken')
              response = await postComplaint()
            } else {
              throw error
            }
          }
        }
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
