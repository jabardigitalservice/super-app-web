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
            :icon="`/icon/${getStatusTextAndIcon(milestone.status_aduan).icon}`"
            class="!shadow-lg !w-[14px] !h-[14px]"
            :fill-color="
              index > 0
                ? '#868C89'
                : `${getStatusTextAndIcon(milestone.status_aduan).fillColor}`
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
          <TextMilestone>
            <span
              class="text-gray-500 mb-1 text-[11px]"
              :class="
                index > 0
                  ? 'text-gray-500 dark:text-dark-text-low dark:text-opacity-60'
                  : 'text-gray-500 dark:text-dark-text-low'
              "
            >{{ formatDate(milestone.tanggal_update) }}</span>
            <span
              :class="
                index > 0
                  ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                  : 'text-gray-600 dark:text-dark-text-low '
              "
            >{{
              milestone.status_aduan ===
                dataStatusMilestone.menungguVerifikasi.status
                ? "Aduan Anda sedang"
                : "Aduan Anda telah"
            }}</span>
            <div>
              <span
                :class="
                  index > 0
                    ? 'text-gray-500 dark:text-dark-text-low'
                    : 'font-bold dark:font-medium text-gray-900 dark:text-dark-text-high'
                "
              >{{ getStatusTextAndIcon(milestone.status_aduan).status }}</span>
              <span
                :class="
                  index > 0
                    ? 'text-gray-400 dark:text-dark-text-low'
                    : 'text-gray-800 dark:text-dark-text-low'
                "
              >{{
                milestone.status_aduan ===
                  dataStatusMilestone.dikoordinasikan.status
                  ? "Ke"
                  : "Oleh"
              }}</span>
              <span
                :class="
                  index > 0
                    ? 'text-gray-500 dark:text-dark-text-low'
                    : 'font-bold dark:font-medium text-gray-900 dark:text-dark-text-high'
                "
              >{{ milestone[getStatusTextAndIcon(milestone.status_aduan).getName] }}</span>
            </div>
          </TextMilestone>

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
                    : 'text-gray-800 dark:text-dark-text-high'
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
                      : 'font-bold dark:font-medium text-gray-800 dark:text-dark-text-high'
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
                      : 'font-bold dark:font-medium text-gray-800 dark:text-dark-text-high'
                  "
                >{{ milestone.tanggal_deadline }}</span>
              </div>
            </TextMilestone>
          </template>
        </CardMilestone>

        <CardMilestone
          v-if="
            isditolakOrditindakLanjuti(milestone.status_aduan) &&
              (milestone.keterangan_status_aduan || milestone.keterangan_tambahan)
          "
          class="mt-2"
        >
          <TextMilestone
            v-if="
              milestone.status_aduan === dataStatusMilestone.ditolak.status &&
                milestone.keterangan_status_aduan
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
                  : 'font-bold dark:font-medium text-gray-900 dark:text-dark-text-high'
              "
            >{{ milestone.keterangan_status_aduan }}</span>
          </TextMilestone>

          <AduanTextMilestone
            v-if="
              milestone.status_aduan ===
                dataStatusMilestone.ditindakLanjuti.status &&
                milestone.keterangan_tambahan
            "
          >
            <span
              :class="
                index > 0
                  ? 'text-gray-400 dark:text-dark-text-low dark:text-opacity-60'
                  : 'text-gray-600 dark:text-dark-text-low '
              "
            >
              Tanggapan</span>

            <span
              :class="
                index > 0
                  ? 'text-gray-500 dark:text-dark-text-low'
                  : 'font-bold dark:font-medium text-gray-900 dark:text-dark-text-high'
              "
            >{{ milestone.keterangan_tambahan }}</span>
          </AduanTextMilestone>
        </CardMilestone>

        <NuxtLink
          v-if="
            milestone.status_aduan === dataStatusMilestone.ditolak.status &&
              index === 0
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
            milestone.status_aduan === dataStatusMilestone.selesai.status &&
              index === 0
          "
          class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2 dark:border-0"
          @click="openDialog"
        >
          Apakah penyelesaian ini membantu?
        </BaseButton>

        <!--  this dummy slicing, i want fixit if API ready -->
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
    getStatusTextAndIcon (status) {
      switch (status) {
        case dataStatusMilestone.menungguVerifikasi.status:
          return {
            status: dataStatusMilestone.menungguVerifikasi.textStatus,
            icon: dataStatusMilestone.menungguVerifikasi.icon,
            fillColor: dataStatusMilestone.menungguVerifikasi.fillColor,
            getName: dataStatusMilestone.menungguVerifikasi.getName
          }
        case dataStatusMilestone.ditolak.status:
          return {
            status: dataStatusMilestone.ditolak.textStatus,
            icon: dataStatusMilestone.ditolak.icon,
            fillColor: dataStatusMilestone.ditolak.fillColor,
            getName: dataStatusMilestone.ditolak.getName
          }
        case dataStatusMilestone.terverifikasi.status:
          return {
            status: dataStatusMilestone.terverifikasi.textStatus,
            icon: dataStatusMilestone.terverifikasi.icon,
            fillColor: dataStatusMilestone.terverifikasi.fillColor,
            getName: dataStatusMilestone.terverifikasi.getName
          }
        case dataStatusMilestone.dikoordinasikan.status:
          return {
            status: dataStatusMilestone.dikoordinasikan.textStatus,
            icon: dataStatusMilestone.dikoordinasikan.icon,
            fillColor: dataStatusMilestone.dikoordinasikan.fillColor,
            getName: dataStatusMilestone.dikoordinasikan.getName
          }
        case dataStatusMilestone.ditindakLanjuti.status:
          return {
            status: dataStatusMilestone.ditindakLanjuti.textStatus,
            icon: dataStatusMilestone.ditindakLanjuti.icon,
            fillColor: dataStatusMilestone.ditindakLanjuti.fillColor,
            getName: dataStatusMilestone.ditindakLanjuti.getName
          }
        case dataStatusMilestone.selesai.status:
          return {
            status: dataStatusMilestone.selesai.textStatus,
            icon: dataStatusMilestone.selesai.icon,
            fillColor: dataStatusMilestone.selesai.fillColor,
            getName: dataStatusMilestone.selesai.getName
          }
        case dataStatusMilestone.ditutup.status:
          return {
            status: dataStatusMilestone.ditutup.textStatus,
            icon: dataStatusMilestone.ditutup.icon,
            fillColor: dataStatusMilestone.ditutup.fillColor,
            getName: dataStatusMilestone.ditutup.getName
          }
        case dataStatusMilestone.dialihkan.status:
          return {
            status: dataStatusMilestone.dialihkan.textStatus,
            icon: dataStatusMilestone.dialihkan.icon,
            fillColor: dataStatusMilestone.dialihkan.fillColor,
            getName: dataStatusMilestone.dialihkan.getName
          }
        default:
          return {
            status: '',
            icon: '',
            fillColor: ''
          }
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

    openDialog () {
      this.$emit('open-dialog')
    }
  }
}
</script>
