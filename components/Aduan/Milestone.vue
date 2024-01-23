<template>
  <div class="w-full">
    <span
      class="font-bold text-[16px] text-gray-900 dark:text-dark-text-high leading-5 font-roboto mb-4"
    >Riwayat Aduan</span>

    <div v-for="(milestone, index) in dataMilestone" :key="index">
      <div v-if="milestone?.status_aduan !== 'Banding'">
        <!-- Card ada id span lapor -->
        <div v-if="isSpanLapor(milestone)" class="flex mt-3">
          <IconAndLine
            :icon="`/icon/${dataStatusMilestone.dialihkan.icon}`"
            :fill-color="
              index > 0
                ? '#868C89'
                : `${dataStatusMilestone.dialihkan.fillColor}`
            "
            :line-milestone="index !== dataMilestone.length - 1"
          />
          <div class="w-full">
            <CardMilestone>
              <TextMilestone>
                <span
                  class="text-gray-500 mb-1 text-[11px]"
                  :class="
                    index > 0
                      ? ' dark:text-dark-text-low dark:text-opacity-60'
                      : ' dark:text-dark-text-low'
                  "
                >{{
                  formatDate(
                    milestone.tanggal_update,
                    "EEEE, dd MMMM yyyy - HH:mm"
                  )
                }}</span>

                <LabelText
                  text="Status"
                  :condition-text="index > 0"
                />

                <div>
                  <StatusText
                    :condition-text="index > 0"
                    :text="
                      getStatusTextAndIcon(milestone.status_aduan).textStatus
                    "
                  />

                  <HelperText
                    :text="getHelperTextStatusAduan(milestone.status_aduan)"
                    :condition-text="index > 0"
                  />

                  <StatusText
                    :condition-text="index > 0"
                    :text="
                      changeNameStatusByUser(
                        milestone[
                          getStatusTextAndIcon(milestone.status_aduan)
                            .getNameStatus
                        ]
                      )
                    "
                  />
                </div>
              </TextMilestone>
            </CardMilestone>

            <!-- memunculkan card ketika status dialihkan, ditolak dan dikordinasikan dan terdapat keterangan status dari api -->
            <CardMilestone
              v-if="
                showCatatanOrKeterangan(milestone.status_aduan) &&
                  milestone.keterangan_status_aduan
              "
              class="mt-2"
            >
              <!-- menampilan keterangan ketika status dialihkan ke sp4n lapor -->
              <TextMilestone
                v-if="
                  showKeteranganStatusAduan(
                    milestone.status_aduan,
                    milestone.keterangan_status_aduan
                  )
                "
              >
                <LabelText
                  text="Keterangan"
                  :condition-text="index > 0"
                />

                <span
                  :class="
                    index > 0
                      ? 'text-gray-500 dark:text-dark-text-low'
                      : 'font-medium  text-gray-900 dark:text-dark-text-high'
                  "
                >{{ milestone.keterangan_status_aduan }}</span>
              </TextMilestone>
            </CardMilestone>

            <div v-if="isLogSpanLaporExist(milestone)" class="mt-3">
              <div class="w-full">
                <CardMilestone>
                  <TextMilestone>
                    <LabelText
                      text="ID Tracking SP4N LAPOR"
                      :condition-text="index > 0"
                    />

                    <div class="mb-1">
                      <StatusText
                        :condition-text="index > 0"
                        :text="milestone.id_aduan_span_lapor"
                      />
                    </div>

                    <LabelText text="Status" :condition-text="index > 0" />
                    <div>
                      <StatusText
                        :condition-text="index > 0"
                        :text="milestone?.log_span_lapor?.status"
                      />
                    </div>
                  </TextMilestone>
                </CardMilestone>

                <!-- card milestone for log span lapor -->
                <div v-if="showLogSpanLapor(milestone)">
                  <div
                    v-for="(logSpan, indexLog) in getLogSpanLaporLogs(milestone)"
                    :key="indexLog"
                  >
                    <CardMilestone v-if="indexLog < 2" class="mt-2">
                      <TextMilestone>
                        <LabelText
                          class="!mb-1 !text-[11px]"
                          :text="logSpan.date"
                          :condition-text="indexLog > 0"
                        />

                        <span
                          class="mb-2 text-[11px]"
                          :class="
                            indexLog > 0
                              ? 'text-gray-500 dark:text-dark-text-low'
                              : 'text-gray-700 dark:text-dark-text-low'
                          "
                        >{{ logSpan.responder }}</span>

                        <div>
                          <span
                            class="log-span"
                            :class="
                              indexLog > 0
                                ? 'text-gray-600 dark:text-dark-text-low'
                                : 'font-medium text-gray-900 dark:text-dark-text-high'
                            "
                          >{{ logSpan.keterangan }}</span>
                        </div>
                      </TextMilestone>
                    </CardMilestone>
                  </div>

                  <div
                    v-if="milestone?.log_span_lapor?.log?.length > 2"
                    class="w-full"
                  >
                    <BaseButton
                      class="text-[12px] font-lato text-green-600 bg-[#F4F4F4] w-full !px-3 !py-2 mt-2 dark:border-0 dark:bg-dark-emphasis-medium"
                      @click="
                        setLogSpanLapor(
                          milestone?.log_span_lapor?.log,
                          milestone.id_aduan_span_lapor
                        )
                      "
                    >
                      Lihat Semua Status
                    </BaseButton>
                  </div>
                </div>

                <BaseButton
                  v-if="
                    isDitutupOlehSpanOrSelesai(
                      milestone.status_aduan,
                      milestone?.log_span_lapor?.status,
                      index
                    )
                  "
                  class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2 dark:border-0"
                  @click="openDialogRateAduan(milestone.id_aduan_span_lapor)"
                >
                  Apakah penyelesaian ini membantu ?
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- is not span lapor -->
        <div v-else class="flex mt-3">
          <IconAndLine
            :icon="`/icon/${
              getStatusTextAndIcon(
                milestone.status_aduan,
                milestone?.log_span_lapor?.status
              ).icon
            }`"
            :fill-color="
              index > 0
                ? '#868C89'
                : `${
                  getStatusTextAndIcon(
                    milestone.status_aduan,
                    milestone?.log_span_lapor?.status
                  ).fillColor
                }`
            "
            :line-milestone="index !== dataMilestone.length - 1"
          />
          <div class="w-full">
            <CardMilestone>
              <!-- text for status aduan -->
              <TextMilestone>
                <span
                  class="text-gray-500 mb-1 text-[11px]"
                  :class="
                    index > 0
                      ? ' dark:text-dark-text-low dark:text-opacity-60'
                      : ' dark:text-dark-text-low'
                  "
                >{{
                  formatDate(
                    milestone.tanggal_update,
                    "EEEE, dd MMMM yyyy - HH:mm"
                  )
                }}</span>

                <LabelText text="Status" :condition-text="index > 0" />

                <div>
                  <StatusText
                    :condition-text="index > 0"
                    :text="
                      getStatusTextAndIcon(milestone.status_aduan).textStatus
                    "
                  />

                  <HelperText
                    :text="getHelperTextStatusAduan(milestone.status_aduan)"
                    :condition-text="index > 0"
                  />

                  <StatusText
                    :condition-text="index > 0"
                    :text="
                      changeNameStatusByUser(
                        milestone[
                          getStatusTextAndIcon(milestone.status_aduan)
                            .getNameStatus
                        ]
                      )
                    "
                  />
                </div>
              </TextMilestone>

              <!-- memunculkan keterangan penanggung jawab dan estimasi pengerjaan pada status ditindak lanjut, selesai, pengerjaan ditunda, dan pengerjaan ditinjau ulang -->
              <template
                v-if="
                  showEstimasiPengerjaanAndPenanggungJawab(
                    milestone.status_aduan
                  )
                "
              >
                <TextMilestone>
                  <LabelText
                    text="Penanggung Jawab"
                    :condition-text="index > 0"
                  />

                  <TextDitindakLanjuti
                    :text="milestone.nama_kepala_pd"
                    :condition-text="index > 0"
                  />
                </TextMilestone>

                <TextMilestone>
                  <LabelText
                    text="Estimasi Pengerjaan"
                    :condition-text="index > 0"
                  />

                  <div>
                    <TextDitindakLanjuti
                      :text="
                        formatDate(milestone.tanggal_instruksi, `dd MMMM yyyy`)
                      "
                      :condition-text="index > 0"
                    />

                    <HelperText text="sampai" :condition-text="index > 0" />

                    <TextDitindakLanjuti
                      :text="
                        formatDate(milestone.tanggal_deadline, `dd MMMM yyyy`)
                      "
                      :condition-text="index > 0"
                    />
                  </div>
                </TextMilestone>
              </template>
            </CardMilestone>

            <!-- card if catatan and tanggap is exist -->
            <CardMilestone
              v-if="
                showCatatanOrKeterangan(milestone.status_aduan) &&
                  (milestone.keterangan_status_aduan ||
                    milestone.keterangan_tambahan)
              "
              class="mt-2"
            >
              <TextMilestone
                v-if="
                  showCatatanDitolak(
                    milestone.status_aduan,
                    milestone.keterangan_status_aduan
                  )
                "
              >
                <LabelText text="Catatan" :condition-text="index > 0" />

                <span
                  :class="
                    index > 0
                      ? 'text-gray-500 dark:text-dark-text-low'
                      : 'font-medium text-gray-900 dark:text-dark-text-high'
                  "
                >{{ milestone.keterangan_status_aduan }}</span>
              </TextMilestone>

              <TextMilestone
                v-if="
                  showKeteranganStatusAduan(
                    milestone.status_aduan,
                    milestone.keterangan_status_aduan
                  )
                "
              >
                <LabelText text="Keterangan" :condition-text="index > 0" />

                <span
                  :class="
                    index > 0
                      ? 'text-gray-500 dark:text-dark-text-low'
                      : 'font-medium  text-gray-900 dark:text-dark-text-high'
                  "
                >{{ milestone.keterangan_status_aduan }}</span>
              </TextMilestone>

              <!-- ditinjau ulang dan ditunda -->
              <TextMilestone
                v-if="
                  showKeteranganTambahan(
                    milestone.status_aduan,
                    milestone.keterangan_tambahan
                  )
                "
              >
                <LabelText text="Keterangan" :condition-text="index > 0" />

                <span
                  :class="
                    index > 0
                      ? 'text-gray-500 dark:text-dark-text-low'
                      : 'font-medium  text-gray-900 dark:text-dark-text-high'
                  "
                >{{ milestone.keterangan_tambahan }}</span>
              </TextMilestone>
            </CardMilestone>

            <CardMilestone
              v-if="showKeteranganDefault(milestone.status_aduan)"
              class="mt-2"
            >
              <!-- keterangan default/hardcode -->
              <TextMilestone>
                <LabelText text="Keterangan" :condition-text="index > 0" />

                <span
                  :class="
                    index > 0
                      ? 'text-gray-500 dark:text-dark-text-low'
                      : 'font-medium  text-gray-900 dark:text-dark-text-high'
                  "
                >{{ generateTextDefault(milestone.status_aduan) }}</span>
              </TextMilestone>
            </CardMilestone>

            <NuxtLink
              v-if="
                showButtonBuatAduanBaru(milestone.status_aduan) && index === 0
              "
              to="/aduan-warga/redirect-aduan"
              class="w-full"
            >
              <BaseButton
                class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2 dark:border-0"
              >
                Buat Aduan Baru
              </BaseButton>
            </NuxtLink>

            <BaseButtonCustom
              v-if="
                showDokumenBuktiBanding(milestone.status_aduan) &&
                  milestone.bukti_banding !== null
              "
              class="!flex !justify-start bg-[#F9F9F9] text-[12px] font-lato rounded-lg dark:bg-dark-emphasis-medium w-full !px-3 !py-2 mt-2 border-0"
              @click="goToPageFile(milestone.bukti_banding)"
            >
              <BaseButtonBodyCustom>
                <BaseIconSvg
                  icon="/icon/image-and-document.svg"
                  class="!w-[14px] !h-[14px]"
                  :fill-color="'#757575'"
                />
                <span
                  :class="
                    index > 0
                      ? 'font-medium text-gray-500 dark:text-dark-text-low'
                      : 'font-medium  text-gray-900 dark:text-dark-text-high'
                  "
                >Dokumen Bukti</span>

                <span class="ml-auto font-bold text-green-600">Lihat</span>
              </BaseButtonBodyCustom>
            </BaseButtonCustom>

            <BaseButton
              v-if="
                isDitutupOlehSpanOrSelesai(
                  milestone.status_aduan,
                  milestone?.log_span_lapor?.status,
                  index
                )
              "
              class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2 dark:border-0"
              @click="openDialogRateAduan(milestone.id_aduan_span_lapor)"
            >
              Apakah penyelesaian ini membantu ?
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardMilestone from './CardMilestone.vue'
import TextMilestone from './Text/TextMilestone.vue'
import IconAndLine from './Text/IconAndLine.vue'
import LabelText from './Text/LabelText.vue'
import StatusText from './Text/StatusText.vue'
import HelperText from './Text/HelperText.vue'
import TextDitindakLanjuti from './Text/TextDitindakLanjuti.vue'
import { dataStatusMilestone } from '~/constant/status-milestone'
import { formatDate, getExtensionFileByUrl } from '~/utils'
import BaseButtonCustom from '~/components/Base/ButtonCustom/Button.vue'
import BaseButtonBodyCustom from '~/components/Base/ButtonCustom/BodyButton.vue'
import { fileGroupMixin } from '~/mixins/fileGroupMixin'
export default {
  name: 'MilestoneAduan',
  components: {
    TextMilestone,
    CardMilestone,
    IconAndLine,
    LabelText,
    StatusText,
    HelperText,
    TextDitindakLanjuti,
    BaseButtonCustom,
    BaseButtonBodyCustom
  },
  mixins: [fileGroupMixin],
  props: {
    dataMilestone: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dataStatusMilestone
    }
  },

  methods: {
    formatDate,
    getExtensionFileByUrl,
    getStatusTextAndIcon (status, lastStatusSpan) {
      switch (status) {
        case dataStatusMilestone.menungguVerifikasi.status:
          return dataStatusMilestone.menungguVerifikasi
        case dataStatusMilestone.ditolak.status:
          return dataStatusMilestone.ditolak
        case dataStatusMilestone.terverifikasi.status:
          return dataStatusMilestone.terverifikasi
        case dataStatusMilestone.dikoordinasikan.status:
          return dataStatusMilestone.dikoordinasikan
        case dataStatusMilestone.ditindakLanjuti.status:
          return dataStatusMilestone.ditindakLanjuti
        case dataStatusMilestone.selesai.status:
          return dataStatusMilestone.selesai
        case dataStatusMilestone.ditutup.status:
          return dataStatusMilestone.ditutup
        case dataStatusMilestone.dialihkan.status:
          if (
            typeof lastStatusSpan !== 'undefined' &&
            lastStatusSpan.includes('Ditutup')
          ) {
            return {
              textStatus: dataStatusMilestone.dialihkan.textStatus,
              icon: dataStatusMilestone.ditutup.icon,
              fillColor: dataStatusMilestone.ditutup.fillColor,
              getNameStatus: dataStatusMilestone.dialihkan.getNameStatus
            }
          } else {
            return dataStatusMilestone.dialihkan
          }
        case dataStatusMilestone.gagalDiverifikasi.status:
          return dataStatusMilestone.gagalDiverifikasi
        case dataStatusMilestone.pengerjaanDitunda.status:
          return dataStatusMilestone.pengerjaanDitunda
        case dataStatusMilestone.pengerjaanDitinjauUlang.status:
          return dataStatusMilestone.pengerjaanDitinjauUlang
        default:
          return {
            textStatus: '',
            status: '',
            icon: '',
            fillColor: ''
          }
      }
    },
    getHelperTextStatusAduan (status) {
      switch (status) {
        case dataStatusMilestone.dikoordinasikan.status:
          return 'Ke'
        default:
          return 'Oleh'
      }
    },
    changeNameStatusByUser (name) {
      switch (name) {
        case 'Sistem':
          return 'Admin'
        case 'Tim Penentu Kewenangan':
          return 'Admin'
        case 'Tim Hotline':
          return 'Tim Hotline Jabar'
        default:
          return name
      }
    },
    showDokumenBuktiBanding (status) {
      const validStatus = [
        // dataStatusMilestone.selesai.status,
        dataStatusMilestone.pengerjaanDitunda.status,
        dataStatusMilestone.pengerjaanDitinjauUlang.status
      ]

      return validStatus.includes(status)
    },
    showEstimasiPengerjaanAndPenanggungJawab (status) {
      const validStatus = [
        dataStatusMilestone.ditindakLanjuti.status,
        dataStatusMilestone.selesai.status,
        dataStatusMilestone.pengerjaanDitunda.status,
        dataStatusMilestone.pengerjaanDitinjauUlang.status
      ]

      return validStatus.includes(status)
    },
    showCatatanOrKeterangan (status) {
      const validStatus = [
        dataStatusMilestone.ditolak.status,
        dataStatusMilestone.dikoordinasikan.status,
        dataStatusMilestone.dialihkan.status,
        dataStatusMilestone.menungguVerifikasi.status,
        dataStatusMilestone.terverifikasi.status,
        dataStatusMilestone.gagalDiverifikasi.status,
        dataStatusMilestone.pengerjaanDitunda.status,
        dataStatusMilestone.pengerjaanDitinjauUlang.status
      ]

      return validStatus.includes(status)
    },
    isSpanLapor (milestone) {
      return (
        milestone.status_aduan === dataStatusMilestone.dialihkan.status &&
        milestone.id_aduan_span_lapor
      )
    },
    isLogSpanLaporExist (milestone) {
      return (
        milestone.status_aduan === dataStatusMilestone.dialihkan.status &&
        milestone.id_aduan_span_lapor !== '' &&
        milestone?.log_span_lapor?.status !== ''
      )
    },
    isDitutupOlehSpanOrSelesai (status, lastStatusSpan, index) {
      return (
        (status === dataStatusMilestone.selesai.status && index === 0) ||
        (lastStatusSpan?.includes('Ditutup') &&
          status === dataStatusMilestone.dialihkan.status &&
          index === 0)
      )
    },
    showCatatanDitolak (status, keterangan) {
      return status === dataStatusMilestone.ditolak.status && keterangan
    },
    showKeteranganStatusAduan (status, keterangan) {
      return (
        (status === dataStatusMilestone.dikoordinasikan.status ||
          status === dataStatusMilestone.dialihkan.status) &&
        keterangan
      )
    },
    showKeteranganTambahan (status, keterangan) {
      return (
        (status === dataStatusMilestone.pengerjaanDitunda.status ||
          status === dataStatusMilestone.pengerjaanDitinjauUlang.status) &&
        keterangan
      )
    },
    showKeteranganDefault (status) {
      return (
        status === dataStatusMilestone.menungguVerifikasi.status ||
        status === dataStatusMilestone.terverifikasi.status ||
        status === dataStatusMilestone.gagalDiverifikasi.status
      )
    },
    generateTextDefault (status) {
      switch (status) {
        case dataStatusMilestone.menungguVerifikasi.status:
          return 'Terimakasih telah melakukan pengaduan, aduan anda akan segera kami verifikasi.'
        case dataStatusMilestone.terverifikasi.status:
          return 'Terimakasih telah melakukan pengaduan, aduan anda akan segera kami tindaklanjuti.'
        case dataStatusMilestone.gagalDiverifikasi.status:
          return 'Aduan tidak bisa dianalisis lebih lanjut.'
      }
    },
    showButtonBuatAduanBaru (status) {
      return (
        status === dataStatusMilestone.ditolak.status ||
        status === dataStatusMilestone.gagalDiverifikasi.status
      )
    },
    openDialogRateAduan (idSpanLapor) {
      this.$emit('open-dialog', idSpanLapor)
    },

    setLogSpanLapor (logSpan, idAduanSpanLapor) {
      this.$store.commit('setLogSpan', logSpan?.reverse())
      this.$router.push(`/aduan-warga/log-span-lapor/${idAduanSpanLapor}`)
    },
    getLogSpanLaporLogs (milestone) {
      if (
        milestone &&
        milestone.log_span_lapor &&
        milestone.log_span_lapor.log
      ) {
        return milestone.log_span_lapor.log.slice().reverse()
      }
      return []
    },
    showLogSpanLapor (milestone) {
      if (milestone) {
        const logSpanLapor = milestone?.log_span_lapor?.log
        return this.isSpanLapor(milestone) && logSpanLapor?.length > 0
      }
      return false
    },
    goToPageFile (fileArray) {
      if (fileArray.length === 1) {
        const parts = fileArray[0].split('.')
        const extensionFiles = this.checkExtensionFiles(
          parts[parts.length - 1]
        )

        if (extensionFiles === 'images' || extensionFiles === 'pdf') {
          this.$store.commit('setFileAduan', fileArray)
          this.$router.push(`/aduan-warga/file-aduan/${extensionFiles}`)
          return
        }

        window.location.href = fileArray[0]
      } else {
        this.groupingFileByExtension(fileArray)

        const {
          images: { data: imagesDataArray },
          xlsx: { data: xlsxDataArray },
          pdf: { data: pdfDataArray },
          documents: { data: documentsDataArray }
        } = this.grupByTypeFile

        if (
          imagesDataArray.length > 1 &&
          xlsxDataArray.length === 0 &&
          pdfDataArray.length === 0 &&
          documentsDataArray.length === 0
        ) {
          this.$store.commit('setFileAduan', imagesDataArray)
          this.$router.push('/aduan-warga/file-aduan/images')
        } else {
          this.$store.commit('setFileDokumenBukti', fileArray)
          this.$router.push('/aduan-warga/page-dokumen-bukti')
        }
      }
    },
    checkExtensionFiles (typeFile) {
      switch (typeFile.toLowerCase()) {
        case 'jpg':
        case 'jpeg':
        case 'png':
          return 'images'
        case 'xlsx':
          return 'files'
        case 'pdf':
          return 'pdf'
        case 'doc':
        case 'docx':
          return 'files'
        default:
          return ''
      }
    }
  }
}
</script>

<style scoped>
.log-span {
  white-space: pre-wrap;
}
</style>
