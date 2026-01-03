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
			'/pages/xn/my/user-agreement'
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
		const userStore = useLoginStore()
		const token =
			userStore.userInfoXn?.token ||
			userStore.userInfoGz?.token ||
			uni.getStorageSync('tokenXn') ||
			uni.getStorageSync('tokenGz');

		// 白名单
		const whiteList = [
			'/pages/login',
			'/pages/xn/my/regist-xn',
			'/pages/xn/my/reset-psd-xn',
			'/pages/xn/orders/detail',
			'/pages/xn/my/user-agreement'
		]

		// 获取当前页面路径
		let currentPath = ''
		// #ifdef H5
		currentPath = window.location.hash.replace('#', '').split('?')[0]
		// #endif
		
		// #ifndef H5
		const pages = getCurrentPages()
		if (pages.length > 0) {
			currentPath = '/' + pages[pages.length - 1].route
		}
		// #endif

		// 简单的白名单检查
		const isWhiteList = whiteList.some(item => currentPath.startsWith(item))

		if (!token && !isWhiteList && currentPath && currentPath !== '/') {
			uni.reLaunch({
				url: '/pages/login'
			})
		}
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
