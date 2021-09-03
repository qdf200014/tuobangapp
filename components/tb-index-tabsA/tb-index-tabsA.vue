<template>
	<view style="position: relative;padding-bottom: 240rpx;">
		<view class="yun">
			<view class="nowFu">
				 <swiper class="swiper" :autoplay="true" :interval="4000" 
				 :duration="500" :circular="true">
					<swiper-item>
						<image src="../../static/index/listaIMG.png" mode="" style="width: 100%;height: 260rpx;"></image>
					</swiper-item>
					<swiper-item style="padding-top: 16rpx;padding-left: 1%;" @click="gotopage('../my/changjian/miji?type='+ 4)">
						<image src="../../static/index/miji.png" mode="" style="width: 96%;height: 234rpx"></image>
					</swiper-item>
				</swiper>
			</view>
			<!-- 待帮 -->
			<view class="title_line">
				<view >
					<tb-title style="width: 150rpx;" title="待帮助" ></tb-title>
				</view>
				<view class="title_line_r">
					<view></view>
					<view @click="go_list" >更多</view>
				</view>
			</view>
					<!-- offertohelp -->
			<view class="task_list" v-for="(it,index) in offertohelp" :key="index" @click="go_detail(it.bzUuid)">
				<view class="task_list_top">
					<view class="task_list_left">
						<image class="task_list_left_img" :src="it.photo" mode="aspectFill"></image>
					</view> 
					<view class="task_list_right">
						<text class="task_list_right_tit">{{it.jianjie}}</text>
						<view class="task_list_right_address">
							<view class="task_list_left_userinfo">
								<image class="left_userinfo_img" :src="it.img" mode="aspectFill"></image>
								<text class="left_userinfo_text">{{it.bkName}}</text>
								<text class="right_address_jl" v-show="it.distance">{{it.distance < 1 ? it.distance * 1000 + 'm' : it.distance + 'km'}}</text>
							</view>
							<view style="color: red;font-weight: bold;">
								{{it.price != 0 ?'￥'+it.price + '元' : '无偿帮助' }}
							</view>
						</view>
					</view>
				</view>
				<image v-if="index !=2" class="tiaozi" src="../../static/index/xiantiao.png" mode=""></image>
			</view>
		</view>
		
		<!-- 嘚瑟 -->
		<view class="desemok">
			<view class="deseIMG">
				<tb-title style="width: 200rpx;" title="分享传递"></tb-title>
			</view>
			<!-- bargData -->
			<view class="brag" v-for="(item,ind) in bargData" :key="ind" @click="gotopage('../../pages/brag/brag?id='+item.showId)" >
				<view class="barg_top">
					<view class="task_list_left_userinfo">
						<view class="img_border">
							<image class="left_userinfo_img" :src="item.ryHeadimg" mode="aspectFill"></image>
						</view>
					</view>
					<view class="top_right">
						<text style="font-weight: bold;">{{item.bzName}}</text>
						<image src="../../static/index/bangzhul.png" mode=""></image>
						<text >{{item.bkName}}</text>
					</view>
				</view>
				<view class="deseDetail" v-if="ind == 0">
					<view class="barg_title">
						{{item.showContent}}
					</view>
					<view class="barg_imgs">
						<image v-for="(item,index) in item.showImg" :key="index" :src="item" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 帮主排行 -->
		<view class="paihang">
			<tb-title style="width: 200rpx;" title="帮主排行"></tb-title>
			<scroll-view :scroll-x="true" >
				<view class="scrollSty" 
				:style="{'padding-top': '40rpx',width:seniority.length <= 3 ? '840rpx' : '1320rpx','padding-right':seniority.length >= 5 ? '26rpx' : '0rpx'}">
					<view class="rankingItem" v-for="(item,ind) in seniority" :key="ind" @click="go_master(item.ryUuid)">
						<view class="userimg">
							<image :src="item.img" mode="aspectFill"></image>
						</view>
						<image class="dzan"  :src="'../../static/index/zan'+ind +'.png'" alt=""/>
						<view class="sex">
							<image v-if="item.sex == '男'" src="../../static/nan.png" mode=""></image>
							<image v-else src="../../static/nu.png" mode=""></image>
							<view class="right_name">
								{{item.name}}
							</view>
						</view>
						<view style="color: #666;line-height: 50rpx;">
							{{item.grade}}
						</view>
						<image v-if="item.isAuthentication != 1" class="renzheng" src="../../static/index/renzheng.png" mode=""></image>
					</view>
					<view class="scrollX_gend" @click="go_master_gen(1)">
						<view class="text">更多 <u-icon name="arrow-right" color="#999"></u-icon></view>
						<view class="textpy">GENGDUO</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 企业排行 -->
		<!-- <view class="paihangS">
			<tb-title style="width: 200rpx;" title="企业排行"></tb-title>
			 <scroll-view class="scroll-view_H" :scroll-x="true">
				<view id="demo1" class="scroll-view-item_H scrollSty" 
				:style="{width:seniority.length <= 3 ? '840rpx' : '1320rpx','padding-right':seniority.length >= 5 ? '26rpx' : '0rpx'}">
					<view class="itemqi" v-for="(it,ind) in QYseniority" :key="ind" >
						<view style="width: 100%;height: 60rpx;background-color: #cbbdbc;border-radius: 18rpx 18rpx 0 0;">
							
						</view>
						<image src="../../static/shouy_36.png" mode=""></image>
						<view class="title">
							哼哼唧唧
						</view>
					</view>
					<view class="scrollX_gend_qiy" @click="go_master_gen(2)">
						<view class="text">更多 <u-icon name="arrow-right" color="#999"></u-icon></view>
						<view class="textpy">GENGDUO</view>
					</view>
				</view>
			</scroll-view>
		</view> -->
		<!-- 占位 -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			offertohelp:{},//待帮数据
			bargData:{},//嘚瑟数据
			seniority:{},//排行
			district:{},//地址
			QYseniority:{},//企业排行
		},
		methods: {
			//页面跳转
			gotopage(e){
				this.com.navto(e)
			},
			// 待帮详情
			go_detail(e){
				this.com.wangluo()
				this.$emit('go_detail',e)
			},
			// 到个人主页
			go_master(e){
				this.$emit('go_master',e)
			},
			//待帮助列表
			go_list(){
				uni.navigateTo({
					url:'../../pages/index/indexAlist?address='+this.district,
					animationType:'slide-in-right'
				})
			},
			// 更多排行
			go_master_gen(e){
				if(e == 1){
					uni.navigateTo({
						url:'../../pages/index/paihang/paihang?address='+this.district,
						animationType:'slide-in-right'
					})
				}
			}
		}
	}
