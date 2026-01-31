<template>
  <view class="sold-info">
    <u-card :border-radius="16" :padding="20" :show-head="false">
      <!-- ✅ body  -->
      <template #body>
        <!-- 价格区域 -->
        <u-row justify="space-between" class="price-section">
          <u-col span="8">
            <text class="current-price">¥{{detailData.money}}</text>
            <text class="original-price">¥{{detailData.new_money}}</text>
          </u-col>
          <u-col span="4" textAlign="right">
            <text class="sales-info">已售{{detailData.total_sales}}件</text>
          </u-col>
        </u-row>

        <!-- 商品标题 -->
        <view class="title">
          {{detailData.name}}
        </view>

        <!-- 标签区域 -->
        <view class="status-tags">
        	<CxTag
        	  :text="detailData.period || ''"
        	  :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
        	/>&nbsp;
        	<CxTag
        	  :text="detailData.difficulty || ''"
        	  :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
        	/>
        </view>
      </template>
    </u-card>
  </view>
<view class="commodity-welfare">
    <view class="cell-wrapper">
      <u-cell
        title="正品保证"
		name="正品保证"
		class="welfare-item"
        :border="false"
        :custom-style="{
          padding: '16rpx 32rpx'
        }"
		    :title-style="{ fontSize: '28rpx', fontWeight: 500 }"
        @click="handleClick"
      >
        <template #right-icon>
          <u-icon name="arrow-right" color="#666" size="36rpx"></u-icon>
        </template>
      </u-cell>
    </view>
    <view class="cell-wrapper">
      <u-cell
        title="7天无理由退货"
        name="7天无理由退货"
        class="welfare-item"
        :border="false"
        :custom-style="{
          padding: '16rpx 32rpx'
        }"
		    :title-style="{ fontSize: '28rpx', fontWeight: 500 }"
        @click="handleClick"
      >
        <template #right-icon>
          <u-icon name="arrow-right" color="#666" size="36rpx"></u-icon>
        </template>
      </u-cell>
    </view>
  </view>
<view class="creative-process">
	<view class="chain-title">
	  <u-image
			 src="/static/images/collection-detail/production-details.png"
			 width="30rpx"
			 height="30rpx"
			 mode="widthFix"
			 radius="50%"
		   /> &nbsp;&nbsp;制作详情
	</view>
	 <u-card
      :border="false"
      :show-head="false"
      :padding="20"
      :border-radius="16"
      :custom-style="{
      background:'#fff',
      boxShadow:'0 4px 12px rgba(0,0,0,0.05)',
      border: '2px solid #FFE185'
	   }"
	 >
	   <template #body>
		 <!-- 标题 -->
		<!-- <view class="title-wrapper">
		   <view class="title-line"></view>
		   <text class="title-text">创作过程</text>
		 </view> -->

		 <!-- 文本 -->
		 <!-- <view class="content-text">
		   {{detailData.new_money}}
		 </view> -->

		 <!-- 图片 -->
		 <!-- <view class="image-wrapper">
		   <u-image
			 :src="detailData.image"
			 width="100%"
			 mode="widthFix"
			 radius="12"
		   />
		 </view> -->

		 <view class="content-text" v-html="detailData.details"></view>
	   </template>
	 </u-card>
</view>
 
  <view class="footer-bar">
	  
    <!-- 左侧功能区 -->
    <view class="left-actions">
      <view class="action-item" @click="handleCollect">
        <u-icon name="star" size="60rpx" :color="detailData.collect_status == 1 ? '#FFD700' : '#FFFFFF'"></u-icon>
        <text class="action-text collect" :style="{ color: detailData.collect_status == 1 ? '#FFD700' : '#FFFFFF' }">
          {{ detailData.collect_status == 1 ? '已收藏' : '收藏' }}
        </text>
      </view>
      <view class="action-item" @click="handleService">
        <u-icon name="kefu-ermai" size="60rpx" color="#FFD700"></u-icon>
        <text class="action-text service">客服</text>
      </view>
    </view>

    <!-- 右侧操作按钮区 -->
    <view class="right-buttons">
	<view class="gradient-btn-item shopping-cart" @click="handlePayDeposit" :class="{'authen-gray':detailData.rush_status==1}">
	   <view class="gradient-button">
			
		</view>
		<view class="button-inner">
			支付押金
			<view class="update-tip" v-if="detailData.rush_status!=1">
				需要升等级
			</view>
		</view>
	 </view>
	 
	 <view class="gradient-btn-item buy-now" :class="{'authen-gray':detailData.rush_status!=1}" @click="handleGrabOrder">
	    <view class="gradient-button">
	 		
	 	</view>
	 	<view class="button-inner">
	 		一键抢单
	 	</view>
	  </view>
    </view>
  </view>
</template>


<script setup name="NftDetail">
import { taskDetails, changeCollect } from '@/api/index.js'

let isUpgrade = ref(true);
let detailData = ref({});
const { proxy } = getCurrentInstance();

// 获取页面参数
// 假设父页面或路由通过 params/query 传递了 id，或者如果是组件 props
// 这里先尝试从 getCurrentPages 获取路由参数，或者定义 props
const props = defineProps({
  collectionImage: {
    type: String,
    default: ''
  },
  id: {
    type: [String, Number],
    default: ''
  }
});
const emit = defineEmits(['update:collectionImage'])
// 如果 props 没有 id，尝试从页面路由参数获取
let taskId = ref(props.id);

