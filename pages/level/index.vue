<template>
	<view class="page-wrap grab-order">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="u-block-box">
					<CommonStep
						:blockSteps="blockSteps" 
						:currentStep="currentStep"
						>
					</CommonStep>
			</view>
			<view class="cloud-list">
				<CommonLevelCard
					v-for="(item,index) in cardAry" :key="item.levelName"
					:cardIndex="index+1" 
					:selectIndex="selectIndex" 
					:levelName="item.levelName" 
					:guaranteedAmount="item.guaranteedAmount"
					:works="item.works"
					@click="()=>selectLevel(index)"
					>
				</CommonLevelCard>
			</view>
			<view class="margin-instruction">
				<text class="margin-instruction-text">保证金满3个月可退还”“作品数量将逐步向3-4档倾斜</text>
			</view>
			<view class="enter-wrap">
				<CommonComfirmBtn text="进入" :loading="loading" @click="handleEnter" />				
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive } from 'vue';

	const currentStep = ref(1)
	let title = ref("等级选择");
	let loading = ref(false);
	let selectIndex = ref(1);
	let cardAry = reactive([
		{
			levelName:"锦初",
			guaranteedAmount: 5000,
			works:"刺绣、刺绣、刺绣、刺绣、刺绣、 刺绣、刺绣、刺绣、"
		},{
			levelName:"绣升",
			guaranteedAmount: 6000,
			works:"刺绣、刺绣、刺绣、刺绣、刺绣、 刺绣、刺绣、刺绣、"
		},{
			levelName:"瑶臻",
			guaranteedAmount: 8000,
			works:"刺绣、刺绣、刺绣、刺绣、刺绣、 刺绣、刺绣、刺绣、"
		},{
			levelName:"宸御",
			guaranteedAmount: 10000,
			works:"刺绣、刺绣、刺绣、刺绣、刺绣、 刺绣、刺绣、刺绣、"
		}
	]);
	const blockSteps = reactive([
		{
			text: "手机号验证"
		},{
			text: "身份验证"
		},{
			text: "等级选择"
		}
	]);
	const handleEnter = () => {
		loading.value = true;
		setTimeout(() => {
		  loading.value = false;
		  uni.showToast({
			title: '已进入',
			icon: 'success'
		  });
		  currentStep.value+=1;
		  uni.navigateTo({
		    url: `/pages/level/pay-deposit?amount=${cardAry[selectIndex.value-1].guaranteedAmount}`,
		    success(res) {
		      // res.eventChannel.emit('acceptData', {
		      //   amountData: cardAry[selectIndex-1]
		      // })
		    }
		  })
		}, 3000);
	};
	const selectLevel = (index)=>{
		selectIndex.value = index+1
	};
	onMounted(() => {
	  console.log('is tab page income', title)
	});
	onShow(()=>{
		// uni.hideTabBar();
	});
</script>

<style lang="scss" scoped>
	.page-wrap{
		background: url("/static/images/user/login-bg.png") no-repeat center/cover;
	}
	.u-block-box{
		margin-top: 42rpx;
	}
	.cloud-list{
		margin-top: 24rpx;
	}
	.margin-instruction{
		text-align: center;
		
	}
	.margin-instruction-text{
		color: #BDA8A9;
	}
	.enter-wrap{
		width: 90%;
		margin: 0 auto;
		margin-top: 64rpx;
	}
</style>
