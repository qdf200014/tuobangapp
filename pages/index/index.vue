<template>
	<view class="wrap" >
		<tb-pulldown bgcolor="#fd4142" textcolor="#000" :pullshow="false" :scrollY="false" @onRefresh="onRefresh">
			<view slot="detail">
				<!-- //内容 -->
				<view class="page_content" style="padding-top: 80rpx;">
					<view class="pageHeader_child">
						<!-- 天气 --> 
						<view class="weather">
							<view class="weathertext norow" @click="go_dis"> 
								{{district || '正在获取'}}
								<u-icon name="arrow-down"></u-icon>
							</view>
							<view class="weathertext2" v-if="district != '全国'">{{ weathertype }} {{ weathersize + '℃' }}</view>
						</view>
						<!-- 搜索 -->
						<view class="search"
							@click="goto_page('../searchPage/searchPage?address='+addresscont+'&district='+district)">
							<image class="search_img" src="../../static/search.png" mode=""></image>
						</view>
						<view style="width: 180rpx;text-align: center;padding-top: 20rpx;" @click="scanCode">
							<u-icon name="scan" color="white" size="46"></u-icon>
						</view>
					</view>
					<!-- tab -->
					<view class="head_tab">
						<u-tabs :list="list" :is-scroll="false" :current="current" 
						bgColor="rgba(0,0,0,0)" @change="change" font-size="36"
						inactiveColor="#fff" activeColor="#fff" item-width="200" 
						bar-width="30" bar-height="10" :bar-style="{'background-color':'#ffd800'}"
						></u-tabs>
					</view>
				</view>
				<!-- //swiper -->
				<view class="swiper" >
					<swiper  class="swiper_zi" :current="current" @change="swiperchange">
						<!-- 提供帮助 -->
						<swiper-item class="swiper_item">
							<scroll-view  scroll-y="true" class="scroll-Y">
								<tb-index-tabsA :bargData="bargData" :offertohelp="offertohelp" :district="district"
								 :seniority="seniority" @go_detail="go_detail" @go_master="goMaster"
								 :QYseniority="QYseniority"></tb-index-tabsA>
							</scroll-view>
							
						</swiper-item>
						<!-- 寻求帮助 -->
						<swiper-item class="swiper_item">
							<scroll-view scroll-y :show-scrollbar="false" class="scroll-Y" style="height: 100%;" @scrolltolower="scroll">
								<tb-index-tabsB :datas="askhelp" @popCli="popCli" @priceConfirm="priceConfirm"
								@serve_map="serve_map" @gochat="gochat" :userId="userId"></tb-index-tabsB>
								<!-- <view class="nogd"> 没有更多了</view> -->
							</scroll-view>
						</swiper-item>
						<!-- 急需帮助 -->
						<swiper-item class="swiper_item">
							<scroll-view scroll-y :show-scrollbar="false" class="scroll-Y" style="height: 100%;" @scrolltolower="scroll">
								<tb-index-tabsC :datas="worryhelp" @priceConfirmC="priceConfirmC"  @popCliC="popCliC" @go_detail="go_detail"
								@go_map="go_map" @gochaC="gochaC" :userId="userId" :jiaz="jiaz"></tb-index-tabsC>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			
			</view>
		</tb-pulldown>
	</view>
</template>

