<template>
	<u-picker
		:show="show"
		:columns="regionColumns"
		keyName="name"
		@confirm="handleConfirm"
		@cancel="handleCancel"
		@change="handleChange"
	></u-picker>
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

const regionColumns = reactive([]);

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

const handleChange = (e) => {
	const { columnIndex, index, indexs, value } = e;
	
	// 根据变动的列进行级联更新
	if (columnIndex === 0) {
		// 省变动 -> 更新市、区、镇
		const selectedProv = regionColumns[0][index];
		if (selectedProv) {
			const cityList = allData.cities.filter(item => item.pid === selectedProv.id);
			regionColumns[1] = cityList;
			
			const selectedCity = cityList[0];
			if (selectedCity) {
				const countyList = allData.counties.filter(item => item.pid === selectedCity.id);
				regionColumns[2] = countyList;
				
				const selectedCounty = countyList[0];
				if (selectedCounty) {
					const townList = allData.towns.filter(item => item.pid === selectedCounty.id);
					regionColumns[3] = townList;
				} else {
					regionColumns[3] = [];
				}
			} else {
				regionColumns[2] = [];
				regionColumns[3] = [];
			}
		}
	} else if (columnIndex === 1) {
		// 市变动 -> 更新区、镇
		const selectedCity = regionColumns[1][index];
		if (selectedCity) {
			const countyList = allData.counties.filter(item => item.pid === selectedCity.id);
			regionColumns[2] = countyList;
			
			const selectedCounty = countyList[0];
			if (selectedCounty) {
				const townList = allData.towns.filter(item => item.pid === selectedCounty.id);
				regionColumns[3] = townList;
			} else {
				regionColumns[3] = [];
			}
		} else {
			regionColumns[2] = [];
			regionColumns[3] = [];
		}
	} else if (columnIndex === 2) {
		// 区变动 -> 更新镇
		const selectedCounty = regionColumns[2][index];
		if (selectedCounty) {
			const townList = allData.towns.filter(item => item.pid === selectedCounty.id);
			regionColumns[3] = townList;
		} else {
			regionColumns[3] = [];
		}
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