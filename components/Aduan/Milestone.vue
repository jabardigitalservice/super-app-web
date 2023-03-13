<template>
  <div class="w-full">
    <div
      v-for="(milestone, index) in dataMilestone"
      :key="milestone.status"
      class="flex mt-3"
    >
      <div class="flex flex-col items-center mr-4">
        <div
          class="flex items-center justify-center border w-[26px] h-[26px] bg-gray-50 rounded-lg -left-3 ring-8 ring-white"
        >
          <BaseIconSvg
            :icon="`/icon/${getStatusTextAndIcon(milestone.status).icon}`"
            class="!shadow-lg !w-[14px] !h-[14px]"
            :fill-color="
              index > 0
                ? '#BDBDBD'
                : `${getStatusTextAndIcon(milestone.status).fillColor}`
            "
          />
        </div>
        <div
          v-if="index !== dataMilestone.length - 1"
          class="w-px h-full bg-gray-300"
        />
      </div>
      <div class="w-full">
        <CardMilestone>
          <TextMilestone>
            <span class="text-gray-500 mb-1 text-[11px]">{{ milestone.date }} - {{ milestone.time }}</span>
            <span :class="index > 0 ? 'text-gray-400' : 'text-gray-600'">{{
              isWaiting(milestone.status)
            }}</span>
            <div>
              <span
                :class="index > 0 ? 'text-gray-500' : 'font-bold text-gray-900'"
              >{{ getStatusTextAndIcon(milestone.status).status }}</span>
              <span :class="index > 0 ? 'text-gray-400' : 'text-gray-800'">{{
                isCordination(milestone.status)
              }}</span>
              <span
                :class="index > 0 ? 'text-gray-500' : 'font-bold text-gray-900'"
              >{{ milestone.name }}</span>
            </div>
          </TextMilestone>

          <template v-if="isFollowUpOrDone(milestone.status)">
            <TextMilestone>
              <span :class="index > 0 ? 'text-gray-400' : 'text-gray-600'">Penanggung Jawab</span>

              <span :class="index > 0 ? 'text-gray-500' : 'text-gray-800'">Asep Kumaha</span>
            </TextMilestone>

            <TextMilestone>
              <span :class="index > 0 ? 'text-gray-400' : 'text-gray-600'">Estimasi Pengerjaan</span>

              <div>
                <span
                  :class="
                    index > 0 ? 'text-gray-500' : 'font-bold text-gray-800'
                  "
                >20 Des 2022</span>
                <span :class="index > 0 ? 'text-gray-400' : 'text-gray-800'">sampai</span>
                <span
                  :class="
                    index > 0 ? 'text-gray-500' : 'font-bold text-gray-800'
                  "
                >22 Des 2022</span>
              </div>
            </TextMilestone>
          </template>
        </CardMilestone>

        <CardMilestone
          v-if="isRejectedOrFollowUp(milestone.status)"
          class="mt-2"
        >
          <TextMilestone
            v-if="milestone.status === dataStatusMilestone.rejected.status"
          >
            <span :class="index > 0 ? 'text-gray-400' : 'text-gray-600'">
              Catatan</span>

            <span
              :class="index > 0 ? 'text-gray-500' : 'font-bold text-gray-900'"
            >Foto Kurang jelas, dan lokasi detail belum dilengkapi</span>
          </TextMilestone>

          <TextMilestone
            v-if="milestone.status === dataStatusMilestone.followUp.status"
          >
            <span :class="index > 0 ? 'text-gray-400' : 'text-gray-600'">
              Tanggapan</span>

            <span
              :class="index > 0 ? 'text-gray-500' : 'font-bold text-gray-900'"
            >Data diri kurang lengkap</span>
          </TextMilestone>
        </CardMilestone>

        <NuxtLink
          v-if="milestone.status === dataStatusMilestone.rejected.status && index === 0"
          to="/aduan-warga/redirect-aduan"
          class="w-full"
        >
          <BaseButton
            class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2"
          >
            Buat Aduan Baru
          </BaseButton>
        </NuxtLink>

        <BaseButton
          v-if="milestone.status === dataStatusMilestone.done.status && index === 0"
          class="text-[12px] font-lato text-white bg-green-700 hover:bg-green-600 w-full !px-3 !py-2 mt-2"
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
            fillColor: dataStatusMilestone.waiting.fillColor
          }
        case dataStatusMilestone.rejected.status:
          return {
            status: dataStatusMilestone.rejected.textStatus,
            icon: dataStatusMilestone.rejected.icon,
            fillColor: dataStatusMilestone.rejected.fillColor
          }
        case dataStatusMilestone.verification.status:
          return {
            status: dataStatusMilestone.verification.textStatus,
            icon: dataStatusMilestone.verification.icon,
            fillColor: dataStatusMilestone.verification.fillColor
          }
        case dataStatusMilestone.cordination.status:
          return {
            status: dataStatusMilestone.cordination.textStatus,
            icon: dataStatusMilestone.cordination.icon,
            fillColor: dataStatusMilestone.cordination.fillColor
          }
        case dataStatusMilestone.followUp.status:
          return {
            status: dataStatusMilestone.followUp.textStatus,
            icon: dataStatusMilestone.followUp.icon,
            fillColor: dataStatusMilestone.followUp.fillColor
          }
        case dataStatusMilestone.done.status:
          return {
            status: dataStatusMilestone.done.textStatus,
            icon: dataStatusMilestone.done.icon,
            fillColor: dataStatusMilestone.done.fillColor
          }
        case dataStatusMilestone.closed.status:
          return {
            status: dataStatusMilestone.closed.textStatus,
            icon: dataStatusMilestone.closed.icon,
            fillColor: dataStatusMilestone.closed.fillColor
          }
        default:
          return {
            status: '',
            icon: '',
            fillColor: ''
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
    },
    isWaiting (status) {
      if (status === dataStatusMilestone.waiting.status) {
        return 'Aduan Anda sedang'
      } else {
        return 'Aduan Anda telah'
      }
    },
    isCordination (status) {
      if (status === dataStatusMilestone.cordination.status) {
        return 'Ke'
      } else {
        return 'Oleh'
      }
    },
    openDialog () {
      this.$emit('open-dialog')
    }
  }
}
</script>
