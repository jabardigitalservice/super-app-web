export default ({ route }) => {
  if (process.client) {
    if (route.query.dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}
