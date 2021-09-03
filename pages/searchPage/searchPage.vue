<template>
	<view class="box" >
		<view v-if="searchshow">
			<view class="headTab">
				<u-tabs :list="list" :is-scroll="false" :current="current" bgColor="#fff" @change="change"
				 activeColor="#000" item-width="200" bar-width="30"
				></u-tabs>
			</view>
			<view class="swiper" style="margin-top: 80rpx;">
				<swiper  class="swiper_zi" :current="current" @change="swiperchange">
					<!-- 提供帮助 -->
					<swiper-item class="swiper_item">
						<scroll-view  scroll-y="true" class="scroll-Y">
							<tb-pulldown bgcolor="#f5f5f5" textcolor="#000" :scrollY="true" @onRefresh="onRefresh" @pulldown="pulldown"
							:status="status" :content-text="contentText">
								<view slot="detail" >
									<tb-indexA-db :paixInd="paixInd" @go_detail="goDetail" @go_map="go_map" @popCli="popCli"
									 :datas="pageList" @priceConfirm="priceConfirm"></tb-indexA-db>
									 <view class="kun" v-if="pageList == ''">
									 	<tb-kunNews></tb-kunNews>
									 </view>
								</view>
							</tb-pulldown>
						</scroll-view>
					</swiper-item>
					<!-- 寻求帮助 -->
					<swiper-item class="swiper_item">
						<scroll-view  scroll-y="true" class="scroll-Y"  style="width: 96%;margin-left: 2%;">
							<tb-pulldown bgcolor="#f5f5f5" textcolor="#000" :scrollY="true" @onRefresh="onRefresh" @pulldown="pulldown"
							:status="status" :content-text="contentText">
								<view slot="detail" >
									<tb-index-tabsB :datas="askhelp" @popCli="popCli" @priceConfirm="priceConfirm"></tb-index-tabsB>
									<view class="kun" v-if="askhelp == ''">
										<tb-kunNews></tb-kunNews>
									</view>
								</view>
							</tb-pulldown>
						</scroll-view>
					</swiper-item>
					<!-- 用户 -->
					<swiper-item class="swiper_item">
						<scroll-view  scroll-y="true" class="scroll-Y" style="background-color: #eef3f6;">
							<view style="padding: 3%;">
								<view class="items" v-for="(it,index) in userlist" :key="index" @click="go_master(it.ryUuid)">
									<view class="items_top">
										<image :src="it.ryHeadImg" mode="aspectFill"></image>
										<view class="items_top_cont">
											<view class="cont_name">{{it.ryPetName}}</view>
											<view class="items_bottom">
												<view class="items_bottom_l">
													{{it.grade}}
												</view>
												<view class="items_bottom_r">
													{{it.myFans}}位粉丝
												</view>
											</view>
										</view>
										<view>
											<view @click.stop="quguan(it.ryUuid,index)">
												<view class="items_top_right" v-if="it.state == 3">互相关注</view>
												<view class="items_top_right" v-else-if="it.state == 2">已关注</view>
											</view>
											<view v-if="it.state == 1" >
												<view class="items_top_right_active"  @click.stop="quguan(it.ryUuid,index)">+ 关注</view>
											</view>
										</view>
									</view>
									
								</view>
								<view class="kun" v-if="userlist == ''">
									<tb-kunNews></tb-kunNews>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view v-else>
			<!-- 热门搜索 -->
			<view v-if="search_hot">
				<view class="zl-search-hot">
					<view class="zl-hot-title">
						<text>热门搜索</text>
					</view>
				</view>
				<!-- 内容 -->
				<view class="zl-hot-text">
					<text v-for="(item,index) in search_hot" @click="again(item.search_word)" :key="index">{{item.search_word}}</text>
					
				</view>
			</view>
			<!-- 历史搜索 -->
			<view v-if="history.length !=0" style="width: 100%;">
				<view class="zl-history-box">
					<view class="zl-history">
						<text>历史搜索</text>
					</view>
					<!-- <image src="" class="zl-delete" @click="deles"></image> -->
					<view style="color: red;" @click="deles">删除</view>
				</view>
					<!-- 内容 -->
				<view class="zl-search-history">
					<text v-for="(item,index) in history" :key="index" @click="again(item)">{{item}}</text>
				</view>
			</view>
		</view>
		<view>
			
		</view>
	</view>
</template>

