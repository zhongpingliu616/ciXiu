import provincial from '@/static/provincial.js';
import municipal from '@/static/municipal.js';
import county from '@/static/county.js';
import town from '@/static/town.js';

// 解析区域名称的方法
export const getRegionName = (addressStr) => {
	if (!addressStr) return '';
	// 尝试解析 ID 组合
	const ids = String(addressStr).split(/[\/,\s]+/).map(id => parseInt(id, 10));
	
	let regionName = '';
	
	// Level 1: Province
	if (ids[0]) {
		const prov = provincial.find(item => item.id === ids[0]);
		if (prov) regionName += prov.name;
	}
	
	// Level 2: City
	if (ids[1]) {
		const city = municipal.find(item => item.id === ids[1]);
		if (city) regionName += city.name;
	}
	
	// Level 3: County
	if (ids[2]) {
		const cnt = county.find(item => item.id === ids[2]);
		if (cnt) regionName += cnt.name;
	}
	
	// Level 4: Town
	if (ids[3]) {
		const twn = town.find(item => item.id === ids[3]);
		if (twn) regionName += twn.name;
	};
	return regionName;
};