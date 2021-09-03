<template> 
	<view class="pages">
		<view class="header">
			<view class="username marBut " @click="gotopage">
				<view class="imgBorder">
					<image class="userimg" :src="page_content.img" mode="aspectFill"  ></image>
				</view>
				<view class="headRight">
					<view class="headRightName">
						<text class="views norow">{{page_content.name}}</text>
						<image v-if="page_content.sex == '男'" class="nans" src="../../static/nan.png" mode=""></image>
						<image v-else class="nans" src="../../static/nu.png" mode=""></image>
					</view>
					<view class="grade">
						<view class="gradeClass">
							{{page_content.grade}}
						</view>
						<image v-if="page_content.isAuthentication" src="../../static/index/renzheng.png" mode=""></image>
					</view>
				</view>
			</view>
			<!-- 帮助简介 -->
			<view class="helpintor marBut redius26" >
				<view class="synopsis">
					<image v-if="page_content_two.isUrgent != 0" src="../../static/index/taskDetail/jinjipng.png" mode=""></image>
					<text class="helpTit">  {{page_content_two.jianjie}} </text>
				</view>
				<image class="xian" src="../../static/index/xiantiao.png" mode=""></image>
				<view class="help_distance">
					<view class="textsty">距离：
					{{page_content_two.distance < 1 ? page_content_two.distance * 1000 + 'm' : page_content_two.distance + 'km'}}
					</view> 
					<text class="textstyb">{{page_content_two.price == 0 ? '无偿帮助' : '酬金：'+ page_content_two.price + '元'}}</text>
				</view>
			</view>
			
			<!-- 地区 -->
			<view class="district redius26 marBut" @click="go_map">
				<view class="districtL">
					<image src="../../static/index/taskDetail/dibiao.png" mode=""></image>
					<view class="addressSty">
						<view class="">
							{{page_content_two.address}}
						</view>
						<view>
							{{page_content_two.position}}
						</view>
					</view>
				</view>
				<view class="districtR"> 
					<u-icon name="arrow-right" size="50"></u-icon> 
				</view>
			</view>
		</view>
		<view class="contents redius26">
			<!-- 相关照片 -->
			<view class="photo_attached" >
				<text  class="title">求助照片</text>
				<view class="images" >
					<image class="img redius26" v-for="(it,ind) in page_content_two.photo"  :src="it" 
					@click="img_pieve(page_content_two.photo,ind)" mode="aspectFill"></image>

				</view>
			</view>
			<image class="xian" src="../../static/index/xiantiao.png" mode=""></image>
			<view class="task_Detail_Data">
				<view class="title">求助详情</view>
				<view style="font-size: 34rpx;">  {{page_content_two.demand}}</view>
				
			</view>
			
			<image class="xian" src="../../static/index/xiantiao.png" mode=""></image>
			<!-- 限制 -->
			<view style="margin-bottom: 120rpx;" v-if="xianzhi">
				<text  class="title">帮主条件</text>
				<view class="astrict" >
					<view class="texst" v-if="xianzhishow.xueli">{{xianzhishow.xueli}} </view>
					<view class="texst" v-if="xianzhishow.zhiye">{{xianzhishow.zhiye}} </view>
					<view class="texst" v-if="xianzhishow.xingbie">{{xianzhishow.xingbie}}</view>
					<view class="texst" v-if="xianzhishow.nianling">{{xianzhishow.nianling}}</view>
					<view class="texst" v-if="xianzhishow.qita">{{xianzhishow.qita}}</view>
					<view class="texst" v-if="page_content_two.jieshutime">最晚响应时间：{{page_content_two.jieshutime}}</view>
				</view>
			</view>
		</view>
		
		<!-- 底部功能 -->
		<view class="bottom_function" v-if="!myselfType">
			<view class="bottom_function_left" @click="collect_c(0)">
				<view class="left_view" v-if="collect_show">
					<u-icon name="star" color="#333" size="36"></u-icon>
					<view class="viewcolor"  >收藏</view>
				</view>
				<view class="left_view" v-else  @click="collect_c(1)">
					 <u-icon name="star-fill" color="#f30600" size="36"></u-icon>
					<view class="viewcolor" >已收藏</view>
				</view>
			</view>
			<view class="bottom_function_right">
				<text class="button_r" @click="gochat">联系帮客</text>
				<text class="button_l" @click="goodHelp">我要帮助</text>
			</view>
		</view>
		
		<view class="bottom_function" v-else>
			<view></view>
			<view class="bottom_function_right">
				<view></view>
				<text class="button_l" @click="myBj">去编辑</text>
			</view>
		</view>
		<!-- 菜单 -->
		<tb-share ref="share" :page_content_two="page_content_two" :contentHeight="450" type="1"></tb-share>
		
		<u-popup v-model="commont_delShow" mode="bottom" border-radius="20">
			<view class="del_item" @click="delcommontCli(1)" >
				分享
			</view>
			<view class="del_item" @click="delcommontCli(2)" style="color: red;border-bottom: 1rpx solid #eee;">
				举报
			</view>
			<view class="del_item" @click="commont_delShow = false">
				取消
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				id:0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: "",
				longitude: "",
				collect_show:true,
				praise_show:true,
				page_can:'',//页面参数 id/
				page_content:'',//页面数据
				page_content_two:'',
				xiangimgs:[],//相关图片
				myselfType:false,
				isEditable:'',
				xianzhi:false,//限制显示
				xianzhishow:'',//限制内容
				commont_delShow:false
			}
		},
		onNavigationBarButtonTap(e) {
			let that = this
			console.log(e)
			this.commont_delShow = true
			
		},
		onLoad(e) {
			console.log(e)
			//获取页面参数
			this.page_can = e.id
			if(this.page_can){
				this.pageData()
			}
			uni.getLocation({
				type: 'wgs84',
				geocode: true, //必写项
				success: data => {
					// console.log(data)
					this.page_can = e.id+'?longitude='+data.longitude+'&latitude='+data.latitude
					if(this.page_can){
						this.pageData()
					}
					
				}
			})
			this.page_can = e.id+'?longitude='+'&latitude=' //删
			//接收点击
			
		},

		methods: {
			delcommontCli(a){
				this.commont_delShow = false
				if(a == 1){ //分享
					this.$refs.share.toggleMask();
				}else if(a == 2){ //举报
					this.com.navto('../report/report?type='+1+'&bzUuid='+this.page_content_two.bzUuid+'&id='+this.page_content.ryUuid)
				}
			},
			pageData(){
				let that = this
				this.api.get('help/helpDetails/' + that.page_can,{ryUuid:uni.getStorageSync('userinfo_Data').id}).then(res=>{
					console.log(res)
					if (res.flag) {
						that.myselfType = res.data.myself
						that.isEditable = res.data.isEditable
						//个人信息
						that.page_content = res.data.hsperson
						//求助信息
						that.page_content_two = res.data.hshelpxinxi
						//收藏
						
						if(res.data.hshelpxinxi.store != 0){
							that.collect_show = true //未收藏
						}else{
							that.collect_show = false
						}
						
						//定位
						that.latitude = res.data.hshelpxinxi.latitude
						that.longitude= res.data.hshelpxinxi.longitude
						//限制
						that.xianzhishow = res.data.hshelpxinxi.requirement
						if(that.xianzhishow.nianling == '' && that.xianzhishow.qita == '' && that.xianzhishow.xingbie == '' && that.xianzhishow.zhiye == '' && that.xianzhishow.xueli == ''){
							that.xianzhi = false
						}else{
							that.xianzhi = true
						}
					}else{
						that.com.msg(res.message)
					}
				})
			},
			//编辑
			myBj(){
				if(this.isEditable){
					uni.navigateTo({
						url:'../publish/publish?id='+this.page_content_two.bzUuid,
						animationType:'slide-in-right'
					})
				}else{
					uni.showToast({
						title:'此帮助已被接单，不能编辑，想要编辑可以先取消订单',
						icon:'none'
					})
				}
				
			},
			// 到个人主页
			gotopage(){
				let that = this
				// console.log(this.page_content.ryUuid ) 
				uni.navigateTo({
					url:'../my/master_page?id='+that.page_content.ryUuid,
					animationType:'slide-in-right'
				})
			},
			// 收藏
			collect_c(e){
				this.api.get('record/isStore/'+this.page_content_two.bzUuid+'/'+e).then(res=>{
					if(res.flag){
						this.pageData()
						uni.showToast({
							title:res.message,icon:'none'
						})
					}
				})
			},
			//图片预览
			img_pieve(e,ind){
			
				 uni.previewImage({
					urls: e,
					current:ind
					
				});
			},
			//立即帮助
			goodHelp(){
				// response/acceptHelp
				this.api.post('response/acceptHelp',{bzUuid:this.page_content_two.bzUuid,type:0}).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.navto('../my/order_detail?id='+res.data+'&type='+ 2 +'&shengf='+ 1) //1帮主 2帮客
					}else{
						if(res.message !='请先登录'){
							this.com.msg(res.message)
						}
					}
				})
			},
			
			//去聊天
			gochat(){
				this.api.get('chat/add/'+this.page_content.ryUuid +'/'+this.page_content_two.bzUuid+'/'+0).then(res=>{
					console.log(res)
					if(res.flag){
						//id发布人 bzuuid是任务或服务id
						this.com.navto('../chat/chat?name='+this.page_content.name+'&id='+this.page_content.ryUuid+'&bzuuid='+this.page_content_two.bzUuid+'&type='+ 0+'&chatId='+res.data)
					}
				})
			},
			go_map(){
				let data = {
					address:this.page_content_two.address,
					position:this.page_content_two.position,
					latitude:this.page_content_two.latitude,
					longitude:this.page_content_two.longitude,
				}
				this.com.navto('../map/map?data='+JSON.stringify(data))
			}
		},
		
	}
