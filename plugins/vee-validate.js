/* eslint-disable camelcase */
import Vue from 'vue'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import {
  required,
  min_value,
  numeric,
  email,
  min,
  max,
  length,
  image,
  size,
  mimes
} from 'vee-validate/dist/rules'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

extend('required', {
  ...required,
  message: field => field + ' belum diisi'
})

extend('numeric', {
  ...numeric,
  message: field => `${field} hanya menerima karakter angka`
})

extend('min_value', {
  ...min_value,
  message: 'Nomor urut dimulai dari angka 1'
})

extend('email', {
  ...email,
  message: field => `${field} yang anda masukkan salah!`
})

extend('min', {
  ...min,
  message: (field, values) => `${field} minimal ${values.length} karakter`
})

extend('length', {
  ...length,
  message: field => `${field} harus 16 digit`
})

extend('max', {
  ...max,
  message: (field, values) => `${field} maksimal ${values.length} karakter`
})

extend('image', {
  ...image,
  message: 'File yang anda pilih gambar!'
})

extend('size', {
  ...size,
  message: 'File yang anda masukkan melebihi 1 Mb'
})

extend('mimes', {
  ...mimes,
  message: 'File yang anda masukkan harus berformat .jpg atau .png'
})
