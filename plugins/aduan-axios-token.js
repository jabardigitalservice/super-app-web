export default function ({ $axios, $getToken }, inject) {
  const authAxios = $axios.create()

  authAxios.onRequest(async (config) => {
    try {
      const token = await $getToken()
      config.headers.Authorization = `Bearer ${token}`
    } catch (error) {
      console.error('Error setting auth token:', error)
    }
    return config
  })

  inject('authAxiosAduan', authAxios)
}
