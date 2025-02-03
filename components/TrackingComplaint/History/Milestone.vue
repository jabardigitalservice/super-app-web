<template>
  <div class="w-full">
    <div v-for="(milestone, index) in dataMilestone" :key="index">
      <div v-if="milestone?.status_aduan !== 'Banding'">
        <div class="flex mt-3">
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
                <!-- <span
                  class="text-gray-500 mb-1 text-[11px]"
                  :class="
                    index > 0
                      ? ' dark:text-dark-text-low dark:text-opacity-60'
                      : ' dark:text-dark-text-low'
                  "
                  >{{
                    formatDate(
                      milestone.tanggal_update,
                      'EEEE, dd MMMM yyyy - HH:mm'
                    )
                  }}</span
                > -->

                <LabelText> Aduan Anda telah </LabelText>

                <DetailText>
                  {{ getStatusTextAndIcon(milestone.status_aduan).textStatus }}
                </DetailText>

                <DetailText>{{ getNameByStatus(milestone) }} </DetailText>
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
                  <LabelText> Penanggung Jawab </LabelText>

                  <DetailText>
                    {{ milestone.nama_kepala_pd }}
                  </DetailText>
                </TextMilestone>

                <TextMilestone>
                  <LabelText text="Estimasi Pengerjaan" />

                  <DetailText>
                    {{
                      `
                        ${formatDate(
                          milestone.tanggal_instruksi,
                          `dd MMMM yyyy`
                        )} sampai ${formatDate(
                        milestone.tanggal_deadline,
                        `dd MMMM yyyy`
                      )}
                      `
                    }}
                  </DetailText>
                </TextMilestone>
              </template>
            </CardMilestone>

            <DetailCardCatatan
              v-if="
                showCatatanDitolak(
                  milestone.status_aduan,
                  milestone.keterangan_status_aduan
                )
              "
              label-text="Catatan"
              :index="index"
              :content-text="milestone.keterangan_status_aduan"
            />

            <DetailCardCatatan
              v-if="
                showKeteranganStatusAduan(
                  milestone.status_aduan,
                  milestone.keterangan_status_aduan
                )
              "
              label-text="Keterangan"
              :index="index"
              :content-text="milestone.keterangan_status_aduan"
            />

            <DetailCardCatatan
              v-if="
                showKeteranganTimHotline(
                  milestone.status_aduan,
                  milestone.keterangan_status_aduan,
                  milestone.admin_monitoring_status_aduan
                )
              "
              label-text="Keterangan"
              :index="index"
              :content-text="milestone.keterangan_status_aduan"
            />

            <DetailCardCatatan
              v-if="
                showKeteranganTambahan(
                  milestone.status_aduan,
                  milestone.keterangan_tambahan
                )
              "
              label-text="Keterangan"
              :index="index"
              :content-text="milestone.keterangan_tambahan"
            />

            <DetailCardCatatan
              v-if="
                showKeteranganSelesaiTrk(
                  milestone.status_aduan,
                  milestone.keterangan_selesai_trk
                )
              "
              label-text="Keterangan"
              :index="index"
              :content-text="milestone.keterangan_selesai_trk"
            />

            <DetailCardCatatan
              v-if="showKeteranganDefault(milestone.status_aduan)"
              label-text="Keterangan"
              :index="index"
              :content-text="generateTextDefault(milestone.status_aduan)"
            />

            <CardMilestone v-if="isIdSpanLaporExist(milestone)">
              <TextMilestone>
                <LabelText>ID Tracking SP4N LAPOR </LabelText>

                <div class="mb-1">
                  <DetailText> {{ milestone.id_aduan_span_lapor }}</DetailText>
                </div>

                <template v-if="isStatusSpanLaporExist(milestone)">
                  <LabelText>Status </LabelText>

                  <DetailText>
                    {{ milestone?.log_span_lapor?.status }}
                  </DetailText>
                </template>
              </TextMilestone>
            </CardMilestone>

            <template v-if="showLogSpanLapor(milestone)">
              <div
                v-for="(logSpan, indexLog) in getLogSpanLaporLogs(milestone)"
                :key="indexLog"
              >
                <CardMilestone v-if="indexLog < 2">
                  <TextMilestone>
                    <LabelText class="!mb-1 !text-[11px]">
                      {{ logSpan.date }}
                    </LabelText>

                    <DetailText>{{ logSpan.responder }} </DetailText>

                    <DetailText class="log-span">
                      {{ logSpan.keterangan }}
                    </DetailText>
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
            </template>

            <NuxtLink
              v-if="
                showButtonBuatAduanBaru(milestone.status_aduan) &&
                index === 0 &&
                !$route.query.origin
              "
              to="/aduan-warga/redirect-aduan"
              class="w-full"
            >
              <BaseButton class="button-aduan"> Buat Aduan Baru </BaseButton>
            </NuxtLink>

            <!-- bukti banding -->
            <ButtonBuktiAduan
              v-if="
                showDocumentButton(
                  milestone.status_aduan,
                  milestone.bukti_banding
                )
              "
              :index="index"
              @show-file="goToPageFile(milestone.bukti_banding)"
            />

            <!-- bukti trk -->
            <ButtonBuktiAduan
              v-if="
                showDocumentButton(
                  milestone.status_aduan,
                  milestone.attachment_bukti_foto_selesai_trk
                )
              "
              :index="index"
              @show-file="
                goToPageFile(milestone.attachment_bukti_foto_selesai_trk)
              "
            />

            <!-- bukti hotline -->
            <ButtonBuktiAduan
              v-if="
                showDocumentButton(
                  milestone.status_aduan,
                  milestone.attachment_hotline
                )
              "
              :index="index"
              @show-file="goToPageFile(milestone.attachment_hotline)"
            />

            <BaseButton
              v-if="
                isDitutupOlehSpanOrSelesai(
                  milestone.status_aduan,
                  milestone?.log_span_lapor?.status,
                  index
                ) && !$route.query.origin
              "
              class="button-aduan"
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
import ButtonBuktiAduan from './ButtonBuktiAduan.vue'
import CardMilestone from './CardMilestone.vue'
import DetailCardCatatan from './DetailCardCatatan.vue'

