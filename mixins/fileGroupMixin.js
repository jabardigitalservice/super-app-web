
export const fileGroupMixin = {
  data () {
    return {
      grupByTypeFile: {
        images: { data: [], icon: '/icon/type-images.png' },
        xlsx: { data: [], icon: '/icon/type-xls.png' },
        pdf: { data: [], icon: '/icon/type-pdf.png' },
        documents: { data: [], icon: '/icon/type-doc.png' }
      }
    }
  },
  methods: {
    groupingFileByExtension (fileArray) {
      fileArray.forEach((url) => {
        const extension = this.getExtensionFileByUrl(url)
        switch (extension.toLowerCase()) {
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
    }
  }
}
