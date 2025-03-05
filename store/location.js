import { isEqual } from 'lodash'
import { convertToLocaleDate } from '~/utils'

const state = () => ({
  params: {
    depth: 2,
    parent_code_kemendagri: 32,
    per_page: 30,
  },
  cities: [],
  subDistricts: [],
  villages: [],
})

const getters = {
  citiesOption(state) {
    return state.cities.length
      ? state.cities.map((area) => ({ label: area.name, value: area.name }))
      : []
  },
  subDitrictsOption(state) {
    return state.subDistricts.length
      ? state.subDistricts.map((area) => ({
          label: area.name,
          value: area.name,
        }))
      : []
  },
  villagesOption(state) {
    return state.villages.length
      ? state.villages.map((area) => ({ label: area.name, value: area.name }))
      : []
  },
}

const mutations = {
  SET_PARAMS(state, payload) {
    state.params = payload
  },
  SET_CITIES(state, payload) {
    state.cities = payload
  },
  SET_SUB_DISTRICT(state, payload) {
    state.subDistricts = payload
  },
  SET_VILLAGES(state, payload) {
    state.villages = payload
  },
}

const actions = {
  async fetchAreas({ commit }, { params, localStorageKey }) {
    try {
      const response = await this.$axios.$get('/areas', { params })

      if (params.depth === 2) {
        commit('SET_CITIES', response.data)
      }
      if (params.depth === 3) {
        commit('SET_SUB_DISTRICT', response.data)
      }
      if (params.depth === 4) {
        commit('SET_VILLAGES', response.data)
      }

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
  /**
   * @function: To get Kota/Kabupaten data
   */
  async getCities({ dispatch }, { params, localStorageKey }) {
    await dispatch('fetchAreas', { params, localStorageKey })
  },
  /**
   * @function: To set cities option
   */
  setCitiesOption({ state, commit, dispatch }, localStorageKey = null) {
    const timeStamp = localStorage.getItem(`${localStorageKey}Date`)
      ? convertToLocaleDate(
          localStorage.getItem(`${localStorageKey}Date`),
          'dd/MM/yyyy'
        )
      : ''
    const cities = localStorage.getItem(`${localStorageKey}Data`) ?? []
    const nowDate = convertToLocaleDate(new Date(), 'dd/MM/yyyy')

    if (isEqual(timeStamp, nowDate)) {
      commit('SET_CITIES', JSON.parse(cities))
    } else {
      dispatch('getCities', { params: state.params, localStorageKey })
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
