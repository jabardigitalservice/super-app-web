<template class="h-screen bg-background dark:bg-dark-emphasis-low">
  <div class="bg-white w-full h-screen rounded-lg overflow-y-auto dark:bg-black">
    <div class="p-4">
      <Milestone :data-milestone="dataDummy" @open-dialog="openDialog" />
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
      // dataDummy: [
      //   {
      //     status: 1,
      //     date: 'Senin, 21 Desember 2022',
      //     time: '18:00',
      //     name: 'Admin'
      //   },
      //   {
      //     status: 2,
      //     date: 'Senin, 22 Desember 2022',
      //     time: '18:00',
      //     name: 'Admin'
      //   },
      //   {
      //     status: 3,
      //     date: 'Senin, 23 Desember 2022',
      //     time: '18:00',
      //     name: 'Admin'
      //   },
      //   {
      //     status: 4,
      //     date: 'Senin, 24 Desember 2022',
      //     time: '18:00',
      //     name: 'Admin'
      //   },
      //   {
      //     status: 5,
      //     date: 'Senin, 25 Desember 2022',
      //     time: '18:00',
      //     name: 'Admin'
      //   },
      //   {
      //     status: 6,
      //     date: 'Senin, 26 Desember 2022',
      //     time: '18:00',
      //     name: 'Admin'
      //   },
      //   {
      //     status: 7,
      //     date: 'Senin, 27 Desember 2022',
      //     time: '18:00',
      //     name: 'Admin'
      //   }
      // ].reverse(),
      dataDummy: [{
        id_aduan: '5529201766291333909',
        status_aduan: 'Verifikasi',
        tanggal_aduan: '2023-02-23',
        admin_monitoring_status_aduan: 'Bidang IKP Diskominfo',
        tanggal_deadline: null,
        nama_instansi_penanggung_jawab: 'BADAN PENDAPATAN DAERAH',
        keterangan_status_aduan: '',
        keterangan_tambahan: '',
        tanggal_update: '2023-03-16',
        id_aduan_span_lapor: '',
        nama_kepala_pd: 'Dr. H. Dedi Taufik, M.Si.',
        log_span_lapor: null
      },
      {
        id_aduan: '6340753',
        status_aduan: 'Dikoordinasikan',
        tanggal_aduan: '2023-02-11',
        admin_monitoring_status_aduan: 'Tim Penentu Kewenangan',
        tanggal_deadline: null,
        nama_instansi_penanggung_jawab: 'BADAN KESATUAN BANGSA DAN POLITIK',
        keterangan_status_aduan: '',
        keterangan_tambahan: '',
        tanggal_update: '2023-03-30',
        id_aduan_span_lapor: '',
        nama_kepala_pd: 'kiru',
        log_span_lapor: {
          id: '6340753',
          status: 'Ditutup oleh Sistem',
          date: 'Sabtu, 11 Februari 2023, 01:16',
          log: [
            {
              date: 'Minggu, 12 Februari 2023, 17:09',
              keterangan: 'Laporan dilempar ke Pemerintah Provinsi Jawa Barat oleh Admin Nasional SP4N-LAPOR!'
            },
            {
              date: 'Senin, 13 Februari 2023, 16:02',
              keterangan: 'Laporan didisposisikan ke Dinas Pendidikan, Pemerintah Provinsi Jawa Barat oleh Pemerintah Provinsi Jawa Barat'
            },
            {
              date: 'Selasa, 14 Februari 2023, 08:25',
              keterangan: 'Selamat pagi, Jika memiliki bukti yang cukup, silahkan langsung mengajukan persoalan ini kepada pihak yang berwajib yaitu aparat kepolisian. Apabila benar, masalah ini sudah masuk ke ranah pidana.'
            }
          ]
        }
      },
      {
        id_aduan: '6340754',
        status_aduan: 'Ditolak',
        tanggal_aduan: '2023-02-12',
        admin_monitoring_status_aduan: 'Tim Penentu Kewenangan',
        tanggal_deadline: null,
        nama_instansi_penanggung_jawab: 'BIRO KESEJAHTERAAN RAKYAT SEKRETARIAT DAERAH PROVINSI JAWA BARAT',
        keterangan_status_aduan: 'laporan yang diadukan tidak sesuai substansi',
        keterangan_tambahan: '',
        tanggal_update: '2023-04-10',
        id_aduan_span_lapor: '',
        nama_kepala_pd: '',
        log_span_lapor: null
      }
      ],
      showDialog: false
    }
  },
  methods: {
    openDialog () {
      this.showDialog = true
    }
  }
}
</script>
