export default ({ route }) => {
  // set theme by default device
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', prefersDark)

  if (process.client) {
    if (route.query.dark === 'true') {
      document.documentElement.classList.add('dark')
    } else if (route.query.dark === 'false') {
      document.documentElement.classList.remove('dark')
    }
  }
}