</script>

<style scoped lang="scss">
.del_item{
	width: 100%;text-align: center;line-height: 100rpx;
}
.xian{
	width: 100%;height: 10rpx;
}
.pages{
	width: 100%;background-color: #f8f8f8;
	.header{
		width: 100%;
		//求助人
		.username{
			font-size: 30rpx;padding: 30rpx;
			display: flex;justify-content: space-between;
			background-color: white;
			border-radius:  0 0 26rpx 26rpx;
			.imgBorder{
				width: 102rpx;height: 102rpx;text-align: center;
				padding: 4rpx;border: 0.5px solid #9b5b42;border-radius: 50%;
				.userimg{
					margin-top: 2rpx;
					width: 90rpx;height: 90rpx;border-radius: 50%;
				}
			}
			.headRight{
				width: 86%;
				.headRightName{
					display: flex;
					.views{
						font-size: 34rpx;
						max-width: 300rpx;
						margin: 0 20rpx;
					} 
					.nans{
						margin-top: 8rpx;
						width: 36rpx;height: 36rpx;
					}
				}
				.grade{
					margin: 10rpx;color: white;
					display: flex;
					.gradeClass{
						padding-left: 44rpx;font-size: 26rpx;margin-right: 20rpx;
						width: 166rpx;height: 38rpx;
						background: url(../../static/index/taskDetail/dengji.png) no-repeat;
						background-size: 100% 100%;
					}
					image{
						
						width: 140rpx;height: 38rpx;
					}
				}
				
			}
			
			
		}
		
		//求助简介
		.helpintor{
			width: 100%;padding: 3%;background-color: white;
			.synopsis{
				display: flex;
				image{
					width: 80rpx;height: 38rpx;margin: 8rpx 10rpx;
				}
				.helpTit{
					font-weight: 600;
					font-size: 34rpx;
					lines: 2;
				}
			}
			
			.help_distance{
				font-size: 32rpx;
				display: flex;margin-top: 16rpx;justify-content: space-between;
				.textsty{
					color: #ff6000;
				}
				.textstyb{
					color: red;
				}
			}
		}
		.district{
			padding: 3%;
			width: 100%;
			background: url(../../static/index/taskDetail/addressText.png) no-repeat;
			background-size: 100% 100%;
			display: flex;justify-content: space-between;
			.districtL{
				display: flex;font-size: 32rpx;
				image{
					width: 45rpx;height: 60rpx;margin: 10rpx 22rpx; 
				}
				.addressSty{
					width: 550rpx;
				}
			}
			.districtR{
				line-height: 110rpx;color: #999;
			}
		}
	}
	.backimg{ 
		width: 750rpx;height: 300rpx;
	}
	
}


