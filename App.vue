<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			//跳转
		
			// #ifdef APP-PLUS
			// 使用5+App的方式进行监听消息推送
			plus.push.addEventListener("click", function(msg) {
				// console.log("click:" + msg); 
				console.log(msg.payload);
				console.log(JSON.stringify(msg));
				// onLaunch 生命周期里，页面跳转有问题,跳不过去
				// 应该是页面还没加载，加上定时后，就可以了；
				setTimeout(() => {
					// type：1 粉丝列表  参数：uid
					// type：2  订单流程  参数：jdUuid 
					if(msg.payload.type == 1){
						uni.navigateTo({
							url:'/pages/my/tongji/fans?id='+msg.payload.uid
						})
					}else if (msg.payload.type == 2){
						let leix = msg.payload.identity == 2 ? 1 : 2
						uni.navigateTo({
							url:'/pages/my/order_detail?id='+msg.payload.jdUuid+'&type='+leix+'&shengf='+msg.payload.identity //1帮主 2帮客
						})
					}else if (msg.payload.type == 3){
						uni.navigateTo({
							url:'/pages/my/disqualification?id='+msg.payload.jdUuid+'&type='+msg.payload.jdUuid.orderType
						})
					}else if (msg.payload.type == 4){
						uni.navigateTo({
							url:'/pages/my/list/qiuzhuxj'
						})
					}else if (msg.payload.type == 5){
						uni.navigateTo({
							url:'/pages/index/task_detail?id='+msg.payload.bzUuid
						})
					}
					
				}, 1200)
			}, false);
			// 监听在线消息事件    
			plus.push.addEventListener("receive", function(msg) {
				//业务代码
				 plus.push.createMessage( msg.content, msg.payload, {title:msg.title} );
				console.log("recevice:" + JSON.stringify(msg))
			}, false);
			
			// app锁定竖屏方向
				plus.screen.lockOrientation('portrait-primary');
			// #endif
			//点击中间
			uni.onTabBarMidButtonTap(() => {
				uni.navigateTo({
					url: '/pages/publish/issuePage',
					animationType: 'fade-in',
				});
			})
			// 网络断开
			uni.onNetworkStatusChange(function (res) {
			    console.log(res.isConnected);
			    console.log(res.networkType);
				if(res.isConnected == false){
					uni.navigateTo({
						url:'/pages/network/network'
					})
				}
			});
		},
		onShow: function() {
			console.log('App Show')
			// var args= plus.runtime.arguments;  
			// if(args){  
			// 	console.log(args)
			// 	// 处理args参数，如直达到某新页面等  
			// } 
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import 'pages/css/gg.css';
	
</style>
