import { decodeMetaQueryParam } from '~/utils/decode-meta'

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
    id: '',
    role: '',
  },

  dokumen: {
    ktp: null,
    kk: null,
    suratMiskin: null,
    suratTanah: null,
    fotoDepan: null,
    fotoBelakang: null,
    fotoKiri: null,
    fotoKanan: null,
    fotoDalam: null,
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

  /** ID usulan yang sedang diedit (mode edit via query param `edit`) */
  editComplaintId: '',
})

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
  return String(kondisiRumah?.deskripsiKondisi || '').trim()
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

function isUnauthorizedError(error) {
  return error?.response?.status === 401
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
  setField('id', data.id)
  setField('role', data.role)
  const kkVal = data.kk != null ? data.kk : data.nomor_kk
  setField('nomorKk', kkVal)
}

/**
 * Resolve field proposer dengan aturan:
 * - Jika meta.role selain 'warga' -> pakai nilai dari meta (state.dataPengusul)
 * - Jika meta.role === 'warga' atau kosong -> pakai nilai dari state.dataPengusul (diisi user)
 */
function resolveProposerField(state, fieldName) {
  const role = (state.dataPengusul.role || '').trim().toLowerCase()
  if (role && role !== 'warga') {
    return state.dataPengusul[fieldName] || ''
  }
  return state.dataPengusul[fieldName] || ''
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
    /** Mode edit aktif jika ada usulan yang sedang diedit (`editComplaintId` terisi). */
    isEditMode: (state) => !!state.editComplaintId,
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
      const requiredKeys = [
        'ktp',
        'kk',
        'suratMiskin',
        'suratTanah',
        'fotoDepan',
        'fotoBelakang',
        'fotoKiri',
        'fotoKanan',
        'fotoDalam',
      ]
      return requiredKeys.every((k) => state.dokumen[k] && state.dokumen[k].status === 'SUCCESS')
    },
    documentSlotsOrdered: (state) => {
      const keys = [
        'ktp',
        'kk',
        'suratMiskin',
        'suratTanah',
        'fotoDepan',
        'fotoBelakang',
        'fotoKiri',
        'fotoKanan',
        'fotoDalam',
      ]
      return keys.map((k) => ({ key: k, slot: state.dokumen[k] }))
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
    SET_EDIT_COMPLAINT_ID(state, id) {
      state.editComplaintId = id || ''
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
    /**
     * Hydrate form store dari data list item (mode edit).
     * Hanya field yang tersedia di response list yang diisi — sisanya harus diisi ulang user.
     * Data dari list item menimpa hasil `initForm` agar identitas yang tampil milik usulan.
     */
    hydrateFromExisting({ commit, rootState }, complaintId) {
      const items = rootState.imahAingHistory?.items || []
      const item = items.find((i) => i.id === complaintId)
      if (!item) {
        return
      }

      commit('SET_EDIT_COMPLAINT_ID', complaintId)

      // Prefill data pengusul dari list item (menimpa hasil initForm)
      const setPengusul = (field, value) => {
        if (value != null && String(value).trim() !== '') {
          commit('SET_DATA_PENGUSUL_FIELD', { field, value: String(value).trim() })
        }
      }
      setPengusul('name', item.user_name)
      setPengusul('nik', item.user_nik)
      setPengusul('nomorKk', item.user_kk)
      setPengusul('id', item.user_id)

      // Prefill lokasi RT/RW dari list item
      if (item.rt != null) {
        commit('SET_LOKASI_TANAH_FIELD', { field: 'rt', value: String(item.rt) })
      }
      if (item.rw != null) {
        commit('SET_LOKASI_TANAH_FIELD', { field: 'rw', value: String(item.rw) })
      }

      // Consent dianggap sudah disetujui di mode edit
      commit('SET_CONSENT_PRIVACY', true)
      commit('SET_CONSENT_STATEMENT', { field: 'stmtSingleHouse', value: true })
      commit('SET_CONSENT_STATEMENT', { field: 'stmtNoSimilarProgram', value: true })
      commit('SET_CONSENT_STATEMENT', { field: 'stmtRevocationIfUntrue', value: true })
    },
    /**
     * Ambil detail usulan untuk prefill lengkap di mode edit.
     * @returns {Promise<object|null>} data detail, atau `null` bila kosong.
     */
    async fetchComplaintDetail({ state, commit }, complaintId) {
      if (!complaintId) {
        return null
      }
      try {
        const res = await this.$gatewayPartnerAPI.get(`/aduan/complaints/${complaintId}`, {
          params: { phase: 'verification' },
          headers: state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {},
        })
        return res.data?.data || null
      } catch (error) {
        if (isUnauthorizedError(error)) {
          commit('SET_STATUS_SUBMIT', 'SESSION_EXPIRED')
        }
        throw error
      }
    },
    /**
     * Overlay prefill form dari response GET detail (menimpa baseline list item).
     * Hanya field yang tersedia di detail yang diisi.
     */
    hydrateFromDetail({ commit }, detail) {
      if (!detail || typeof detail !== 'object') {
        return
      }

      // Data pengusul / calon penerima
      const setPengusul = (field, value) => {
        if (value != null && String(value).trim() !== '') {
          commit('SET_DATA_PENGUSUL_FIELD', { field, value: String(value).trim() })
        }
      }
      setPengusul('name', detail.user_name)
      setPengusul('nik', detail.user_nik)
      setPengusul('nomorKk', detail.user_kk)
      setPengusul('phone', detail.user_phone)
      setPengusul('email', detail.user_email)
      setPengusul('id', detail.user_id)
      setPengusul('role', detail.user_role)
      if (detail.user_income_per_month != null && detail.user_income_per_month !== '') {
        commit('SET_DATA_PENGUSUL_FIELD', {
          field: 'incomePerMonth',
          value: String(detail.user_income_per_month).replace(/\D/g, ''),
        })
      }

      // Kondisi rumah
      if (detail.description != null) {
        commit('SET_KONDISI_RUMAH_FIELD', { field: 'deskripsiKondisi', value: String(detail.description) })
      }
      if (detail.complaint_subcategory_id) {
        commit('SET_KONDISI_RUMAH_FIELD', { field: 'penyebabKerusakan', value: detail.complaint_subcategory_id })
      }

      // Lokasi tanah
      const setLokasi = (field, value) => {
        if (value != null && String(value).trim() !== '') {
          commit('SET_LOKASI_TANAH_FIELD', { field, value: String(value).trim() })
        }
      }
      setLokasi('city_id', detail.city_id)
      setLokasi('city_name', detail.city_name)
      setLokasi('district_id', detail.district_id)
      setLokasi('district_name', detail.district_name)
      setLokasi('village_id', detail.village_id)
      setLokasi('village_name', detail.village_name)
      setLokasi('rt', detail.rt)
      setLokasi('rw', detail.rw)
      setLokasi('dusun', detail.dusun_name)
      setLokasi('address_detail', detail.address_detail)
      if (detail.address != null) {
        commit('SET_LOKASI_TANAH_FIELD', {
          field: 'place',
          value: { name: '', address: String(detail.address) },
        })
      }
      const loc = parseLocationFromMetaPayload(detail)
      if (loc) {
        commit('SET_LOKASI_TANAH_FIELD', { field: 'location', value: loc })
      }

      // Dokumen — map photos[].field → slot store, tandai SUCCESS agar lolos validasi
      if (Array.isArray(detail.photos)) {
        const fieldToSlot = {
          ktp: 'ktp',
          kk: 'kk',
          surat_miskin: 'suratMiskin',
          surat_tanah: 'suratTanah',
          foto_depan: 'fotoDepan',
          foto_belakang: 'fotoBelakang',
          foto_kiri: 'fotoKiri',
          foto_kanan: 'fotoKanan',
          foto_dalam: 'fotoDalam',
        }
        detail.photos.forEach((photo) => {
          const slotKey = fieldToSlot[photo?.field]
          if (slotKey && photo?.url) {
            // Buat placeholder File agar file.size tidak null di UploadProgress.
            // Size diambil dari photo.size (jika API menyediakan), fallback ke 0.
            const fileName = photo.url.split('/').pop().split('?')[0] || 'document'
            const byteSize = photo.size != null && Number.isFinite(Number(photo.size)) ? Number(photo.size) : 0
            const placeholderFile = process.client
              ? new File([new ArrayBuffer(byteSize)], fileName)
              : null
            commit('SET_DOKUMEN_SLOT', {
              key: slotKey,
              payload: { file: placeholderFile, url: photo.url, progress: 100, status: 'SUCCESS', errors: [] },
            })
          }
        })
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
    async checkKkDuplicate({ state, commit }) {
      // Mode edit: KK milik usulan yang sedang diedit — lewati cek duplikat
      // agar tidak salah memblokir dengan "No KK Sudah Pernah Diajukan".
      if (state.editComplaintId) {
        return false
      }

      const kk = String(state.dataPengusul.nomorKk || '').replace(/\D/g, '')
      if (!kk) {
        return false
      }

      const params = {
        complaint_category_id: 'imah-aing',
        user_kk: kk,
      }

      const call = () =>
        this.$gatewayPartnerAPI.get('/aduan/complaints/exists', {
          params,
          headers: state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {},
        })

      try {
        const res = await call()
        return parseComplaintExistsResponse(res)
      } catch (error) {
        if (isUnauthorizedError(error)) {
          commit('SET_STATUS_SUBMIT', 'SESSION_EXPIRED')
        }
        throw error
      }
    },
    /**
     * Prefetch opsi cascade lokasi (kecamatan & kelurahan) di mode edit.
     * Memakai `cityId`/`districtId` hasil hydrate detail agar opsi JdsSelect terisi
     * tanpa interaksi user. Bila id kosong, resolve dari nama via daftar yang ada.
     */
    async prefillLocationOptions({ state, commit, dispatch, rootState }) {
      const { cityId, cityName, districtId, districtName } = state.lokasiTanah

      let resolvedCityId = cityId
      if (!resolvedCityId && cityName) {
        const city = rootState.location.cities.find((c) => c.name === cityName)
        if (city) {
          resolvedCityId = city.id
          commit('SET_LOKASI_TANAH_FIELD', { field: 'city_id', value: city.id })
        }
      }
      if (!resolvedCityId) {
        return
      }
      await dispatch(
        'location/fetchAreas',
        { params: { depth: 3, cityId: resolvedCityId } },
        { root: true }
      )

      let resolvedDistrictId = districtId
      if (!resolvedDistrictId && districtName) {
        const district = rootState.location.subDistricts.find(
          (d) => d.name === districtName
        )
        if (district) {
          resolvedDistrictId = district.id
          commit('SET_LOKASI_TANAH_FIELD', { field: 'district_id', value: district.id })
        }
      }
      if (!resolvedDistrictId) {
        return
      }
      await dispatch(
        'location/fetchAreas',
        { params: { depth: 4, districtId: resolvedDistrictId } },
        { root: true }
      )
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
      const setSlot = (slotPayload) => {
        commit('SET_DOKUMEN_SLOT', { key, payload: slotPayload })
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
          response = await this.$gatewayPartnerAPI.post('/file/upload', formData)
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
    async submitForm({ commit, state }) {
      commit('SET_STATUS_SUBMIT', 'LOADING')
      try {
        const docMapping = [
          { key: 'ktp', field: 'ktp' },
          { key: 'kk', field: 'kk' },
          { key: 'suratMiskin', field: 'surat_miskin' },
          { key: 'suratTanah', field: 'surat_tanah' },
          { key: 'fotoDepan', field: 'foto_depan' },
          { key: 'fotoBelakang', field: 'foto_belakang' },
          { key: 'fotoKiri', field: 'foto_kiri' },
          { key: 'fotoKanan', field: 'foto_kanan' },
          { key: 'fotoDalam', field: 'foto_dalam' },
        ]

        const photos = docMapping
          .map((m) => ({
            url: state.dokumen[m.key]?.url || '',
            field: m.field,
          }))
          .filter((p) => !!p.url)

        const { location, place, cityId, cityName, districtId, districtName, villageId, villageName, dusun, rw, rt, addressDetail } = state.lokasiTanah
        const userIncomePerMonth = incomeDigitsToNumber(state.dataPengusul.incomePerMonth)
        if (!Number.isFinite(userIncomePerMonth)) {
          commit('SET_STATUS_SUBMIT', 'ERROR')
          throw new Error('invalid_user_income_per_month')
        }

        const payload = {
          user_id: state.dataPengusul.id || '',
          user_name: state.dataPengusul.name,
          user_email: state.dataPengusul.email || '',
          user_phone: state.dataPengusul.phone,
          user_nik: state.dataPengusul.nik,
          user_kk: state.dataPengusul.nomorKk,
          proposer_name: resolveProposerField(state, 'name'),
          proposer_phone: resolveProposerField(state, 'phone'),
          proposer_email: resolveProposerField(state, 'email'),
          proposer_role: state.dataPengusul.role || '',
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

        // Mode edit (US-013): PUT update ke endpoint /mobile
        // Mode buat baru: POST create
        const isEdit = !!state.editComplaintId
        const headers = state.authToken
          ? { Authorization: `Bearer ${state.authToken}` }
          : {}

        const sendComplaint = () =>
          isEdit
            ? this.$gatewayPartnerAPI.put(
                `/aduan/complaints/${state.editComplaintId}/mobile`,
                payload,
                { headers }
              )
            : this.$gatewayPartnerAPI.post('/aduan/complaints', payload, { headers })

        let response
        try {
          response = await sendComplaint()
        } catch (error) {
          if (isUnauthorizedError(error)) {
            commit('SET_STATUS_SUBMIT', 'SESSION_EXPIRED')
          }
          throw error
        }
        const submissionId = response.data?.data?.id || response.data?.id || ''

        commit('SET_STATUS_SUBMIT', 'SUCCESS')
        commit('SET_SUBMISSION_ID', submissionId)
        return response
      } catch (error) {
        if (state.statusSubmitForm.status !== 'SESSION_EXPIRED') {
          commit('SET_STATUS_SUBMIT', 'ERROR')
        }
        throw error
      }
    },
    resetForm({ commit }) {
      commit('RESET_STATE')
    },
  },
}
