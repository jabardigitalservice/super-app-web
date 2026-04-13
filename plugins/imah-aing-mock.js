const MOCK_UPLOAD_PATH = 'mock/imah-aing/document.jpg'

const MOCK_CITIES = [
  { id: '3273', name: 'Kota Bandung' },
  { id: '3204', name: 'Kabupaten Bandung' },
  { id: '3201', name: 'Kabupaten Bogor' },
]

const MOCK_DISTRICTS = [
  { id: '3273010', name: 'Sukasari' },
  { id: '3273020', name: 'Coblong' },
  { id: '3273030', name: 'Cicendo' },
]

const MOCK_VILLAGES = [
  { id: '3273020001', name: 'Cipaganti' },
  { id: '3273020002', name: 'Lebakgede' },
  { id: '3273020003', name: 'Sekeloa' },
]

const wait = (duration = 500) =>
  new Promise((resolve) => {
    setTimeout(resolve, duration)
  })

export default (_context, inject) => {
  const imahAingMock = {
    async uploadDocument() {
      await wait(800)
      return {
        data: {
          path: MOCK_UPLOAD_PATH,
        },
      }
    },
    getAreas({ depth }) {
      if (Number(depth) === 2) return MOCK_CITIES
      if (Number(depth) === 3) return MOCK_DISTRICTS
      if (Number(depth) === 4) return MOCK_VILLAGES
      return []
    },
    async submitForm() {
      await wait(600)
      return {
        data: {
          id: `mock-submission-${Date.now()}`,
        },
      }
    },
  }

  inject('imahAingMock', imahAingMock)
}
