import { get, post } from '@/utils/request'

// ---------------- 示例代码 ----------------

// GET 请求示例
// export const exampleGet = (params) => get('/api/example', params)

// POST 请求示例
// export const examplePost = (data) => post('/api/example', data)

// ---------------- 业务接口 ----------------

export const getBanner = () => get('/index/banner')
export const login = (data) => post('/user/login', data)
export const paymentDeposit = (data) => post('/user/payment-peposit', data)
export const getTaskCode = (data) => get("/info-api/task-code", data)

// 使用示例
// import { getBanner } from '@/api/index'

// onMounted(async () => {
//   const bannerList = await getBanner()
//   console.log(bannerList)
// })