<script>
	import indexAlist from '../index/indexAlist.vue'
	export default {
		data() {
			return {
				search_hot:["搬家(急)","帮买狗粮","买感冒药","扛水泥","临时刷墙工"],
				search_s:"",//搜索关键字
				history:[],//搜索历史
				list:[
					{
						name:'求助'
					}, {
						name: '帮助'
					}, {
						name: '用户',
					}
				],
				searchshow:false,//搜索展示
				current:0,//导航
				pageList:[],//待帮
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中~',
					contentnomore: '没有更多了'
				},
				askhelp:[],//服务
				pages:1,//待帮分页
				pageB:1,//服务
				pageC:1,//用户
				addresscont:'',//经纬度
				district:'',
				userlist:[],//用户搜索
				timeFilter:{},//价格
				isEnterprise:0, 
				idexBtype:0,//寻求帮助排序
				paixInd:0,
				lowprice:'',//最低价
				tallprice:'',//最高价
				bzType:2,
			}
		},
		components:{
			indexAlist
		},
		onLoad(op) {
			console.log(op)
			this.api.get('hsSearchRecords/tenDaysKeyword').then(res=>{
				console.log(res)
				if(res.flag){
					this.search_hot = res.data
				}
			})
			this.addresscont = op.address
			let aq = uni.getStorageSync('neirong')
			this.history =JSON.parse(aq)
			this.district = op.district
			
			
		},
		onNavigationBarButtonTap(e) {
			if(this.search_s == ''){
				this.com.msg('不能为空')
			}else{
				this.go_search(this.search_s)
			}
		},
		onNavigationBarSearchInputChanged(e) {
			this.search_s = e.text
		},
		//用户点击软键盘上的“搜索”按钮时触发。
		onNavigationBarSearchInputConfirmed	(){
			console.log(this.search_s)
			if(this.search_s == ''){
				this.com.msg('不能为空')
			}else{
				this.go_search(this.search_s)
			}
		},
		watch:{
			search_s(a,b){
				if(a == ''){
					this.searchshow = false
				}
			}
		},
		methods: {
			// 刷新
			onRefresh(){
				if(this.current == 0){
					this.pages = 0
					this.pageList = []
					this.pageData(this.pages)
				}else if(this.current == 1){
					this.pageB = 0
					this.askhelp = []
					this.funhelpask(this.pageB) 
				}else if(this.current == 2){
					this.pageB = 0
					this.userlist = []
					this.funhelpask(this.pageB) 
				}
			},
			//搜索
			go_search(key){
				console.log(key)
				// if(this.search_s== ""){
				// 	this.com.msg('搜索内容不能为空')
				// 	return
				// }
				this.userlist = []
				this.askhelp = []
				this.pageList = []
				//存储
				if(this.history.indexOf(this.search_s) == -1){
					this.history.unshift(this.search_s)  //unshift:跟push性质一样 区别就是将新添加的数据放在第一位
				}
				if(this.history.length > 8){
					this.history.pop()
				}
				uni.setStorage({
					key: 'neirong',
					data: JSON.stringify(this.history)//转换为字符串形式
				})
				//存储
				//接口
				this.searchshow = true
				this.pageData(this.pages)
				this.funhelpask(this.pageB) 
				this.user(this.pageC) //帮主
				
			},
			// 删除搜索历史
			deles(){
				let that = this
				uni.showModal({
				    title: '提示',
				    content: '确定要删除历史搜索吗',
				    success: function (res) {
				        if (res.confirm) {
							
							that.history =[]
							uni.removeStorage({
								key: 'neirong',
								success: function(res) {
									uni.showToast({
										title:'清空成功',icon:'none'
									})
								}
							});
				        } else if (res.cancel) {
				            
				        }
				    }
				});
				
			},
			// 点击搜索历史再次搜索
			again(item){
				this.search_s = item
				this.go_search(item)
				let webView =this.$mp.page.$getAppWebview();
				webView.setTitleNViewSearchInputText(item);
				
			},
			//导航
			change(e){
				this.current = e
			}, 
			// 滑动
			swiperchange(e){
				// console.log(e)
				this.current = e.detail.current
			},
			//加载
			pulldown(){
				if(this.current == 0){
					this.status = 'loading'
					this.pages++
					this.pageData(this.pages)
				}else if(this.current == 1){
					this.status = 'loading'
					this.pageB++
					this.funhelpask(this.pageB) 
				}else if(this.current == 2){
					this.status = 'loading'
					this.pageB++
					this.funhelpask(this.pageB) 
				}
				
			},
			// 待帮
			pageData(e){
				let pri = {
					 priceFilter:[this.lowprice,this.tallprice]
				}
				this.api.post('help/list',{
					page:e,
					size:10,
					isUrgent:0,
					longitude:this.addresscont.longitude|| 116.34863, //
					latitude: this.addresscont.latitude || 39.938732,  //  
					keyword:this.search_s,
					address:this.district,
					filter:pri,
					bzType:this.bzType
				}).then(res=>{
					console.log(res)
					this.pageList = this.pageList.concat(res.data)
					if(res.data && res.data.length < 10){
						this.status = 'noMore'
					}
				})
			},
			// 寻求帮助
			funhelpask(e){
				
				this.api.post('serve/list',{
					longitude:this.addresscont.longitude|| 116.34863, // 
					latitude: this.addresscont.latitude || 39.938732,  //  
					size:10,page:e,
					address:this.district,
					sort:this.idexBtype,
					isEnterprise:this.isEnterprise,
					filter:this.timeFilter,
					keyword:this.search_s
				}).then(res=>{
					console.log(res)
					if(res.flag){
						this.askhelp =this.askhelp.concat(res.data) 
						if(res.data && res.data.length < 10){
							this.status = 'noMore'
						}
					}
				})	 
			},
			// 帮主
			user(e){
				this.api.post('person/selPetName',{petName:this.search_s,page:e}).then(res=>{
					console.log(res)
					if(res.flag){
						this.userlist =this.userlist.concat(res.data.list) 
						if(res.data && res.data.length < 10){
							this.status = 'noMore'
						}
					}
				})
			},
			// 服务筛选确定
			priceConfirm(fil,type){
				this.timeFilter = fil
				this.isEnterprise = type
				this.funhelpask(this.pageB) 
			},
			//服务排序
			popCli(e){
				this.idexBtype = e 
				this.funhelpask(this.pageB)
			},
			//到个人主页
			go_master(e){
				this.com.navto('../my/master_page?id='+e)
			},
			// 到详情
			goDetail(e){
				this.com.navto('../index/task_detail?id='+e)
			},
			
			// 确定
			priceConfirm(e){
				this.bzType = e.bztype
				this.lowprice = e.lowprice//最低价
				this.tallprice = e.tallprice//最高价
				this.pageList = []
				this.pages = 1
				this.pageData(this.pages)
			},
			//点击
			popCli(it){
				this.pageList = []
				this.shaiText = it.name
				this.paixInd = it.type
				this.pages = 1
				this.pageData(this.pages)
			},
			//到地图
			go_map(){
				this.com.navto('../index/map_page?data='+JSON.stringify(this.pageList)+'&longitude='+this.addresscont.longitude+'&latitude='+this.addresscont.latitude)
			},
		}
	}
