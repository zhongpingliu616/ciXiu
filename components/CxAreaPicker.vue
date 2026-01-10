<template>
	<up-picker
		:show="show"
		:columns="regionColumns"
		keyName="name"
		@confirm="handleConfirm"
		@cancel="handleCancel"
		@change="handleChange"
	></up-picker>
</template>

<script setup name="CxPicker">
import provincial from '@/static/provincial';
import municipal from '@/static/municipal';
import county from '@/static/county';
import town from '@/static/town';

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['update:show', 'confirm']);

const regionColumns = reactive([[], [], [], []]);

// 存储所有的地区数据
const allData = reactive({
	provinces: provincial,
	cities: municipal,
	counties: county,
	towns: town
});

// 初始化列数据
const initColumns = () => {
	if (allData.provinces.length > 0) {
		const provinceList = allData.provinces;
		// 默认取第一个省
		const defaultProv = provinceList[0];
		// 过滤出对应的市
		const cityList = allData.cities.filter(item => item.pid === defaultProv.id);
		const defaultCity = cityList[0] || {};
		
		// 过滤出对应的区/县
		const countyList = allData.counties.filter(item => item.pid === defaultCity.id);
		const defaultCounty = countyList[0] || {};
		
		// 过滤出对应的镇/街道
		const townList = allData.towns.filter(item => item.pid === defaultCounty.id);
		
		regionColumns.splice(0, regionColumns.length);
		regionColumns.push(provinceList);
		regionColumns.push(cityList);
		regionColumns.push(countyList);
		regionColumns.push(townList);
	}
};

const lastIndexs = reactive([0, 0, 0, 0]);

const handleChange = (e) => {
	const { indexs } = e;
	console.log('Picker Change:', indexs);
	
	// 省变动
	if (indexs[0] !== lastIndexs[0]) {
		const prov = regionColumns[0][indexs[0]];
		if (prov) {
			const cities = allData.cities.filter(item => item.pid === prov.id);
			regionColumns[1] = cities;
			
			// 默认选中第一个市
			const city = cities[0] || {};
			const counties = allData.counties.filter(item => item.pid === city.id);
			regionColumns[2] = counties;
			
			// 默认选中第一个区
			const county = counties[0] || {};
			const towns = allData.towns.filter(item => item.pid === county.id);
			regionColumns[3] = towns;
		} else {
			regionColumns[1] = [];
			regionColumns[2] = [];
			regionColumns[3] = [];
		}
		// 重置后续索引记录
		lastIndexs[0] = indexs[0];
		lastIndexs[1] = 0;
		lastIndexs[2] = 0;
		lastIndexs[3] = 0;
	} 
	// 市变动
	else if (indexs[1] !== lastIndexs[1]) {
		// 注意：此时 regionColumns[1] 应该已经是当前省对应的市列表
		const city = regionColumns[1][indexs[1]];
		if (city) {
			const counties = allData.counties.filter(item => item.pid === city.id);
			regionColumns[2] = counties;
			
			// 默认选中第一个区
			const county = counties[0] || {};
			const towns = allData.towns.filter(item => item.pid === county.id);
			regionColumns[3] = towns;
		} else {
			regionColumns[2] = [];
			regionColumns[3] = [];
		}
		lastIndexs[1] = indexs[1];
		lastIndexs[2] = 0;
		lastIndexs[3] = 0;
	}
	// 区变动
	else if (indexs[2] !== lastIndexs[2]) {
		const county = regionColumns[2][indexs[2]];
		if (county) {
			const towns = allData.towns.filter(item => item.pid === county.id);
			regionColumns[3] = towns;
		} else {
			regionColumns[3] = [];
		}
		lastIndexs[2] = indexs[2];
		lastIndexs[3] = 0;
	}
	// 镇变动
	else if (indexs[3] !== lastIndexs[3]) {
		lastIndexs[3] = indexs[3];
	}
};

const handleConfirm = (e) => {
	emit('update:show', false);
	emit('confirm', e);
};

const handleCancel = () => {
	emit('update:show', false);
};

onMounted(() => {
	initColumns();
});
</script>

<style lang="scss" scoped>
</style>