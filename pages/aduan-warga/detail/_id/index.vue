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
      label-button-reject="Tidak Membantu"
      information-message="Aduan Anda akan ditutup oleh sistem sesuai dengan batas waktu yang ditentukan oleh SP4N LAPOR."
      @close="showDialog = false"
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
      // data: [],
      data: [
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
          id_aduan: '5576325308507662687',
          status_aduan: 'Terverifikasi',
          tanggal_aduan: '2023-04-18',
          admin_monitoring_status_aduan: '',
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
          keterangan_tambahan: 'segera dikerjakan sampai batas waktu pengerjaan',
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
          keterangan_tambahan: 'segera dikerjakan sampai batas waktu pengerjaan',
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
          log_span_lapor: {
            id: '6340753',
            status: 'Ditutup oleh Sistem',
            date: 'Sabtu, 11 Februari 2023, 01:16',
            log: [
              {
                date: 'Minggu, 12 Februari 2023, 17:09',
                keterangan:
                  'Laporan dilempar ke Pemerintah Provinsi Jawa Barat oleh Admin Nasional SP4N-LAPOR!'
              },
              {
                date: 'Senin, 13 Februari 2023, 16:02',
                keterangan:
                  'Laporan didisposisikan ke Dinas Pendidikan, Pemerintah Provinsi Jawa Barat oleh Pemerintah Provinsi Jawa Barat'
              },
              {
                date: 'Selasa, 14 Februari 2023, 08:25',
                keterangan:
                  'Selamat pagi, Jika memiliki bukti yang cukup, silahkan langsung mengajukan persoalan ini kepada pihak yang berwajib yaitu aparat kepolisian. Apabila benar, masalah ini sudah masuk ke ranah pidana.'
              }
            ]
          }
        }
      ],
      showDialog: false
    }
  },
  // async fetch () {
  //   try {
  //     const token =
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoianNhX2FkdWFuX2FwaSIsImV4cGlyZXMiOjE2ODI4NjcwODMuMTQ3OTU4fQ.Pc_DMIOWahzcTyRNcYBvXjRKUd99EfIoWN51NpRjzik'
  //     const options = {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       },
  //       data: {
  //         id_aduan: '5572530782204661889'
  //       }
  //     }
  //     const response = await this.$axios.post(
  //       'https://api.coredatajds.id/api-aduanjsa-tracking/aduan/id_aduan',
  //       options
  //     )
  //     const { data } = response.data
  //     console.log(data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // },
  methods: {
    openDialog () {
      this.showDialog = true
    }
  }
}
</script>
