/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { isEqual } from 'lodash'
import { convertToLocaleDate } from '~/utils'

// define the default state for reset purposes
const IMAGE_UPLOAD_STATUS = Object.freeze({
  NONE: 'NONE',
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  HASDEFAULT: 'HASDEFAULT',
})

const FORM_SUBMIT_STATUS = Object.freeze({
  NONE: 'NONE',
  SAVE_AS_DRAFT_CONFIRMATION: 'SAVE_AS_DRAFT_CONFIRMATION',
  SUBMIT_CONFIRMATION: 'SUBMIT_CONFIRMATION',
  UPDATE_CONFIRMATION: 'UPDATE_CONFIRMATION',
  CANCEL_CONFIRMATION: 'CANCEL_CONFIRMATION',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
})

const getDefaultState = () => ({
  authToken: null,
  currentFormStep: 1,
  // data_wargi as step-one
  data_wargi: {
    phone: '',
    name: '',
    email: '',
    is_email_valid: false,
  },
  // informasi_aduan as step-two
  informasi_aduan: {
    type: '',
    is_anonymous: false,
    category: '',
    category_option: [],
    sub_category: '',
    sub_category_option: [],
    title: '',
    reason: '',
    category_child_id: '',
    subcategory_child_id: '',
  },
  // foto_aduan as step-three
  foto_aduan: {
    images: [],
    raw_image: [],
    errors: [],
  },
  // lokasi_aduan as step-four
  lokasi_aduan: {
    province_name: 'Jawa Barat',
    province_id: '32',
    city_name: '',
    city_id: '',
    district_name: '',
    district_id: '',
    village_name: '',
    village_id: '',
    location: {
      lat: 0,
      lng: 0,
    },
    place: {
      name: '',
      address: '',
    },
    address_detail: '',
  },
  statusSubmitForm: {
    status: FORM_SUBMIT_STATUS.NONE,
    progress: 0,
  },
})

