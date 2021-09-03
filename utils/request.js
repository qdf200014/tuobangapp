// let ip = 'http://192.168.101.15:19091/pufuapp';
let ip = 'http://192.168.1.2:19091/pufuapp/';
import store from '../store/index.js'

function requestGet (url, data) {
	return new Promise((resolve, reject) => {
		uni.showLoading({
		    title: '加载中...'
		});
		let info = {
			ry_uuid:store.getters.get_userinfo.ry_uuid,
			...data
		}
		uni.request({
			url: ip + url,
			data: info,
			method: 'GET',
			dataType: 'JSON',
			success: (res) => {
				resolve(res);
				uni.hideLoading();
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}

function requestPost (url, data) {
	return new Promise((resolve, reject) => {
		uni.showLoading({
		    title: '加载中...'
		});
		let info = {
			ry_uuid:store.getters.get_userinfo.ry_uuid,
			...data
		}
		uni.request({
			url: ip + url,
			data: info,
			method: 'POST',
			dataType: 'JSON',
			success: (res) => {
				resolve(res);
				uni.hideLoading();
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export{
	requestGet,
	requestPost,
	ip,
}
