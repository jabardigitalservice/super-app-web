<template>
  <ol class="relative border-l border-gray-200 ml-4">
    <li
      v-for="milestone in dataMilestone"
      :key="milestone.status"
      class="mb-3 ml-6"
    >
      <span
        class="absolute flex items-center justify-center w-[26px] h-[26px] bg-gray-50 rounded-lg -left-3 ring-8 ring-white"
      >
        <BaseIconSvg
          :icon="`/icon/${getStatusTextAndIcon(milestone.status).icon}`"
          class="!shadow-lg !w-[14px] !h-[14px]"
          :fill-color="getStatusTextAndIcon(milestone.status).fillColor"
        />
      </span>

      <CardMilestone>
        <TextMilestone>
          <template #date-time>
            {{ milestone.date }} - {{ milestone.time }}
          </template>

          <template #information>
            {{ getStatusTextAndIcon(milestone.status).conditionAduan }}
          </template>

          <template #status>
            <b>{{ getStatusTextAndIcon(milestone.status).status }}</b>
            <span class="text-gray-800">oleh</span>
            <b>{{ milestone.name }}</b>
          </template>
        </TextMilestone>

        <template v-if="isFollowUpOrDone(milestone.status)">
          <TextMilestone>
            <template #information>
              Penanggung Jawab
            </template>

            <template #status>
              Asep Kumaha
            </template>
          </TextMilestone>

          <TextMilestone>
            <template #information>
              Estimasi Pengerjaan
            </template>

            <template #status>
              <b>20 Des 2022</b>
              <span class="text-gray-800">sampai</span>
              <b>22 Des 2022</b>
            </template>
          </TextMilestone>
        </template>
      </CardMilestone>

      <CardMilestone v-if="isRejectedOrFollowUp(milestone.status)" class="mt-2">
        <TextMilestone
          v-if="milestone.status === dataStatusMilestone.rejected.status"
        >
          <template #information>
            Catatan
          </template>

          <template #status>
            Foto Kurang jelas, dan lokasi detail belum dilengkapi
          </template>
        </TextMilestone>

        <TextMilestone
          v-if="milestone.status === dataStatusMilestone.followUp.status"
        >
          <template #information>
            Tanggapan
          </template>

          <template #status>
            Data diri kurang lengkap
          </template>
        </TextMilestone>
      </CardMilestone>

      <!--  this dummy slicing, i want fixit if API ready -->

      <NuxtLink
        v-if="milestone.status === dataStatusMilestone.rejected.status"
        to="/aduan-warga/redirect-aduan"
        class="w-full"
      >
        <BaseButton
          class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2"
        >
          Buat Aduan Baru
        </BaseButton>
      </NuxtLink>

      <NuxtLink
        v-if="milestone.status === dataStatusMilestone.done.status"
        to="/aduan-warga/redirect-aduan"
        class="w-full"
      >
        <BaseButton
          class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2"
        >
          Apakah penyelesaian ini membantu?
        </BaseButton>
      </NuxtLink>

      <!--  this dummy slicing, i want fixit if API ready -->
    </li>
  </ol>
</template>

<script>
import CardMilestone from './CardMilestone.vue'
import TextMilestone from './TextMilestone.vue'
import { dataStatusMilestone } from '~/constant/status-milestone'

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
    getStatusTextAndIcon (status) {
      switch (status) {
        case dataStatusMilestone.waiting.status:
          return {
            status: dataStatusMilestone.waiting.textStatus,
            icon: dataStatusMilestone.waiting.icon,
            fillColor: dataStatusMilestone.waiting.fillColor,
            conditionAduan: dataStatusMilestone.waiting.conditionAduan
          }
        case dataStatusMilestone.rejected.status:
          return {
            status: dataStatusMilestone.rejected.textStatus,
            icon: dataStatusMilestone.rejected.icon,
            fillColor: dataStatusMilestone.rejected.fillColor,
            conditionAduan: dataStatusMilestone.rejected.conditionAduan
          }
        case dataStatusMilestone.verification.status:
          return {
            status: dataStatusMilestone.verification.textStatus,
            icon: dataStatusMilestone.verification.icon,
            fillColor: dataStatusMilestone.verification.fillColor,
            conditionAduan: dataStatusMilestone.verification.conditionAduan
          }
        case dataStatusMilestone.cordination.status:
          return {
            status: dataStatusMilestone.cordination.textStatus,
            icon: dataStatusMilestone.cordination.icon,
            fillColor: dataStatusMilestone.cordination.fillColor,
            conditionAduan: dataStatusMilestone.cordination.conditionAduan
          }
        case dataStatusMilestone.followUp.status:
          return {
            status: dataStatusMilestone.followUp.textStatus,
            icon: dataStatusMilestone.followUp.icon,
            fillColor: dataStatusMilestone.followUp.fillColor,
            conditionAduan: dataStatusMilestone.followUp.conditionAduan
          }
        case dataStatusMilestone.done.status:
          return {
            status: dataStatusMilestone.done.textStatus,
            icon: dataStatusMilestone.done.icon,
            fillColor: dataStatusMilestone.done.fillColor,
            conditionAduan: dataStatusMilestone.done.conditionAduan
          }
        case dataStatusMilestone.closed.status:
          return {
            status: dataStatusMilestone.closed.textStatus,
            icon: dataStatusMilestone.closed.icon,
            fillColor: dataStatusMilestone.closed.fillColor,
            conditionAduan: dataStatusMilestone.closed.conditionAduan
          }
        default:
          return {
            status: '',
            icon: '',
            fillColor: '',
            conditionAduan: ''
          }
      }
    },
    isRejectedOrFollowUp (status) {
      return (
        status === dataStatusMilestone.rejected.status ||
        status === dataStatusMilestone.followUp.status
      )
    },
    isFollowUpOrDone (status) {
      return (
        status === dataStatusMilestone.followUp.status ||
        status === dataStatusMilestone.done.status
      )
    }
  }
}
</script>
