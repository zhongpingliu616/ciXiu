import areaData from 'china-area-data';

// 兼容不同的导出结构
const pcaa = areaData.pcaa || areaData; 

// 将 china-area-data 转换为 uview-plus picker 需要的 children 嵌套结构
const generateRegionData = () => {
    // 安全获取数据，防止 pcaa 或 pcaa['86'] 为 undefined
    if (!pcaa || !pcaa['86']) {
        console.error('china-area-data 加载失败或数据结构不匹配');
        return [];
    }

    const provinces = pcaa['86'];
    const result = [];

    for (const provinceCode in provinces) {
        const province = {
            text: provinces[provinceCode],
            value: provinceCode,
            children: []
        };

        const cities = pcaa[provinceCode];
        for (const cityCode in cities) {
            const city = {
                text: cities[cityCode],
                value: cityCode,
                children: []
            };

            const areas = pcaa[cityCode];
            for (const areaCode in areas) {
                // 排除 "市辖区" 这种无意义的区级名称，或者根据需求保留
                // china-area-data 中有些区级可能只有“市辖区”
                const area = {
                    text: areas[areaCode],
                    value: areaCode
                };
                city.children.push(area);
            }
            
            // 如果城市没有下属区县（虽然少见，但做个防护），可以加一个占位或者直接push
            if (city.children.length === 0) {
                 // 某些特殊行政单位可能没有下级，或者数据问题
                 // city.children.push({ text: '', value: '' }); 
            }

            province.children.push(city);
        }

        result.push(province);
    }
    return result;
};

const regionData = generateRegionData();

export default regionData;
