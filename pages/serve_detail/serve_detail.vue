<template>
	<view>
		<view class="title">{{detailtit.serveTitle}}</view>
		<u-swiper :list="list" :circular="true" mode="rect" height="440" @click="img_pieve" border-radius="0"></u-swiper>
		
		<view class="disPic">
			<view class="disList">
				<view class="top">
					{{detailtit.distance < 1 ? detailtit.distance * 1000 + 'm' : detailtit.distance + 'km'}}
					<text>服务范围> <text v-for="it in addFanw">{{it.name}}</text></text>
				</view>
				<view class="bot">
					<view class="botleft">总计服务：{{detailtit.serveTotal}}</view>
					<view class="botrig">收藏量：{{detailtit.storeTotal}}</view>
				</view>
			</view>
			<!-- <view class="disRig">
				服务参考￥{{detailtit.price}}元
			</view> -->
		</view>
		<!-- 发布人 -->
		<view class="userinfo" @click="go_master(detailUser.ryUuid)">
			<view class="left" >
				<image :src="detailUser.img" mode="aspectFill"></image>
				<view class="usernmae">
					<view class="names">{{detailUser.name}}</view>
					<view class="renzheng">
						<view class="gradeClass">
							{{detailUser.grade}}
						</view>
						 <image v-if="detailUser.isAuthentication != 1" style="height: 38rpx;" src="../../static/index/renzheng.png" mode=""></image>
					</view>
				</view>
				
			</view>
			<view class="right">
				进入帮主主页
			</view>
		</view>
		
		<view v-if="detailComment.averageScore">
			<view class="pinj">
				<view class="pjtit active">评价</view>
				<!-- 评分 -->
				<view class="score">
					<view>
						综合评分 <text style="color: #fe552e;"> {{detailComment.averageScore}}</text> 
						<u-rate :current="detailComment.averageScore" :disabled="true" gutter="0"></u-rate>
					</view>
					<view class="" v-if="detailComment.appraiseCount">
						<text style="margin-left: 50rpx;color: #fe552e;">{{detailComment.appraiseCount.appraiseCount}}</text>条评论
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
				<view class="commentuser">
					<view class="userimg" @click="go_master(detailComment.ryUuid)">
						<image :src="detailComment.img" mode="aspectFill"></image>
						<view>
							{{detailComment.petName}}
							<!-- <view class="">
								<u-rate :current="it.score" :disabled="true" gutter="0"></u-rate>
							</view> -->
						</view>
					</view>
					<view class="userTime">
						{{detailComment.time}}
					</view>
				</view>
				<view class="textcontent" @click="go_Detail(detailComment.id)">
					{{detailComment.proposal}}
				</view>
				<view class="imgswiper" @click="go_Detail(detailComment.id)">
					<image v-for="(it,index) in detailComment.photo" :key="index" :src="it" mode="aspectFill"></image>
					
				</view>
				<view class="thumbs" @click="pj_dian(detailComment.id)">
					<u-icon name="thumb-up" v-if="detailComment.ishelpAppraiseParse == 0"></u-icon>
					<u-icon name="thumb-up-fill" v-else color="#0493fd"></u-icon>
					{{detailComment.parseCount}}
				</view>
				<view class="quancomment" @click="go_pjia(detailtit.serveUuid)">
					查看全部评价<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
		
		<!-- //详情 -->
		<view class="fuwdetail">
			<view class="pjtit active">详情</view>
			<!-- 介绍 -->
			<view class="introduce">
				{{detailtit.describe}}
			</view>
		</view>
		<!-- 按钮 -->
		<view class="bottom" v-if="zhanshow">
			<view class="bottomLeft"  @click="collect(detailtit.serveUuid)">
				<view class="bottom_function_left">
					<view class="left_view" v-if="detailtit.store != 0">
						<u-icon name="star" color="#333" size="36"></u-icon>
						<view class="viewcolor"  >收藏</view>
					</view>
					<view class="left_view" v-else >
						 <u-icon name="star-fill" color="#f30600" size="36"></u-icon>
						<view class="viewcolor" >已收藏</view>
					</view>
				</view>
				<!-- <view @click="collect(detailtit.serveUuid)">{{detailtit.store == 0 ? '已收藏' : '收藏'}}</view> -->
			</view>
		
			<view class="bottomRight"> 
				<view class="bottomRight_L" @click="gochat">在线咨询</view>
				<view class="bottomRight_r" @click="order_receiving">请ta帮忙</view>
			</view>
		</view>
		<view class="bottom" v-else>
			<view class="bottomLeft">
				
			</view>
			<view class="bottomRight" style="padding-right: 30rpx;"> 
				<view></view>
				<view class="bottomRight_r" @click="compile(detailtit.serveUuid)">编辑</view>
			</view>
		</view>
		<!-- 评论举报 -->
		<u-popup v-model="bragpopup" mode="bottom" border-radius="20">
			<view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(1)">
				分享
			</view>

			<view class="del_item"  style="color: red;border-bottom: 1rpx solid #eee;" @click="bargClick(3)">
				举报
			</view>
			<view class="del_item" @click="bragpopup = false">
				取消
			</view>
		</u-popup>
		<tb-share ref="share" :page_content_two="detailtit" :contentHeight="450" type="2"></tb-share>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bragpopup:false,
				zhanshow:false,// 展示
				list: [],
				detailId:'', 
				detail:'',
				detailtit:'',
				addresscont:'',//经纬度
				detailComment:'',//评价
				detailUser:'',//发布人
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
				addFanw:[],//服务范围
			}
		},
		onLoad(e) {
			this.detailId = e.id
			this.weather()
		},
		onNavigationBarButtonTap() {
			this.bragpopup = !this.bragpopup
		},
		onShow() {
		},
		methods: {
			//编辑
			compile(e){
				this.com.navto('../my/list/addService?id='+e)
			},
			// 图片点击
			img_pieve(e){
				console.log(this.list) 
				let arr = []
				this.list.forEach(i=>{
					arr.push(i.image)
				})
				uni.previewImage({
					urls:arr,
					current:e
				});
			},
			// 地址
			weather() {
				var that = this;
				
				that.pageData()
				
				uni.getLocation({
					type: 'wgs84',
					geocode: true, //必写项
					success: data => {
						console.log(data);
						if (data.address) {
							that.addresscont = data;
							that.pageData()
						}
					}
				});
			},
			pageData(){
				this.list = []
				this.api.get('serve/serveDetails/'+this.detailId,{
					longitude:this.addresscont.longitude ,
					latitude:this.addresscont.latitude,
					ryUuid:uni.getStorageSync('userinfo_Data').id
				}).then(res=>{
					console.log(res)
					if(res.flag){
						this.detail = res.data
						this.detailtit = res.data.hsServeInfo //服务信息
						//图片处理
						res.data.hsServeInfo.photo.forEach(i=>{
							this.list.push({image:i})
						})
						// 评价
						this.detailComment = res.data.hsAppraise
						// console.log(this.list)
						this.detailUser = res.data.hsPerson
						if( res.data.hsPerson ){
							if( res.data.hsPerson.ryUuid != uni.getStorageSync('userinfo_Data').id){
								this.zhanshow = true
							}else{
								this.zhanshow = false
							}
						}
					}
					if( res.data.hsAppraise.appraiseCount){
						let add = res.data.hsAppraise.appraiseCount
						this.types = [
							// 0 -查看评价 1-好评 2-差评 3-帮助及时 4-服务周到 5-专业熟练 6-安全可靠 6-收费合理
							{name:'全部',type:0,num:add.appraiseCount},
							{name:'好评',type:1,num:add.praiseCount },
							{name:'差评',type:2,num:add.negativeCount},
							{name:'帮助及时',type:3,num:add.timelyServiceCount},
							{name:'服务周到',type:4,num:add.serveScoreCount},
							{name:'专业熟练',type:5,num:add.professionalCount},
							{name:'安全可靠',type:6,num:add.reliabilityScore},
							{name:'收费合理',type:7,num:add.qualityCount}
						]
					}
					this.addFanw = res.data.hsServeInfo.serveScope
				})
			},
			// 收藏
			collect(e){
				// console.log(e)
				// 帮助ID/用户ID/收藏状态
				let type = 0
				if(this.detailtit.store == 0){
					type = 1
				}else{
					type = 0
				}
				this.api.get('record/isStore/'+e+'/'+type).then(res=>{
					console.log(res) 
					if(res.flag){
						this.pageData()
					}
					this.com.msg(res.message)
				})
			},
			go_master(e){
				this.com.navto('../my/master_page?id='+e)
			},
			order_receiving(){
				if(!uni.getStorageSync('token')){
					uni.showModal({
						content:'您未登录，是否去登录？',
						cancelText:"再逛逛",
						confirmText:'去登陆',
						success(e) {
							if(e.confirm){
								uni.navigateTo({
									url:'../login/login'
								})
							}
						}
					})
				}else{
					this.com.navto('./order_receiving?id='+this.detailId)
				}
			},
			// 到评价列表
			go_pjia(e){
				this.com.navto('./serve_list?id='+e)
			},
			//点击类型
			cliList(e,type){
				this.com.navto('./serve_list?id='+e+'&type='+type)
			},
			//评价点赞
			pj_dian(e){
				this.api.get('helpAppraiseParse/addShowCommentParse/'+e).then(res=>{
					if(res.flag){
						this.pageData()
					}
					this.com.msg(res.message)
				})
			},
			// 评价详情
			go_Detail(e){
				this.com.navto('./evaluate_detail/evaluate_detail?id='+e)
			},
			//分享举报
			bargClick(e){ //1分享 2举报
				this.bragpopup = false
				if(e== 1){
					this.$refs.share.toggleMask();
				}else{
					uni.navigateTo({
					 	url:'../report/report?type='+ 2+'&bzUuid='+this.detailtit.serveUuid+'&id='+this.detailUser.ryUuid
					})
				}
			},
			//去聊天
			gochat(){
				this.api.get('chat/add/'+this.detailUser.ryUuid+'/'+this.detailId+'/'+1).then(res=>{
					console.log(res)
					if(res.flag){
						//id发布人 bzuuid是任务或服务id
						this.com.navto('../chat/chat?name='+this.detailUser.name+'&id='+this.detailUser.ryUuid+'&bzuuid='+this.detailId+'&type='+ 1+'&chatId='+res.data)
					}
				})
			
			}
		}
	}
