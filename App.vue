<script setup>
import { useLoginStore } from './stores/userLogin'
	onLaunch(() => {
		const {proxy} = getCurrentInstance()
		const userStore = useLoginStore()
	
		const whiteList = [
			// '/pages/my/index',
			'/pages/my/login',
			'/pages/my/regist-xn',
			'/pages/my/reset-psd-xn',
			'/pages/orders/detail'
		]
	
		const needLogin = (url) => {
			return !whiteList.some(item => url.startsWith(item))
		}
		// const isLogin = () => !!uni.getStorageSync('tokenXn') || !!uni.getStorageSync('tokenGz')
		// const originalNavigateTo = uni.navigateTo
		// uni.navigateTo = function (options) {
		//   if (!isLogin()) {
		// 	  proxy.$u.toast('请登录系统')
		// 	return originalNavigateTo({
		// 	  url: '/pages/my/login' //未登录 → 强制跳转 登录
		// 	});
		//   }
		//   return originalNavigateTo(options);
		// }
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
								url: '/pages/my/login'
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
		console.log('App Hide')
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
