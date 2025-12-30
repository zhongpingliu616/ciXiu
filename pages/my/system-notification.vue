<template>
	<view class="page-wrap system-notification">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="page-container">
			    <!-- 通知列表 -->
			    <view class="notification-list">
			      <view
			        v-for="(item, index) in notifications"
			        :key="index"
			        class="notification-item"
					@tap="handleNotification(item,index)"
			      >
			        <!-- 左侧图标 -->
			        <view class="icon-wrapper">
			          <u-icon name="bell-fill" size="36" color="#fff"></u-icon>
			          <!-- 小红点 (仅用于“软件更新”) -->
			          <view v-if="item.type === 'update'" class="dot"></view>
			        </view>
			
			        <!-- 中间内容 -->
			        <view class="content">
			          <view class="title">{{ item.title }}</view>
			          <view class="desc">{{ item.desc }}</view>
			        </view>
			
			        <!-- 右侧时间 -->
			        <view class="time">{{ item.time }}</view>
			      </view>
			    </view>
			  </view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="systemNotification">
let title = ref("系统通知");	
// 模拟数据
const notifications = ref([
  {
    type: 'update',
    title: '软件更新',
    desc: '11月30日将进行软件升级',
    time: '2025-11-27'
  },
  {
    type: 'price',
    title: '价格变动提醒',
    desc: 'XXXXXXX价格变动',
    time: '2025-11-27'
  },
  {
    type: 'income',
    title: '收益到账提醒',
    desc: '您的收益 XXXXXX已经到账',
    time: '2025-11-27'
  },
  {
    type: 'price',
    title: '价格变动提醒',
    desc: 'XXXXXXX价格变动',
    time: '2025-11-27'
  },
  {
    type: 'update',
    title: '收益到账提醒',
    desc: '您的收益 XXXXXX已经到账',
    time: '2025-11-27'
  },
  {
    type: 'price',
    title: '价格变动提醒',
    desc: 'XXXXXXX价格变动',
    time: '2025-11-27'
  },
  {
    type: 'income',
    title: '收益到账提醒',
    desc: '您的收益 XXXXXX已经到账',
    time: '2025-11-27'
  },
  {
    type: 'price',
    title: '价格变动提醒',
    desc: 'XXXXXXX价格变动',
    time: '2025-11-27'
  },
  {
    type: 'income',
    title: '收益到账提醒',
    desc: '您的收益 XXXXXX已经到账',
    time: '2025-11-27'
  },
  {
    type: 'price',
    title: '价格变动提醒',
    desc: 'XXXXXXX价格变动',
    time: '2025-11-27'
  },
  {
    type: 'income',
    title: '收益到账提醒',
    desc: '您的收益 XXXXXX已经到账',
    time: '2025-11-27'
  },
  {
    type: 'price',
    title: '价格变动提醒',
    desc: 'XXXXXXX价格变动',
    time: '2025-11-27'
  },
  {
    type: 'income',
    title: '收益到账提醒',
    desc: '您的收益 XXXXXX已经到账',
    time: '2025-11-27'
  },
  {
    type: 'price',
    title: '价格变动提醒',
    desc: 'XXXXXXX价格变动',
    time: '2025-11-27'
  },
  {
    type: 'income',
    title: '收益到账提醒',
    desc: '您的收益 XXXXXX已经到账',
    time: '2025-11-27'
  }
])
const handleNotification = (item,index)=>{
	uni.navigateTo({
		url:`/pages/my/system-notification-detail?id=${index}`
	})
};
</script>

<style lang="scss" scoped>
.page-container {
  position: relative;
  max-height: 100%;
  box-sizing: border-box;
  padding: 20rpx 0;
  overflow-y: auto;
}
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.icon-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  background-color: #FF6347; /* 橙红色 */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
}

.dot {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: #ff0000;
  border-radius: 50%;
}

.content {
  flex: 1;
  min-width: 0; /* 防止文字溢出 */
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.desc {
  font-size: 14px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
}
.page-wrap{
	grid-template-rows: 80rpx 1fr 0rpx;
}		
	
</style>