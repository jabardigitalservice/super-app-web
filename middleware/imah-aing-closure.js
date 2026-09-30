import {
  IMAH_AING_CLOSED_PATH,
  isImahAingFormOpen,
} from '~/constant/imah-aing-closure'

// Gate pembuatan usulan baru Imah Aing. Dipasang di route form yang juga dipakai
// mode edit, jadi `?edit=` dilewatkan tanpa menunggu Unleash — edit sanggah tidak
// boleh bergantung ke feature flag. Fail-closed: lihat `isImahAingFormOpen`.
export default async function ({ $unleash, route, redirect }) {
  if (route.query.edit) return

  if (!(await isImahAingFormOpen($unleash))) {
    redirect({ path: IMAH_AING_CLOSED_PATH, query: route.query })
  }
}