onMounted(() => {
    // 如果 props 中没有 id，尝试从页面参数获取
    if (!taskId.value) {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        // 兼容不同平台的参数获取
        const options = currentPage.options || currentPage.$page?.options || {};
        taskId.value = options.id;
    }
    
    if (taskId.value) {
        fetchDetail();
    }
});

const fetchDetail = async () => {
    try {
        const res = await taskDetails({
            id: taskId.value
        });
        if (res.code === 200) {
            detailData.value = res?.data.list || {};

          
             emit('update:collectionImage', detailData.value.image || '');
        } else {
            uni.showToast({ title: res.msg || '获取详情失败', icon: 'none' });
        }
    } catch (error) {
        console.error('获取详情异常', error);
    }
};

const handleCollect = async () => {
  try {
      const res = await changeCollect({
          id: detailData.value.id,
          type: detailData.value.collect_status == 1 ? 2 : 1
      });
      if (res.code === 200) {
          // 切换收藏状态
          detailData.value.collect_status = detailData.value.collect_status == 1 ? 2 : 1;
          uni.showToast({
              title: detailData.value.collect_status == 1 ? '收藏成功' : '已取消收藏',
              icon: 'success'
          });
      } else {
          uni.showToast({ title: res.msg || '操作失败', icon: 'none' });
      }
  } catch (error) {
      console.error('收藏操作异常', error);
      uni.showToast({ title: '操作失败', icon: 'none' });
  }
};
const handleService = ()=> {
  // 客服逻辑
  console.log('客服');
};
const handlePayDeposit = ()=> {
  // 支付押金逻辑 - 跳转到压金页面
  if(detailData.value.rush_status==1) return;
  uni.navigateTo({
      url: `/pages-xn/my/deposit?id=${detailData.value.id}`,
      success: (res) => {
        res.eventChannel.emit('sendMarginDatas', { marginResultData: detailData.value });
      },
      fail: (err) => {
        console.error('跳转失败', err);
      }
    })
};
const handleGrabOrder = ()=> {
  if(detailData.value.rush_status==1) {
      uni.navigateTo({
					url: `/pages-xn/my/deposit?id=${detailData.value.id}`,
					success: (res) => {
						res.eventChannel.emit('sendMarginDatas', { marginResultData: detailData.value });
					},
					fail: (err) => {
						console.error('跳转失败', err);
					}
				})
     uni.showToast({
      title: '请支付押金后抢单',
      icon: 'success'
    })
	  return;
  };
 
};
const handleClick = (cellPrm)=>{
	console.log("点击了正品保障",cellPrm);
}
</script>

<style lang="scss" scoped>

	.filter-gray{
		filter: grayscale(1);
	}
.shopping-cart{
	.gradient-button{		
		border-radius: 20rpx 10rpx 6rpx 40rpx;
		background: linear-gradient(90deg, #F3D89E, #F5EAC9);
		transform: skewY(-15deg) rotateZ(15deg); 
	}
	.update-tip{
		position: absolute;
		top: -38rpx;
		right: -82rpx;
		padding: 0rpx 20rpx;
		background: #FE3A3A;
		border-radius: 30rpx;
		border-bottom-left-radius:0;
		color: #fff;
		font-size: 18rpx;
		z-index: 2;
	}
	.button-inner{
		color: #805536;
	}
}
.right-buttons{
		position: relative;
	
}
.shopping-cart{
	
}
.gradient-button {
  width: 200rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: linear-gradient(90deg, #ff4136, #ff8533);
  border: 2rpx solid #ffc107;
  border-radius: 10rpx 40rpx 20rpx 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-weight: bold;
  transform: skewY(-15deg) rotateZ(15deg);
}
.button-inner{
	position: absolute;
	inset: 0;
	text-align: center;
	vertical-align: middle;
	color: white;
}
.gradient-btn-item{
	display: inline-block;
	position: relative;
  line-height: 60rpx;
	
}
.footer-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 124rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(77, 20, 25, .6);
  padding: 10px 15px;
  box-sizing: border-box;
}

.left-actions {
  display: flex;
  justify-content:space-around;
  width: 30%; 
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.action-text {
  font-size: 24rpx;
}

.action-text.collect {
  color: #FFFFFF; 
}

.action-text.service {
  color: #FFD700; 
}

.right-buttons {
}

.right-buttons .u-button:first-child {
  margin-right: -1px;
}

.right-buttons .u-button:last-child {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.creative-process {
  margin-top: 40rpx;
  // border: 2rpx solid $app-border-color;
}

.chain-title {
 display: flex;
 justify-content: flex-start;
 align-items: flex-start;
  color: white;
  font-size: 32rpx;
  font-weight: bold;
  margin: 20rpx;
}

.content-text {
  font-size: 24rpx;
  line-height: 1.8;
  color: #555;
  margin: 20rpx 0;
}
	
	




.cell-wrapper {
  background-color: #ffffff;
  border-radius: 28rpx;
  overflow: hidden; 
  margin-top: 20rpx;
}
.commodity-welfare {
	padding: 0 20rpx;
}
.sold-info {
	margin-top: 20rpx;
}

.price-section {
  margin-bottom: 20rpx;
}

.current-price {
  color: #FF0000;
  font-size: 36rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

.original-price {
  color: #999999;
  font-size: 28rpx;
  text-decoration: line-through;
}

.sales-info {
  color: #666666;
  font-size: 24rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333333;
}

.tag-section {
  margin-top: 20rpx;
}
</style>