import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useLoginStore = defineStore('loginInfo',() => {
	let currentRole = ref(''); // 'XN' or 'GZ'
	let userInfoXn = reactive({
			count:0,
			user: "admin" , 			
			// token: "dfd984jdfjjhfah42387", 			
			token: "", 			
			id: "45665785785" ,
			status: 0 
		})
	let userInfoGz = reactive({
			zcount:0,
			user: "admin" , 			
			// token: "dfd984jdfjjhfah42387", 			
			token: "",
			id: "45665785785" ,
			status: 0 
		})
	function increment() {
			this.count++;
		}
	
	function setRole(role) {
		currentRole.value = role;
		uni.setStorageSync('currentRole', role);
	}
	
	// 初始化时从 storage 读取
	const storedRole = uni.getStorageSync('currentRole');
	if (storedRole) {
		currentRole.value = storedRole;
	}

	return { userInfoXn, userInfoGz, increment, currentRole, setRole };
});