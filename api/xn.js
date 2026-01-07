import { get, post } from '@/utils/request'
import { useLoginStore } from '@/stores/userLogin'

// ---------------- 示例代码 ----------------

// GET 请求示例
// export const exampleGet = (params) => get('/api/example', params)

// POST 请求示例
// export const examplePost = (data) => post('/api/example', data)

// ---------------- 业务接口 ----------------

export const getBanner = () => get('/index/banner')
export const login = (data) => post('/embroid/login', data)
export const register = (data) => post('/embroid/register', data)
export const sendSms = (data) => post('/embroid/sms', data)
export const addAuthen = (data) => post('/embroid/user/authenAdd', data)
export const getConfigList = () => get('/embroid/config/lists')
export const getUserInfo = () => get('/embroid/user/info')
export const getBannerList = () => get('/embroid/banner/lists')
export const taskLists = (data) => get('/embroid/task/lists', data)
export const getSearchHistory = () => post('/embroid/task/keywords')
export const deleteSearchHistory = (data) => post('/embroid/task/delkeywords', data)
export const taskDetails = (data) => get('/embroid/task/details', data)
export const changeCollect = (data) => post('/embroid/task/changeCollect', data)
export const resetPassword = (data) => post('/embroid/forget', data)
export const uploadImage = (filePath) => {
    return new Promise((resolve, reject) => {
        const userStore = useLoginStore()
        uni.uploadFile({
            url: import.meta.env.VITE_APP_BASE_URL + '/embroid/uploadImage',
            filePath: filePath,
            name: 'file', // 后端接收的文件字段名，通常是 'file'
            header: {
                'Authorization': userStore.userInfoXn.token
            },
            success: (uploadFileRes) => {
                let data;
                try {
                    data = JSON.parse(uploadFileRes.data);
                } catch (e) {
                    data = uploadFileRes.data;
                }
                
                if (uploadFileRes.statusCode === 200 && data.code === 200) {
                    resolve(data.data); // 假设返回 data.data 是图片路径或对象
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
export const paymentDeposit = (data) => post('/user/payment-peposit', data)
export const getTaskCode = (data) => get("/info-api/task-code", data)
export const getLevelLists = () => get('/embroid/user/levelLists')
export const updateLevel = (data) => post('/embroid/user/updateLevel', data)
export const authenStatus = () => get('/embroid/user/authenStatus')
export const tasklLists = () => get('/embroid/task/lists')

// 使用示例
// import { getBanner } from '@/api/index'

// onMounted(async () => {
//   const bannerList = await getBanner()
//   console.log(bannerList)
// })
