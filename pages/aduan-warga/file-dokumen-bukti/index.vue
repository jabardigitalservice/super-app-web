<template>
  <div class="h-screen bg-white dark:bg-dark-emphasis-low">
    <div class="w-full h-full">
      <div v-for="(group, groupName) in grupByTypeFile" :key="groupName">
        <template v-if="groupName === 'images'">
          <ButtonDokumenBukti @go-to-page="gotPageFile(group.data,'images')">
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

              <div
                class="dark:bg-dark-emphasis-medium bg-gray-100 flex px-5.5 flex-col items-center gap-10 rounded-xl"
              >
                <span
                  class="text-[12px] font-roboto font-medium leading-[18px] dark:text-dark-text-high text-gray-800 p-1"
                >{{ group.data.length }} Terlampir</span>
              </div>
            </div>
          </ButtonDokumenBukti>
        </template>
        <template v-else>
          <ButtonDokumenBukti
            v-for="(url, index) in group.data"
            :key="index"
            @go-to-page="gotPageFile(url,'file')"
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
                class="font-lato text-[14px] font-normal leading-5 text-gray-800"
              >{{ getLastSegment(url) }}</span>
            </div>
          </ButtonDokumenBukti>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonDokumenBukti from '~/components/Aduan/ButtonDokumenBukti'
export default {
  name: 'FileDokumenBukti',
  components: {
    ButtonDokumenBukti
  },

  data () {
    return {
      dummyFile: [
        'http://101.50.0.202:12002/trk/img/lim/Book1.xlsx',
        'http://101.50.0.202:12002/trk/img/lim/Book1.xlsx',
        'http://101.50.0.202:12002/trk/img/lim/Book1.doc',
        'https://www.jotform.com/uploads/JDS_Digital/230227877098062/5714318406876661727/yankes.JPG',
        'https://www.jotform.com/uploads/JDS_Digital/230227877098062/5715109954421580499/Screenshot 2023-09-25 145359.png',
        'https://www.jotform.com/uploads/JDS_Digital/230227877098062/5715120784429903272/Screenshot 2023-09-25 145340.png',
        'https://www.jotform.com/uploads/JDS_Digital/230227877098062/5597927940986221505/7065e0fc-ff5a-499d-86f6-b420d024c959.jpeg',
        'https://www.africau.edu/images/default/sample.pdf',
        'https://www.africau.edu/images/default/sample.pdf'
      ],
      grupByTypeFile: {
        images: { data: [], icon: '/icon/type-images.png' },
        xlsx: { data: [], icon: '/icon/type-xls.png' },
        pdf: { data: [], icon: '/icon/type-pdf.png' },
        documents: { data: [], icon: '/icon/type-doc.png' }
      }
    }
  },
  head () {
    return {
      title: 'File Dokumen Bukti'
    }
  },
  mounted () {
    this.dummyFile.forEach((url) => {
      const extension = this.fileExtension(url)
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
          this.grupByTypeFile.images.data.push(url)
          break
        case 'xlsx':
          this.grupByTypeFile.xlsx.data.push(url)
          break
        case 'pdf':
          this.grupByTypeFile.pdf.data.push(url)
          break
        case 'doc':
        case 'docx':
          this.grupByTypeFile.documents.data.push(url)
          break
        default:
          break
      }
    })
  },
  methods: {
    fileExtension (url) {
      const parts = url.split('.')
      return parts[parts.length - 1]
    },
    getLastSegment (url) {
      const segments = url.split('/')
      return segments[segments.length - 1]
    },
    gotPageFile (file, type) {
      if (type === 'images') {
        this.$store.commit('setFileAduan', file)
        this.$router.push('/aduan-warga/file-aduan/images')
      } else if (this.fileExtension(file) === 'pdf') {
        this.$store.commit('setFileAduan', file)
        this.$router.push('/aduan-warga/file-aduan/files')
      } else {
        window.location.href = file
      }
    }
  }
}
</script>
