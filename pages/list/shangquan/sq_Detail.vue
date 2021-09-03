<template>
	<view>
		<view class="toppage" :style="{ 'background-color': backgroundColor}">
			<view class="left" @click="gotopage(1)">
				<u-icon name="arrow-left" size="60" :color="fontcolor" ></u-icon>
			</view>
			<view class="left">
				<u-icon name="more-dot-fill" size="60" :color="fontcolor" ></u-icon>
			</view>
		</view>
		<view class="head" :style="{'background-image': 'url(../../../static/shouy_34.png)'}">
			
		</view>
		<view class="headText">
			<view class="dpxinx">
				<image src="../../../static/shouy_36.png" mode=""></image>
				<view class="dp">
					<view class="dpname">
						店铺名称
					</view>
					<view class="fensi">
						粉丝数：210
					</view>
					<view class="label">
						<view class="labelItem jin">
							一星企业
						</view>
						<view class="labelItem">
							企业认证
						</view>
					</view>
				</view>
			</view>
			<!-- 数据 -->
			<view class="dpData">
				<view class="dataItem" v-for="(it,ind) in 3" :key="ind">
					<view class="itemPrice">
						0.02
					</view>
					<view class="itemText">
						成交额
					</view>
				</view>
			</view>
			<view class="dptype">
				服务：
				<text>空调清洗 除螨防潮 家庭保洁</text>
			</view>
		</view>
		<view class="tabs">
			<view class="tabsItem" :class="{act:tabIndex == index}" v-for="(it,index) in list" :key="index" @click="tabCli(index)">
				{{it.name}}<text v-if="it.num != 0">({{it.num}})</text>
			</view>
		</view>
		<view class="content">
			<!-- 简介 -->
			<view class="jianjie">
				<view class="title">简介</view>
				<view class="contentText">
					主要经营食品、餐饮、等主要经营食品、餐饮、等主要经营食品、餐饮、等...
				</view>
			</view>
		</view>
		<view class="district redius26 marBut" @click="go_map">
			<view class="districtL">
				<image src="../../../static/index/taskDetail/dibiao.png" mode=""></image>
				<view class="addressSty">
					<view class="">
						北京市西城区
					</view>
					<view>
						西直门外大街金贸大厦A座
					</view>
				</view>
			</view>
			<view class="districtR"> 
				<u-icon name="arrow-right" size="50"></u-icon> 
			</view>
		</view>
		<!-- 服务 -->
		<view class="fuwu">
			<view class="title">服务(12)</view>
			<view class="fuwuItem" >
				<view class="items" v-for="(its,index) in 2" :key="index">
					<view class="task_detail_top" @click="go_detail()">
						<image class="top_img" src="../../../static/shouy_36.png" mode="aspectFill"></image>
						<text class="top_text">简介</text>
					</view>
					<image class="xiantiao" src="../../../static/index/xiantiao.png" mode=""></image>
				</view>
			</view>
			<view class="quancomment"  @click="gotopage('./fuwuList')">
				查看12项服务
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<!-- 评论 -->
		<view  class="dppj">
			<view class="pinj">
				<view class="title">评价(21)</view>
				<!-- 评分 -->
				<view class="score">
					<view>
						综合评分 <text style="color: #fe552e;"> 4.3</text> 
						<u-rate :current="4.3" :disabled="true" gutter="0"></u-rate>
					</view>
					<view class="" >
						<text style="margin-left: 50rpx;color: #fe552e;">223</text>条评论
					</view>
					
				</view>
				<view class="xuan">
					<view class="xuanitem" v-for="(it,ind) in types" :key="ind"
					@click="cliList(detailtit.serveUuid,it.type)">
						{{it.name + it.num}}
					</view>
				</view>
			</view>
			<!-- 评论 -->
			<view class="comment">
				<!-- 用户 -->
				<view class="pjItem" v-for="(it,ind) in 2" :key="ind">
					<view class="commentuser">
						<view class="userimg" @click="go_master()">
							<!-- <image :src="detailComment.img" mode="aspectFill"></image> -->
							<image src="../../../static/shouy_34.png" mode=""></image>
							<view>
								功夫熊猫
								<!-- <view class="">
									<u-rate :current="it.score" :disabled="true" gutter="0"></u-rate>
								</view> -->
							</view>
						</view>
						<view class="userTime">
							2021-8-24
						</view>
					</view>
					<view class="textcontent" @click="go_Detail()">
						评价内容。。。
					</view>
					<view class="imgswiper" @click="go_Detail()">
						<image v-for="(it,index) in 3" :key="index" src="../../../static/shouy_36.png" mode="aspectFill"></image>
						
					</view>
					<view class="thumbs" @click="pj_dian()">
						<u-icon name="thumb-up" v-if="true"></u-icon>
						<u-icon name="thumb-up-fill" v-else color="#0493fd"></u-icon>
					</view>
				</view>
				<view class="quancomment" @click="go_pjia()">
					查看全部评价<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{name:'首页',num:0},
					{name:'服务',num:10},
					{name:'评价',num:123},
				],
				tabIndex:0,
				types:[
					{name:'全部',type:0,num:0},
					{name:'好评',type:1,num:0 },
					{name:'差评',type:2,num:0},
					{name:'帮助及时',type:3,num:0},
					{name:'服务周到',type:4,num:0},
					{name:'专业熟练',type:5,num:0},
					{name:'安全可靠',type:6,num:0},
					{name:'收费合理',type:7,num:0}
				],
				backgroundColor:'',//背景色
				fontcolor:'rgba(255,255,255,1)',
				fuwuGd:true,
				fuwuTop:'',//服务距离顶部
				EvaluateTop:''//评价距离顶部
			}
		},
		mounted() {
			this.serveEvaluate()
		},
		onPageScroll(e) {
			// console.log(e)
			this.backgroundColor = 'rgba(255,255,255,'+e.scrollTop / 180 +')' 
			this.fontcolor = 'rgba(0,0,0,'+e.scrollTop / 180 +')' 
			if(e.scrollTop == 0){
				this.fontcolor  = 'rgba(255,255,255,1)' 
			}
		},
		methods: {
			// 服务评价高度
			serveEvaluate(){
				const query = uni.createSelectorQuery().in(this);
				query.select('.fuwu').boundingClientRect(data => {
					console.log("得到布局位置信息" + JSON.stringify(data));
					if(data.height){
						this.fuwuTop = data.top - 130
					}
					console.log(this.fuwuTop)
				}).exec();
				query.select('.dppj').boundingClientRect(data => {
					console.log("得到布局位置信息" + JSON.stringify(data));
					if(data.height){
						this.EvaluateTop = data.top - 130
					}
					console.log(this.EvaluateTop)
				}).exec();
			},
			 // 页面跳转
			gotopage(e){
				if(e == 1){
					uni.navigateBack()
				}else{
					this.com.navto(e)
				}
			},
			// 点击tab
			tabCli(e){
				this.tabIndex = e
				if(e == 0){
					uni.pageScrollTo({
						scrollTop: 0,
						duration: 100,
					});
				}else if(e== 1){
					uni.pageScrollTo({
						scrollTop: this.fuwuTop,
						duration: 100,
					});
				}else{
					uni.pageScrollTo({
						scrollTop: this.EvaluateTop,
						duration: 100,
					});
				}
			},
			// 导航
			go_map(){
				let data = {
					address:'北京市西城区',
					position:'金贸大厦A座715',
					// latitude:this.page_content_two.latitude,
					// longitude:this.page_content_two.longitude,
				}
				this.com.navto('../../map/map?data='+JSON.stringify(data))
			},
			// 全部评价
			go_pjia(){
				this.com.navto('./pingjia')
			},
			
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
</style>
<style scoped lang="scss">
.toppage{
	z-index: 22;
	width: 100%;padding: 90rpx 30rpx 10rpx 30rpx;
	position: fixed;top: 0;
	display: flex;justify-content: space-between;
}
.head{
	width: 100%;height: 600rpx;
	
	z-index: 1;
	filter: blur(15rpx) brightness(70%); // 模糊半径和变暗
	transform: scale(1.1); // 控制边缘是否模糊，小于1的话边缘会模糊
}
.headText{
	width: 100%;padding: 0 40rpx;color: #fff;
	position: absolute;left: 0;top: 180rpx;
	.dpxinx{
		display: flex;
		image{
			width: 180rpx;height: 180rpx;border-radius: 26rpx;
		}
		.dp{
			padding-left: 30rpx;
			.dpname{
				font-size: 34rpx;
			}
			.fensi{
				line-height: 60rpx;font-size: 26rpx;
			}
			.label{
				display: flex;margin-top: 14rpx;
				.labelItem{
					font-size: 26rpx;border-radius: 10rpx;
					padding: 0 14rpx 4rpx 14rpx;border: 1rpx solid #fff;margin-right: 16rpx;
					&.jin{
						color: #ffeec1;border: 1rpx solid #ffeec1;
					}
				}
				
			}
		}
	}
	.dpData{
		width: 100%;padding: 0 11%;margin-top: 40rpx;
		display: flex;justify-content: space-around;
		.dataItem{
			width: 33%;text-align: center;
			.itemPrice{
				font-size: 34rpx;line-height: 60rpx;
			}
		}
	}
	.dptype{
		width: 100%;height: 60rpx;line-height: 56rpx;padding: 0 40rpx;
		background-color: rgba(0,0,0,0.2);
		position: absolute;left: 0;top: 360rpx;
		text{
			color: #c0c4cc;
		}
	}
}
.tabs{
	z-index: 999;position: sticky;top: 160rpx;
	background-color: #f8f8f8;
	width: 100%;height: 100rpx;line-height: 96rpx;padding:0 30rpx;
	display: flex;
	.tabsItem{
		text-align: center;padding: 0 20rpx;
		display: inline-block;font-size: 30rpx;
		position: relative;
		&.act{
			// font-weight: bold;
			color: #eb0000;
			&:before{
				content: '';
				position: absolute;
				left: 35%;
				bottom: 15%;
				border-radius: 10rpx;
				height: 7rpx;
				width: 30%;
				background-color: #eb0000;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}
	
}
.title{
	font-size: 32rpx;font-weight: bold;margin-bottom: 16rpx;
}
.content{
	width: 100%;
	.jianjie{
		width: 100%;padding:30rpx 40rpx;background-color: #fff;
		.contentText{
			line-height:40rpx;
		}
	}
}
.district{
	padding: 3%;
	width: 100%;
	background: url(../../../static/index/taskDetail/addressText.png) no-repeat;
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
.dppj{
	.pinj{
		padding: 3%;
		.score{
			display: flex;justify-content: space-between;
			padding: 30rpx 0;
		}
		.xuan{
			display: flex;flex-wrap: wrap;border-bottom: 1rpx solid #eee;padding-bottom: 20rpx;
			.xuanitem{
				padding: 10rpx 20rpx;border-radius: 10rpx;border: 1rpx solid #C0C0C0;margin: 10rpx ;
			}
		}
	}
	
	.comment{
		padding: 0 3%;
		.pjItem{
			padding-top: 30rpx;
		}
		.commentuser{
			display: flex;justify-content: space-between;
			.userimg{
				display: flex;
				image{
					width: 80rpx;height: 80rpx;border-radius: 50%;margin-right: 14rpx;
				}
			}
		}
		.textcontent{
			line-height: 50rpx;
		}
		.imgswiper{
			display: flex;flex-wrap: wrap;
			image{
				width: 210rpx;height: 210rpx;border-radius: 10rpx;
				margin: 10rpx;
			}
		}
		.thumbs{
			padding: 3%;border-bottom: 1rpx solid #eee;text-align: right;
		}
		.quancomment{
			text-align: center;
			padding: 3% 0;color: #999999;
		}
	}
	.pjtit{
		line-height: 60rpx;
		border-bottom: 1rpx solid #eee;
		position: relative;
		&.active{
			font-weight: bold;	color: #000;
			// background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 1%; 
				bottom: -10rpx;
				transform: translateY(-50%);
				height: 10rpx;
				width: 40rpx;
				border-radius: 8rpx;
				background-color: #fe552e;
				opacity: .8;
			}
		}
	}
}
.fuwu{
	width: 100%;padding: 0 4%;background-color: #fff;
	.fuwuItem{
		overflow: hidden;
		.items{
			padding-top: 16rpx;
			.task_detail_top{
				display: flex;justify-content: space-between;flex-direction: row;
				.top_img{
					width: 210rpx;height: 170rpx;border-radius: 20rpx;
					background-color: #F8F8F8;
				}
				.top_text{
					width: 450rpx;lines: 3;text-overflow: ellipsis;
					font-size: 32rpx;
				}
			}
			.xiantiao{
				width: 100%;height: 10rpx;
			}
		}
	}
	.quancomment{
		text-align: center;
		padding: 3% 0;color: #999999;
	}
}
</style>
