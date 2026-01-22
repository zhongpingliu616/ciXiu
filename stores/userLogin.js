import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { getUserInfo as getUserInfoApi } from '@/api/index';

export const useLoginStore = defineStore('loginInfo',() => {
	let currentRole = ref(''); // 'XN' or 'GZ'
	
	// 从本地缓存读取初始化数据，如果不存在则使用默认值
	const storedXn = uni.getStorageSync('userInfoXn') || {};
	let userInfoXn = reactive({
			count:0,
			user: "admin" , 			
			token: "", 			
			id: "45665785785" ,
			status: 0,
			...storedXn // 合并缓存数据
		});
		
	const storedGz = uni.getStorageSync('userInfoGz') || {};
	let userInfoGz = reactive({
			count:0,
			user: "admin" , 			
			token: "",
			id: "45665785785" ,
			status: 0,
			...storedGz // 合并缓存数据
		});
	function increment() {
			this.count++;
		};
	
	function setRole(role) {
		currentRole.value = role;
		uni.setStorageSync('currentRole', role);
	};
	
	// 初始化时从 storage 读取
	const storedRole = uni.getStorageSync('currentRole');
	if (storedRole) {
		currentRole.value = storedRole;
	};

	/**
	 * 合并更新用户信息并持久化
	 * @param {string} role - 角色标识 'XN' 或 'GZ'
	 * @param {object} data - 要更新的用户信息对象
	 */
	function updateUserInfo(role, data) {
		const isXn = role === 'XN';
		const targetInfo = isXn ? userInfoXn : userInfoGz;
		const storageKey = isXn ? 'userInfoXn' : 'userInfoGz';
		const tokenKey = isXn ? 'tokenXn' : 'tokenGz';

		// 1. 更新 Store (使用 Object.assign 进行浅合并)
		Object.assign(targetInfo, data);
		// 2. 更新 Token 持久化 (如果 data 中包含 token)
		if (data.token) {
			uni.setStorageSync(tokenKey, data.token);
		};

		// 3. 更新 UserInfo 持久化 (先读取旧缓存，再合并新数据，确保不丢失未更新的字段)
		const oldStorage = uni.getStorageSync(storageKey) || {};

		const newStorage = { ...oldStorage, ...data };
		uni.setStorageSync(storageKey, newStorage);
	};

	/**
	 * 获取并更新用户信息
	 */
	async function fetchUserInfo() {
		try {
			const res = await getUserInfoApi();
			if (res.code === 200) {
				// 使用当前角色更新用户信息
				updateUserInfo(currentRole.value, res?.data?.lists || {});
				return res.data;
			} else {
				console.error('获取用户信息失败:', res.msg);
				return null;
			};
		} catch (error) {
				console.error('获取用户信息异常:', error);
				return null;
		};
	};

	return { userInfoXn, userInfoGz, increment, currentRole, setRole, updateUserInfo, fetchUserInfo };
});