<template>
  <div class="h-full bg-white dark:bg-dark-emphasis-low">
    <BaseButtonBack />
    <div class="w-full h-screen">
      <div v-for="(group, groupName) in grupByTypeFile" :key="groupName">
        <template v-if="groupName === 'images' && group.data.length > 0">
          <ButtonDokumenBukti
            type-file="image"
            @go-to-page="gotPageFile(group.data, 'images')"
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
            @go-to-page="gotPageFile(url, 'file')"
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
  </div>
</template>

<script>
import ButtonDokumenBukti from '~/components/Aduan/ButtonDokumenBukti'
import { fileGroupMixin } from '~/mixins/fileGroupMixin'
import { getExtensionFileByUrl } from '~/utils'
export default {
  name: 'PageDokumenBukti',
  components: {
    ButtonDokumenBukti,
  },
  mixins: [fileGroupMixin],
  head() {
    return {
      title: 'File Dokumen Bukti',
    }
  },
  mounted() {
    this.groupingFileByExtension(this.$store.state.fileDokumenBukti)
  },
  methods: {
    getExtensionFileByUrl,
    getLastSegment(url) {
      const segments = url.split('/')
      return segments[segments.length - 1]
    },
    gotPageFile(file, type) {
      if (type === 'images') {
        this.$store.commit('setFileAduan', file)
        this.$router.push({
          path: `/aduan-warga/file-aduan/${type}`,
          query: this.$route.query,
        })
      } else {
        window.open(file, '_blank')
      }
    },
  },
}
</script>
