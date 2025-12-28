<script setup>
import { useLoginStore } from './stores/userLogin'
	onLaunch(() => {
		const {proxy} = getCurrentInstance()
		const userStore = useLoginStore()
	
		const whiteList = [
			// '/pages/my/index',
			'/pages/my/login'
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
					proxy.$u.toast('请登录系统')
					const url = args.url
					if (!url) return true;
					const token = userStore.userInfoXn?.token || userStore.userInfoGz?.token;
					if (!token && needLogin(url)) {
						setTimeout(() => {
							uni.navigateTo({
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
