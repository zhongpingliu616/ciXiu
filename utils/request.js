const BASE_URL = import.meta.env.APP_BASE_URL || ''

function request(options) {
  const {
    url,
    data = {},
    method = 'GET',
    header = {},
    showLoading = true
  } = options

  showLoading && uni.showLoading({ title: '加载中' })

  const token = uni.getStorageSync('tokenXn')

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      data,
      method,
      timeout: 10000,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: token } : {}),
        ...header
      },

      success(res) {
        const { statusCode, data } = res

        /** HTTP 层错误 */
        if (statusCode !== 200) {
          uni.showToast({
            title: '服务器异常',
            icon: 'none'
          })
          reject(res)
          return
        }

        /** 业务层约定（按你后端改） */
        if (data.code === 401) {
          // 登录失效
          uni.removeStorageSync('token')
          uni.showToast({
            title: '登录已过期',
            icon: 'none'
          })

          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/my/login'
            })
          }, 500)

          reject(data)
          return
        }

        if (data.code !== 0) {
          uni.showToast({
            title: data.message || '请求失败',
            icon: 'none'
          })
          reject(data)
          return
        }

        resolve(data.data)
      },

      fail(err) {
        uni.showToast({
          title: '网络异常',
          icon: 'none'
        })
        reject(err)
      },

      complete() {
        showLoading && uni.hideLoading()
      }
    })
  })
}

/** 方法封装 */
export const get = (url, data, options = {}) =>
  request({ url, data, method: 'GET', ...options })

export const post = (url, data, options = {}) =>
  request({ url, data, method: 'POST', ...options })

export default request
