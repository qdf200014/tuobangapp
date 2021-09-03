<template>
	<view>
		<!-- <tb-pulldown bgcolor="#ffecd3" :scrollY="true" @onRefresh="onRefresh" :pullshow="false">
			<view slot="detail" > -->
				<!-- 头部 -->
				<view class="user_header">
					<view class="headKuang">
						<view style="display: flex;justify-content: space-between;padding: 0 3%;">
							<view class="header_l">
								<image class="header_l_img" :src="hsPerson.ryHeadImg" @click="img_da(hsPerson.ryHeadImg)" mode="aspectFill"></image>
								<image v-if="hsPerson.rySex == '男'" class="nans" src="../../static/nan.png" mode=""></image>
								<image v-else class="nans" src="../../static/nu.png" mode=""></image>
							</view>
							<view class="header_r">
								<view class="header_r_top">
									<view class="top_item" v-for="(it, index) in swiperList" :key="index" @click="cli_data(index)">
										<view class="top_item_num">{{ it.num }}</view>
										<view class="top_item_text">{{ it.name }}</view>
									</view>
								</view>
								<view class="header_r_bottom" v-if="hsPerson.state == 0" @click="topclick(0)">编辑资料</view>
								<view class="header_r_bottom_w" v-if="hsPerson.state == 1" @click="topclick(1)">+关注</view>
								<view class="header_r_bottom_sty" v-if="hsPerson.state == 2" @click="topclick(2)">已关注</view>
								<view class="header_r_bottom_sty" v-if="hsPerson.state == 3" @click="topclick(3)">互相关注</view>
							</view>
						</view>
					
						<view class="username">
							<view class="username_l">
								<view class="username_l_name">{{ hsPerson.ryPetName }}</view>
								<view class="rzheng" @click="gotopage('./grade')">
									<view class="username_l_xz">
										{{hsPerson.grade}}
									</view>
									<view v-if="hsPerson.authStatus != '未认证'">
										<image src="../../static/index/renzheng.png" mode=""></image>
									</view>
								</view>
								
							</view>
							<view class="username_r">{{ accessTime }}</view>
						</view>
						<!-- 简介 -->
						<view class="intor">{{ hsPerson.ryIntro }}</view>
					</view>
				</view>
				
				<!-- tab --> 
				<view style="position: sticky;top: 0;z-index: 999;background-color: #fff;">
					<view class="tab_part">
						<view class="part_item" :class="{ active: tabindex == index }" v-for="(it, index) in tablist" 
						:key="index" @click="tab_cli(index)">{{ it.name + it.num }}</view>
					</view>
				</view>
				<view class="content">
					<swiper class="swiper" :style="{height:heightA * 2 + 'rpx'}" @change="change_swiper" :current="tabindex">
						<!-- 需求 -->
						<swiper-item class="swiperIt">
							<view v-if="myHelpList!=''" >
								<view class="task_list" ref="lista" v-for="(it, index) in myHelpList" :key="index"
								 @click="go_myHelpdetail(it,it.bzState)">
									<image class="labimg" v-if="it.bzState == 1" src="../../static/guoqi.png" mode=""></image>
									<image class="labimg" v-if="it.bzState == 3" src="../../static/chengg.png" mode=""></image>
									<image class="labimg" v-if="it.bzState == 4" src="../../static/xiajia.png" mode=""></image>
									<image class="labimg" v-if="it.bzState == 2" src="../../static/beijie.png" mode=""></image>
									<view class="task_list_left">
										<image class="task_list_left_img" :src="it.photo" mode="aspectFill"></image>
										<!-- <view class="task_list_left_userinfo">
										<image class="left_userinfo_img" src="../../static/daibangliebiaotouxiang.png" mode="aspectFill"></image>
										<text class="left_userinfo_text">这是标题</text>
									</view> -->
									</view>
									<view class="task_list_right">
										<text class="task_list_right_tit rowTwo">{{ it.jianjie }}</text>
										<view class="task_list_right_address">
											<!-- <text class="right_address_time">123</text> -->
										</view>
									</view>
									<!-- <view class="collect" v-if="it.countStore != 0">{{ it.countStore }}人收藏</view> -->
								</view>
							</view>
							<view v-else style="padding-top: 100rpx;">
									<u-empty text="求助列表为空" mode="list"></u-empty>
							</view>
						</swiper-item>
						<!-- 服务 -->
						<swiper-item class="swiperIt">
							<!-- 列表 -->
							<view v-if="seekhelp!=''">
								<view class="task_list" v-for="(it, index) in seekhelp" :key="index" @click="go_detail(it.serveUuid)">
									
									<view class="task_list_left">
										<image class="task_list_left_img" :src="it.photo[0]" mode="aspectFill"></image>
										<!-- <view class="task_list_left_userinfo">
										<image class="left_userinfo_img" src="../../static/daibangliebiaotouxiang.png" mode="aspectFill"></image>
										<text class="left_userinfo_text">这是标题</text>
									</view> -->
									</view>
									<view class="task_list_right">
										<text class="task_list_right_tit rowTwo">{{ it.serveTitle }}</text>
										<view class="task_list_right_address">
											<!-- <text class="right_address_time">  123 </text> -->
										</view>
									</view>
									<!-- <view class="collect" v-if="it.countStore != 0">{{ it.countStore }}人收藏</view> -->
								</view>
							</view>
							<view v-else style="padding-top: 100rpx;">
									<u-empty text="帮助列表为空" mode="list"></u-empty>
							</view>
						</swiper-item>
						<swiper-item class="swiperIt">
							<pinj :detailComment="detailComment" :types="types" @typeCli="typeCli" @pj_dian="pj_dian"
							:averageScore="averageScore"  @goDetail="go_Detail" :height.sync="heightc" ref="pinjia"></pinj>
						</swiper-item>
					</swiper>
				</view> 
			<!-- </view>
		</tb-pulldown> -->

		<!-- 举报 -->
		<u-popup v-model="bragpopup" mode="bottom" border-radius="20">
			<!-- <view class="del_item" @click="bargClick(1)">分享</view> -->
			<!-- <view class="del_item" @click="bargClick(2)" v-if="hsPerson.state != 0">加入黑名单</view> -->
			<view class="del_item" style="color: red;" @click="bargClick(3)" 
			v-if="hsPerson.state != 0">举报</view>
			<view class="del_item" style="color: #999;" @click="bragpopup = false">取消</view>
		</u-popup>
	</view>
