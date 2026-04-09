import Vue from 'vue'
import Vuex from 'vuex'

// Modules Import

import aduan from './aduan/storeAduan'
import citizenComplaintForm from './citizen-complaint/citizenComplaintForm'
import location from './location'
import imahAingForm from './imah-aing/imahAingForm'
Vue.use(Vuex)

// Define the module
const modules = {
  aduan,
  citizenComplaintForm,
  location,
  imahAingForm,
}

export default () =>
  new Vuex.Store({
    modules,
  })
