import Vue from 'vue'
import Vuex from 'vuex'

// Modules Import

import aduan from './aduan/storeAduan'
import citizenComplaintForm from './citizen-complaint/citizenComplaintForm'
import jalanAing from './jalan-aing'
import location from './location'
import imahAingForm from './imah-aing/imahAingForm'
import imahAingHistory from './imah-aing/imahAingHistory'
import imahAingSanggah from './imah-aing/imahAingSanggah'
import imahAingProgress from './imah-aing/imahAingProgress'
Vue.use(Vuex)

// Define the module
const modules = {
  aduan,
  citizenComplaintForm,
  'jalan-aing': jalanAing,
  location,
  imahAingForm,
  imahAingHistory,
  imahAingSanggah,
  imahAingProgress,
}

export default () =>
  new Vuex.Store({
    modules,
  })