<script>
	import { ip } from '../../api.js';
	export default{
		data(){
			return{
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 'px', //导航栏
				city: '', //城市
				district: '', //区
				weathertype: '晴', //温度状态
				weathersize: '0', //温度
				list:[
					{
						name:'求助广场'
					}, {
						name: '帮助广场'
					}, {
						name: '紧急求助',
					}
				],
				current:0,//tabs切换
				positionSty:'none',
				offertohelp:[],//提供帮助待帮
				worryhelp:[],//急需帮助
				bargData:[],//嘚瑟内容
				askhelp:[],//帮助广场
				seniority :[],//排行个人
				QYseniority:[],//企业排行
				pageB:1,//分页
				pageC:1,
				idexBtype:0,//寻求帮助的排序
				idexCtype:0,//急需帮助的排序
				addresscont:{
					longitude:'',
					latitude:''
				},
				isEnterprise:0,//是否是企业 0 个人 1企业
				timeFilter:'',//寻求
				timeFilterC:{priceFilter: ["", ""]},//急需
				userId:uni.getStorageSync('userinfo_Data').id,
				jiaz:false
			}
		},
		onLoad() {
			this.weather()//获取地区
			
			//监听登录时间
			if(uni.getStorageSync('userinfo_Data')){
				uni.request({
					url:ip + 'home/getAccessTime/'+uni.getStorageSync('userinfo_Data').id,
					method:"GET",
					header: { 'content-type': 'application/json' },
					success(res) {
						console.log(res)
					}
				})
			} 
		},
		onShow() {
			this.page_data()
			uni.getNetworkType({
			    success: function (res) {
			        console.log(res.networkType);
				
					if(res.networkType == 'none'){
						this.com.msg('无网络')
					}else{
						// console.log(123)
						// this.weather() 
					}
			    }.bind(this)
			});
			this.addressreq()//地区
		},
		
		methods:{
			//帮助广场
			gochat(e){
				console.log(e)
				this.api.get('chat/add/'+e.ryUuid +'/'+e.serveUuid+'/'+1).then(res=>{
					// console.log(res)
					if(res.flag){
						//id发布人 bzuuid是任务或服务id
						this.com.navto('../chat/chat?name='+e.name+'&id='+e.ryUuid+'&bzuuid='+e.serveUuid+'&type='+ 1 +'&chatId='+res.data)
					}
				})
			},
			//急求帮助
			gochaC(e){
				// console.log(e)
				this.api.get('chat/add/'+e.ryId +'/'+e.bzUuid+'/'+0).then(res=>{
					// console.log(res)
					if(res.flag){
						//id发布人 bzuuid是任务或服务id
						this.com.navto('../chat/chat?name='+e.bkName+'&id='+e.ryId+'&bzuuid='+e.bzUuid+'&type='+ 0+'&chatId='+res.data)
					}
				})
			},
			//页面触底
			scroll(e){
				// console.log(e)
				if(this.current == 1){//帮助
					this.pageB ++
					this.funhelpask(this.pageB)
				}else if(this.current == 2){//急求
					this.pageC ++
					this.needHelp(this.pageC)
				}
			},
			//地区
			addressreq(){
				if(uni.getStorageSync('address').dist){ //有城市
					this.district = uni.getStorageSync('address').dist  //区
					
					this.city = uni.getStorageSync('address').name //市
					this.page_data()
				}else{
					if(uni.getStorageSync('address').name){
						this.district = uni.getStorageSync('address').name
						
						this.city = uni.getStorageSync('address').name //市
						this.page_data()
					}
				}
				this.tianqi()//天气
			},
			//刷新
			onRefresh(){
				this.page_data()
				if(this.current == 1){//帮助
					this.pageB = 1
					this.askhelp = []
					this.funhelpask(this.pageB)
				}else if(this.current == 2){//急求
					this.worryhelp = []
					this.pageC = 1
					this.needHelp(this.pageC)
					
				}
				
			},
			change(e){
				// console.log(e)
				this.current = e
				this.userId = uni.getStorageSync('userinfo_Data').id
			},
			// 到个人主页
			goMaster(e){
				this.com.navto('../my/master_page?id='+e)
			},
			//首页数据
			page_data(){
				let that = this
				//排行  0个人   1企业
				that.api.get('integral/king/'+0,{
					address:that.district,
					size:5,page:1
				}).then(res=>{
					// console.log(res)
					if(res.flag){
						res.data.forEach((it,index)=>{
							it.index = index
						})
						that.seniority = res.data
					}
				})
				that.tianqi()//天气
				// 企业排行
				// that.api.get('king/king/'+1,{
				// 	address:that.district,
				// 	size:5,page:1
				// }).then(res=>{
				// 	console.log(res)
				// 	if(res.flag){
					
				// 		that.QYseniority = res.data
				// 	}
				// })
				
				// 嘚瑟
				that.api.get('show/getLastestShowContent').then(res=>{
					// console.log(res)
					if(res.flag){
						that.bargData = res.data
					}
				})
				//提供帮助待帮
				that.api.post('home/index/help',{
					longitude: that.addresscont.longitude,
					latitude:that.addresscont.latitude,
					address:that.district,
					userAddress:that.city
					}).then(res=>{
						// console.log(res)
					if(res.flag){
						that.offertohelp = res.data
					}else{
						that.offertohelp = ''
					}
				})
			},
			//寻求帮助筛选
			popCli(e){
				// console.log(e)
				this.idexBtype = e
				this.pageB = 1
				this.askhelp = []
				this.funhelpask(this.pageB)
			},
			// 寻求帮助筛选确定
			priceConfirm(fil,type){
				// console.log(fil,type)
				this.timeFilter = fil
				this.isEnterprise = type
				
				this.pageB = 1
				this.askhelp = []
				this.funhelpask(this.pageB)
				
			},
			//  222 帮助广场
			funhelpask(e){
				this.api.post('serve/list',{
					longitude: this.addresscont.longitude,
					latitude:this.addresscont.latitude, 
					size:10,page:e,
					address:this.district,
					sort:this.idexBtype,
					isEnterprise:this.isEnterprise,
					filter:this.timeFilter
				}).then(res=>{
					console.log(res)
					if(res.flag){
						this.askhelp = this.askhelp.concat(res.data)
					}
				})	 
			},
			//急需筛选
			popCliC(e){
				this.idexCtype = e
				this.worryhelp = []
				this.pageC = 1
				this.needHelp(this.pageC)
			},
			priceConfirmC(e){
				this.timeFilterC = e
				this.worryhelp = []
				this.pageC = 1
				this.needHelp(this.pageC)
			},
			//急需帮助
			needHelp(e){
				//急需帮助
				this.api.post('help/list',{
					longitude: this.addresscont.longitude,
					latitude:this.addresscont.latitude,
					isUrgent:1,
					size:10,page:1,
					sort:this.idexCtype,
					address:this.district,
					filter:this.timeFilterC
				}).then(res=>{
					// console.log(res)
					if(res.flag){
						this.worryhelp =this.worryhelp.concat(res.data) 
						if(res.data < 10){
							this.jiaz = true
						}
					} 
				})
			},
			//天气
			tianqi(){
				uni.request({
					url: 'http://wthrcdn.etouch.cn/weather_mini?city=' + this.city,
					data: {},
					success: res => {
						// console.log(res.data)
						if(res.data.data.forecast[0]){
							this.weathertype = res.data.data.forecast[0].type;
						}
						this.weathersize = res.data.data.wendu;
					}
				});
			},
			// 地区
			weather() {
				var that = this;
				uni.getLocation({
					type: 'wgs84',
					geocode: true, //必写项
					success: data => {
						// console.log(data);
						if (data.address) {
							that.addresscont = data;
							that.city = data.address.city;
							that.district = data.address.city; //区
							that.page_data()
							that.funhelpask(that.pageB)
							that.needHelp(that.pageC)
							let arr = {
								name: data.address.city,
								dist:''
							}
							//地区
							uni.setStorageSync("address",arr)
							that.tianqi()
						}
					},fail(arr) {
						that.district = '获取失败'
						console.log(arr)
					}
				});
				
				
			},
			//搜索
			goto_page(e){
				uni.navigateTo({
					url:e
				})
			},
			//滑动页面
			swiperchange(e){
				// console.log(e)
				this.current = e.detail.current
				this.userId = uni.getStorageSync('userinfo_Data').id
			},
			//提供帮助待帮详情
			go_detail(e){
				this.com.navto('./task_detail?id='+e)
			},
			// 定位
			go_dis(){
				this.com.navto('../city/city?city='+this.city+'&dis='+uni.getStorageSync('address').dist)
			},
			// 急需地图
			go_map(){
				uni.navigateTo({
					url:'./map_page?data='+JSON.stringify(this.worryhelp)+'&longitude='+this.addresscont.longitude+'&latitude='+this.addresscont.latitude
				})
			},
			// 服务都地图
			serve_map(){
				uni.navigateTo({
					url:'./map_serve?data='+JSON.stringify(this.askhelp)+'&longitude='+this.addresscont.longitude+'&latitude='+this.addresscont.latitude
				})
			},
			// 扫码
			scanCode(){
				 var result = this.permision.requestAndroidPermission('android.permission.CAMERA')
				 console.log(result)
				let that = this
				uni.scanCode({
				    success: function (res) {
						console.log('条码内容：' + res.result);
						if(typeof res.result == 'string'){
							let id = JSON.parse(res.result)
							if(id.ryuuid){
								that.com.navto('../my/master_page?id='+id.ryuuid)
							}else{
								that.com.msg('查询不到该用户')
							}
						}else{
							that.com.msg('查询不到该用户')
						}
				    },fail(arr){
						console.log(arr)
					}
				});
			}
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
</style>
<style scoped lang="scss">

.page_content{
	width: 100%;padding-bottom: 25rpx;
	background-image: url(../../static/index/indexHead.png);
	background-size: 100% 100%;
}
.pageHeader_child {
	display: flex;
	padding-top: 15rpx;
	margin-bottom: 36rpx;
	.weather {
		width: 200rpx;
		padding:0 30rpx;
		.weathertext {
			width: 170rpx;
			color: #fff;
			font-size: 34rpx;
		}
	}
	
	.weathertext2 {
		color: #fff;
		font-size: 26rpx;
		white-space: nowrap;
	}
	
	/* 导航 */
	.head_tab {
		width: 100%;margin: 120rpx 0;
		display: flex;justify-content: space-around;
	}
	.headerTabtext {
		
		color: #fff;
		width: 200rpx;text-align: center;
		&.active{
			color: #FFFFFF;font-weight: bold;
			border-bottom:5rpx solid red;
		}
		
	}
}
/* 搜索 */
.search {
	width: 720rpx;
	height: 74rpx;
	margin-left: 15rpx;
	background-color: white;
	border-radius: 80rpx;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	.search_img {
		width: 36rpx;
		height: 36rpx;
		margin: 10px 5px 0 16px;
	}
	.search_text2 {
		width: 160rpx;
		height: 36px;
		line-height: 72rpx;
		background-color: #00b4ff;
		text-align: center;
		border-radius: 100rpx;
		margin: 4rpx;
		color: white;
		font-size: 36rpx;
	}
}
//滑动
.swiper{
	height: 90vh;
	width: 100%; 
	.swiper_zi{
		width: 100%;height: 100%;
		.swiper_item{
			width: 100%;height: 100%;
			box-sizing: border-box;
			margin-bottom: 50rpx;
			.scroll-Y{
				height: 100%;
				// border-radius: 50rpx 50rpx 0 0;
			}
			.swiper-item_child{   
				width: 100%;
			}
		}
	}
	
}

</style>