export default {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    authToken(state) {
      return state.authToken
    },
    hasAuthToken(state) {
      return !!state.authToken
    },
    email(state) {
      return state.data_wargi.email
    },
    isEmailValid(state) {
      return state.data_wargi.is_email_valid
    },
    currentFormStep(state) {
      return state.currentFormStep
    },
    isFirstStep(state) {
      return state.currentFormStep === 1
    },
    isLastStep(state) {
      return state.currentFormStep === 4
    },
    lengthImageAduan(state) {
      return state.foto_aduan.raw_image.length
    },
    categoriesOption(state) {
      const categories = state.informasi_aduan.category_option
      return categories.length
        ? categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))
        : []
    },
    subCategoriesOption(state) {
      const subcategories = state.informasi_aduan.sub_category_option
      return subcategories.length
        ? subcategories.map((subcategory) => ({
            label: subcategory.name,
            value: subcategory.id,
          }))
        : []
    },
  },
  mutations: {
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token
    },
    SET_CURRENT_FORM_STEP(state, payload) {
      state.currentFormStep = payload
    },
    SET_DATA_WARGI_PHONE(state, payload) {
      state.data_wargi.phone = payload
    },
    SET_DATA_WARGI_NAME(state, payload) {
      state.data_wargi.name = payload
    },
    SET_DATA_WARGI_EMAIL(state, payload) {
      state.data_wargi.email = payload
    },
    SET_INFORMASI_ADUAN_TYPE(state, payload) {
      state.informasi_aduan.type = payload
    },
    SET_INFORMASI_ADUAN_IS_ANONYMOUS(state, payload) {
      state.informasi_aduan.is_anonymous = payload
    },
    SET_INFORMASI_ADUAN_CATEGORY(state, payload) {
      state.informasi_aduan.category = payload
    },
    SET_INFORMASI_ADUAN_CATEGORY_OPTION(state, payload) {
      state.informasi_aduan.category_option = payload
    },
    SET_INFORMASI_ADUAN_SUB_CATEGORY(state, payload) {
      state.informasi_aduan.sub_category = payload
    },
    SET_INFORMASI_ADUAN_CATEGORY_CHILD_ID(state, payload) {
      state.informasi_aduan.category_child_id = payload
    },
    SET_INFORMASI_ADUAN_SUBCATEGORY_CHILD_ID(state, payload) {
      state.informasi_aduan.subcategory_child_id = payload
    },
    SET_INFORMASI_ADUAN_SUB_CATEGORY_OPTION(state, payload) {
      state.informasi_aduan.sub_category_option = payload
    },
    SET_INFORMASI_ADUAN_TITLE(state, payload) {
      state.informasi_aduan.title = payload
    },
    SET_INFORMASI_ADUAN_REASON(state, payload) {
      state.informasi_aduan.reason = payload
    },
    ADD_FOTO_ADUAN(state) {
      state.foto_aduan.images.push({
        url: '',
      })
    },
    SET_LOKASI_ADUAN_CITY_NAME(state, payload) {
      state.lokasi_aduan.city_name = payload
    },
    SET_LOKASI_ADUAN_CITY_ID(state, payload) {
      state.lokasi_aduan.city_id = payload
    },
    SET_LOKASI_ADUAN_DISTRICT_NAME(state, payload) {
      state.lokasi_aduan.district_name = payload
    },
    SET_LOKASI_ADUAN_DISTRICT_ID(state, payload) {
      state.lokasi_aduan.district_id = payload
    },
    SET_LOKASI_ADUAN_VILLAGE_NAME(state, payload) {
      state.lokasi_aduan.village_name = payload
    },
    SET_LOKASI_ADUAN_VILLAGE_ID(state, payload) {
      state.lokasi_aduan.village_id = payload
    },
    SET_LOKASI_ADUAN_LOCATION(state, payload) {
      state.lokasi_aduan.location.lat = payload.lat
      state.lokasi_aduan.location.lng = payload.lng
    },
    SET_LOKASI_ADUAN_PLACE(state, payload) {
      state.lokasi_aduan.place.name = payload.name ?? ''
      state.lokasi_aduan.place.address = payload.formatted_address ?? ''
    },
    SET_LOKASI_ADUAN_ADDRESS_DETAIL(state, payload) {
      state.lokasi_aduan.address_detail = payload
    },
  },
  actions: {
    setAuthToken({ commit }, token) {
      commit('SET_AUTH_TOKEN', token)
    },
    generateFormData({ state }) {
      const infoAduan = state.informasi_aduan
      const lokasiAduan = state.lokasi_aduan
      const user = state.data_wargi

      const formComplaint = {
        source_id: 'sapawarga', // jotform, sp4n, sapawarga, portaljabar
        user_name: user.name,
        user_phone: user.phone,
        user_email: user.email,
        title: infoAduan.title,
        description: infoAduan.reason,
        category_id: infoAduan.category,
        sub_category_id: infoAduan.sub_category,
        is_secret: infoAduan.type !== 'public',
        is_anonymous: infoAduan.is_anonymous,
        province_id: lokasiAduan.province_id,
        province_name: lokasiAduan.province_name,
        city_id: lokasiAduan.city_id,
        city_name: lokasiAduan.city_name,
        district_id: lokasiAduan.district_id,
        district_name: lokasiAduan.district_name,
        village_id: lokasiAduan.village_id,
        village_name: lokasiAduan.village_name,
        address: lokasiAduan.place.address,
        longitude: `${lokasiAduan.location.lng}`,
        latitude: `${lokasiAduan.location.lat}`,
        address_detail: lokasiAduan.address_detail,
        category_child_id: infoAduan.category_child_id,
        subcategory_child_id: infoAduan.subcategory_child_id,
        photos: [...state.foto_aduan.images],
      }

      return formComplaint
    },
    async fetchCategories({ commit, state }, localStorageKey) {
      try {
        const response = await this.$axios.get('/aduan/complaints/categories', {
          headers: {
            Authorization: `Bearer ${state.authToken}`,
          },
        })

        commit('SET_INFORMASI_ADUAN_CATEGORY_OPTION', response.data.data)
        if (localStorageKey) {
          localStorage.setItem(`${localStorageKey}Date`, new Date())
          localStorage.setItem(
            `${localStorageKey}Data`,
            JSON.stringify(response.data.data)
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
    async fetchSubCategories({ commit, state }, params) {
      try {
        const response = await this.$axios.get(
          '/aduan/complaints/subcategories',
          {
            headers: {
              Authorization: `Bearer ${state.authToken}`,
            },
            params: {
              ...params,
            },
          }
        )

        commit('SET_INFORMASI_ADUAN_SUB_CATEGORY_OPTION', response.data.data)
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * @function: To set categories option
     */
    setCategoriesOption({ state, dispatch }, localStorageKey = null) {
      const timeStamp = localStorage.getItem(`${localStorageKey}Date`)
        ? convertToLocaleDate(
            localStorage.getItem(`${localStorageKey}Date`),
            'dd/MM/yyyy'
          )
        : ''
      const categories = localStorage.getItem(`${localStorageKey}Data`) ?? []
      const nowDate = convertToLocaleDate(new Date(), 'dd/MM/yyyy')

      if (isEqual(timeStamp, nowDate)) {
        state.informasi_aduan.category_option = JSON.parse(categories)
      } else {
        dispatch('fetchCategories', localStorageKey)
      }
    },
    handleCategorySelected({ state, commit, dispatch }) {
      if (
        state.informasi_aduan.category_option.length !== 0 &&
        !!state.informasi_aduan.category
      ) {
        const filteredCategory = state.informasi_aduan.category_option.filter(
          (category) => category.id === state.informasi_aduan.category
        )

        const params = {
          complaint_category_id: filteredCategory[0].id,
        }

        dispatch('fetchSubCategories', params)
        dispatch('handleSubCategorySelected')
      }

      if (state.informasi_aduan.category === undefined) {
        commit('SET_INFORMASI_ADUAN_CATEGORY', '')
        commit('SET_INFORMASI_ADUAN_SUB_CATEGORY', '')
        commit('SET_INFORMASI_ADUAN_CATEGORY_CHILD_ID', '')
        commit('SET_INFORMASI_ADUAN_SUBCATEGORY_CHILD_ID', '')
        commit('SET_INFORMASI_ADUAN_SUB_CATEGORY_OPTION', '')
      }
    },
    handleSubCategorySelected({ commit }) {
      commit('SET_INFORMASI_ADUAN_SUB_CATEGORY', '')
      commit('SET_INFORMASI_ADUAN_SUBCATEGORY_CHILD_ID', '')
    },
    resetCategoryOthers({ commit }) {
      commit('SET_INFORMASI_ADUAN_CATEGORY_CHILD_ID', '')
    },
    resetSubCategoryOthers({ commit }) {
      commit('SET_INFORMASI_ADUAN_SUBCATEGORY_CHILD_ID', '')
    },
    previousStep({ commit, state }) {
      const { currentFormStep } = state

      if (currentFormStep === 1) {
        return
      }

      commit('SET_CURRENT_FORM_STEP', currentFormStep - 1)
    },
    nextStep({ commit, state }) {
      const { currentFormStep } = state

      if (currentFormStep >= 4) {
        return
      }
      commit('SET_CURRENT_FORM_STEP', currentFormStep + 1)
    },
    handleCitySelected({ state, commit, dispatch, rootState }) {
      if (
        rootState.location.cities.length !== 0 &&
        !!state.lokasi_aduan.city_name
      ) {
        const filteredCity = rootState.location.cities.filter(
          (city) => city.name === state.lokasi_aduan.city_name
        )
        const params = {
          depth: 3,
          cityId: filteredCity[0].id,
        }

        if (filteredCity[0].id !== state.lokasi_aduan.city_id) {
          commit('SET_LOKASI_ADUAN_DISTRICT_NAME', '')
          commit('SET_LOKASI_ADUAN_DISTRICT_ID', null)

          commit('location/SET_VILLAGES', [], { root: true })
          commit('SET_LOKASI_ADUAN_VILLAGE_NAME', '')
          commit('SET_LOKASI_ADUAN_VILLAGE_ID', null)
        }

        commit('SET_LOKASI_ADUAN_CITY_ID', filteredCity[0].id)
        dispatch('location/fetchAreas', { params }, { root: true })
      }

      if (state.lokasi_aduan.city_name === undefined) {
        commit('SET_LOKASI_ADUAN_CITY_NAME', '')
        commit('SET_LOKASI_ADUAN_CITY_ID', null)

        commit('location/SET_SUB_DISTRICT', [], { root: true })
        commit('SET_LOKASI_ADUAN_DISTRICT_NAME', '')
        commit('SET_LOKASI_ADUAN_DISTRICT_ID', null)

        commit('location/SET_VILLAGES', [], { root: true })
        commit('SET_LOKASI_ADUAN_VILLAGE_NAME', '')
        commit('SET_LOKASI_ADUAN_VILLAGE_ID', null)
      }
    },
    handleSubdistrictSelected({ state, commit, dispatch, rootState }) {
      if (
        rootState.location.subDistricts.length !== 0 &&
        !!state.lokasi_aduan.district_name
      ) {
        const filteredDistrict = rootState.location.subDistricts.filter(
          (subdistrict) => subdistrict.name === state.lokasi_aduan.district_name
        )
        const params = {
          depth: 4,
          districtId: filteredDistrict[0].id,
        }

        if (filteredDistrict[0].id !== state.lokasi_aduan.district_id) {
          commit('SET_LOKASI_ADUAN_VILLAGE_NAME', '')
          commit('SET_LOKASI_ADUAN_VILLAGE_ID', null)
        }

        commit('SET_LOKASI_ADUAN_DISTRICT_ID', filteredDistrict[0].id)
        dispatch('location/fetchAreas', { params }, { root: true })
      }

      if (state.lokasi_aduan.district_name === undefined) {
        commit('SET_LOKASI_ADUAN_DISTRICT_ID', null)
        commit('SET_LOKASI_ADUAN_DISTRICT_NAME', '')

        commit('location/SET_VILLAGES', [], { root: true })
      }
    },
    handleVillageSelected({ state, commit, rootState }) {
      if (
        rootState.location.villages.length !== 0 &&
        !!state.lokasi_aduan.village_name
      ) {
        const filteredVillage =
          rootState.location.villages.filter(
            (village) => village.name === state.lokasi_aduan.village_name
          ) ?? []

        commit('SET_LOKASI_ADUAN_VILLAGE_ID', filteredVillage[0].id)
      }

      if (state.lokasi_aduan.village_name === undefined) {
        commit('SET_LOKASI_ADUAN_VILLAGE_NAME', '')
        commit('SET_LOKASI_ADUAN_VILLAGE_ID', null)
      }
    },
    handleLocationComplaint({ state }, params) {
      state.lokasi_aduan.location.lat = params.location.lat
      state.lokasi_aduan.location.lng = params.location.lng
      state.lokasi_aduan.place.name = params.place.name
      state.lokasi_aduan.place.address = params.place.address
    },
    updateProgress({ state }, { progress, delay, index }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          state.foto_aduan.raw_image[index].image_upload_progress = progress
          resolve()
        }, delay)
      })
    },
    updateSubmitProgress({ state }, { progress, delay }) {},
    async handleImagesFile({ state, getters, dispatch }, files) {
      for (const file of files) {
        // Validate Image
        const errorMessages = []
        if (file.size > 1024 * 1024) {
          errorMessages.push('File yang anda masukan melebihi 1 Mb')
        }

        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
          errorMessages.push(
            'File yang anda masukan harus berformat .jpg atau .png'
          )
        }

        // Prevent user upload more than 10 images
        if (state.foto_aduan.raw_image.length >= 10) {
          break
        }

        // Create Image Object
        state.foto_aduan.raw_image.push({
          id: Math.floor(Math.random() * 100000),
          image_file: file,
          image_upload_progress: 0,
          image_upload_status: IMAGE_UPLOAD_STATUS.NONE,
          errors: errorMessages.length > 0 ? errorMessages : [],
        })

        // Handle Upload Image
        const indexing = getters.lengthImageAduan - 1

        state.foto_aduan.raw_image[indexing].image_upload_status =
          IMAGE_UPLOAD_STATUS.UPLOADING

        await dispatch('updateProgress', {
          progress: 50,
          delay: 200,
          index: indexing,
        })
        await dispatch('updateProgress', {
          progress: 75,
          delay: 200,
          index: indexing,
        })
        await dispatch('updateProgress', {
          progress: 100,
          delay: 200,
          index: indexing,
        })

        if (errorMessages.length > 0) {
          state.foto_aduan.raw_image[indexing].image_upload_status =
            IMAGE_UPLOAD_STATUS.ERROR
        } else {
          state.foto_aduan.raw_image[indexing].image_upload_status =
            IMAGE_UPLOAD_STATUS.SUCCESS
        }
      }
    },
    removeImage({ state }, id) {
      const updatedImage = state.foto_aduan.raw_image.filter(
        (item) => item.id !== id
      )
      state.foto_aduan.raw_image = updatedImage
    },
    async retryHandleImage({ state, dispatch }, file) {
      const itemIndex = state.foto_aduan.raw_image.findIndex(
        (item) => item.id === file.id
      )

      const errorMessages = []
      if (file.size > 1024 * 1024) {
        errorMessages.push('File yang anda masukan melebihi 1 Mb')
      }

      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        errorMessages.push(
          'File yang anda masukan harus berformat .jpg atau .png'
        )
      }

      await dispatch('updateProgress', {
        progress: 0,
        delay: 0,
        index: itemIndex,
      })
      state.foto_aduan.raw_image[itemIndex].image_upload_status =
        IMAGE_UPLOAD_STATUS.UPLOADING
      await dispatch('updateProgress', {
        progress: 50,
        delay: 200,
        index: itemIndex,
      })
      await dispatch('updateProgress', {
        progress: 75,
        delay: 200,
        index: itemIndex,
      })
      await dispatch('updateProgress', {
        progress: 100,
        delay: 200,
        index: itemIndex,
      })

      if (errorMessages.length > 0) {
        state.foto_aduan.raw_image[itemIndex].image_upload_status =
          IMAGE_UPLOAD_STATUS.ERROR
      } else {
        state.foto_aduan.raw_image[itemIndex].image_upload_status =
          IMAGE_UPLOAD_STATUS.SUCCESS
      }
    },
    submitConfirmation({ state, dispatch }) {
      state.statusSubmitForm.status = FORM_SUBMIT_STATUS.SUBMIT_CONFIRMATION
    },
    closeConfirmation({ state }) {
      state.statusSubmitForm.status = FORM_SUBMIT_STATUS.NONE
    },
    async handleImage({ state, dispatch }, files) {
      const uploadPromises = files.map(async (file) => {
        const base64Data = await dispatch(
          'convertFileToBase64',
          file.image_file
        )

        const formData = {
          name: file.image_file.name,
          isConfidental: false,
          mimeType: file.image_file.type,
          roles: ['admin', 'rw'],
          data: base64Data,
        }

        const response = await this.$axios.post('/file/upload', formData, {
          headers: {
            Authorization: `Bearer ${state.authToken}`,
          },
        })

        if (response) {
          return {
            url: `${this.$config.urlFile}/` + response.data.data.path,
          }
        }
      })

      const results = await Promise.all(uploadPromises)
      state.foto_aduan.images.push(...results)
    },

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
    async submitForm({ state, dispatch }) {
      try {
        state.statusSubmitForm.status = FORM_SUBMIT_STATUS.LOADING
        await dispatch('updateSubmitProgress', { progress: 25, delay: 200 })
        await dispatch('updateSubmitProgress', { progress: 50, delay: 200 })

        if (state.foto_aduan.images.length === 0) {
          await dispatch('handleImage', state.foto_aduan.raw_image)
        }

        if (!state.informasi_aduan.category.includes('lainnya')) {
          await dispatch('resetCategoryOthers')
        }

        if (!state.informasi_aduan.sub_category.includes('lainnya')) {
          await dispatch('resetSubCategoryOthers')
        }

        const citizenComplaintForm = await dispatch('generateFormData')
        const response = await this.$axios.post(
          '/aduan/complaints',
          citizenComplaintForm,
          {
            headers: {
              Authorization: `Bearer ${state.authToken}`,
            },
          }
        )

        if (response) {
          await dispatch('updateSubmitProgress', { progress: 75, delay: 200 })
          await dispatch('updateSubmitProgress', { progress: 100, delay: 200 })
          state.statusSubmitForm.status = FORM_SUBMIT_STATUS.SUCCESS
        } else {
          dispatch('updateSubmitProgress', { progress: 0, delay: 0 })
          state.statusSubmitForm.status = FORM_SUBMIT_STATUS.ERROR
        }
      } catch (error) {
        dispatch('updateSubmitProgress', { progress: 0, delay: 0 })
        state.statusSubmitForm.status = FORM_SUBMIT_STATUS.ERROR
      }
    },
    resetForm({ state }) {
      Object.assign(state, getDefaultState())
    },
    async handleCheckEmail({ state, getters }) {
      try {
        const response = await this.$axios.get(
          `/user/profile/email/${getters.email}`,
          {
            headers: {
              Authorization: `Bearer ${state.authToken}`,
            },
          }
        )

        state.data_wargi.is_email_valid = response.data.status
      } catch (error) {
        console.error(error)
      }
    },
  },
}
