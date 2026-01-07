const BASE_URL = import.meta.env.VITE_APP_BASE_URL || ''
console.log("当前环境",import.meta.env.VITE_APP_BASE_URL)
import { useLoginStore } from '@/stores/userLogin'

function request(options) {
  const {
    url,
    data = {},
    method = 'GET',
    header = {},
    showLoading = true
  } = options

  showLoading && uni.showLoading({ title: '加载中' })

  // 获取 store 实例
  // 注意：在非组件中使用 store，需要确保 pinia 已经安装，通常在 request 调用时 pinia 已就绪
  const userStore = useLoginStore()
  
  // 根据 currentRole 动态获取 token
  // 如果 currentRole 是 'XN'，取 userInfoXn.token
  // 如果 currentRole 是 'GZ'，取 userInfoGz.token
  // 也可以根据业务需求，如果没有 role，默认取某个或都不取
  let token = ''
  if (userStore.currentRole === 'XN') {
	  token = userStore.userInfoXn.token || uni.getStorageSync('tokenXn');
  } else if (userStore.currentRole === 'GZ') {
	  token = userStore.userInfoGz.token || uni.getStorageSync('tokenGz');
  } else {
	  // 如果没有明确角色，尝试获取任意一个存在的 token，或者不传
	  token = userStore.userInfoXn.token || userStore.userInfoGz.token || ''
  }
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
        showLoading && uni.hideLoading()
        const { statusCode, data } = res;
        /** HTTP 层错误 */
        if (statusCode !== 200 && statusCode !== 304) {
          uni.showToast({
            title: '服务器异常',
            icon: 'none'
          })
          reject(res)
          return
        }

        // 304 兼容处理：如果是 304，通常没有 data，或者 data 为空
        // 此时直接 resolve，或者根据业务需要处理
        if (statusCode === 304) {
           // 如果 304 返回了 data，则继续走下面的业务逻辑检查
           // 如果没有 data，直接返回 data 本身或空对象，防止读取 code 报错
           if (!data) {
               resolve(data)
               return
           }
        }

        /** 业务层约定（按你后端改） */
        // 注意：有些接口成功时 code 也是 200，或者其他约定。请根据后端实际情况调整。
        // 这里假设 data.code === 0 为成功。
        // 增加对 code 200 的兼容，防止部分接口返回 200 但非 0 被误判
        
        if (data.code !== 0 && data.code !== 200) {
          // 如果是 401，且不是登录接口，则视为 token 过期
          // 登录接口的 401 通常是账号密码错误或参数校验失败，不应跳转登录页
          if (data.code === -1 && !url.includes('/login')) {
             // 登录失效
             // 根据当前角色清除对应 token
             if (userStore.currentRole === 'XN') {
                 userStore.userInfoXn.token = ''
                 uni.removeStorageSync('tokenXn')
             } else if (userStore.currentRole === 'GZ') {
                 userStore.userInfoGz.token = ''
                 uni.removeStorageSync('tokenGz')
             } else {
                 userStore.userInfoXn.token = ''
                 userStore.userInfoGz.token = ''
                 uni.removeStorageSync('tokenXn')
                 uni.removeStorageSync('tokenGz')
             }
             
             uni.showToast({
               title: '登录已过期',
               icon: 'none'
             })
             
             // 记录过期时的角色，以便跳转后恢复
             const expiredRole = userStore.currentRole;
    
             setTimeout(() => {
               uni.reLaunch({
                 url: `/pages/my/login?role=${expiredRole}`
               })
             }, 500)
    
             reject({ code: -1, message: '登录已过期' })
             return
          };
		  
          uni.showToast({
            title: data.msg || data.message || '请求失败',
            icon: 'none'
          })
          resolve(data)
          return
        }

        // 优先返回 data.data，如果不存在则返回整个 data
        // 这样可以兼容某些直接返回结果的接口，或者 304 无 body 的情况
        if (data && Object.prototype.hasOwnProperty.call(data, 'data')) {
           // resolve(data.data)
            resolve(data)
        } else {
            resolve(data)
        }
      },

      fail(err) {
        showLoading && uni.hideLoading()
        uni.showToast({
          title: '网络异常',
          icon: 'none'
        })
        reject(err)
      },

      complete() {
        // showLoading && uni.hideLoading()
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