</template>

<script>
	import pinj from '../serve_detail/pinjia.vue'
export default {
	data() {
		return {
			tablist: [ { name: '求助', num: 0 },{ name: '帮助', num: 0 }, { name: '评价', num: 0 }],
			tabindex: 0,
			fuId: '',
			myHelpList: [], //列表
			hsPerson: '', //信息
			swiperList: [],
			accessTime: '', //时间
			bragpopup: false,
			addresscont:'',
			seekhelp:[],// 求助
			pageAye:1,//需求页数
			pageBye:1,//服务
			pageCye:1,//评论
			detailComment:[],//评价
			types:[],
			plIndex:0,//评论
			averageScore:0,//评分
			heightA:'',
			heightc:''
		};
	},
	//下拉刷新
	onPullDownRefresh() {
		console.log('refresh');
		let that = this
		that.pageData();
		setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	onLoad(e) {
		console.log(e);
		let that = this
		uni.getLocation({
			type: 'wgs84',
			geocode: true, //必写项
			success: data => {
				// console.log(data);
				if (data.address) {
					that.addresscont = data;
				}
			}
		});
		
		
		this.fuId = e.id;
		if (e.id) {
			this.pageData();
		} else {
			this.fuId = uni.getStorageSync('userinfo_Data').id;
			this.pageData();
		}
		this.pageA(this.pageAye)
		this.pageB(this.pageBye)
		this.pageC(this.pageCye)
	},
	onNavigationBarButtonTap() {
		if(this.hsPerson.state != 0){
			this.bragpopup = true;
		}
	},
	components:{
		pinj
	}, 
	mounted() {
		this.hqheight()
		
	},
	onReachBottom(e) {
		console.log('触底了')
		if(this.tabindex == 0){
			this.pageBye ++
			this.pageB(this.pageBye)
		}else if(this.tabindex == 1){
			this.pageAye ++
			this.pageA(this.pageAye)
		}else if(this.tabindex == 2){
			this.pageCye ++
			this.pageC(this.pageCye)
			if(this.detailComment.length > 0){
				this.heightA = this.detailComment.length * 250 + this.heightc
			}
		}
	},
	methods: {
		gotopage(e){
			this.com.navto(e)
		},
		pageData() {
			let arr = {
			    "uid": this.fuId,
			    "fid": uni.getStorageSync('userinfo_Data').id,
			    "longitude": this.addresscont.longitude,
			    "latitude": this.addresscont.latitude
			}
			this.api.post('person/getBangZhuInfo',arr).then(res => {
				console.log(res);
				if (res.flag) {
					uni.stopPullDownRefresh();
					this.accessTime = res.data.accessTime;
					this.hsPerson = res.data.hsPerson;
					this.swiperList = [
						{
							name: '收藏',
							num: res.data.hsPerson.storeCounts
						},
						{
							name: '关注',
							num: res.data.hsPerson.myGuanZhu
						},
						{
							name: '粉丝',
							num: res.data.hsPerson.myFans
						}
					];
					this.tablist = [
						{ name: '求助', num: res.data.seekHelpCounts },  //需求
						{ name: '帮助',num:res.data.serveCounts},      //服务
						{ name: '评价', num: res.data.appraiseCounts },
					]
				}
			});
		},
		hqheight(){
			const query = uni.createSelectorQuery().in(this);
			if(this.myHelpList != ''){
				query.select('.task_list').boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					if(data.height){
						if(this.tabindex == 0){
							this.heightA = Math.floor(data.height + 15) * this.myHelpList.length 
						}else if(this.tabindex == 1){
							
							this.heightA = Math.floor(data.height + 15) * this.seekhelp.length 
						}
					}
					console.log(this.heightA)
				}).exec();
			}
		},
		hqheightB(){
			const query = uni.createSelectorQuery().in(this);
			query.select('.task_list').boundingClientRect(data => {
				if(data.height){
					// console.log("得到布局位置信息" + JSON.stringify(data));
					this.heightA = Math.floor(data.height + 15) * this.myHelpList.length 
					console.log(this.heightA)
				}
			}).exec();
		},
		//服务
		pageA(e){
			this.api.get('serve/bangZhuInfoServe/'+ this.fuId,{
				page:e,
				size:10,
				longitude: this.addresscont.longitude ||  116.406158,
				latitude: this.addresscont.latitude || 39.942307,
				fid:uni.getStorageSync('userinfo_Data').id,
			}).then(res=>{
				console.log(res)
				this.seekhelp =this.seekhelp.concat(res.data)
				
				if(e > 1 && res.data && res.data.length < 10){
					this.com.msg('到底了~')
				}
				this.hqheight()
			})
		},
		//需求
		pageB(e){
			this.api.get('help/bangZhuInfoHelp/'+ this.fuId,
			{
				page:e,
				size:10,
				longitude: this.addresscont.longitude ||  116.406158,
				latitude: this.addresscont.latitude || 39.942307,
				fid:uni.getStorageSync('userinfo_Data').id,
			}).then(res=>{
				console.log(res)
				this.myHelpList =this.myHelpList.concat(res.data)
				
				if(e != 1 && res.data && res.data.length < 10){
					this.com.msg('到底了~')
				}
				this.hqheight()
				
			})
		},
		//评价
		pageC(e){
			this.api.get('appraise/bangZhuInfoAppraise/'+this.fuId+'/'+this.plIndex,
			{
				fid:uni.getStorageSync('userinfo_Data').id,
				page:e,
				size:5,
			}).then(res=>{ 
				console.log(res)
				this.detailComment = this.detailComment.concat(res.data.appraise)
				this.averageScore = res.data.averageScore
				let add = res.data.appraiseCount
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
				if(e != 1){
					if(res.data && res.data.appraise.length < 5){
						this.com.msg('到底了~')
					}
				}
			})
		},
		
		//关注粉丝
		cli_data(e) {
			if (e == 1) {
				this.com.navto('./tongji/attention?id=' + this.hsPerson.ryUuid); //粉丝
			} else if (e == 2) {
				this.com.navto('./tongji/fans?id=' + this.hsPerson.ryUuid); //粉丝
			}
		},
		//tab点击
		tab_cli(e) {
			this.tabindex = e;
			if(e == 0){
				this.hqheight()
			}else if(e==1){
				this.hqheight()
			}else{
				if(this.detailComment.length > 0){
					this.heightA = this.detailComment.length * 250 + this.heightc
				}
				console.log(this.heightA)
			}
		},
		//滑块
		change_swiper(e) {
			console.log(e);
			this.tabindex = e.detail.current
			if(e.detail.current == 0){ 
				this.hqheight()
			}else if(e.detail.current == 1){
				this.hqheight()
			}else{
				// this.$refs.pinjia.getHeight()
				if(this.detailComment.length > 0){
					this.heightA = this.detailComment.length * 250 + this.heightc
				}
				console.log(this.heightA)
			}
		},
		//到详情
		go_detail(e) {
			this.com.navto('../serve_detail/serve_detail?id=' + e);
		},
		//需求流程
		go_myHelpdetail(e,type){
			console.log(e,type)
			if(type == 0 ){
				this.com.navto('../index/task_detail?id='+e.bzUuid) 
			}else{
				this.com.navto('./details?data=' + JSON.stringify(e));
			}
		},
		
		// 按钮
		topclick(e) {
			// 0 编辑资料 1加关注 2已关注 3互相关注
			if (e == 0) {
				this.com.navto('./user_set'); //个人信息设置
			} else {
				this.api.post('hsFansInfo/addGuanZhu', { uid: this.hsPerson.ryUuid, fid: uni.getStorageSync('userinfo_Data').id }).then(res => {
					console.log(res);
					if (res.flag) {
						this.com.msg(res.message);
						this.pageData();
					}
				});
			}
		},
		//预览图片
		img_da(a) {
			let arr = [];
			arr.push(a);
			uni.previewImage({
				urls: arr
			});
		},
		// 举报
		bargClick(e) {
			if (e == 1) {
			}else if(e == 2){
				
			}else if(e == 3){
				this.bragpopup = false
				this.com.navto('../report/master_page_report?cont='+this.hsPerson.ryUuid)
			}
		},
		// 评价详情
		go_Detail(e){
			this.com.navto('../serve_detail/evaluate_detail/evaluate_detail?id='+e)
		},
		//点击切换
		typeCli(e){
			this.plIndex = e
			this.detailComment = []
			this.pageCye = 1
			this.pageC(this.pageCye)
		},
		//点赞
		pj_dian(e,ind){
			console.log(e,ind)
			this.api.get('helpAppraiseParse/addShowCommentParse/'+e).then(res=>{
				if(res.flag){
					this.detailComment[ind].ishelpAppraiseParse = this.detailComment[ind].ishelpAppraiseParse == 0 ? 1 : 0
					this.detailComment[ind].parseCount = this.detailComment[ind].ishelpAppraiseParse == 1 ? this.detailComment[ind].parseCount +1 : this.detailComment[ind].parseCount -1 
					this.detailComment = this.detailComment
					console.log(this.detailComment)
				}
			})
		}
	}
};
</script>

