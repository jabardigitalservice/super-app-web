<template>
  <details class="border-b-2 border-[#FAFAFA] dark:border-[#1F2121]">
    <summary>
      <div class="flex justify-between items-center py-[22px] md:px-0">
        <div class="truncate overflow-hidden min-w-0 flex-1 text-[Roboto] text-[18px] font-semibold text-gray-800 dark:text-[#AAB0B7]">
          {{ title }}
        </div>
        <div class="flex-shrink-0 arrow ml-2">
          <ArrowCircle class="w-[28px] h-[28px]" />
        </div>
      </div>
    </summary>
    <!-- eslint-disable vue/no-v-html -->
    <div class="text-[14px] font-[Lato] mb-5" v-html="description" />
  </details>
</template>

<script>
import ArrowCircle from '~/assets/icon/arrow-circle.svg?inline'
export default {
  name: 'AccordionDetail',
  components: {
    ArrowCircle
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  },
  mounted () {
    // Fetch all the details element.
    const accordionDetail = document.querySelectorAll('details')
    // Add the onclick listeners.
    accordionDetail.forEach((targetDetail) => {
      targetDetail.addEventListener('click', () => {
        // Close all the details that are not targetDetail.
        accordionDetail.forEach((detail) => {
          if (detail !== targetDetail) {
            detail.removeAttribute('open')
          }
        })
      })
    })
  }
}
</script>

<style scoped>

  details summary{
    padding: 0 16px;
  }

  details summary::marker {
   content:"";
  }

  .arrow{
    transform: rotate(-90deg);
  }

  .arrow svg rect{
    fill:#FAFAFA;
    stroke: #EEEEEE;
  }

  .arrow svg line{
    stroke: #757575;
  }

  details[open] {
    background-color: #FAFAFA;
    border-left: 2px solid #16A75C;
    padding: 0 16px;
  }

  details[open] summary{
    padding: 0px;
  }

  @media (prefers-color-scheme: dark) {
    details[open] {
    background-color: #1F2121;
  }
  .arrow svg rect{
    fill:#1F2121;
    stroke: #292C2A;
  }

  .arrow svg line{
    stroke: #AAB0B7;
  }
}

  details[open] > summary div {
    color: #069550;
    font-weight: 700;
  }
  details[open] > summary .arrow {
    transform: rotate(0deg);
    transition: 0.4s;
  }

  details[open] > summary .arrow svg line {
    stroke:white;
  }
  details[open] > summary .arrow svg rect {
    fill: #16A75C;
  }

</style>
