export const dataStatusMilestone = Object.freeze({
  waiting: {
    status: 1,
    textStatus: 'Menunggu Verifikasi',
    icon: 'waiting.svg',
    fillColor: '#FF7500'
  },
  rejected: {
    status: 2,
    textStatus: 'Ditolak',
    icon: 'rejected.svg',
    fillColor: '#F44336'
  },
  verification: {
    status: 3,
    textStatus: 'Terverifikasi',
    icon: 'verfication.svg',
    fillColor: '#FF7500'
  },
  cordination: {
    status: 4,
    textStatus: 'Dikoordinasikan',
    icon: 'cordination.svg',
    fillColor: '#1E88E5'
  },
  followUp: {
    status: 5,
    textStatus: 'Ditindaklanjuti',
    icon: 'follow-up.svg',
    fillColor: '#FF7500'
  },
  done: {
    status: 6,
    textStatus: 'Selesai Dikerjakan',
    icon: 'done.svg',
    fillColor: '#1E88E5'
  },
  closed: {
    status: 7,
    textStatus: 'Ditutup',
    icon: 'closed.svg',
    fillColor: '#16A75C'
  }
}
)
