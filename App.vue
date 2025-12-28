<script setup>
	import { useLoginStore } from './stores/userLogin'
	onLaunch(() => {
		const userStore = useLoginStore()
	
		const whiteList = [
			'/pages/my/index',
			'/pages/my/login'
		]
	
		const needLogin = (url) => {
			return !whiteList.some(item => url.startsWith(item))
		}
		const isLogin = () => !!uni.getStorageSync('token')
		const originalNavigateTo = uni.navigateTo
		uni.navigateTo = function (options) {
		  if (!isLogin()) {
			return originalNavigateTo({
			  url: '/pages/index/index'
			});
		  }
		  return originalNavigateTo(options);
		}
		;['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'].forEach(method => {
			uni.addInterceptor(method, {
				invoke(args) {
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
