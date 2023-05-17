export default ({ route }) => {
  if (process.client) {
    const darkModeQuery = route.query.mode === 'dark'
    if (darkModeQuery) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}
