<template>
  <div class="w-full">
    <div v-for="(milestone, index) in dataMilestone" :key="index">
      <div v-if="isLogSpanLaporExist(milestone)" class="flex mt-3">
        <IconAndLine
          :icon="`/icon/${
            getStatusTextAndIcon(
              milestone.status_aduan,
              milestone?.log_span_lapor?.status
            ).icon
          }`"
          :fill-color="index > 0
            ? '#868C89'
            : `${
              getStatusTextAndIcon(
                milestone.status_aduan,
                milestone?.log_span_lapor?.status
              ).fillColor
            }`"
          :line-milestone="index !== dataMilestone.length - 1"
        />
        <div class="w-full">
          <CardMilestone>
            <TextMilestone>
              <LabelText text="ID Tracking SP4N LAPOR" :condition-text="index > 0" />

              <div class="mb-1">
                <StatusText :condition-text="index > 0" :text="milestone.id_aduan_span_lapor" />
              </div>

              <LabelText text="Status" :condition-text="index > 0" />
              <div>
                <StatusText :condition-text="index > 0" :text="milestone?.log_span_lapor?.status" />
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
                  <LabelText class="!mb-1 !text-[11px]" :text="logSpan.date" :condition-text="indexLog > 0" />

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

      <!-- is span lapor -->
      <div v-if="isSpanLapor(milestone)" class="flex mt-3">
        <IconAndLine
          :icon="`/icon/${dataStatusMilestone.dialihkan.icon}`"
          :fill-color="
            isLogSpanLaporExist(milestone)
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
                  isLogSpanLaporExist(milestone)
                    ? ' dark:text-dark-text-low dark:text-opacity-60'
                    : ' dark:text-dark-text-low'
                "
              >{{
                formatDate(
                  milestone.tanggal_update,
                  "EEEE, dd MMMM yyyy - HH:mm"
                )
              }}</span>

              <LabelText text="Status" :condition-text="isLogSpanLaporExist(milestone)" />

              <div>
                <StatusText :condition-text="isLogSpanLaporExist(milestone)" :text="getStatusTextAndIcon(milestone.status_aduan).status" />

                <span
                  :class="
                    isLogSpanLaporExist(milestone)
                      ? 'text-gray-400 dark:text-dark-text-low'
                      : 'text-gray-800 dark:text-dark-text-low'
                  "
                >{{ getHelperTextStatusAduan(milestone.status_aduan) }}</span>

                <StatusText
                  :condition-text="isLogSpanLaporExist(milestone)"
                  :text=" changeNameStatusByUser(
                    milestone[
                      getStatusTextAndIcon(milestone.status_aduan)
                        .getNameStatus
                    ]
                  )"
                />
              </div>
            </TextMilestone>
          </CardMilestone>
          <CardMilestone
            v-if="
              isditolakOrdikoordinasikanAndDialihkan(milestone.status_aduan) &&
                milestone.keterangan_status_aduan
            "
            class="mt-2"
          >
            <TextMilestone
              v-if="
                showKeteranganDikoordinasikanAndDialihkan(
                  milestone.status_aduan,
                  milestone.keterangan_status_aduan
                )
              "
            >
              <LabelText text="Keterangan" :condition-text="isLogSpanLaporExist(milestone)" />

              <span
                :class="
                  isLogSpanLaporExist(milestone)
                    ? 'text-gray-500 dark:text-dark-text-low'
                    : 'font-medium  text-gray-900 dark:text-dark-text-high'
                "
              >{{ milestone.keterangan_status_aduan }}</span>
            </TextMilestone>
          </CardMilestone>
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
                <StatusText :condition-text="index > 0" :text="getStatusTextAndIcon(milestone.status_aduan).status" />
                <span
                  :class="
                    index > 0
                      ? 'text-gray-400 dark:text-dark-text-low'
                      : 'text-gray-800 dark:text-dark-text-low'
                  "
                >{{ getHelperTextStatusAduan(milestone.status_aduan) }}</span>

                <StatusText
                  :condition-text="index > 0"
                  :text="changeNameStatusByUser(
                    milestone[
                      getStatusTextAndIcon(milestone.status_aduan)
                        .getNameStatus
                    ]
                  )"
                />
              </div>
            </TextMilestone>

            <!-- text for status ditindaklanjuti -->
            <template v-if="isditindakLanjutiOrselesai(milestone.status_aduan)">
              <TextMilestone>
                <LabelText text="Penanggung Jawab" :condition-text="index > 0" />

                <span
                  :class="
                    index > 0
                      ? 'text-gray-500 dark:text-dark-text-low'
                      : 'font-semibold text-gray-800 dark:text-dark-text-high'
                  "
                >{{ milestone.nama_kepala_pd }}</span>
              </TextMilestone>

              <TextMilestone>
                <LabelText text="Estimasi Mulai dan Selesai Pengerjaan" :condition-text="index > 0" />

                <div>
                  <span
                    :class="
                      index > 0
                        ? 'text-gray-500 dark:text-dark-text-low'
                        : 'font-semibold text-gray-800 dark:text-dark-text-high'
                    "
                  >{{
                    formatDate(milestone.tanggal_instruksi, "dd MMMM yyyy")
                  }}</span>

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
                  >
                    {{
                      formatDate(milestone.tanggal_deadline, "dd MMMM yyyy")
                    }}</span>
                </div>
              </TextMilestone>
            </template>
          </CardMilestone>

          <!-- card if catatan and tanggap is exist -->
          <CardMilestone
            v-if="
              isditolakOrdikoordinasikanAndDialihkan(milestone.status_aduan) &&
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
                showKeteranganDikoordinasikanAndDialihkan(
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
  </div>
</template>

<script>
import CardMilestone from './CardMilestone.vue'
import TextMilestone from './TextMilestone.vue'
import IconAndLine from './IconAndLine.vue'
import LabelText from './LabelText.vue'
import StatusText from './StatusText.vue'
import { dataStatusMilestone } from '~/constant/status-milestone'
import { formatDate } from '~/utils'

export default {
  name: 'MilestoneAduan',
  components: { TextMilestone, CardMilestone, IconAndLine, LabelText, StatusText },
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
        default:
          return 'Oleh'
      }
    },
    changeNameStatusByUser (name) {
      switch (name) {
        case 'Sistem':
          return 'Admin'
        case 'Tim Penentu Kewenangan':
          return 'Dinas Terkait'
        default:
          return name
      }
    },
    isditolakOrdikoordinasikanAndDialihkan (status) {
      return (
        status === dataStatusMilestone.ditolak.status ||
        status === dataStatusMilestone.dikoordinasikan.status ||
        status === dataStatusMilestone.dialihkan.status
      )
    },
    isditindakLanjutiOrselesai (status) {
      return (
        status === dataStatusMilestone.ditindakLanjuti.status ||
        status === dataStatusMilestone.selesai.status
      )
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
    showKeteranganDikoordinasikanAndDialihkan (status, keterangan) {
      return (
        (status === dataStatusMilestone.dikoordinasikan.status ||
          status === dataStatusMilestone.dialihkan.status) &&
        keterangan
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
    }
  }
}
</script>

<style scoped>
.log-span {
  white-space: pre-wrap;
}
</style>
