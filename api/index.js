import { get, post } from '@/utils/request'

export const getBanner = () => get('/index/banner')
export const login = (data) => post('/user/login', data)
export const paymentDeposit = (data) => post('/user/payment-peposit', data)

// 使用示例
// import { getBanner } from '@/api/index'

// onMounted(async () => {
//   const bannerList = await getBanner()
//   console.log(bannerList)
// })