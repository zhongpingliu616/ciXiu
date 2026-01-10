import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
	 // base: '/ciXiu/unpackage/dist/build/web/',
	  server: {
	    hmr: true
	  },
	  optimizeDeps: {
		  include: ['echarts']
	  },
	  plugins: [
		uni(),
		AutoImport({
		  // ① 自动导入来源
		  imports: [
			'vue',
			'uni-app',
			// {
			//   'uni-app': [
			//     'onLoad',
			//     'onShow',
			//     'onHide',
			//     'onReady'
			//   ]
			// }
		  ],

		  // ② 生成类型声明文件（非常关键）
		  dts: 'src/auto-imports.d.ts',

		  // ③ 允许在 vue / js / ts 中使用
		  include: [
			/\.[tj]sx?$/,
			/\.vue$/,
			/\.vue\?vue/
		  ],

		  // ④ 开启 ESLint 支持（可选）
		  eslintrc: {
			enabled: false
		  }
		})
	  ]
})
