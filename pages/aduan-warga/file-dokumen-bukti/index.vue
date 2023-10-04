<template>
  <div class="h-screen bg-white dark:bg-dark-emphasis-low">
    <div class="w-full h-full">
      <h2>File Dokumen Bukti</h2>
      <div v-for="(group, groupName) in grupByTypeFile" :key="groupName">
        <h3>{{ groupName }}</h3>
        <ul>
          <li v-for="(url,index) in group" :key="index">
            {{ url }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileDokumenBukti',
  data () {
    return {
      dummyFile: [
        'http://101.50.0.202:12002/trk/img/lim/Book1.xlsx',
        'http://101.50.0.202:12002/trk/img/lim/Book1.xlsx',
        'http://101.50.0.202:12002/trk/img/lim/Book1.xlsx',
        'https://www.jotform.com/uploads/JDS_Digital/230227877098062/5714318406876661727/yankes.JPG',
        'https://www.jotform.com/uploads/JDS_Digital/230227877098062/5715109954421580499/Screenshot 2023-09-25 145359.png',
        'https://www.jotform.com/uploads/JDS_Digital/230227877098062/5715120784429903272/Screenshot 2023-09-25 145340.png',
        'https://www.jotform.com/uploads/JDS_Digital/230227877098062/5597927940986221505/7065e0fc-ff5a-499d-86f6-b420d024c959.jpeg',
        'blob:https://superapp-admin.staging.digitalservice.id/d4566661-0642-4cf4-bc51-5c1b61d8a7c1.pdf',
        'blob:https://superapp-admin.staging.digitalservice.id/d4566661-0642-4cf4-bc51-5c1b61d8a7c1.pdf'
      ],
      grupByTypeFile: {
        images: { data: [], icon: '' },
        xlsx: { data: [], icon: '' },
        pdf: { data: [], icon: '' },
        documents: { data: [], icon: '' }
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
      console.log(url)
      const extension = this.fileExtension(url)
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
          this.grupByTypeFile.images.push(url)
          break
        case 'xlsx':
          this.grupByTypeFile.xlsx.push(url)
          break
        case 'pdf':
          this.grupByTypeFile.pdf.push(url)
          break
        case 'doc':
        case 'docx':
          this.grupByTypeFile.documents.push(url)
          break
        default:
          break
      }
    })
  },
  methods: {
    fileExtension (url) {
      console.log(url)
      const parts = url.split('.')
      return parts[parts.length - 1]
    }
  }
}
</script>
