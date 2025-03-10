export default async function ({ $unleash, route, error }) {
  const featureFlag = route.meta[0]?.featureFlag

  if (!featureFlag) {
    return
  }

  const featureEnabled = await $unleash.isEnabled(featureFlag)

  if (!featureEnabled) {
    return error({ statusCode: 404 })
  }
}