.contents{
	width: 100%;padding:1% 3% 120rpx 3%;
	background-color: white; 
	.title{
		display: inline-block;
		font-size: 38rpx;margin: 15rpx 0;
	}
	// 相关照片
	.photo_attached{
		
		.images{
			width: 100%;
			display: flex;flex-direction: row;
			flex-wrap: wrap;
			.img{
				width: 220rpx;margin: 8rpx;height: 180rpx;
			}
			.img:nth-child(1){
				margin-left: 0;
			}
		}
	}
	.task_Detail_Data{
		width: 100%;
		
	}
	.astrict{
		display: flex;flex-wrap: wrap;
		.texst{
			margin: 10rpx;padding: 6rpx 20rpx;border: 0.5px solid #e1d8ce;border-radius: 50rpx;color: #666;
		}
	}
	
	
}
	
// //定位
.bottom_function{
	width: 750rpx;height: 100rpx;padding: 0 15rpx;
	display: flex;justify-content: space-between;flex-direction: row;
	position: fixed;bottom: 0;left: 0;
	box-shadow: 1rpx 1rpx 1rpx 1rpx rgba(0,0,0,0.5);
	background-color: #FFFFFF;
	.bottom_function_left{
		width: 325rpx;
		display: flex;flex-direction: row;
		.left_view{
			width: 120rpx;text-align: center;padding-top: 10rpx;
			.viewcolor{
				color: #333;text-align: center;
			}
		}
	}
	.bottom_function_right{
		width: 50%;padding-right: 30rpx;
		display: flex;justify-content: space-between;flex-direction: row;
		color: #fff;
		.button_l{
			line-height: 70rpx;
			text-align: center;border-radius: 50rpx;height: 70rpx;margin-top: 15rpx;padding: 0 25rpx;
			background-color: #f30600;
		}
		.button_r{
			line-height: 70rpx;
			text-align: center;border-radius: 50rpx;height: 70rpx;margin-top: 15rpx;padding: 0 25rpx;
			background-color: #ffa800;
		}
	}
}
</style>
