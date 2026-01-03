<script setup>
import { useLoginStore } from './stores/userLogin'
	onLaunch(() => {
		// uni.clearStorageSync();
		const {proxy} = getCurrentInstance()
		const userStore = useLoginStore()
	
		const whiteList = [
			// '/pages/index',
			'/pages/login',
			'/pages/xn/my/regist-xn',
			'/pages/xn/my/reset-psd-xn',
			'/pages/xn/orders/detail',
			'/pages/xn/my/user-agreement' // 添加用户协议到白名单
		]
	
		const needLogin = (url) => {
			return !whiteList.some(item => url.startsWith(item))
		}
		;['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'].forEach(method => {
			uni.addInterceptor(method, {
				invoke(args) {					
					const url = args.url
					if (!url) return true;
					const token =
						userStore.userInfoXn?.token ||
						userStore.userInfoGz?.token ||
						uni.getStorageSync('tokenXn') ||
						uni.getStorageSync('tokenGz');
					
					// 首页也需要登录，如果不在白名单且没有 token，拦截
					if (!token && needLogin(url)) {
						// proxy.$u.toast('请登录系统')
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/login'
							})
						}, 100)
						return false
					}	
					return true
				}
			})
		})
	})
	
	onShow(() => {
		console.log('App onShow')
	})
	
	onHide(() => {
		
	})
	</script>

<style lang="scss">
	@import '@/uni_modules/uview-plus/index.scss';
	html,
	body,
	page,
	uni-page-body {
	  height: 100%;
	}
</style>