</script> 


<style scoped lang="scss">
	.yun{
		width: 100%;padding-top: 290rpx;
		background: url(../../static/index/beijing.png) top no-repeat;
		background-size: 100% 400rpx;
		border-radius: 0 0 26rpx 26rpx;
		background-color: white;
	}
.nowFu{
	width: 98%;height: 270rpx;position: absolute;left: 1%;top: 10rpx;
}
.scrollX_gend{
	width: 200rpx;height: 250rpx;border: 0.5px solid #ddd;
	border-radius: 26rpx;text-align: center;color: #999;
	padding: 85rpx 20rpx 20rpx 20rpx;margin-right: 30rpx;
	.text{
		font-size: 36rpx;
		line-height: 60rpx;
	}
	.textpy{
		font-size: 28rpx;
	}
}
.scrollX_gend_qiy{
	width: 200rpx;height: 230rpx;border: 0.5px solid #ddd;
	border-radius: 26rpx;text-align: center;color: #999;
	padding: 85rpx 20rpx 20rpx 20rpx;margin-right: 30rpx;
	.text{
		font-size: 36rpx;
		line-height: 60rpx;
	}
	.textpy{
		font-size: 28rpx;
	}
}
.rankingItem{
	border: 0.5px solid #ddd;
	width: 204rpx;height: 250rpx;margin-right: 26rpx;
	border-radius: 26rpx;
	position: relative;padding: 100rpx 20rpx 20rpx 20rpx;
	.userimg{
		position: absolute;left: 18rpx;top: -30rpx;
		width: 112rpx;height: 112rpx;border-radius: 50%;
		padding: 4rpx;border: 1rpx solid #a0634c;
		background-color: white;
		image{
			width: 100%;height: 100%;border-radius: 50%;
		}
	}
	.dzan{
		width: 60rpx;height: 66rpx;
		position: absolute;right: 12rpx;top: 12rpx;
	}
	.sex{
		display: flex;line-height: 40rpx;
		image{
			width: 40rpx;height: 40rpx;margin-right: 8rpx;
		}
		.right_name{
			width: 120rpx;font-size: 30rpx;
			overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
		}
	}
	.renzheng{
		width: 150rpx;height: 40rpx;
	}
}	
.rankingItem:first-child{
	margin-left: 24rpx;
}

.paihang{
	background-color: white;border-radius: 26rpx;
	margin-bottom: 30rpx;padding: 0 10rpx 30rpx 10rpx;
}
.paihangS{
	background-color: white;border-radius: 26rpx;
	margin-bottom: 30rpx;padding: 0 10rpx 30rpx 10rpx;
	.scroll-view_H{
		margin:20rpx 0 0 0;
		.scroll-view-item_H{
			.itemqi{
				border: 0.5px solid #ddd;
				width: 204rpx;height: 230rpx;margin-right: 26rpx;
				border-radius: 26rpx;text-align: center;
				
				image{
					border: 1rpx solid #ddd;width: 90rpx;height: 90rpx;border-radius: 50%;margin-top: 40rpx;
					margin-top: -40rpx;
				}
				.title{
					width: 150rpx;margin: 16rpx 30rpx 0 30rpx;
					font-size: 32rpx;font-weight: bold;
					overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
				}
			}
			.itemqi:first-child{
				margin-left: 24rpx;
			}
		}
	}
}
.scrollSty{
	
	display: flex;
}

	// 嘚瑟
