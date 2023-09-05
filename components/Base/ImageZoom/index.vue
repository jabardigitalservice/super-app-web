<template>
  <div
    class="bg-white w-full h-full p-4 flex flex-col justify-center items-center sm:w-[360px] sm:h-[515px] sm:rounded-lg dark:bg-black gap-[22px] mt-auto"
  >
    <img
      :src="src"
      :style="zoomStyles"
      class="transition-transform duration-300 transform shadow rounded max-w-full h-auto align-middle border-none"
    >

    <div
      class="fixed bottom-8 mx-auto flex flex-row py-[7px] px-[12px] gap-[24px] bg-green-600 rounded-[38px] shadow-md"
    >
      <button
        class="text-white flex justify-center items-center"
        @click="zoomOut"
      >
        <BaseIconSvg
          icon="/icon/zoom-out.svg"
          class="!shadow-lg !w-[32px] !h-[32px]"
          fill-color="#FFFFFF"
        />
      </button>
      <div class="absolute left-1/2 -ml-0.5 h-[32px] w-[1px] bg-green-500" />
      <button
        class="text-white flex justify-center items-center"
        @click="zoomIn"
      >
        <BaseIconSvg
          icon="/icon/zoom-in.svg"
          class="!shadow-lg !w-[32px] !h-[32px]"
          fill-color="#FFFFFF"
        />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BaseImageZoom',
  props: {
    src: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      zoomLevel: 1
    }
  },

  computed: {
    zoomStyles () {
      return {
        transform: `scale(${this.zoomLevel})`
      }
    }
  },

  methods: {
    zoomIn () {
      this.zoomLevel += 0.1 // Anda bisa menyesuaikan nilai ini sesuai kebutuhan
    },
    zoomOut () {
      if (this.zoomLevel > 0.2) {
        // batasi zoom out agar gambar tidak terlalu kecil
        this.zoomLevel -= 0.1 // Anda bisa menyesuaikan nilai ini sesuai kebutuhan
      }
    }
  }
}
</script>
