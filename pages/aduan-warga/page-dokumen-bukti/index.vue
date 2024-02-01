<template>
  <div class="h-screen bg-white dark:bg-dark-emphasis-low">
    <BaseButtonBack />
    <div class="w-full h-full">
      <div v-for="(group, groupName) in grupByTypeFile" :key="groupName">
        <template v-if="groupName === 'images' && group.data.length > 0">
          <ButtonDokumenBukti @go-to-page="gotPageFile(group.data, 'images')">
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
              >{{ group.data.length }} Terlampir</span>
            </div>
          </ButtonDokumenBukti>
        </template>
        <template v-else>
          <ButtonDokumenBukti
            v-for="(url, index) in group.data"
            :key="index"
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
                class="font-lato text-[14px] font-normal leading-5 text-gray-800 truncate"
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
import { getExtensionFileByUrl } from '~/utils'
import { fileGroupMixin } from '~/mixins/fileGroupMixin'
export default {
  name: 'PageDokumenBukti',
  components: {
    ButtonDokumenBukti
  },
  mixins: [fileGroupMixin],
  head () {
    return {
      title: 'File Dokumen Bukti'
    }
  },
  mounted () {
    this.groupingFileByExtension(this.$store.state.fileDokumenBukti)
  },
  methods: {
    getExtensionFileByUrl,
    getLastSegment (url) {
      const segments = url.split('/')
      return segments[segments.length - 1]
    },
    gotPageFile (file, type) {
      if (type === 'images' || this.getExtensionFileByUrl(file) === 'pdf') {
        this.$store.commit('setFileAduan', file)
        this.$router.push(`/aduan-warga/file-aduan/${type}`)
      } else {
        window.location.href = file
      }
    }
  }
}
</script>
