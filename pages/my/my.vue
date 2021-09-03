<template>
	<view >
		<tb-pulldown :bgcolor="userbgcol" :scrollY="true" :pullshow="false">
			<view slot="detail">
				<swiper class="swiper" style="height: 100vh;margin-bottom: 26rpx;" disable-touch="true" :current="page_index">
					<swiper-item style="overflow-y: scroll;" >
						<!-- 帮主 发布人 -->
						<view class="info_mations" style="padding-top: 100rpx;">
							<!-- 设置 -->
							<view class="info_mation_shezs">
								<!-- 身份 -->
								<view class="userstyle" @click="userstatus(1)">
									<u-icon name='account-fill'></u-icon>切换为帮客</view>
								<view @click="gotoPage('./set')">
									<u-icon name="setting" size="54" color="#fff"></u-icon>
								</view>
							</view>
							<!-- 用户信息 -->
							<view class="user_part">
								<view class="user_part_left" @click="gotoPage('./master_page')">
									<image :src="my_datas.ryHeadImg" mode="aspectFill" style="background-color: rgba(0,0,0,0.3);"></image>
									<image v-if="my_datas.rySex == '男'" class="nans" src="../../static/nan.png" mode=""></image>
									<image v-else class="nans" src="../../static/nu.png" mode=""></image>
								</view>
								<view class="user_part_cont">
									<view class="user_name" v-if="!my_datas" @click="gotoPage('../login/login')">请登录</view>
									<view class="user_name" @click="gotoPage('./master_page')">{{my_datas.ryPetName}} </view>
									<view class="user_part_right">
										<view class="my_medal" @click="gotoPage('./grade')">{{grade}}</view>
										<!-- <view class="Singleing">
											<u-switch v-model="checked" size="38" inactive-color="rgba(255,255,255,0.6)"
											active-color="#fff"></u-switch>
											<text style="margin-left: 10rpx;">接单中</text>
										</view> -->
									</view>
								</view>
							</view>
						</view>
						<!-- 列表 -->
						<view class="lists">
						 	<view class="data_statis_list" v-for="(it,ind) in lists_data_two" :key="ind"  @click="gotolist_two(ind)">
								<image :src="it.image" mode=""></image>
						 		<view>{{it.text}} </view>
						 	</view>
						</view>
						<view class="zhanghu marTop" @click="gotoPage('./account/account')">
							<view class="zhanghuLeft">
								<image src="../../static/my/list/bz8.png" mode=""></image>
								<view>账户</view>
							</view>
							<view class="zhanghuRig">
								<view>{{zhanghbalance}}</view>元
							</view>
						</view>
						<!-- 评价别人 -->
						<view class="judge_br"  v-if="completedp">
							<view style="display: flex;justify-content: space-between;">
								<image :src="completedp.photo" mode="aspectFill"></image>
								<view class="judge_br_cont">
									<view>帮助完成</view>
									<view>快去分享一下吧！</view>
								</view>
								<view class="judge_br_rig" @click="go_pj(1)">分享</view>
							</view>
						</view>
						<!-- 后院 -->
						<view class="backyard">
							<view class="backyard_title">
								后院
							</view>
							<view class="backyard_item">
								<view class="backyard_it_list" v-for="(it,ind) in backyard_item_list" :key="ind" @click="go_list(ind)">
									<image :src="it.image" mode=""></image>
									<view>{{it.text}} </view>
								</view>
							</view>
						</view>
						
						<!-- 帮助发文规范 -->
						<view class="help_dispatch">
							<view class="help_dispatch_item" v-for="(it,ind) in guifan" :key="ind" @click="go_changj(ind)">
								<image :src="it.img" mode=""></image>
								<view>{{it.name}}</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item style="overflow-y: scroll;">
						<!-- 信息部分	 -->
						<view class="info_mation" style="padding-top: 100rpx;">
							<!-- 设置 -->
							<view class="info_mation_shez">
								<!-- 身份 -->
								<view class="userstyle" @click="userstatus(0)">
									<u-icon name='account-fill'></u-icon>切换为帮主</view>
								<view @click="gotoPage('./set')">
									<u-icon name="setting" size="54" color="#fff"></u-icon>
								</view>
							</view>
							<!-- 用户信息 -->
							<view class="user_part">
								<view class="user_part_left" @click="gotoPage('./master_page')">
									<image :src="my_datas.ryHeadImg" mode="aspectFill" style="background-color: rgba(0,0,0,0.3);"></image>
									<image v-if="my_datas.rySex == '男'" class="nans" src="../../static/nan.png" mode=""></image>
									<image v-else class="nans" src="../../static/nu.png" mode=""></image>
								</view>
								<view class="user_part_cont">
									<view class="user_name" v-if="!my_datas" @click="gotoPage('../login/login')">请登录</view>
									<view class="user_name">{{my_datas.ryPetName}}</view>
									<view class="user_part_right">
										<view class="my_medal" @click="gotoPage('./grade')">{{grade}}</view>
										<view class="guest_book" @click="gobook" v-if="qiandao">来签到</view>
										<view class="guest_book" style="background-color: #C8C7CC;" v-else>已签到</view>
									</view>
								</view>
							</view>
							<!-- 数据统计 -->
							<view class="data_statis">
								<view class="data_statis_item" v-for="(it,ind) in statis_list" :key="ind" @click="static_cli(ind)"> 
									<view> {{it.num}}</view>
									<view>{{it.name}} </view>
								</view>
							</view>
							<!-- 列表 -->
							
						</view>
						<view class="lists">
						 	<view class="data_statis_list" v-for="(it,ind) in lists_data" :key="ind"  @click="gotolist(ind)">
								<image :src="it.image" mode=""></image>
						 		<view>{{it.text}} </view>
						 	</view> 
						</view>
						<!-- 评价别人 -->
						<view class="judge_br"  v-if="completedp">
							<view style="display: flex;justify-content: space-between;">
								<image :src="completedp.photo" mode="aspectFill"></image>
								<view class="judge_br_cont">
									<view>帮助完成，待评价</view>
									<view>快给帮主一个评价吧</view>
								</view>
								<view class="judge_br_rig" @click="go_pj(2)">去评价</view>
							</view>
						</view>
						<!-- 后院 -->
						<view class="backyard">
							<view class="backyard_title">
								后院
							</view>
							<view class="backyard_item">
								<view class="backyard_it_list" v-for="(it,ind) in backyard_item_list" :key="ind"  @click="go_list(ind)">
									<image :src="it.image" mode=""></image>
									<view>{{it.text}} </view>
								</view>
							</view>
						</view>
						
						<!-- 帮助发文规范 -->
						<view class="help_dispatch">
							<view class="help_dispatch_item" v-for="(it,ind) in guifan_two" :key="ind" @click="go_changjT(ind)">
								<image :src="it.img" mode=""></image>
								<view>{{it.name}}</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				
			</view>
		</tb-pulldown>
		<u-popup v-model="xuanyType" mode="center" border-radius="30" width="70%">
			<view class="dese" @click="go_brag(1,completedp.jdUuid)">
				图片
			</view>
			<!-- <view class="dese" @click="go_brag(2,completedp.jdUuid)">
				视频
			</view> -->
			<view class="dese" @click="xuanyType = false">
				取消
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 'px', //导航栏
				statis_list:[{
								name:'收藏',
								num:0
							},
							{
								name:'浏览历史',
								num:0
							},
							{
								name:'关注',
								num:0
							},
							{
								name:'粉丝',
								num:0
							}],
				lists_data:[
					
					{
						image:'../../static/my/list/bk1.png',
						text:'求助管理',
						ind:1
					},
					{
						image:'../../static/my/list/bk2.png',
						text:'求助进程',
						ind:2
					},
					{
						image:'../../static/my/list/bk3.png',
						text:'我的账户',
						ind:4
					},
					{
						image:'../../static/my/list/bk4.png',
						text:'申诉管理',
						ind:5
					},
					
				],
				lists_data_two:[ //帮主
					{
						image:'../../static/my/list/bz1.png',
						text:'帮助管理'
					},
					{
						image:'../../static/my/list/bz2.png',
						text:'帮助进程'
					},
					// {
					// 	image:'../../static/my/list/bz3.png',
					// 	text:'商家信息'
					// },
					{
						image:'../../static/my/list/bz4.png',
						text:'我的收藏'
					},
					{
						image:'../../static/my/list/bz5.png',
						text:'我的粉丝'
					},
					// {
					// 	image:'../../static/my/list/bz6.png',
					// 	text:'诚信保障金'
					// },
					{
						image:'../../static/my/list/bz7.png',
						text:'申诉管理'
					},
					
				],
				backyard_item_list:[
					
					{
						image:'../../static/kunnansiyuan1.png',
						text:'进入商圈'
					},
					{
						image:'../../static/aixinjuanzeng1.png',
						text:'我加入的社区'
					},
					{
						image:'../../static/diushiertong1.png',
						text:'公益关注'
					}
				],
				guifan:[
					{
						img:'../../static/my/list/bz9.png',
						name:'帮主秘籍'
					},
					{
						img:'../../static/my/list/bz10.png',
						name:'发布规范'
					},
					{
						img:'../../static/my/list/bz11.png',
						name:'客服中心'
					},
					// {
					// 	img:'../../static/my/list/bz12.png',
					// 	name:'推广服务'
					// },
					{
						img:'../../static/my/list/bz13.png',
						name:'常见问题'
					}
				],
				guifan_two:[
					{
						img:'../../static/my/list/bz9.png',
						name:'快速得到帮助'
					},
					{
						img:'../../static/my/list/bz10.png',
						name:'发布规范'
					},
					{
						img:'../../static/my/list/bz11.png',
						name:'客服中心'
					},
					{
						img:'../../static/my/list/bz13.png',
						name:'常见问题'
					}
				],
				my_datas:'',
				completedp:'',
				qiandao:false,
				userbgcol:'#ff9909',
				checked:false,//是否接单
				infoType:1,//0帮主 1 帮客
				page_index:0,//当前页面
				xuanyType:false,//嘚瑟类型
				pageNums:0,
				grade:'',
				zhanghbalance:0,//账户余额
			}
		},
		onLoad() {
			
		},
		onShow() {
			
			if(!uni.getStorageSync('token')){
				this.pageNums ++
				if(this.pageNums == 1){
					this.com.navto('../login/login?type='+1)
				}else{
					this.pageNums = 0
					uni.switchTab({
						url:'../index/index' 
					})
				}
			}else{
				this.pages()
			}
			// if(!uni.getStorageSync('token')){
			// 	this.com.navto('../login/login')
			// }
			if(uni.getStorageSync('bk') == 1){ //帮客
				this.userbgcol = '#ff9909'
				this.page_index  = uni.getStorageSync('bk')
			}else{
				this.userbgcol = '#fd4142'
				this.page_index  = uni.getStorageSync('bk')
			}
		},
		methods: {
			pages(){
				this.api.get('home/myIndex/'+this.infoType).then(res=>{
					console.log(res)
					if(res.flag){
						this.completedp = res.data.completedNotEvaluatedHelp
						this.my_datas= res.data.hsFansVo
						this.grade = res.data.grade
						this.qiandao = res.data.SignState == 0 ? true : false
						this.statis_list = [
							{
								name:'收藏',
								num:res.data.hsFansVo.storeCounts
							},
							{
								name:'浏览历史',
								num:res.data.hsFansVo.historyCounts
							},
							{
								name:'关注',
								num:res.data.hsFansVo.myGuanZhu
							},
							{
								name:'粉丝',
								num:res.data.hsFansVo.myFans
							}
						]
					}
				})
				//账户余额
				this.api.get('hsTransaction/checkUserBalance').then(res=>{
					console.log(res)
					if(res.flag){
						this.zhanghbalance = res.data
					}
				})
			},
			//帮客
			gotolist(e){
				
				if(e == 0){
					this.com.navto('./list/my_fabu')
				}else if(e==1){
					this.com.navto('./list/response_my')
				}else if(e==2){
					this.com.navto('./account/account')
				}else if(e==3){
					this.com.navto('./list/appealList/appealList')
				}
			},
			//帮主
			gotolist_two(e){
				if(e == 0){
					this.com.navto('./list/service_management') //帮助管理
				}else if(e==1){
					this.com.navto('./list/my_task')
				}else if(e==2){
					this.com.navto('./tongji/collect') //收藏
				}else if(e==3){
					this.com.navto('./tongji/fans?id='+uni.getStorageSync("userinfo_Data").id) //粉丝
				}else if(e==4){
					this.com.navto('./list/appealList/appealList')
				}
			},
			gotoPage(e){
				this.com.navto(e)
			},
			//帮主常见问题
			go_changj(e){
				if(e == 0){
					this.com.navto('./changjian/miji?type='+ 4)
				}else if(e==1){
					this.com.navto('./changjian/miji?type='+ 5)
				}else if(e==2){
					
				}else if(e==3){
					this.com.navto('./changjian/changjian')
				}
			},
			go_changjT(e){
				if(e == 0){
					this.com.navto('./changjian/miji?type='+ 3)
				}else if(e==1){
					this.com.navto('./changjian/miji?type='+ 5)
				}else if(e==2){
					
				}else if(e==3){
					this.com.navto('./changjian/changjian')
				}
			},
			//收藏
			static_cli(e){
				console.log(e)
				if(e==0){
					this.com.navto('./tongji/collect') //收藏
				}else if(e==1){
					this.com.navto('./tongji/lishi') //记录
				}else if(e== 2){
					this.com.navto('./tongji/attention?id='+uni.getStorageSync("userinfo_Data").id) //关注
				}else{
					this.com.navto('./tongji/fans?id='+uni.getStorageSync("userinfo_Data").id) //粉丝
				}
			},
			// 签到
			gobook(){
				this.api.get('sign/doSign').then(res=>{  
					console.log(res)
					if(res.flag){
						this.com.msg(res.message)
						this.pages()
						this.qiandao = false
					}
				})
			},
			// 切换身份
			userstatus(e){
				this.page_index = e
				uni.setStorageSync('bk',e)
				if(e == 1){ //帮客
					this.userbgcol = '#ff9909'
				}else{
					this.userbgcol = '#fd4142'
				}
				//身份切换
				this.infoType = e
				this.pages()
			},
			// 1 发嘚瑟/ 2去评价
			go_pj(e){
				if(e == 1){
					this.com.navto('../brag/issue_brag?type='+1+'&id='+this.completedp.jdUuid)
				}else{
					this.com.navto('./list/addpingjia?id='+this.completedp.jdUuid)
				}
			},
			// 到嘚瑟
			go_brag(e,id){
				console.log(e,id)
				this.com.navto('../brag/issue_brag?type='+e+'&id='+id)
				this.xuanyType = false
			},
			// 到后院
			go_list(e){
				uni.switchTab({
					url:'../list/list?type='+e
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f6f6f6;
	}
</style>
<style scoped lang="scss">
// 得瑟
.dese{
	width: 100%;padding: 30rpx 0;text-align: center;
}
.info_mations{
	width: 100%;padding: 3%;
	height: 380rpx;
	background-image: url(../../static/my/bzbgimg.png);
	background-size: 100% 100%;
	
	.info_mation_shezs{
		display: flex;justify-content: space-between;
		.userstyle{
			color: #fff;background-color:#ffa275;padding:0 28rpx;
			border-radius: 50rpx;line-height: 54rpx;
		}
	} 
	
	.user_part{
		width: 100%;padding: 3%;
		display: flex;
		margin-top: 20rpx;
		.user_part_left{
			width: 30%;position: relative;
			image{
				width: 150rpx;height: 150rpx;border-radius: 50%;
			}
			.nans{
				width: 44rpx;height: 44rpx;
				position: absolute;right: 44rpx;bottom: 4rpx;
			}
		}
		.user_part_cont{
			width: 70%;
			.user_name{
				font-size: 44rpx;color: #FFFFFF;line-height: 90rpx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.user_part_right{
				display: flex;justify-content: space-between;
				.my_medal{
					width: 160rpx;padding-left: 44rpx;
					height: 40rpx;
					background-image: url(../../static/index/taskDetail/dengji.png);
					background-size: 100% 100%;
					color: #fff;
					font-size: 26rpx;
					
				}
				.Singleing{
					display: flex;color: #fff;
				}
				.guest_book{
					background-color: #FFFFFF;padding: 8rpx 25rpx;border-radius: 50rpx;
					// box-shadow: 0rpx 1rpx 10rpx 0rpx rgba(0,0,0,0.5);
				}
			}
		}
		
	}
	.data_statis{
		width: 100%;
		display: flex;justify-content: space-around;
		.data_statis_item{
			width: 25%;text-align: center;color: #fff;
			view:nth-child(1){
				font-size: 34rpx;font-weight: bold;line-height: 60rpx;
			}
		}
	}
}	
	
.lists{
		margin-top: 26rpx;margin-left: 3%;padding: 30rpx 0;
		background-color: white;
		width: 94%;border-radius: 20rpx;
		display: flex;flex-wrap: wrap;
		.data_statis_list{
			width: 25%;text-align: center;margin: 10rpx 0;
			image{
				width: 80rpx;height: 87rpx;
			}
			view{
				font-size: 28rpx;
			}
		}
	}
.zhanghu{
	width: 94%;height: 120rpx;margin-left: 3%;line-height: 120rpx;
	background-image: url(../../static/my/zhanghuBG.png);
	background-size: 100% 100%;
	display: flex;justify-content: space-between;
	.zhanghuLeft{
		display: flex;
		image{
			width: 58rpx;height: 60rpx;margin: 28rpx;
		}
		view{
			font-size: 36rpx;
		}
	}
	.zhanghuRig{
		color: red;display: flex;padding-right: 20rpx;
		view{
			font-size: 42rpx;margin-right: 30rpx;
		}
	}
}
.info_mation{
	width: 100%;padding: 3%;
	height: 500rpx;
	background-image: url(../../static/my/bkbgimg.png);
	background-size: 100% 100%;
	//定位
	
	
	.info_mation_shez{
		display: flex;justify-content: space-between;
		.userstyle{
			color: #fff;background-color: #ff6600;padding:0 28rpx;
			border-radius: 50rpx;line-height: 54rpx;
		}
	} 
	
	.user_part{
		width: 100%;padding: 3%;
		display: flex;
		margin-top: 20rpx;
		.user_part_left{
			width: 30%;position: relative;
			image{
				width: 150rpx;height: 150rpx;border-radius: 50%;
			}
			.nans{
				width: 44rpx;height: 44rpx;
				position: absolute;right: 44rpx;bottom: 4rpx;
			}
		}
		.user_part_cont{
			width: 70%;
			.user_name{
				font-size: 44rpx;color: #FFFFFF;line-height: 90rpx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.user_part_right{
				display: flex;justify-content: space-between;
				.my_medal{
					width: 160rpx;padding-left: 44rpx;
					height: 40rpx;
					background-image: url(../../static/index/taskDetail/dengji.png);
					background-size: 100% 100%;
					color: #fff;
					font-size: 26rpx;
					
				}
				.guest_book{
					background-color: #FFFFFF;padding: 8rpx 25rpx;border-radius: 50rpx;
					// box-shadow: 0rpx 1rpx 10rpx 0rpx rgba(0,0,0,0.5);
				}
			}
		}
		
	}
	.data_statis{
		width: 100%;
		display: flex;justify-content: space-around;
		.data_statis_item{
			width: 25%;text-align: center;color: #fff;
			view:nth-child(1){
				font-size: 34rpx;font-weight: bold;line-height: 60rpx;
			}
		}
	}
}

.judge_br{
	width: 94%;margin: auto;margin-top: 26rpx;
	background-color: #fff;padding: 20rpx;

	border-radius: 20rpx;
	image{
		width: 200rpx;height: 150rpx;border-radius: 15rpx;
	}
	.judge_br_cont{
		view:first-child{
			font-size: 30rpx;font-weight: bold;line-height: 80rpx;
		}
		view:last-child{
			color: #999;
		}
	}
	.judge_br_rig{
		background-color: #eaeaea;margin: 50rpx 20rpx;padding: 10rpx 15rpx;border-radius: 50rpx;
	}
}
.backyard{
	width: 94%;margin: auto;background-color: #FFFFFF;margin-top: 25rpx;padding: 30rpx 0;border-radius: 20rpx;
	
	.backyard_title{
		font-size: 34rpx;font-weight: bold;padding-left: 30rpx;
	}
	.backyard_item{
		display: flex;width: 100%;
		padding-top: 30rpx;
		.backyard_it_list{
			width: 25%;text-align: center;
			image{
				width: 60rpx;height: 60rpx;
			}
			view{
				font-size: 26rpx;
			}
		}
	}
}
.help_dispatch{
	display: flex;flex-wrap: wrap;
	width: 94%;margin: auto;margin-top: 26rpx;
	padding:30rpx 0 10rpx 0;background-color: #FFFFFF;border-radius: 20rpx;
	.help_dispatch_item{
		width: 25%;text-align: center;margin-bottom: 20rpx;
		image{
			width: 50rpx;height: 50rpx;
		}
		view{
			font-size: 26rpx;text-overflow: ellipsis;line-height: 60rpx;
		}
	}
}
</style>
