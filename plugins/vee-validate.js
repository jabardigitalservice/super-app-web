/* eslint-disable camelcase */
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import {
  email,
  image,
  length,
  max,
  mimes,
  min,
  min_value,
  numeric,
  required,
  size,
} from 'vee-validate/dist/rules'
import Vue from 'vue'

Vue.component('ValidationObserver', ValidationObserver)
Vue.component('ValidationProvider', ValidationProvider)

extend('required', {
  ...required,
  message: (field) => field + ' belum diisi',
})

extend('numeric', {
  ...numeric,
  message: (field) => `${field} hanya menerima karakter angka`,
})

extend('min_value', {
  ...min_value,
  message: 'Nomor urut dimulai dari angka 1',
})

extend('email', {
  ...email,
  message: (field) => `${field} yang anda masukkan salah!`,
})

extend('min', {
  ...min,
  message: (field, values) => `${field} minimal ${values.length} karakter`,
})

extend('length', {
  ...length,
  message: (field) => `${field} harus 16 digit`,
})

extend('max', {
  ...max,
  message: (field, values) => `${field} maksimal ${values.length} karakter`,
})

extend('image', {
  ...image,
  message: 'File yang anda pilih gambar!',
})

extend('size', {
  ...size,
  message: 'File yang anda masukkan melebihi 1 Mb',
})

extend('mimes', {
  ...mimes,
  message: 'File yang anda masukkan harus berformat .jpg atau .png',
})

extend('phoneNumber', {
  validate: (value) => value.startsWith('08'),
  message: (_, values) => `${values._field_} harus dimulai dengan 08`,
})
