import Vue from 'vue'
import Vuex from 'vuex'
// import CreatePersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		userinfo: {},
		agreement:false,
		xqdraft:{}
	},
	getters: {
		get_userinfo: state => state.userinfo,
		get_agreement: state => state.agreement,
	},
	mutations: {
		
		//需求草稿
		changeDataMut(state,params){  
			state.xqdraft = params
		},
		changeDatas(state,params){
			state.xqdraft = params
		},
	},
	actions: {
		
		changeDataAct({commit},params){  //context是一个对象，从它里面把咱们需要的commit方法解构出来
		    commit('changeDataMut',params)
		}
	},
	modules: {},
	plugins: [
		// CreatePersistedState({
		// 	storage: {
		// 		getItem: key => uni.getStorageSync(key),
		// 		setItem: (key, value) => uni.setStorageSync(key, value),
		// 		removeItem: key => uni.removeStorageSync(key)
		// 	}
		// })
	],
})
