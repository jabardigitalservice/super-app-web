<template>
  <div class="w-full">
    <div v-for="(milestone, index) in dataMilestone" :key="`history-${index}`">
      <div
        class="grid grid-cols-[minmax(30px,max-content),minmax(30px,min-content),1fr] gap-2 mt-3"
      >
        <div class="sm:w-full w-[100px]">
          <span
            class="font-lato text-xs text-blue-gray-300 dark:text-dark-text-low"
          >
            {{ formatDate(milestone.date, 'dd MMMM yyyy - HH:mm') }}
          </span>
        </div>

        <div class="flex flex-col items-center">
          <div
            class="mt-1 flex items-center justify-center border dark:border-dark-emphasis-medium w-[26px] h-[26px] bg-gray-50 rounded-lg dark:bg-dark-emphasis-medium"
          >
            <BaseIconSvg
              :icon="`/icon/${getIconAndFillColor(milestone.status).icon}`"
              class="!shadow-lg !w-[14px] !h-[14px]"
              :fill-color="
                index > 0
                  ? '#868C89'
                  : getIconAndFillColor(milestone.status).fillColor
              "
            />
          </div>

          <div
            v-if="index !== dataMilestone.length - 1"
            class="w-px h-full bg-gray-300 dark:bg-dark-emphasis-medium"
          />
        </div>

        <div class="w-full mt-1">
          <div class="card-milestone">
            <div class="text-milestone">
              <p class="label-text">
                {{
                  milestone.status ===
                  newDataStatusMilestone.unverified.textStatus
                    ? 'Aduan Anda sedang'
                    : 'Aduan Anda telah'
                }}
              </p>
              <p class="detail-text flex flex-col gap-y-1">
                <span>{{ milestone.status }}</span>
                <span class="label-text">oleh</span>
                <span>{{ milestone.pic }}</span>
              </p>
            </div>

            <div v-if="showPic(milestone)" class="text-milestone">
              <p class="label-text">Penanggung Jawab</p>
              <p class="detail-text">{{ milestone.pic_name }}</p>
            </div>

            <div v-if="showEstimation(milestone)" class="text-milestone">
              <p class="label-text">Estimasi Pengerjaan</p>
              <p class="detail-text">
                {{ getEstimationPeriod(milestone) }}
              </p>
            </div>
          </div>

          <div v-if="milestone.note" class="card-milestone mt-2">
            <div class="text-milestone">
              <p class="label-text">Keterangan</p>
              <p class="detail-text">{{ milestone.note }}</p>
            </div>
          </div>

          <div v-if="showIdSpanLapor(milestone)" class="card-milestone mt-2">
            <div class="text-milestone">
              <p class="label-text">ID Tracking SP4N LAPOR</p>
              <p class="detail-text">{{ milestone.sp4n_id }}</p>
            </div>
          </div>

          <TrackingComplaintAccordion
            v-if="showLogSpanLapor(milestone)"
            title="Lihat Semua Status"
            :log-span="milestone.sp4n_histories"
          />

          <!-- TODO: EVIDENCE FOR STATUS SELESAI, DITINJAU ULANG, PENGERJAAN DITUNDA -->
          <div v-if="showEvidence(milestone)">isinya file</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { newDataStatusMilestone } from '~/constant/status-milestone'
import { formatDate } from '~/utils'

export default {
  name: 'MilestoneAduan',
  props: {
    dataMilestone: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      newDataStatusMilestone,
    }
  },
  methods: {
    formatDate,
    getIconAndFillColor(textStatus) {
      const statusEntry = Object.values(newDataStatusMilestone).find(
        (status) => status.textStatus === textStatus
      )

      if (statusEntry) {
        return {
          icon: statusEntry.icon,
          fillColor: statusEntry.fillColor,
          textStatus: statusEntry.textStatus,
        }
      }
      return {
        icon: 'default.svg',
        fillColor: '#868C89',
        textStatus: 'Unknown Status',
      }
    },
    showEstimation(milestone) {
      return (
        [
          newDataStatusMilestone.finished.textStatus,
          newDataStatusMilestone.followup.textStatus,
          newDataStatusMilestone.postponed.textStatus,
          newDataStatusMilestone.review.textStatus,
        ].includes(milestone.status) &&
        (milestone.start_date || milestone.end_date)
      )
    },
    showEvidence(milestone) {
      return [
        newDataStatusMilestone.postponed.textStatus,
        newDataStatusMilestone.review.textStatus,
        newDataStatusMilestone.finished.textStatus,
      ].includes(milestone.status)
    },
    showPic(milestone) {
      return [
        newDataStatusMilestone.finished.textStatus,
        newDataStatusMilestone.followup.textStatus,
        newDataStatusMilestone.postponed.textStatus,
        newDataStatusMilestone.review.textStatus,
      ].includes(milestone.status)
    },
    showIdSpanLapor(milestone) {
      return (
        milestone.status ===
          newDataStatusMilestone.diverted_to_span.textStatus &&
        milestone.sp4n_id
      )
    },
    showLogSpanLapor(milestone) {
      return (
        milestone?.sp4n_histories?.length > 0 &&
        milestone.status === newDataStatusMilestone.diverted_to_span.textStatus
      )
    },
    getEstimationPeriod(milestone) {
      const start = milestone.start_date || '-'
      const end = milestone.end_date || '-'
      return `${start} sampai ${end}`
    },
  },
}
</script>

<style>
.card-milestone {
  @apply p-2 bg-gray-50 border rounded-lg flex flex-col w-full dark:bg-dark-emphasis-medium;
}

.label-text {
  @apply text-blue-gray-300 dark:text-dark-text-low dark:text-opacity-60;
}

.detail-text {
  @apply text-blue-gray-800 dark:text-dark-text-high;
}

.text-milestone {
  @apply font-lato flex flex-col text-xs mt-2 gap-y-1;
}
</style>
