<template>
  <details
    class="complaint-accordion bg-green-50 p-4 rounded-[18px] mt-2"
    v-bind="$attrs"
    :open="isOpen"
    v-on="$listeners"
  >
    <summary
      class="complaint-accordion__summary min-w-0 w-full flex justify-between"
      @click.prevent="toggleAccordion"
    >
      <h4
        class="complaint-accordion__title mr-4 font-roboto text-[12px] leading-[20px] font-bold text-green-700 cursor-pointer transition-colors ease-brand duration-200"
      >
        {{ title }}
      </h4>
      <div
        class="complaint-accordion__icon--background flex-shrink-0 w-6 h-6 flex items-center justify-center ml-auto self-center cursor-pointer"
      >
        <Icon
          name="chevron-down"
          size="18px"
          class="text-green-700 transition-transform duration-300"
          :class="{ 'transform rotate-180': isOpen }"
        />
      </div>
    </summary>

    <ol class="complaint-accordion__description list-none">
      <li
        v-for="(item, index) in logSpan"
        :key="index"
        class="font-lato font-normal text-[14px] leading-[20px] text-gray-800 grid grid-cols-[minmax(50px,min-content),1fr] gap-2 mb-2"
      >
        <div class="flex flex-col gap-2">
          <div class="w-4 h-4">
            <div
              :class="{
                'w-4 h-4 bg-green-600 rounded-full border-4 border-green-100 animate-pulse':
                  index === 0,
                'w-4 h-4 bg-gray-400 rounded-full border-4 border-gray-200':
                  index > 0,
              }"
            />
          </div>
          <div
            class="ml-2 border border-y-0 border-r-0 border-solid h-full sm:min-h-[70px] border-gray-300"
            :class="{
              hidden: index === logSpan.length - 1,
            }"
          />
        </div>

        <div>
          <p class="text-helper">
            {{
              item.tracking_at
                ? formatDate(item.tracking_at, 'EEEE, dd MMMM yyyy - HH:mm')
                : '-'
            }}
          </p>
          <p class="text-detail">
            {{ item.tracking_by || '-' }}
          </p>
          <p class="text-helper">Keterangan</p>
          <div class="text-detail" v-html="formattedNote(item.tracking_note)" />
        </div>
      </li>
    </ol>
  </details>
</template>

<script>
import { formatDate } from '~/utils'

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    logSpan: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isOpen: true,
    }
  },

  methods: {
    formatDate,
    toggleAccordion() {
      this.isOpen = !this.isOpen
    },
    formattedNote(trackingNote) {
      if (!trackingNote) return '-'

      return trackingNote
        .replace(/\r\n/g, '<br>')
        .replace(/\n/g, '<br>')
        .replace(/\r/g, '<br>')
    },
  },
}
</script>

<style scoped>
.complaint-accordion__summary::-webkit-details-marker {
  display: none;
}

@keyframes details-show {
  from {
    opacity: 0;
    transform: translateY(-0.5em);
  }
}

.complaint-accordion[open] > *:not(summary) {
  animation: details-show 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.text-helper {
  @apply font-lato text-[11px] leading-[20px] text-blue-gray-300;
}

.text-detail {
  @apply font-lato text-[12px] leading-[18px] text-blue-gray-800;
}
</style>
