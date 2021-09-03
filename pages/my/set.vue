<template>
	<view>
		<view class="items" v-for="(item,index) in page_list" :key="index" @click="item_cli(index)">
			{{item}}
			<u-icon name="arrow-right" color="#999" v-if="index != 4"></u-icon>
			<view v-else style="color: #999999;">{{all}}</view>
		</view>
		<view class="items" @click="item_cli(99)">
			版本号
			<view style="color: #999999;">{{banbh}}</view>
		</view>
		<view class="tuichu">
			<tb-button buttitle="退出账号" @but_cli="but_cli"></tb-button>
		</view>
		<!-- 二维码 -->
		<template >
			<mosowe-canvas-image 
				ref="mosoweCanvasComponents" 
				@canvasImage="_canvasImage" 
				:lists="lists" 
				height="300" 
				width="300" 
				showPreview />
		</template>
	</view>
</template>

<script>
	import MosoweCanvasImage from '../../components/mosowe-canvas-image/mosowe-canvas-image.vue'
	export default {
		data() {
			return {
				page_list:[
					'个人信息设置',
					'账户安全',
					'服务政策',
					'隐私协议',
					'清空缓存',
					'我的二维码'
				],
				all:'0B',
				banbh:'1.0.00',
				canvasUrl: '',
				lists: [
					{
						type: 'qr',
						content: JSON.stringify({ryuuid: uni.getStorageSync('userinfo_Data').id}),
						width: 280,  
						height: 280,  
						x: 10, 
						y: 10,
						arc: true, 
						arcX: 250, 
						arcY: 250, 
						arcR: 50 
					}
				],
				qrcodeShow:false,
			}
		},
		components:{
			MosoweCanvasImage
		},
		onLoad() {
			this.page_hc()
		},
		methods: {
			item_cli(e){
				if(e == 0){
					this.com.navto('./user_set') //个人信息设置
				}else if(e == 1){
					this.com.navto('./user_anq')
				}else if(e == 2){
					this.com.navto('../login/agreement_page?type='+e)
				}else if(e == 3){//清楚缓存
					this.com.navto('../login/agreement_page?type='+e)
				}else if(e== 4 ){
					this.del_hc()
				}else if(e== 5 ){
					this.beginCanvas()
				}else if(e == 99){
					this.com.msg('无更新')
				}
			},
			agreement(e){
				console.log(e)
			},
			but_cli(){
				this.com.navto('../login/login') //登录
				this.api.get('home/delUserToken/'+uni.getStorageSync('userinfo_Data').id).then(res=>{
					console.log(res)
				})
				uni.removeStorageSync('token')
			},
			//缓存
			page_hc(){
				plus.cache.calculate(  ( size ) =>{ //size是多少个字节单位是b
					console.log(size)
						//你可以做下面相应的处理
					if(size<1024){
						this.all=size+'B'; 
					}else if(size/1024>=1 && size/1024/1024<1){
						this.all= Math.floor(size/1024*100)/100+'KB';
					}else if(size/1024/1024>=1){
						this.all=Math.floor(size/1024/1024*100)/100+'MB';
					}else if(size/1024/1024/1024>=1){
						this.all=Math.floor(size/1024/1024*100)/100+'GB';
					}
				})
			},
			//清除缓存
			del_hc(){
				let that = this
				// 使用plus.cache.calculate 获取应用的缓存大小，
				 plus.cache.calculate(  ( size ) =>{ //size是多少个字节单位是b
				 console.log(size)
				     //你可以做下面相应的处理
					 if(size<1024){
						 this.all=size+'B'; 
					 }  
					 else if(size/1024>=1 && size/1024/1024<1){
						 this.all= Math.floor(size/1024*100)/100+'KB';
					 } 
					else if(size/1024/1024>=1){
					      this.all=Math.floor(size/1024/1024*100)/100+'MB';
					}
					 //可以询问用户是否删除
					uni.showModal({
							title:'提示',
							content:'确定清除缓存吗?',
							success(res) {
							// 用户确定要删除
								if(res.confirm){
								//使用plus.cache.clear 清除应用中的缓存数据 这里清除后还要二十几KB没有清除，达不到全部清除
									plus.cache.clear( function () {
										uni.showToast({
											title:'清除成功',
											icon:'none',
											success() {
												that.page_hc()
											}
										})
									});	
								}
							}
					})
				});
			},
			beginCanvas () {
				this.$refs.mosoweCanvasComponents.createCanvas();
			},
			_canvasImage (e) {
				this.canvasUrl = e;
			}
		}
	}
</script>

<style>
page{
	background-color: #F6F6F6;
}
</style>
<style scoped lang="scss">
	.qrcodeImg{
		position: fixed;left: 30rpx;top: 36%;
	}
.items{
	width: 100%;padding: 0 2%;
	line-height: 100rpx;background-color: #FFFFFF;margin-bottom: 2rpx;
	display: flex;justify-content: space-between;
}
.tuichu{
	width: 100%;
	position: fixed;left: 0;bottom: 5%;
}
</style>