</script>

<style lang="scss" scoped>
.items{
	width: 100%;padding: 3%;margin: 15rpx 0;border-radius: 20rpx;
	background-color: #fff;
	.items_top{
		display: flex;
		image{
			width: 140rpx;height: 140rpx;border-radius: 50%;
			margin-right: 15rpx;
		}
		.items_top_cont{
			width: 46%;margin: 15rpx 10rpx;
			.cont_name{
				font-size: 34rpx;
			}
			.items_bottom{
				display: flex;
				color: #999999;line-height: 66rpx;
				.items_bottom_l{
					width: 170rpx;
				}
			}
		}
		.items_top_right{
			text-align: center;margin: 20rpx ;
			padding: 10rpx 20rpx;border-radius: 50rpx;
			color: white;border: 2rpx solid #999999;color: #999999;
		}
		.items_top_right_active{
			text-align: center;
			padding: 10rpx 20rpx;background-color: #2292fb;border-radius: 50rpx;
			color: white;
			margin: 20rpx ;
		}
	}
	
}
//滑动
.swiper{
	height: 1400rpx;
	width: 100%;
	.swiper_zi{
		width: 100%;height: 100%;
		.swiper_item{
			width: 100%;height: 100%;
				box-sizing: border-box;
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

	.box{
		width: 100%;
		.headTab{
			width: 100%;
			position: fixed;left: 0;top: 0;z-index: 200;
		}
	}
	.zl-box{
		// width: 100%;
		display: flex;
		border:2rpx solid #00b4ff;
		border-radius: 50rpx;
		
		input{
			border-radius: 50rpx;
			height: 60rpx;
			padding-left: 30rpx;
		}
	}
	.zl-search{
		padding-left: 30upx;
		border-style: solid;
		border-color: #00b4ff;
		border-radius: 50upx;
		border-width: 4upx;
		margin: 15upx 0 0 0;
		height: 60upx;
	}
	
	.zl-search-btn{
		border-radius: 40rpx;
		background-color: #00b4ff;
		color: #ffffff;
		padding: 0 20rpx;
		height: 60rpx;
		line-height: 60rpx;
		font-size: 26rpx;
		display: flex;
	}
	
	.zl-history-box{
		width: 100%;
		display: flex;
		padding: 20upx;
		justify-content: space-between;
	}
	
	.zl-history{
		height: 60upx;
		font-size: 32upx;
		font-weight: bold;
		line-height: 60upx;
	}
	
	.zl-delete{
		width: 40upx;
		height: 40upx;
	}
	
	.zl-search-history{
		display: flex;
		flex-wrap: wrap;
		padding: 0 20rpx;
		text{
			background-color: #f3f3f3;
			margin: 15upx;
			padding: 0 25upx;
			text-align: center;
			border-radius: 40upx;
			max-width: 200rpx;
			height: 60rpx;line-height: 60rpx;
			display: inline-block;
			white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
		}
	}

	
	.zl-search-hot{
		display: flex;
		padding: 20upx 30upx;
	}
	
	.zl-hot-title{
		width: 80%;
		height: 60upx;
		font-size: 32upx;
		font-weight: bold;
		line-height: 60upx;
	}
	
	.zl-hot-text text{
		background-color: #f3f3f3;
		margin: 20upx 20upx;
		padding: 12upx 50upx;
		line-height: 40upx;
		border-radius: 40upx;
		display: inline-block;
	}
</style>
