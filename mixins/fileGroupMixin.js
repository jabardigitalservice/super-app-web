export const fileGroupMixin = {
  data() {
    return {
      grupByTypeFile: {
        images: { data: [], icon: '/icon/file-image.svg' },
        xlsx: { data: [], icon: '/icon/file-excel.svg' },
        pdf: { data: [], icon: '/icon/file-pdf.svg' },
        documents: { data: [], icon: '/icon/file-doc.svg' },
        powerpoint: { data: [], icon: '/icon/file-ppt.svg' },
      },
    }
  },
  methods: {
    groupingFileByExtension(fileArray) {
      this.resetDataFile()
      fileArray.forEach((url) => {
        const extension = this.getExtensionFileByUrl(url)
        switch (extension.toLowerCase()) {
          case 'jpg':
          case 'jpeg':
          case 'png':
            this.grupByTypeFile.images.data.push(url)
            break
          case 'xlsx':
          case 'xls':
            this.grupByTypeFile.xlsx.data.push(url)
            break
          case 'pdf':
            this.grupByTypeFile.pdf.data.push(url)
            break
          case 'doc':
          case 'docx':
            this.grupByTypeFile.documents.data.push(url)
            break
          case 'ppt':
          case 'pptx':
            this.grupByTypeFile.powerpoint.data.push(url)
            break
          default:
            break
        }
      })
    },
    resetDataFile() {
      Object.keys(this.grupByTypeFile).forEach((typeFile) => {
        this.grupByTypeFile[typeFile].data = []
      })
    },
  },
}
