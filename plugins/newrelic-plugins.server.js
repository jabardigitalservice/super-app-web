import newrelic from 'newrelic'
import { generateBrowserScript } from '~/static/newrelic-browser'

export default ({ $config, app }, inject) => {
  const script = generateBrowserScript($config.newrelicData)
  app.head.script.push({
    hid: 'newrelic',
    innerHTML: script
  })
  inject('newrelicSetup', newrelic)
}
