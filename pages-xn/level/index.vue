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
					v-for="(item,index) in cardAry" :key="item.name"
					:cardIndex="index+1" 
					:selectIndex="selectIndex" 
					:levelName="item.name" 
					:guaranteedAmount="item.deposit"
					:works="item.content"
					@click="()=>selectLevel(index)"
					>
				</CommonLevelCard>
			</view>
			<template  v-if="cardAry.length">
				<view class="margin-instruction">
					<h5 class="level-title">等级说明：</h5>
					<text class="margin-instruction-text" v-for="(item,index) in cardAry" :key="item.name">{{index+1}}档({{item.deposit}}元) </text>
				</view>
				<view class="enter-wrap">
					<CxComfirmBtn text="进入" :loading="loading" @click="handleEnter" />				
				</view>
			</template>
		</view>
	</view>
</template>

<script setup>
import { getLevelLists, updateLevel } from '@/api/index'
import { useLoginStore } from '@/stores/userLogin'
const userStore = useLoginStore()
const currentStep = ref(1)
let title = ref("等级选择");
let loading = ref(false);
let selectIndex = ref(1);
let cardAry = reactive([
	// {
	// 	name:"锦初",
	// 	deposit: 5000,
	// 	content:"刺绣、刺绣、刺绣、刺绣、"
	// },
]);
const blockSteps = reactive([
	// {
	// 	text: "手机号验证"
	// },
	{
		text: "身份验证"
	},{
		text: "等级选择"
	}
]);
const setLevelDatas = (res={})=>{
	const { code=9999, data,msg } = res;
	if (code === 200) {
		 if(data?.lists.length>0){
			cardAry.splice(0,cardAry.length,...data.lists);
		 };
		 
	} else {
		uni.showToast({
			title: msg || '数据加载失败',
			icon: 'none'
		});
	}
};
const handleEnter = async () => {
	loading.value = true;
	const {name,deposit=0,id} = cardAry[selectIndex.value-1];
	
	const {code,data,msg} = await updateLevel({id:id});
	
	loading.value = false;
	if (code === 200) {
		await userStore.updateUserInfo('XN', {
							level: data.level,
							is_buy: data.is_buy,
							real_name_check: data.real_name_check
						});
		uni.navigateTo({
		url: `/pages-xn/my/identity-authentication`,
		success(res) {
				res.eventChannel.emit('acceptLevelData', {
					selectIndex,
					name,
					deposit
				});
			}
		});
	} else if(code === 100014){
		uni.showToast({
			title: msg || '更新失败',
			icon: 'none'
		});
		uni.navigateTo({
		url: `/pages-xn/my/identity-authentication`,
		success(res) {
				res.eventChannel.emit('acceptLevelData', {
					selectIndex,
					name,
					deposit
				});
			}
		});
	} else {
		uni.showToast({
			title: msg || '更新失败',
			icon: 'none'
		});
	};
};
const selectLevel = (index)=>{
	selectIndex.value = index+1
};
onMounted( async() => {
	const res = await getLevelLists();
	setLevelDatas(res || {});
});
onShow(()=>{
	// uni.hideTabBar();
});
</script>

<style lang="scss" scoped>
.level-title{
	color: #fff;
	text-align: left;
}
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
	margin-top: 20rpx;
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