<style scoped lang="scss">
//删除
.del_item {
	width: 100%;
	text-align: center;
	line-height: 100rpx;
	font-size: 32rpx;
}
.headKuang{
	width: 100%;padding: 2% 1%;
	background: url(../../static/my/kuang.png) no-repeat;
	background-size: 100% 100%;
}
.user_header {
	padding:  1%;
	width: 100%;
	background: url(../../static/my/jianbian.png) no-repeat;
	background-size: 100% 200%;
	
	.header_l {
		position: relative;
		.header_l_img{
			
			width: 160rpx;
			height: 160rpx;
			border-radius: 50%;
		}
		.nans {
			width: 44rpx;
			height: 44rpx;
			position: absolute;
			right: 0rpx;
			bottom: 4rpx;
		}
	}

	.header_r {
		width: 72%;
		.header_r_top {
			display: flex;
			
			justify-content: space-around;
			text-align: center;
			.top_item_num {
				font-weight: bold;
				font-size: 34rpx;
			}
			.top_item_text {
				line-height: 40rpx;
			}
		}
		.header_r_bottom {
			width: 100%;
			text-align: center;
			padding: 10rpx 0;
			background-color: #ffffff;
			margin-top: 10rpx;
			border-radius: 50rpx;
		}
		.header_r_bottom_w {
			width: 100%;
			text-align: center;
			padding: 10rpx 0;
			background-color: #ffa800;color: white;
			margin-top: 10rpx;
			border-radius: 50rpx;
		}
		.header_r_bottom_sty {
			width: 100%;
			text-align: center;
			padding: 10rpx 0;
			background-color: #c8c7cc;
			margin-top: 10rpx;
			border-radius: 50rpx;
			color: white;
		}
	}
}
.username {
	display: flex;
	margin-top: 30rpx;	padding:0 3%;
	justify-content: space-between;
	.username_l {
		.username_l_name {
			font-size: 36rpx;
			font-weight: bold;
		}
		.rzheng{
			display: flex;margin: 10rpx 0;
			.username_l_xz {
				padding: 0 20rpx 0 46rpx;font-size: 26rpx;margin-right: 20rpx;
				min-width: 166rpx;max-width: 260rpx; height: 38rpx;
				background: url(../../static/index/taskDetail/dengji.png) no-repeat;
				background-size: 100% 100%;color: white;
			}
			image {
				height: 38rpx;width: 140rpx;
			}
		}
	}
}
.intor {
	text-overflow: ellipsis;
	overflow: hidd;	padding: 0 3%;
	max-height: 120rpx;
}
.tab_part {
	display: flex;
	width: 100%;
	padding: 3%;
	line-height: 60rpx;height: 100rpx;
	.part_item {
		width: 18%;
		text-align: center;
		color: #a4a7a8;
		font-size: 32rpx;
		position: relative;
		&.active {
			font-weight: bold;
			color: #000;
			// background: #f8f8f8;
			&:before {
				content: '';
				position: absolute;
				left: 35%;
				bottom: 0%;
				transform: translateY(-50%);
				height: 4rpx;
				width: 40rpx;
				background-color: #2d407a;
				opacity: 0.8;
			}
		}
	}
	// .active{
	// 	color: #000;width: 18%;text-align: center;font-weight: bold;font-size: 34rpx;

	// }
}
.content {
	background-color: #f8f8f8;
}
.swiper {
	width: 100%;min-height: 80vh;
	.swiperIt{
		padding-bottom: 80rpx;
	}
}
.task_list {
	width: 100%;
	background-color: white;
	margin: 14rpx 0;
	border-radius: 20rpx;
	padding: 30rpx 25rpx 0 25rpx;
	display: flex;
	flex-direction: row;
	position: relative;
	.labimg {
		position: absolute;
		left: 18%;
		bottom: 8%;
		width: 100rpx;
		height: 100rpx;
		z-index: 20;
	}
	.collect {
		width: 160rpx;
		text-align: center;
		position: absolute;
		right: 0;
		bottom: 0;
		border-radius: 0 0 20rpx 0;
		background-image: linear-gradient(to right, #fff, #0096ff);
		color: white;
	}
	.task_list_left {
		width: 180rpx;
	}
	.task_list_left_img {
		width: 160rpx;
		height: 160rpx;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
	}
	.task_list_left_userinfo {
		display: flex;
		flex-direction: row;
	}
	.left_userinfo_img {
		width: 60rpx;
		height: 60rpx;
		margin-right: 14rpx;
		border-radius: 50%;
	}
	.left_userinfo_text {
		font-size: 30rpx;
		line-height: 60rpx;
		color: #a3a3a3;
	}
	.task_list_right {
		width: 480rpx;
	}
	.task_list_right_tit {
		height: 80rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 36rpx;
		line-height: 40rpx;
		display: inline-block;

	}
	.task_list_right_address {
		margin-top: 10rpx;
		width: 340rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.right_address_jl {
		color: red;
		font-size: 28rpx;
	}
	.right_address_time {
		font-size: 30rpx;
		lines: 2;
		text-overflow: ellipsis;
	}
}
</style>