</script>

<style scoped lang="scss">
	//删除
	.del_item{
		width: 100%;text-align: center;line-height: 100rpx;
	}
.title{
	padding: 0 3%;font-size: 36rpx;line-height: 70rpx;
}
.swiper{
	height: 450rpx;background-color: pink;
}
.disPic{
	display: flex;justify-content: space-between;padding: 2% 4%;
	background-color: #fff;
	.disList{
		width: 100%;
		.top{
			color: red;
			text{
				margin-left: 30rpx;color: #333333;
			}
		}
		.bot{
			display: flex;font-size: 26rpx;color: #999;margin-top: 20rpx;
			view{
				width: 220rpx;
			}
		}
	}
	.disRig{
		width: 50%;color: red;text-align: right;
	}
}
.userinfo{
	border-top: 20rpx solid #eee;border-bottom: 20rpx solid #eee;
	padding: 2%;display: flex;justify-content: space-between;
	.left{
		display: flex;
		image{
			width: 140rpx;height: 140rpx;border-radius: 8rpx;
			margin-right: 20rpx;
		}
		.usernmae{
			.names{
				font-size: 30rpx;line-height: 66rpx;
			}
			.renzheng{
				display: flex;justify-content: space-between;color: #333;
				.gradeClass{
					padding-left: 44rpx;font-size: 26rpx;margin-right: 20rpx;
					width: 166rpx;height: 38rpx;
					background: url(../../static/index/taskDetail/dengji.png) no-repeat;
					background-size: 100% 100%;color: white;
				}
			}
		}
	}
	.right{
		font-size: 26rpx;
	}
}
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
.fuwdetail{
	padding: 0 3% 120rpx 3%;
	.introduce{
		padding: 3% 0;
	}
}
.bottom{
	padding: 0 3%;
	width: 100%;height: 100rpx;box-shadow: 0rpx 0rpx 1rpx 3rpx rgba(0,0,0,0.1);
	display: flex;justify-content: space-between;align-items: center;
	position: fixed;left: 0;bottom: 0;background-color: #FFFFFF;z-index: 20;
	.bottomLeft{
		width: 105rpx;text-align: center;
	}
	.bottomRight{
		width: 50%;
		display: flex;justify-content: space-between;align-items: center;
		view{
			padding: 15rpx 30rpx;border-radius: 50rpx;color: #fff;
		}
		.bottomRight_L{
			background-color: #ff8a00;
		}
		.bottomRight_r{
			background-color: red;
		}
	}
}
</style>
