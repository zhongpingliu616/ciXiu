import { defineStore } from 'pinia';
export const useLoginStore = defineStore('loginInfo',() => {
	let userInfoXn = reactive({
			count:0,
			user: "admin" , 			
			// token: "dfd984jdfjjhfah42387", 			
			token: "dfd984jdfjjhfah42387", 			
			id: "45665785785" ,
			status: 0 
		})
	let userInfoGz = reactive({
			zcount:0,
			user: "admin" , 			
			// token: "dfd984jdfjjhfah42387", 			
			token: "34564563345",
			id: "45665785785" ,
			status: 0 
		})
	function increment() {
			this.count++;
		}
	return { userInfoXn, userInfoGz, increment };
});