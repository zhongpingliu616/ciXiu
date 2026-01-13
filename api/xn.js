import { get, post } from '@/utils/request'
import { useLoginStore } from '@/stores/userLogin'

// ---------------- 示例代码 ----------------

// GET 请求示例
// export const exampleGet = (params) => get('/api/example', params)

// POST 请求示例
// export const examplePost = (data) => post('/api/example', data)

// ---------------- 业务接口 ----------------

export const getBanner = () => get('/index/banner') // 获取首页轮播图
export const login = (data) => post('/embroid/login', data) // 登录
export const register = (data) => post('/embroid/register', data) // 注册
export const sendSms = (data) => post('/embroid/sms', data) // 发送短信验证码
export const addAuthen = (data) => post('/embroid/user/authenAdd', data)    // 提交身份认证
export const getConfigList = () => get('/embroid/config/lists') // 获取配置列表
export const getUserInfo = () => get('/embroid/user/info') // 获取用户信息
export const getBannerList = () => get('/embroid/banner/lists') // 获取轮播图列表
export const taskLists = (data) => get('/embroid/task/lists', data) // 获取任务列表
export const getSearchHistory = () => post('/embroid/task/keywords') // 获取搜索历史
export const deleteSearchHistory = (data) => post('/embroid/task/delkeywords', data) // 删除搜索历史
export const taskDetails = (data) => get('/embroid/task/details', data) // 获取任务详情
export const changeCollect = (data) => post('/embroid/task/changeCollect', data) // 任务收藏/取消收藏
export const resetPassword = (data) => post('/embroid/forget', data) // 重置密码
export const paymentDeposit = (data) => post('/user/payment-peposit', data) // 支付定金
export const getTaskCode = (data) => get("/info-api/task-code", data) // 获取任务码
export const getLevelLists = () => get('/embroid/user/levelLists') // 获取会员等级列表
export const updateLevel = (data) => post('/embroid/user/updateLevel', data) // 更新会员等级
export const authenStatus = () => get('/embroid/user/authenStatus') // 获取身份认证状态
export const tasklLists = () => get('/embroid/task/lists') // 任务列表
export const memberAddress = () => get('/embroid/address/lists') // 获取收货地址列表
export const addAddress = (data) => post('/embroid/address/add', data)  // 新增收货地址
export const editAddress = (data) => post('/embroid/address/edit', data) // 编辑收货地址
export const deleteAddress = (data) => post('/embroid/address/del', data) // 删除收货地址
export const noticeLists = () => get('/embroid/notice/lists') // 公告列表
export const orderLists = (data) => get('/embroid/order/lists', data) // 订单管理列表
export const addOrder = (data) => post('/embroid/order/add', data) // 新增订单
export const editOrderSatus = (data) => post('/embroid/order/edit', data) // 修改订单状态
export const orderDetails = (data) => get('/embroid/order/details', data) // 订单详情
export const orderPay = (data) => post('/embroid/order/pay', data) // 订单支付
export const updateUserInfo = (data) => post('/embroid/user/updateInfo', data) // 更新用户信息
export const getPaymentTypes = () => get('/embroid/paymentTypes/lists') // 获取平台支持的支付方式列表
export const editBank = (data) => post('/embroid/bank/edit', data) // 编辑银行卡
export const bankLists = () => get('/embroid/bank/lists') // 获取支付方式列表
export const deleteBank = (data) => post('/embroid/bank/del', data) // 删除银行卡
export const addBank = (data) => post('/embroid/bank/add', data) // 新增银行卡
export const addWithdrawalOrder = (data) => post('/embroid/withdrawalOrder/add', data) // 新增提现订单
export const withdrawalOrderLists = () => get('/embroid/withdrawalOrder/lists') // 获取提现订单列表
export const withdrawalOrderDetails = (data) => get('/embroid/withdrawalOrder/details', data) // 获取提现订单详情



export const uploadImage = (filePath) => { // 上传图片
    return new Promise((resolve, reject) => {
        const userStore = useLoginStore()
        uni.uploadFile({
            url: import.meta.env.VITE_APP_BASE_URL + '/embroid/uploadImage',
            filePath: filePath,
            name: 'file', // 后端接收的文件字段名，通常是 'file'
            header: {
                'Authorization': userStore.userInfoXn.token
                // 'Content-Type': 'multipart/form-data'
            },
            success: (uploadFileRes) => {
                let data;
                try {
                    data = JSON.parse(uploadFileRes.data);
                } catch (e) {
                    data = uploadFileRes.data;
                }
                
                if (uploadFileRes.statusCode === 200 && data.code === 200) {
                    resolve(data); // 假设返回 data.data 是图片路径或对象
                } else {
                    reject(data.msg || '上传失败');
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};
// 使用示例
// import { getBanner } from '@/api/index'

// onMounted(async () => {
//   const bannerList = await getBanner()
//   console.log(bannerList)
// })
