<template>
  <div class="w-full min-h-[400px] overflow-y-auto">
    <div v-for="(group, groupName) in grupByTypeFile" :key="groupName">
      <template v-if="groupName === 'images' && group.data.length > 0">
        <ButtonDokumenBukti
          type-file="image"
          @go-to-page="emitAllImages(group.data)"
        >
          <div class="flex items-center">
            <div>
              <BaseIconSvg
                :icon="group.icon"
                class="!shadow-lg !w-[24.458px] !h-[32px] mr-3"
                mode="image"
              />
            </div>
            <span
              class="font-lato text-[14px] font-normal leading-5 text-gray-800 dark:text-dark-text-high mr-3"
              >Gambar
            </span>

            <span
              class="text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full font-roboto leading-[18px] dark:text-dark-text-high text-gray-800 dark:bg-dark-emphasis-medium bg-gray-100"
              >{{ group.data.length }} Terlampir</span
            >
          </div>
        </ButtonDokumenBukti>
      </template>
      <template v-else>
        <ButtonDokumenBukti
          v-for="(url, index) in group.data"
          :key="index"
          type-file="file"
          @go-to-page="gotPageFile(url)"
        >
          <div class="flex items-center">
            <div>
              <BaseIconSvg
                :icon="group.icon"
                class="!shadow-lg !w-[24.458px] !h-[32px] mr-3"
                mode="image"
              />
            </div>
            <div
              class="font-lato text-[14px] font-normal leading-5 text-gray-800 truncate dark:text-dark-text-high mr-3"
            >
              {{ getLastSegment(url) }}
            </div>
          </div>
        </ButtonDokumenBukti>
      </template>
    </div>
  </div>
</template>

<script>
import ButtonDokumenBukti from '~/components/Aduan/ButtonDokumenBukti'
import { fileGroupMixin } from '~/mixins/fileGroupMixin'
import { getExtensionFileByUrl } from '~/utils'

export default {
  components: {
    ButtonDokumenBukti,
  },
  mixins: [fileGroupMixin],
  props: {
    fileDokumenBukti: {
      type: Array,
      default: () => [],
    },
  },

  watch: {
    fileDokumenBukti: {
      immediate: true,
      handler(newValue) {
        this.groupingFileByExtension(newValue)
      },
    },
  },
  methods: {
    getExtensionFileByUrl,
    getLastSegment(url) {
      const segments = url.split('/')
      return segments[segments.length - 1]
    },
    gotPageFile(file) {
      window.open(file, '_blank')
    },
    emitAllImages(file) {
      this.$emit('show-file', file)
    },
  },
}
</script>
