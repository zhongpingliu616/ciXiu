import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOrderStore = defineStore('order', () => {
    const listData = ref([]);
    const page = ref(1);
    const pageSize = ref(10);
    const noMore = ref(false);
    const loading = ref(false);
    
    // 重置状态
    function reset() {
        listData.value = [];
        page.value = 1;
        noMore.value = false;
        loading.value = false;
    }

    return {
        listData,
        page,
        pageSize,
        noMore,
        loading,
        reset
    };
});
