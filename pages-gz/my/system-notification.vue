<template>
	<view class="page-wrap system-notification">
	<LayoutNavigationGz :title="title" >
    <template #right>
          <uni-icons custom-prefix="iconfont" type="icon-qingchu" size="30rpx" color="#ffffff" @tap="markedRead"></uni-icons>
		</template>
  </LayoutNavigationGz>
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
			          <view v-if="item.is_read === 2" class="dot"></view>
			        </view>
			
			        <!-- 中间内容 -->
			        <view class="content">
			          <view class="title">{{ item.title }}</view>
			          <view class="desc">{{ item.subtitle }}</view>
			        </view>
			
			        <!-- 右侧时间 -->
			        <view class="time">{{ item.create_time }}</view>
			      </view>
			    </view>
			  </view>
		</view>
	 <view></view>
	</view>
<CxModal
	  v-model:show="showMarkedReadModal"
	  content="全部标记为已读吗？"
	  @confirm="confirmMarkedRead"
	/>
</template>


<script setup name="systemNotification">
let title = ref("系统通知");	
let eventChannel = ref(null);
let showMarkedReadModal = ref(false);
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
// 模拟数据
const notifications = ref([
  {
    "id": 2,
    "receiver_id": 6,
    "title": "这个是个通知",
    "subtitle": "这个是一个副标题",
    "status": 1,
    "create_time": "2025-12-09 00:01:40",
    "is_read": 2
  }
])
const confirmMarkedRead = ()=>{
  markedRead();
  showMarkedReadModal.value = false;
}
const handleNotification = (item,index)=>{
      console.log('接收到的消息数据:', item);
	uni.navigateTo({
		url:`/pages-gz/my/system-notification-detail?id=${item.id}`,
	})
};
const markedRead = ()=>{
  showMarkedReadModal.value = true;
}
onLoad(()=>{  
	eventChannel.value = proxy.getOpenerEventChannel();
  eventChannel.value.on('sendMessageDatas', (data) => {
    if(data && data.messageListsData){
      // notifications.value = data.messageListsData || [];
    }
  });
});
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
	grid-template-rows: v-bind(safeTopValue) 1fr 0rpx;
}		
	
</style>