/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import { isEqual } from 'lodash'
import { formatDate } from '~/utils'

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
  currentFormStep: 1,
  // data_wargi as step-one
  data_wargi: {
    nik: '',
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
    sub_category_other: '',
    sub_category_option: [],
    title: '',
    reason: '',
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
    SET_CURRENT_FORM_STEP(state, payload) {
      state.currentFormStep = payload
    },
    SET_DATA_WARGI_NIK(state, payload) {
      state.data_wargi.nik = payload
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
    SET_INFORMASI_ADUAN_SUB_CATEGORY_OTHER(state, payload) {
      state.informasi_aduan.sub_category_other = payload
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
        file_name: '',
        file_download_uri: '',
        size: 0,
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
    generateFormData({ state }, status) {
      const { is_email_valid, ...restStateDataWargi } = state.data_wargi
      const {
        category_option,
        sub_category_option,
        category,
        sub_category,
        sub_category_other,
        ...restStateInformasiAduan
      } = state.informasi_aduan
      const subCategory = category.includes('lainnya')
        ? sub_category_other
        : sub_category
      const {
        place: { name, address },
        location: { lat: latitude, lng: longitude },
        ...restStateLokasiAduan
      } = state.lokasi_aduan

      const citizenComplaint = {
        data_wargi: {
          ...restStateDataWargi,
        },
        informasi_aduan: {
          category,
          sub_category: subCategory,
          ...restStateInformasiAduan,
        },
        foto_aduan: {
          images: [...state.foto_aduan.images],
        },
        lokasi_aduan: {
          address,
          location: {
            latitude,
            longitude,
          },
          ...restStateLokasiAduan,
        },
      }

      return citizenComplaint
    },
    async fetchCategories({ commit }, localStorageKey) {
      try {
        const xApiKey = this.$config.imageUploadApi

        const response = await this.$axios.$get(
          '/v1/public/complaints/categories',
          {
            headers: {
              'x-api-key': xApiKey,
            },
          }
        )

        commit('SET_INFORMASI_ADUAN_CATEGORY_OPTION', response.data)

        if (localStorageKey) {
          localStorage.setItem(`${localStorageKey}Date`, new Date())
          localStorage.setItem(
            `${localStorageKey}Data`,
            JSON.stringify(response.data)
          )
        }
      } catch (error) {
        console.error(error)
      }
    },
    async fetchSubCategories({ commit }, params) {
      try {
        const xApiKey = this.$config.imageUploadApi
        const response = await this.$axios.$get(
          '/v1/public/complaints/subcategories',
          {
            headers: {
              'x-api-key': xApiKey,
            },
            params: {
              ...params,
            },
          }
        )

        commit('SET_INFORMASI_ADUAN_SUB_CATEGORY_OPTION', response.data)
      } catch (error) {
        console.error(error)
      }
    },
    /**
     * @function: To set categories option
     */
    setCategoriesOption({ state, dispatch }, localStorageKey = null) {
      const timeStamp = localStorage.getItem(`${localStorageKey}Date`)
        ? formatDate(
            localStorage.getItem(`${localStorageKey}Date`),
            'dd/MM/yyyy',
            { locale: 'id' }
          )
        : ''
      const categories = localStorage.getItem(`${localStorageKey}Data`) ?? []
      const nowDate = formatDate(new Date(), 'dd/MM/yyyy', {
        locale: 'id',
      })

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
          category_id: filteredCategory[0].id,
        }

        dispatch('fetchSubCategories', params)
      }

      if (state.informasi_aduan.category === undefined) {
        commit('SET_INFORMASI_ADUAN_CATEGORY', '')

        commit('SET_INFORMASI_ADUAN_SUB_CATEGORY', '')
        commit('SET_INFORMASI_ADUAN_SUB_CATEGORY_OTHER', '')
        commit('SET_INFORMASI_ADUAN_SUB_CATEGORY_OPTION', '')
      }
    },
    handleSubCategorySelected({ state, commit }) {
      if (state.lokasi_aduan.sub_category === undefined) {
        commit('SET_INFORMASI_ADUAN_SUB_CATEGORY', '')
      }
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
          parent_code_kemendagri: filteredCity[0].code_kemendagri,
          per_page: 30,
        }

        if (filteredCity[0].code_kemendagri !== state.lokasi_aduan.city_id) {
          commit('SET_LOKASI_ADUAN_DISTRICT_NAME', '')
          commit('SET_LOKASI_ADUAN_DISTRICT_ID', null)

          commit('location/SET_VILLAGES', [], { root: true })
          commit('SET_LOKASI_ADUAN_VILLAGE_NAME', '')
          commit('SET_LOKASI_ADUAN_VILLAGE_ID', null)
        }

        commit('SET_LOKASI_ADUAN_CITY_ID', filteredCity[0].code_kemendagri)
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
          parent_code_kemendagri: filteredDistrict[0].code_kemendagri,
          per_page: 30,
        }

        if (
          filteredDistrict[0].code_kemendagri !== state.lokasi_aduan.district_id
        ) {
          commit('SET_LOKASI_ADUAN_VILLAGE_NAME', '')
          commit('SET_LOKASI_ADUAN_VILLAGE_ID', null)
        }

        commit(
          'SET_LOKASI_ADUAN_DISTRICT_ID',
          filteredDistrict[0].code_kemendagri
        )
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

        commit(
          'SET_LOKASI_ADUAN_VILLAGE_ID',
          filteredVillage[0].code_kemendagri
        )
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
    updateSubmitProgress({ state }, { progress, delay }) {
      return new Promise((resolve) => {
        setTimeout(() => {
          state.statusSubmitForm.progress = progress
          resolve()
        }, delay)
      })
    },
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
    async handleImage({ state }, files) {
      const params = {
        domain: 'aduan-warga',
        is_set_alias_url: true,
      }
      const xApiKey = this.$config.imageUploadApi

      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('file', file.image_file)

        const response = await this.$axios.$post(
          '/v1/public/media/upload',
          formData,
          {
            headers: {
              'x-api-key': xApiKey,
            },
          },
          params
        )

        if (response) {
          return {
            file_name: response.file_name,
            file_download_uri: response.file_download_uri,
            size: response.size,
          }
        }
      })

      const results = await Promise.all(uploadPromises)
      state.foto_aduan.images.push(...results)
    },
    async submitForm({ state, dispatch }) {
      try {
        const xApiKey = this.$config.imageUploadApi
        state.statusSubmitForm.status = FORM_SUBMIT_STATUS.LOADING
        await dispatch('updateSubmitProgress', { progress: 25, delay: 200 })
        await dispatch('updateSubmitProgress', { progress: 50, delay: 200 })

        if (state.foto_aduan.images.length === 0) {
          await dispatch('handleImage', state.foto_aduan.raw_image)
        }

        const citizenComplaintForm = await dispatch('generateFormData')
        const response = await this.$axios.$post(
          '/v1/public/complaints',
          citizenComplaintForm,
          {
            headers: {
              'x-api-key': xApiKey,
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
        const xApiKey = this.$config.imageUploadApi

        const response = await this.$axios.$get(
          `/v1/public/complaints/email/${getters.email}`,
          {
            headers: {
              'x-api-key': xApiKey,
            },
          }
        )

        state.data_wargi.is_email_valid = response.data.is_exists
      } catch (error) {
        console.error(error)
      }
    },
  },
}
