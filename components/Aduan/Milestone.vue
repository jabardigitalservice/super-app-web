<template>
  <div class="w-full">
    <div
      v-for="(milestone, index) in dataMilestone"
      :key="index"
      class="flex mt-3"
    >
      <div class="flex flex-col items-center mr-4">
        <div
          class="flex items-center justify-center border dark:border-dark-emphasis-medium w-[26px] h-[26px] bg-gray-50 rounded-lg dark:bg-dark-emphasis-medium"
        >
          <BaseIconSvg
            :icon="`/icon/${
              getStatusTextAndIcon(
                milestone.status_aduan,
                milestone?.log_span_lapor?.status
              ).icon
            }`"
            class="!shadow-lg !w-[14px] !h-[14px]"
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
          />
        </div>
        <div
          v-if="index !== dataMilestone.length - 1"
          class="w-px h-full bg-gray-300 dark:bg-dark-emphasis-medium"
        />
      </div>
      <div class="w-full">
        <CardMilestone>
          <!-- text if id sp4n laporan is exist -->
          <TextMilestone
            v-if="
              isSpanLapor(milestone.status_aduan, milestone.id_aduan_span_lapor)
            "
          >
            <span
              :class="
                index > 0
                  ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                  : 'text-gray-600 dark:text-dark-text-low '
              "
            >
              ID Tracking SP4N LAPOR
            </span>
            <div>
              <span
                :class="
                  index > 0
                    ? 'text-gray-500 dark:text-dark-text-low'
                    : 'font-semibold text-gray-900 dark:text-dark-text-high'
                "
              >{{ milestone.id_aduan_span_lapor }}</span>
            </div>
          </TextMilestone>
          <!-- text for status aduan -->
          <TextMilestone>
            <span
              v-if="
                !isSpanLapor(
                  milestone.status_aduan,
                  milestone.id_aduan_span_lapor
                )
              "
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
            <span
              :class="
                index > 0
                  ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                  : 'text-gray-600 dark:text-dark-text-low '
              "
            >{{
              getHelperTextBeforeStatusAduan(
                milestone.status_aduan,
                milestone.id_aduan_span_lapor,
                milestone?.log_span_lapor?.status
              )
            }}</span>
            <div>
              <span
                :class="
                  index > 0
                    ? 'text-gray-500 dark:text-dark-text-low'
                    : 'font-semibold text-gray-900 dark:text-dark-text-high'
                "
              >{{
                isSpanLapor(
                  milestone.status_aduan,
                  milestone.id_aduan_span_lapor
                )
                  ? milestone?.log_span_lapor?.status
                  : getStatusTextAndIcon(milestone.status_aduan).status
              }}</span>
              <span
                :class="
                  index > 0
                    ? 'text-gray-400 dark:text-dark-text-low'
                    : 'text-gray-800 dark:text-dark-text-low'
                "
              >{{ getHelperTextStatusAduan(milestone.status_aduan) }}</span>
              <span
                :class="
                  index > 0
                    ? 'text-gray-500 dark:text-dark-text-low'
                    : 'font-semibold text-gray-900 dark:text-dark-text-high'
                "
              >{{
                milestone[
                  getStatusTextAndIcon(milestone.status_aduan).getNameStatus
                ]
              }}</span>
            </div>
          </TextMilestone>

          <!-- text for status ditindaklanjuti -->
          <template v-if="isditindakLanjutiOrselesai(milestone.status_aduan)">
            <TextMilestone>
              <span
                :class="
                  index > 0
                    ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                    : 'text-gray-600 dark:text-dark-text-low'
                "
              >Penanggung Jawab</span>

              <span
                :class="
                  index > 0
                    ? 'text-gray-500 dark:text-dark-text-low'
                    : 'font-semibold text-gray-800 dark:text-dark-text-high'
                "
              >{{ milestone.nama_kepala_pd }}</span>
            </TextMilestone>

            <TextMilestone>
              <span
                :class="
                  index > 0
                    ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                    : 'text-gray-600 dark:text-dark-text-low '
                "
              >Estimasi Pengerjaan</span>

              <div>
                <span
                  :class="
                    index > 0
                      ? 'text-gray-500 dark:text-dark-text-low'
                      : 'font-semibold text-gray-800 dark:text-dark-text-high'
                  "
                >{{ milestone.tanggal_instruksi }}</span>
                <span
                  :class="
                    index > 0
                      ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                      : 'text-gray-800 dark:text-dark-text-low '
                  "
                >sampai</span>
                <span
                  :class="
                    index > 0
                      ? 'text-gray-500 dark:text-dark-text-low'
                      : 'font-semibold text-gray-800 dark:text-dark-text-high'
                  "
                >{{ milestone.tanggal_deadline }}</span>
              </div>
            </TextMilestone>
          </template>
        </CardMilestone>

        <!-- card if catatan and tanggap is exist -->
        <CardMilestone
          v-if="
            isditolakOrditindakLanjuti(milestone.status_aduan) &&
              milestone.keterangan_status_aduan
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
            <span
              :class="
                index > 0
                  ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                  : 'text-gray-600 dark:text-dark-text-low '
              "
            >
              Catatan</span>

            <span
              :class="
                index > 0
                  ? 'text-gray-500 dark:text-dark-text-low'
                  : 'font-medium  text-gray-900 dark:text-dark-text-high'
              "
            >{{ milestone.keterangan_status_aduan }}</span>
          </TextMilestone>

          <TextMilestone
            v-if="
              showKeteranganDitindakLanjuti(
                milestone.status_aduan,
                milestone.keterangan_status_aduan
              )
            "
          >
            <span
              :class="
                index > 0
                  ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                  : 'text-gray-600 dark:text-dark-text-low '
              "
            >
              Keterangan</span>

            <span
              :class="
                index > 0
                  ? 'text-gray-500 dark:text-dark-text-low'
                  : 'font-medium  text-gray-900 dark:text-dark-text-high'
              "
            >{{ milestone.keterangan_status_aduan }}</span>
          </TextMilestone>
        </CardMilestone>

        <NuxtLink
          v-if="showButtonBuatAduanBaru(milestone.status_aduan) && index === 0"
          to="/aduan-warga/redirect-aduan"
          class="w-full"
        >
          <BaseButton
            class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2 dark:border-0"
          >
            Buat Aduan Baru
          </BaseButton>
        </NuxtLink>

        <!-- card milestone for log span lapor -->

        <div v-if="showLogSpanLapor(milestone)">
          <div
            v-for="(logSpan, indexLog) in milestoneLogSpanLaporLogs(milestone)"
            :key="indexLog"
          >
            <CardMilestone v-if="indexLog < 2" class="mt-2">
              <TextMilestone>
                <span
                  class="mb-1 text-[11px]"
                  :class="
                    indexLog > 0
                      ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                      : 'text-gray-600 dark:text-dark-text-low'
                  "
                >{{ logSpan.date }}</span>

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

          <div v-if="milestone?.log_span_lapor?.log?.length > 2" class="w-full">
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
            isditutupOlehSpanOrSelesai(
              milestone.status_aduan,
              milestone?.log_span_lapor?.status,
              index
            )
          "
          class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2 dark:border-0"
          @click="openDialog(milestone.id_aduan_span_lapor)"
        >
          Apakah penyelesaian ini membantu ?
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import CardMilestone from './CardMilestone.vue'
import TextMilestone from './TextMilestone.vue'
import { dataStatusMilestone } from '~/constant/status-milestone'
import { formatDate } from '~/utils'

export default {
  name: 'MilestoneAduan',
  components: { TextMilestone, CardMilestone },
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
    getStatusTextAndIcon (status, lastStatusSpan) {
      switch (status) {
        case dataStatusMilestone.menungguVerifikasi.status:
          return {
            status: dataStatusMilestone.menungguVerifikasi.textStatus,
            icon: dataStatusMilestone.menungguVerifikasi.icon,
            fillColor: dataStatusMilestone.menungguVerifikasi.fillColor,
            getNameStatus: dataStatusMilestone.menungguVerifikasi.getNameStatus
          }
        case dataStatusMilestone.ditolak.status:
          return {
            status: dataStatusMilestone.ditolak.textStatus,
            icon: dataStatusMilestone.ditolak.icon,
            fillColor: dataStatusMilestone.ditolak.fillColor,
            getNameStatus: dataStatusMilestone.ditolak.getNameStatus
          }
        case dataStatusMilestone.terverifikasi.status:
          return {
            status: dataStatusMilestone.terverifikasi.textStatus,
            icon: dataStatusMilestone.terverifikasi.icon,
            fillColor: dataStatusMilestone.terverifikasi.fillColor,
            getNameStatus: dataStatusMilestone.terverifikasi.getNameStatus
          }
        case dataStatusMilestone.dikoordinasikan.status:
          return {
            status: dataStatusMilestone.dikoordinasikan.textStatus,
            icon: dataStatusMilestone.dikoordinasikan.icon,
            fillColor: dataStatusMilestone.dikoordinasikan.fillColor,
            getNameStatus: dataStatusMilestone.dikoordinasikan.getNameStatus
          }
        case dataStatusMilestone.ditindakLanjuti.status:
          return {
            status: dataStatusMilestone.ditindakLanjuti.textStatus,
            icon: dataStatusMilestone.ditindakLanjuti.icon,
            fillColor: dataStatusMilestone.ditindakLanjuti.fillColor,
            getNameStatus: dataStatusMilestone.ditindakLanjuti.getNameStatus
          }
        case dataStatusMilestone.selesai.status:
          return {
            status: dataStatusMilestone.selesai.textStatus,
            icon: dataStatusMilestone.selesai.icon,
            fillColor: dataStatusMilestone.selesai.fillColor,
            getNameStatus: dataStatusMilestone.selesai.getNameStatus
          }
        case dataStatusMilestone.ditutup.status:
          return {
            status: dataStatusMilestone.ditutup.textStatus,
            icon: dataStatusMilestone.ditutup.icon,
            fillColor: dataStatusMilestone.ditutup.fillColor,
            getNameStatus: dataStatusMilestone.ditutup.getNameStatus
          }
        case dataStatusMilestone.dialihkan.status:
          if (
            typeof lastStatusSpan !== 'undefined' &&
            lastStatusSpan.includes('Ditutup')
          ) {
            return {
              status: dataStatusMilestone.dialihkan.textStatus,
              icon: dataStatusMilestone.ditutup.icon,
              fillColor: dataStatusMilestone.ditutup.fillColor,
              getNameStatus: dataStatusMilestone.dialihkan.getNameStatus
            }
          } else {
            return {
              status: dataStatusMilestone.dialihkan.textStatus,
              icon: dataStatusMilestone.dialihkan.icon,
              fillColor: dataStatusMilestone.dialihkan.fillColor,
              getNameStatus: dataStatusMilestone.dialihkan.getNameStatus
            }
          }
        default:
          return {
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
        case dataStatusMilestone.dialihkan.status:
          return ''
        default:
          return 'Oleh'
      }
    },
    getHelperTextBeforeStatusAduan (status, idAduanSpanLapor, lastStatusSpan) {
      switch (status) {
        case dataStatusMilestone.menungguVerifikasi.status:
          return 'Aduan Anda sedang'
        case dataStatusMilestone.dialihkan.status:
          if (idAduanSpanLapor && lastStatusSpan) {
            return 'Status Terakhir'
          } else if (idAduanSpanLapor && !lastStatusSpan) {
            return ''
          } else {
            return 'Aduan Anda telah'
          }
        default:
          return 'Aduan Anda telah'
      }
    },
    isditolakOrditindakLanjuti (status) {
      return (
        status === dataStatusMilestone.ditolak.status ||
        status === dataStatusMilestone.ditindakLanjuti.status
      )
    },
    isditindakLanjutiOrselesai (status) {
      return (
        status === dataStatusMilestone.ditindakLanjuti.status ||
        status === dataStatusMilestone.selesai.status
      )
    },
    isSpanLapor (status, idAduanSpanLapor) {
      return (
        status === dataStatusMilestone.dialihkan.status && idAduanSpanLapor
      )
    },
    isditutupOlehSpanOrSelesai (status, lastStatusSpan, index) {
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
    showKeteranganDitindakLanjuti (status, keterangan) {
      return (
        status === dataStatusMilestone.ditindakLanjuti.status && keterangan
      )
    },
    showButtonBuatAduanBaru (status) {
      return status === dataStatusMilestone.ditolak.status
    },
    openDialog (idSpanLapor) {
      this.$emit('open-dialog', idSpanLapor)
    },

    setLogSpanLapor (logSpan, idAduanSpanLapor) {
      this.$store.commit('setLogSpan', logSpan?.reverse())
      this.$router.push(`/aduan-warga/log-span-lapor/${idAduanSpanLapor}`)
    },
    showLogSpanLapor (milestone) {
      if (milestone) {
        const statusAduan = milestone.status_aduan
        const idAduanSpan = milestone.id_aduan_span_lapor
        const logSpanLapor = milestone?.log_span_lapor?.log
        return (
          this.isSpanLapor(statusAduan, idAduanSpan) && logSpanLapor?.length > 0
        )
      }
      return false
    },
    milestoneLogSpanLaporLogs (milestone) {
      return milestone?.log_span_lapor?.log?.reverse() || []
    }
  }
}
</script>

<style scoped>
.log-span {
  white-space: pre-wrap;
}
</style>
