import newrelic from 'newrelic'

export default ({ app, route }, inject) => {
  newrelic.setTransactionName(route.path)
  inject('newrelicSetup', newrelic)
}
