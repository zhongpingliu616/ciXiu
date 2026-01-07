// utils/useWechatShare.ts
import { onMounted } from 'vue'

declare const wx: any

export function useWechatShare(options: {
  title: string
  desc?: string
  link?: string
  imgUrl?: string
}) {
  const isWechat = /MicroMessenger/i.test(navigator.userAgent)

  const initWechatShare = async () => {
    if (!isWechat) return

    const url = location.href.split('#')[0]

    const res: any = await uni.request({
      url: 'https://你的域名/api/wechat/jssdk.php',
      method: 'GET',
      data: { url }
    })

    const { appId, timestamp, nonceStr, signature } = res.data

    wx.config({
      debug: false,
      appId,
      timestamp,
      nonceStr,
      signature,
      jsApiList: [
        'updateAppMessageShareData',
        'updateTimelineShareData'
      ]
    })

    wx.ready(() => {
      const shareData = {
        title: options.title,
        desc: options.desc || '',
        link: options.link || location.href,
        imgUrl: options.imgUrl || ''
      }

      // 分享给朋友
      wx.updateAppMessageShareData(shareData)

      // 分享到朋友圈
      wx.updateTimelineShareData({
        title: shareData.title,
        link: shareData.link,
        imgUrl: shareData.imgUrl
      })
    })
  }

  onMounted(() => {
    initWechatShare()
  })

  return {
    isWechat
  }
}
