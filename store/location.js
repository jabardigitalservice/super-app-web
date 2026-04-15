import { isEqual } from 'lodash'
import { convertToLocaleDate } from '~/utils'

const state = () => ({
  params: {
    depth: 2,
    provinceId: 32,
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
      const endpoints = {
        2: { url: '/area/city', mutation: 'SET_CITIES' },
        3: { url: '/area/district', mutation: 'SET_SUB_DISTRICT' },
        4: { url: '/area/village', mutation: 'SET_VILLAGES' },
      }

      if (endpoints[params.depth]) {
        const { url, mutation } = endpoints[params.depth]
        const response = await this.$axios.get(url, { params })

        commit(mutation, response.data.data)

        if (params.depth === 2 && localStorageKey) {
          localStorage.setItem(`${localStorageKey}Date`, new Date())
          localStorage.setItem(
            `${localStorageKey}Data`,
            JSON.stringify(response.data.data)
          )
        }
      }
    } catch (error) {
      console.error('Error fetching areas:', error)
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
