
//AppSecret：419896cecc3906f6e36c207d24faa3ec
//AppID：wxd3d427c6d0beaf19
// 包名：com.tuobangok

//192.168.1.2:19091
// 8.140.149.104:19091
const commoneUrl  = "http://8.140.149.104:19091/pufuapp/"; //公共路径 
var that = this
//post请求封装
function postRequest(url,data,type){
	var promise = new Promise((resolve,reject) => {
		var postData = data;
		uni.request({
			url:commoneUrl + url,
			data:postData,
			method:'POST',
			// dataType:"jsonp",
			// jsonp:"callbackparam",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名
			// jsonpCallback:"success_jsonpCallback",

			header:{
				'content-type': type || 'application/json;charset=UTF-8','token':uni.getStorageSync('token')},
			success:function(res){
				resolve(res.data);
				if(res.data.message == '请先登录'){
					uni.showModal({
						content:'您未登录，是否去登录？',
						cancelText:"再逛逛",
						confirmText:'去登陆',
						success(e) {
							if(e.confirm){
								uni.navigateTo({
									url:'/pages/login/login'
								})
							}
						}
					})
				}
			},
			error:function(e)
			{
				reject('网络出错');
			}
		})
	});
	return promise;
}

//get请求封装
function getRequest(url,data){
	var promise = new Promise((resolve,reject) => {
			var postData = data;
			uni.request({
				url:commoneUrl + url,
				data:postData,
				method:"GET",
				dataType:'json',
				header:{
					'content-type': 'application/json','token':uni.getStorageSync('token')},
				success:function(res){
					resolve(res.data);
					if(res.data.message == '请先登录'){
						uni.showModal({
							content:'您未登录，是否去登录？',
							cancelText:"再逛逛",
							confirmText:'去登陆',
							success(e) {
								if(e.confirm){
									uni.navigateTo({
										url:'/pages/login/login'
									})
								}
							}
						})
					}
				},
				error:function(e)
				{
					reject('网络出错');
				}
			});
	});
	return promise;
}
//put请求封装
function putRequest(url,data,heads){
	var promise = new Promise((resolve,reject) => {
			var postData = data;
			uni.request({
				url:commoneUrl + url,
				data:postData,
				method:"PUT",
				dataType:'json',
				header:{
					'content-type': 'application/json','token': uni.getStorageSync('token')},
				success:function(res){
					resolve(res.data);
					
				},error:function(e){
					reject('网络出错');
				}
			});
	});
	return promise;
}
//del请求封装
function delRequest(url,data){
	var promise = new Promise((resolve,reject) => {
			var postData = data;
			uni.request({
				url:commoneUrl + url,
				data:postData,
				method:"DELETE",
				dataType:'json',
				header:{
					'content-type': 'application/json','token': uni.getStorageSync('token')},
				success:function(res){
					resolve(res.data);
				
				},error:function(e){
					reject('网络出错');
				}
			});
	});
	return promise;
}
module.exports = {
    post: postRequest,
    get: getRequest,
	put: putRequest,
	del: delRequest,
	ip: commoneUrl
};

// request.get('HomePageController/selectShoppingList.do',data).then(res=>{
// 	console.log(res,444444444444444);	
// 	this.goods = []
// 	if(res.data.code == 200){
// 		  this.goods = that.data.goods.concat(res.data.data)
// 	  }
// })  