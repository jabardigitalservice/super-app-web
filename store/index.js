import Vue from 'vue'
import Vuex from 'vuex'

// Modules Import


import citizenComplaintForm from './citizen-complaint/citizenComplaintForm'
import aduan from './aduan/storeAduan'

Vue.use(Vuex)

// Define the module
const modules = {
  aduan,
  citizenComplaintForm,
}

export default () =>
  new Vuex.Store({
    modules,
  })
