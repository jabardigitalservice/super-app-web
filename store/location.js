import { isEqual } from 'lodash'
import { convertToLocaleDate } from '~/utils'

const state = () => ({
  params: {
    provinceId: 32,
  },
  cities: [],
  subDistricts: [],
  villages: [],
})

const getters = {
  /** ***********  ✨ Codeium Command ⭐  *************/
  /**
   * Get an array of cities as options for a JdsSelect component
   *
   * @param {Object} state - Vuex state
   * @returns {Array} - an array of options for JdsSelect
   */
  /** ****  34c00a31-2441-4cb5-bf40-6878c4cb6f0b  *******/
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
      if (params.provinceId === 32) {
        const responseKotKab = await this.$axios.get('/area/city', { params })
        commit('SET_CITIES', responseKotKab.data.data)
        if (localStorageKey) {
          localStorage.setItem(`${localStorageKey}Date`, new Date())
          localStorage.setItem(
            `${localStorageKey}Data`,
            JSON.stringify(responseKotKab.data)
          )
        }
      }
      if (params.depth === 3) {
        const responseSubDistrict = await this.$axios.get('/area/district', {
          params,
        })

        commit('SET_SUB_DISTRICT', responseSubDistrict.data.data)
      }
      if (params.depth === 4) {
        const respnsoeVilages = await this.$axios.get('/area/village', {
          params,
        })

        commit('SET_VILLAGES', respnsoeVilages.data.data)
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
