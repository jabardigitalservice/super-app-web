import Vue from 'vue'
import Vuex from 'vuex'

// Modules Import

import aduan from './aduan/storeAduan'
import citizenComplaintForm from './citizen-complaint/citizenComplaintForm'
import jalanAing from './jalan-aing'
import location from './location'
Vue.use(Vuex)

// Define the module
const modules = {
  aduan,
  citizenComplaintForm,
  'jalan-aing': jalanAing,
  location,
}

export default () =>
  new Vuex.Store({
    modules,
  })