import DetailText from './Text'
import IconAndLine from './Text/IconAndLine.vue'
import LabelText from './Text/LabelText.vue'
import TextMilestone from './Text/TextMilestone.vue'
import { dataStatusMilestone } from '~/constant/status-milestone'
import { fileGroupMixin } from '~/mixins/fileGroupMixin'
import { formatDate, getExtensionFileByUrl } from '~/utils'

export default {
  name: 'MilestoneAduan',
  components: {
    TextMilestone,
    CardMilestone,
    IconAndLine,
    LabelText,
    DetailText,
    ButtonBuktiAduan,
    DetailCardCatatan,
  },
  mixins: [fileGroupMixin],
  props: {
    dataMilestone: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dataStatusMilestone,
    }
  },

  methods: {
    formatDate,
    getExtensionFileByUrl,
    getStatusTextAndIcon(status, lastStatusSpan) {
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
              getNameStatus: dataStatusMilestone.dialihkan.getNameStatus,
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
            fillColor: '',
          }
      }
    },

    getNameByStatus(milestone) {
      switch (milestone.status_aduan) {
        case dataStatusMilestone.selesai.status:
        case dataStatusMilestone.ditindakLanjuti.status:
          if (milestone.admin_monitoring_status_aduan === 'Tim Hotline') {
            return 'Tim Hotline Jabar'
          } else {
            return this.changeNameStatusByUser(
              milestone[
                this.getStatusTextAndIcon(milestone.status_aduan).getNameStatus
              ]
            )
          }
        default:
          return this.changeNameStatusByUser(
            milestone[
              this.getStatusTextAndIcon(milestone.status_aduan).getNameStatus
            ]
          )
      }
    },
    changeNameStatusByUser(name) {
      switch (name) {
        case 'Sistem':
          return 'Admin'
        case 'Tim Penentu Kewenangan':
          return 'Admin'
        default:
          return name
      }
    },
    showDocumentButton(status, attachment) {
      return (
        (this.showDokumenBuktiBanding(status) && attachment !== null) ||
        (this.showDokumenSelesai(status) && attachment !== null)
      )
    },
    showDokumenBuktiBanding(status) {
      const validStatus = [
        dataStatusMilestone.pengerjaanDitunda.status,
        dataStatusMilestone.pengerjaanDitinjauUlang.status,
      ]

      return validStatus.includes(status)
    },
    showDokumenSelesai(status) {
      const validStatus = [dataStatusMilestone.selesai.status]

      return validStatus.includes(status)
    },
    showEstimasiPengerjaanAndPenanggungJawab(status) {
      const validStatus = [
        dataStatusMilestone.ditindakLanjuti.status,
        dataStatusMilestone.selesai.status,
        dataStatusMilestone.pengerjaanDitunda.status,
        dataStatusMilestone.pengerjaanDitinjauUlang.status,
      ]

      return validStatus.includes(status)
    },
    isIdSpanLaporExist(milestone) {
      return (
        milestone.status_aduan === dataStatusMilestone.dialihkan.status &&
        milestone.id_aduan_span_lapor
      )
    },
    isStatusSpanLaporExist(milestone) {
      return (
        milestone.status_aduan === dataStatusMilestone.dialihkan.status &&
        milestone.id_aduan_span_lapor !== '' &&
        milestone?.log_span_lapor?.status !== ''
      )
    },
    isDitutupOlehSpanOrSelesai(status, lastStatusSpan, index) {
      return (
        (status === dataStatusMilestone.selesai.status && index === 0) ||
        (lastStatusSpan?.includes('Ditutup') &&
          status === dataStatusMilestone.dialihkan.status &&
          index === 0)
      )
    },
    showCatatanDitolak(status, keterangan) {
      return status === dataStatusMilestone.ditolak.status && keterangan
    },
    showKeteranganStatusAduan(status, keterangan) {
      return (
        (status === dataStatusMilestone.dikoordinasikan.status ||
          status === dataStatusMilestone.dialihkan.status) &&
        keterangan
      )
    },
    showKeteranganTambahan(status, keterangan) {
      return (
        (status === dataStatusMilestone.pengerjaanDitunda.status ||
          status === dataStatusMilestone.pengerjaanDitinjauUlang.status) &&
        keterangan
      )
    },
    showKeteranganSelesaiTrk(status, keterangan) {
      return status === dataStatusMilestone.selesai.status && keterangan
    },
    showKeteranganTimHotline(status, keterangan, isHotline) {
      return (
        status === dataStatusMilestone.selesai.status &&
        keterangan &&
        isHotline === 'Tim Hotline'
      )
    },
    showKeteranganDefault(status) {
      return (
        status === dataStatusMilestone.menungguVerifikasi.status ||
        status === dataStatusMilestone.terverifikasi.status ||
        status === dataStatusMilestone.gagalDiverifikasi.status
      )
    },
    generateTextDefault(status) {
      switch (status) {
        case dataStatusMilestone.menungguVerifikasi.status:
          return 'Terimakasih telah melakukan pengaduan, aduan anda akan segera kami verifikasi.'
        case dataStatusMilestone.terverifikasi.status:
          return 'Terimakasih telah melakukan pengaduan, aduan anda akan segera kami tindaklanjuti.'
        case dataStatusMilestone.gagalDiverifikasi.status:
          return 'Aduan tidak bisa dianalisis lebih lanjut.'
      }
    },
    showButtonBuatAduanBaru(status) {
      return (
        status === dataStatusMilestone.ditolak.status ||
        status === dataStatusMilestone.gagalDiverifikasi.status
      )
    },
    openDialogRateAduan(idSpanLapor) {
      this.$emit('open-dialog', idSpanLapor)
    },

    setLogSpanLapor(logSpan, idAduanSpanLapor) {
      this.$store.commit('setLogSpan', logSpan?.reverse())
      this.$router.push({
        path: `/aduan-warga/log-span-lapor/${idAduanSpanLapor}`,
        query: this.$route.query,
      })
    },
    getLogSpanLaporLogs(milestone) {
      if (
        milestone &&
        milestone.log_span_lapor &&
        milestone.log_span_lapor.log
      ) {
        return milestone.log_span_lapor.log.slice().reverse()
      }
      return []
    },
    showLogSpanLapor(milestone) {
      if (milestone) {
        const logSpanLapor = milestone?.log_span_lapor?.log
        return this.isIdSpanLaporExist(milestone) && logSpanLapor?.length > 0
      }
      return false
    },
    goToPageFile(fileArray) {
      if (fileArray.length === 1) {
        const parts = fileArray[0].split('.')
        const extensionFiles = this.checkExtensionFiles(parts[parts.length - 1])

        if (extensionFiles === 'images' || extensionFiles === 'pdf') {
          this.$store.commit('setFileAduan', fileArray)
          this.$router.push({
            path: `/aduan-warga/file-aduan/${extensionFiles}`,
            query: this.$route.query,
          })
          return
        }

        window.location.href = fileArray[0]
      } else {
        this.groupingFileByExtension(fileArray)

        const {
          images: { data: imagesDataArray },
          xlsx: { data: xlsxDataArray },
          pdf: { data: pdfDataArray },
          documents: { data: documentsDataArray },
        } = this.grupByTypeFile

        if (
          imagesDataArray.length > 1 &&
          xlsxDataArray.length === 0 &&
          pdfDataArray.length === 0 &&
          documentsDataArray.length === 0
        ) {
          this.$store.commit('setFileAduan', imagesDataArray)
          this.$router.push({
            path: '/aduan-warga/file-aduan/images',
            query: this.$route.query,
          })
        } else {
          this.$store.commit('setFileDokumenBukti', fileArray)
          this.$router.push({
            path: '/aduan-warga/page-dokumen-bukti',
            query: this.$route.query,
          })
        }
      }
    },
    checkExtensionFiles(typeFile) {
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
    },
  },
}
</script>

<style scoped>
.log-span {
  white-space: pre-wrap;
}

.button-aduan {
  @apply text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2 dark:border-0;
}
</style>
