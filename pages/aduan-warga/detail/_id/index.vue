<template class="h-screen bg-background dark:bg-dark-emphasis-low">
  <div
    class="bg-white w-full h-screen rounded-lg overflow-y-auto dark:bg-black"
  >
    <div class="p-4">
      <Milestone :data-milestone="data" @open-dialog="openDialog" />
    </div>

    <BaseBlurPopup :show-popup="showDialog" />

    <BaseDialog
      :show-popup="showDialog"
      title="Konfirmasi Penyelesaian"
      label-button-approve="Ya, Sangat Membantu"
      label-button-reject="Tidak, Buat Aduan Baru"
      :information-message="
        idSpanLaporIsExists
          ? `Aduan Anda akan ditutup oleh sistem sesuai dengan batas waktu yang ditentukan oleh SP4N LAPOR.`
          : ''
      "
      @close="showDialog = false"
      @submit="backToSearchAduan"
      @reject="goToCreateAduan"
    >
      Apakah penyelesaian dari instansi ini membantu?
    </BaseDialog>
  </div>
</template>

<script>
import Milestone from '~/components/Aduan/Milestone.vue'
export default {
  name: 'DetailAduanWarga',
  components: { Milestone },
  data () {
    return {
      data: [],
      token: '',
      idSpanLaporIsExists: false,
      dataDummy: [
        {
          id_aduan: '5571685772206594124',
          status_aduan: 'Menunggu Verifikasi',
          tanggal_aduan: '2023-04-13',
          admin_monitoring_status_aduan: 'Sistem',
          tanggal_instruksi: null,
          tanggal_deadline: null,
          nama_instansi_penanggung_jawab: '',
          keterangan_status_aduan: '',
          keterangan_tambahan: '',
          tanggal_update: '2023-04-13T11:16:17',
          id_aduan_span_lapor: '',
          nama_kepala_pd: '',
          log_span_lapor: null
        },

        {
          id_aduan: '5576325308507662687',
          status_aduan: 'Terverifikasi',
          tanggal_aduan: '2023-04-18',
          admin_monitoring_status_aduan: 'Asdfff',
          tanggal_instruksi: null,
          tanggal_deadline: null,
          nama_instansi_penanggung_jawab: '',
          keterangan_status_aduan: '',
          keterangan_tambahan: '',
          tanggal_update: '2023-04-28T16:07:14.690453',
          id_aduan_span_lapor: '',
          nama_kepala_pd: '',
          log_span_lapor: null
        },
        {
          id_aduan: '5572548852203776536',
          status_aduan: 'Ditolak',
          tanggal_aduan: '2023-04-14',
          admin_monitoring_status_aduan: 'Tim Penentu Kewenangan',
          tanggal_instruksi: null,
          tanggal_deadline: null,
          nama_instansi_penanggung_jawab: '',
          keterangan_status_aduan:
            'sertakan RT RW lokasi anda tinggal agar aduan dapat dianalisis',
          keterangan_tambahan: '',
          tanggal_update: '2023-04-28T23:07:14.706024',
          id_aduan_span_lapor: '',
          nama_kepala_pd: '',
          log_span_lapor: null
        },
        {
          id_aduan: '5582958518503204896',
          status_aduan: 'Dikoordinasikan',
          tanggal_aduan: '2023-04-26',
          admin_monitoring_status_aduan: 'Tim Penentu Kewenangan',
          tanggal_instruksi: null,
          tanggal_deadline: '2023-04-27',
          nama_instansi_penanggung_jawab: 'BADAN PENDAPATAN DAERAH',
          keterangan_status_aduan: '',
          keterangan_tambahan: '',
          tanggal_update: '2023-04-28T16:07:14.690453',
          id_aduan_span_lapor: '',
          nama_kepala_pd: 'Dr. H. Dedi Taufik, M.Si',
          log_span_lapor: null
        },
        {
          id_aduan: '5571685772206594124',
          status_aduan: 'Ditindaklanjuti',
          tanggal_aduan: null,
          admin_monitoring_status_aduan: '',
          tanggal_instruksi: '2023-04-28',
          tanggal_deadline: '2023-05-31',
          nama_instansi_penanggung_jawab: 'DINAS BINA MARGA DAN PENATAAN RUANG',
          keterangan_status_aduan: '',
          keterangan_tambahan:
            'segera dikerjakan sampai batas waktu pengerjaan',
          tanggal_update: '2023-04-28T16:07:36.931704',
          id_aduan_span_lapor: '',
          nama_kepala_pd: 'Bambang Tirtoyuliono',
          log_span_lapor: null
        },
        {
          id_aduan: '5571685772206594124',
          status_aduan: 'Selesai',
          tanggal_aduan: null,
          admin_monitoring_status_aduan: '',
          tanggal_instruksi: '2023-04-28',
          tanggal_deadline: '2023-05-31',
          nama_instansi_penanggung_jawab: 'DINAS BINA MARGA DAN PENATAAN RUANG',
          keterangan_status_aduan: '',
          keterangan_tambahan:
            'segera dikerjakan sampai batas waktu pengerjaan',
          tanggal_update: '2023-04-28T17:07:53.726822',
          id_aduan_span_lapor: '',
          nama_kepala_pd: 'Bambang Tirtoyuliono',
          log_span_lapor: null
        },
        {
          id_aduan: '5572530782204661889',
          status_aduan: 'Dialihkan ke SP4N Lapor',
          tanggal_aduan: '2023-04-14',
          admin_monitoring_status_aduan: 'Tim Penentu Kewenangan',
          tanggal_instruksi: null,
          tanggal_deadline: null,
          nama_instansi_penanggung_jawab: 'KOTA BANDUNG',
          keterangan_status_aduan: 'kewenangan dishub kota bandung',
          keterangan_tambahan: '',
          tanggal_update: '2023-04-29T18:07:49.982573',
          id_aduan_span_lapor: '',
          nama_kepala_pd: '',
          log_span_lapor: null
        },
        {
          id_aduan: '5572530782204661889',
          status_aduan: 'Dialihkan ke SP4N Lapor',
          tanggal_aduan: '2023-04-14',
          admin_monitoring_status_aduan: 'Tim Penentu Kewenangan',
          tanggal_instruksi: null,
          tanggal_deadline: null,
          nama_instansi_penanggung_jawab: 'KOTA BANDUNG',
          keterangan_status_aduan: 'kewenangan dishub kota bandung',
          keterangan_tambahan: '',
          tanggal_update: '2023-04-29T18:07:49.982573',
          id_aduan_span_lapor: '6340753',
          nama_kepala_pd: '',
          log_span_lapor: {
            id: '6340753',
            status: 'Ditutup oleh Sistem',
            date: 'Sabtu, 11 Februari 2023, 01:16',
            log: [
              {
                date: 'Rabu, 22 Februari 2023, 11:13',
                keterangan:
                  'Laporan didisposisikan ke Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Kabupaten Bekasi oleh Pemerintah Kabupaten Bekasi'
              },
              {
                date: 'Kamis, 23 Februari 2023, 10:44',
                keterangan:
                  'Yth. Pelapor, \n\nTerima kasih atas laporan Anda. Terkait hal tersebut akan kami sampaikan ke unit yang bersangkutan dan akan segera kami tindaklanjuti sesuai batas waktu tindaklanjut di SP4N LAPOR!'
              },
              {
                date: 'Kamis, 23 Februari 2023, 11:11',
                keterangan:
                  'Terima Kasih atas laporan Pengaduannya. Terkait Dugaan galian C Ilegal diarea Cikarang Selatan dapat kami sampaikan sebagai berikut :\n1. Bahwa Perizinan Galian C bukan  penguasaan/Wewenang  Dinas Penanaman Modal dan Pelayanan Perizinan Terpadu Satu Pintu Kabupaten Bekasi. (merupakan kewenangan Pemerintah Pusat yaitu Kementerian Energi dan \n    Sumber Daya Mineral)\n2. Kerusakan Infrastruktur jalan didalam kawasan Lippo Cikarang bukan penguasaan/Wewenang  Dinas Penanaman Modal dan Pelayanan Perizinan Terpadu Satu Pintu Kabupaten Bekasi.\n3. Parkiran liar truk - truk tanah tersebut mengganggu lalu lalang kendaraan logistik ke kawasan industri. Bukan penguasaan/Wewenang  Dinas Penanaman Modal dan Pelayanan Perizinan Terpadu Satu Pintu Kabupaten Bekasi.'
              },
              {
                date: 'Kamis, 23 Februari 2023, 16:41',
                keterangan:
                  'Yang kami sampaikan adalah, meskipun Pemkab tidak berwenang untuk mengeluarkan ijin untuk galian C, namun Pemkab berwenang untuk melakukan pengawasan maupun pengecekkan bahwa suatu galian memiliki ijin atau tidak.\n\nPerpres No. 55 tahun 2022 tentang Pendelegasian Pemberian Perizinan Berusaha di Bidang Pertambangan Mineral dan Batubara\n\nProses perizinan galian C dan tambang rakyat harus mendapatkan rekomendasi dari pemkab atau pemkot setempat sebelum izin dikeluarkan oleh pihak pemprov. Sedangkan pengawasannya dapat dilakukan oleh pemkab atau pemkot langsung.'
              },
              {
                date: 'Senin, 27 Februari 2023, 19:20',
                keterangan:
                  'Terima kasih atas tanggapannya. \n\nTanggapan kami (sebagaimana telah kami konsultasikan dengan APKASI, sebagai salah satu organ pendorong revisi pendelegasian wewenang pertambangan): meskipun Pemkab tidak berwenang untuk mengeluarkan ijin untuk galian C, namun Pemkab berwenang untuk melakukan pengawasan maupun pengecekkan bahwa suatu galian memiliki ijin atau tidak.\n\nPerpres No. 55 tahun 2022 tentang Pendelegasian Pemberian Perizinan Berusaha di Bidang Pertambangan Mineral dan Batubara\n\nProses perizinan galian C dan tambang rakyat harus mendapatkan rekomendasi dari pemkab atau pemkot setempat sebelum izin dikeluarkan oleh pihak pemprov. Sedangkan pengawasannya dapat dilakukan oleh pemkab atau pemkot langsung.'
              }
            ]
          }
        }
      ].reverse(),
      showDialog: false
    }
  },
  async fetch () {
    try {
      const response = await this.$axios.post(
        'https://api.coredatajds.id/api-aduanjsa-tracking/aduan/login',
        {
          username: 'jsa_aduan_api',
          password: 'fde92ef9514076'
        }
      )

      this.token = response.data.access_token
      if (this.token) {
        this.getDataAduanById()
      }
    } catch (error) {
      this.data = this.dataDummy
    }
  },
  methods: {
    openDialog (idSpanLapor) {
      this.showDialog = true
      this.idSpanLaporIsExists = !!idSpanLapor
    },
    backToSearchAduan () {
      this.$router.push('/aduan-warga')
    },
    goToCreateAduan () {
      this.$router.push('/aduan-warga/redirect-aduan')
    },
    async getDataAduanById () {
      if (this.token) {
        try {
          const response = await this.$axios.post(
            'https://api.coredatajds.id/api-aduanjsa-tracking/aduan/id_aduan',
            {
              id_aduan: this.$route.params.id
            },
            {
              headers: {
                Authorization: `Bearer ${this.token}`
              }
            }
          )
          this.data = response.data
        } catch (error) {
          // console.log(error)
        }
      }
    }
  }
}
</script>
