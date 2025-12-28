const BASE_URL = import.meta.env.APP_BASE_URL || ''

export function uploadFile({
  url,
  filePath,
  name = 'file',
  formData = {},
  header = {}
}) {
  const token = uni.getStorageSync('token')

  uni.showLoading({ title: '上传中...' })

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: BASE_URL + url,
      filePath,
      name,
      formData,
      header: {
        ...(token ? { Authorization: token } : {}),
        ...header
      },
      success(res) {
        let data = res.data

        // H5 下返回的是字符串
        if (typeof data === 'string') {
          data = JSON.parse(data)
        }

        if (data.code !== 0) {
          uni.showToast({
            title: data.message || '上传失败',
            icon: 'none'
          })
          reject(data)
          return
        }

        resolve(data.data)
      },
      fail(err) {
        uni.showToast({
          title: '上传失败',
          icon: 'none'
        })
        reject(err)
      },
      complete() {
        uni.hideLoading()
      }
    })
  })
}

// 使用示例
// import { uploadFile } from '@/utils/upload'

// const chooseAndUpload = async () => {
//   const res = await uni.chooseImage({
//     count: 1
//   })

//   const filePath = res.tempFilePaths[0]

//   const url = await uploadFile({
//     url: '/upload/image',
//     filePath
//   })

//   console.log('上传成功地址：', url)
// }