.desemok{
	border-radius: 26rpx;
	margin: 26rpx 0;padding:0 10rpx 20rpx 10rpx;
	background: url(../../static/index/qunshan.png) top right no-repeat; 
	background-size: 66% 160rpx;background-color: white;
	.deseIMG{
		border-radius: 26rpx;
	}
	.brag{
		width: 100%;padding: 2% 0;border-radius: 20rpx;
		.barg_top{
			display: flex;justify-content: space-between;
			position: relative;
			.task_list_left_userinfo{
				position: absolute;left: 10rpx;top: -6rpx;
				.img_border{
					padding: 4rpx;border-radius: 50%;border: 1rpx solid red;
					width: 80rpx;height: 80rpx;
					background-color: white;
					.left_userinfo_img{
						width: 100%;height: 100%;border-radius: 50%;
					} 
				}
				
				.left_userinfo_text{
					font-size: 30rpx;line-height: 60rpx;color: #a3a3a3;
				}
			}
			.top_right{
				margin-left: 9%;
				border-radius:0 10rpx 10rpx  0;border: 0.5px solid #e1d8ce;border-left: 0;
				width: 89%;color: #999;line-height: 70rpx;
				display: flex;
				text{
					// text-decoration: underline; //下划线
					width: 220rpx;
					margin: 0 40rpx;color: #000;
					text-overflow: ellipsis;overflow: hidden;white-space: nowrap;
				}
				image{
					width: 180rpx;height: 52rpx;margin-top: 10rpx;
				}
			}
		}
		.deseDetail{
			margin: 16rpx;
			padding: 15rpx;background-color: #f6f6f6;border-radius: 10rpx;
		}
		.barg_title{
			font-size: 34rpx;line-height: 40rpx;color: #333;
		}
		.barg_imgs{
			display: flex;margin-top: 20rpx;
			image{
				width: 160rpx;height: 160rpx;margin: 0 8rpx;border-radius: 26rpx;
			}
		}
	
	}
}

.title_line{
	display: flex;padding: 0 10rpx;
	.title_line_r{
		width: 75%;line-height: 90rpx;font-weight: bold; 
		display: flex;justify-content: space-between;
	}
}
//待帮
.task_list {
	width: 100%;
	// height: 300rpx;
	margin:20rpx 0;
	padding: 0 30rpx;
	position: relative;
	.task_list_top{
		display: flex;
	}
	.task_list_left {
		width: 220rpx;
	}
	.task_list_left_img {
		width: 160rpx;
		height: 160rpx;margin-bottom: 20rpx;
		border-radius: 26rpx;
	}
	.task_list_left_userinfo{
		display: flex;
		
		.left_userinfo_img{
			width: 54rpx;height: 54rpx;border-radius: 50%;
		} 
		.left_userinfo_text{
			width: 150rpx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
			font-size: 30rpx;line-height: 60rpx;color: #a3a3a3;
			margin: 0 10rpx;
		}
	}
	
	.task_list_right {
		width: 550rpx;
	}
	.task_list_right_tit{
		height: 100rpx;font-weight: bold;
		font-size: 34rpx;line-height: 50rpx;display: inline-block;
		
		overflow: hidden; //超出部分隐藏
		-webkit-line-clamp: 2; //只显示两行
		text-overflow: ellipsis; //超出部分显示省略号
		display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
		-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式 纵向
		
	}
	.task_list_right_address{
		margin-top: 10rpx;line-height: 60rpx;
		display: flex;flex-direction: row;justify-content: space-between;
	}
	.right_address_jl{
		color: #ff6000;font-size: 28rpx;
	}
	.right_address_time{
		color: #565d67; font-size: 30rpx;lines: 3;text-overflow: ellipsis;
	} 
	.right_address_time_s{
		height: 80rpx;line-height: 40rpx;width: 480rpx;
		color: #565d67; font-size: 30rpx;lines: 2;text-overflow: ellipsis;
	} 
	.tiaozi{
		width: 94%;height: 10rpx;position: absolute;left: 3%;bottom: 0;
	}
}

// 排行
.rowline{
	width: 100%;padding:4% 3%;background-color: white;border-radius: 26rpx;
	
	.rowline_item{
		display: flex;justify-content: space-between;
		padding-bottom: 40rpx;
		.item_left{
			width: 20%;position: relative;
			image{
				width: 120rpx;height: 120rpx;border-radius: 100rpx;
			}
			.paim{
				position: absolute;left: -10rpx;top: -20rpx;
				font-size: 24rpx;border-radius: 50%;
				width: 55rpx;height: 55rpx;line-height: 55rpx;
				color: white;background-color: #0493fd;text-align: center;
			}
		}
		.item_right{
			width: 80%;
			.right_name{
				font-size: 34rpx;
			}
			.right_sex{
				width: 180rpx;
				display: flex;justify-content: space-between;
				color: #999;
				image{
					width: 36rpx;height: 36rpx;
				}
			}
			.right_button{
				color: #222;
				width: 100%;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;
			}
		}
	}
	.rowline_item:nth-child(3){
		padding-bottom: 0;
	}
}
</style>
