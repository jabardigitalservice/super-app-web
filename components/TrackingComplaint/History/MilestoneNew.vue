<template>
  <div class="w-full">
    <div v-for="(milestone, index) in dataMilestone" :key="`history-${index}`">
      <div
        class="flex flex-row md:grid md:grid-cols-[minmax(30px,max-content),minmax(30px,min-content),1fr] gap-2 mt-3"
      >
        <div class="w-[150px] mr-3 md:flex hidden">
          <span
            class="font-lato text-xs text-blue-gray-300 dark:text-dark-text-low"
          >
            {{ formatDate(milestone?.date, 'dd MMMM yyyy - HH:mm') }}
          </span>
        </div>

        <div class="flex flex-col items-center">
          <div
            class="mt-1 flex items-center justify-center border dark:border-dark-emphasis-medium w-[26px] h-[26px] bg-gray-50 rounded-lg dark:bg-dark-emphasis-medium"
          >
            <BaseIconSvg
              :icon="`/icon/${getIconAndFillColor(milestone?.status).icon}`"
              class="!shadow-lg !w-[14px] !h-[14px]"
              :fill-color="
                index > 0
                  ? '#868C89'
                  : getIconAndFillColor(milestone?.status).fillColor
              "
            />
          </div>

          <div
            v-show="index !== dataMilestone.length - 1"
            class="w-px h-full bg-gray-300 dark:bg-dark-emphasis-medium"
          />
        </div>

        <div class="w-full mt-1">
          <span
            class="font-lato text-xs text-blue-gray-300 dark:text-dark-text-low float-right mb-2 md:hidden"
          >
            {{ formatDate(milestone?.date, 'dd MMMM yyyy - HH:mm') }}
          </span>
          <div class="card-milestone">
            <div class="text-milestone">
              <p class="label-text">
                {{ getHelperText(milestone?.status) }}
              </p>
              <p class="detail-text flex flex-col md:flex-row gap-x-1">
                <span>{{ milestone?.status }}</span>
                <span class="label-text">
                  {{ getVerbText(milestone?.status) }}</span
                >
                <span>{{ milestone?.pic }}</span>
              </p>
            </div>

            <div v-show="showPic(milestone)" class="text-milestone">
              <p class="label-text">Penanggung Jawab</p>
              <p class="detail-text">{{ milestone?.pic_name }}</p>
            </div>

            <div v-show="showEstimation(milestone)" class="text-milestone">
              <p class="label-text">Estimasi Pengerjaan</p>
              <p class="detail-text">
                {{ getEstimationPeriod(milestone) }}
              </p>
            </div>
          </div>

          <div v-show="milestone?.note" class="card-milestone mt-2">
            <div class="text-milestone">
              <p class="label-text">Keterangan</p>
              <p class="detail-text">{{ milestone?.note }}</p>
            </div>
          </div>

          <div v-show="showIdSpanLapor(milestone)" class="card-milestone mt-2">
            <div class="text-milestone">
              <p class="label-text">ID Tracking SP4N LAPOR</p>
              <p class="detail-text">{{ milestone?.sp4n_id }}</p>
            </div>
          </div>

          <TrackingComplaintAccordion
            v-show="showLogSpanLapor(milestone)"
            title="Lihat Semua Status"
            :log-span="milestone?.sp4n_histories"
          />

          <BaseButton
            v-show="showEvidence(milestone)"
            class="text-xs font-bold text-white mt-2 dark:border-0 bg-green-700 hover:bg-green-600 !p-2"
            @click="openModalEvidence(milestone?.evidences)"
          >
            <BaseIconSvg
              icon="/icon/image-and-document.svg"
              class="!w-3 !h-3"
              fill-color="#FFFFFF"
            />
            Dokumen Bukti
          </BaseButton>
          <BaseButton
            v-show="showFormComplaint(milestone)"
            class="text-xs font-bold text-white mt-2 dark:border-0 bg-green-700 hover:bg-green-600 !p-2"
            @click="goToForm()"
            >Buat Aduan Baru</BaseButton
          >
        </div>
      </div>
    </div>

    <BaseModal :is-open="isOpen" @close="isOpen = false">
      <template #header>
        <h4 class="font-bold text-[21px] leading-[34px] text-green-700">
          Dokumen Bukti
        </h4>
      </template>
      <template #content>
        <TrackingComplaintHistoryFileBukti
          :file-dokumen-bukti="evidencesFile"
          @show-file="openModalImages"
        />
      </template>
    </BaseModal>

    <BaseModal
      :is-open="isOpenImage"
      height="600px"
      width="900px"
      @close="isOpenImage = false"
    >
      <template #header>
        <h4 class="font-bold text-[21px] leading-[34px] text-green-700">
          Dokumen File Gambar
        </h4>
      </template>
      <template #content>
        <BaseImageSwiper :src="fileImages" />
      </template>
    </BaseModal>
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
      isOpen: false,
      isOpenImage: false,
      evidencesFile: [],
      fileImages: [],
    }
  },
  methods: {
    formatDate,
    getIconAndFillColor(textStatus) {
      textStatus = textStatus === 'Ditunda' ? 'Pengerjaan Ditunda' : textStatus
      const statusEntry = Object.values(newDataStatusMilestone).find(
        (status) => status.name === textStatus
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
    showFormComplaint(milestone) {
      return [
        newDataStatusMilestone.failed.name,
        newDataStatusMilestone.rejected.name,
      ].includes(this.getComplaintStatus(milestone?.status))
    },
    showEstimation(milestone) {
      return (
        [
          newDataStatusMilestone.finished.name,
          newDataStatusMilestone.followup.name,
          newDataStatusMilestone.postponed.name,
          newDataStatusMilestone.review.name,
        ].includes(this.getComplaintStatus(milestone?.status)) &&
        (milestone?.start_date || milestone?.end_date)
      )
    },
    showEvidence(milestone) {
      return (
        [
          newDataStatusMilestone.postponed.name,
          newDataStatusMilestone.review.name,
          newDataStatusMilestone.finished.name,
        ].includes(this.getComplaintStatus(milestone?.status)) &&
        milestone?.evidences?.length > 0
      )
    },
    showPic(milestone) {
      return [
        newDataStatusMilestone.finished.name,
        newDataStatusMilestone.followup.name,
        newDataStatusMilestone.postponed.name,
        newDataStatusMilestone.review.name,
      ].includes(this.getComplaintStatus(milestone?.status))
    },
    showIdSpanLapor(milestone) {
      return (
        milestone?.status ===
          newDataStatusMilestone.diverted_to_span.textStatus &&
        milestone?.sp4n_id
      )
    },
    showLogSpanLapor(milestone) {
      return (
        milestone?.sp4n_histories?.length > 0 &&
        milestone?.status === newDataStatusMilestone.diverted_to_span.textStatus
      )
    },
    getComplaintStatus(status) {
      return status === 'Ditunda' ? 'Pengerjaan Ditunda' : status
    },
    getEstimationPeriod(milestone) {
      const start = formatDate(milestone?.start_date, 'dd MMM yyyy')
      const end = formatDate(milestone?.end_date, 'dd MMM yyyy')
      return `${start} sampai ${end}`
    },
    openModalEvidence(evidences) {
      this.isOpen = true
      this.evidencesFile = evidences
    },
    openModalImages(images) {
      this.isOpenImage = true
      this.fileImages = images
    },
    getHelperText(status) {
      return [
        newDataStatusMilestone.unverified.name,
        newDataStatusMilestone.followup.name,
      ].includes(this.getComplaintStatus(status))
        ? 'Aduan Anda sedang'
        : 'Aduan Anda telah'
    },
    getVerbText(status) {
      return [newDataStatusMilestone.coordinated.name].includes(
        this.getComplaintStatus(status)
      )
        ? 'ke'
        : 'oleh'
    },
    goToForm() {
      window.open(
        `${this.$config.urlPortalJabar}/aduan-warga/new/buat-aduan`,
        '_blank'
      )
    },
  },
}
</script>

<style scoped>
.card-milestone {
  @apply p-2 bg-gray-50 border rounded-lg flex flex-col w-full dark:bg-dark-emphasis-medium dark:border-dark-emphasis-medium;
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
