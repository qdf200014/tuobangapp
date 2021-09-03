<template>
	<view class="page">
		<tb-pulldown bgcolor="#fff" textcolor="#000" :scrollY="true" @onRefresh="onRefresh" @pulldown="pulldown"
		:status="status">
			<view slot="detail">
				<view style="position: sticky;top: 0;z-index: 999;background-color: #fff;">
					<u-tabs :list="list" :is-scroll="false" :current="current" @change="change" item-width="200"
					 activeColor="#fd4142" bar-width="30"></u-tabs>
				</view>
				<view v-if="pageshoe">
					<tb-login></tb-login>
				</view>
				<view v-else>
					<view class="content" >
						<view v-show="current == 0 && pageList.length > 0">
							<view class="item" v-for="(it, ind) in pageList" :key="ind" @click="detail(it)">
								<view class="item_top">
									<view class="item_top_left"><image :src="it.img" mode="aspectFill"></image></view>
									<view class="item_top_content">
										<view class="item_top_content_top">{{ it.bkName }}</view>
										<text>初入江湖</text>
									</view>
									<!-- <view class="item_top_right">
										{{current == 0 ? '酬金：' : '参考酬金：'}}
										<text style="color: #ff0000;">￥{{ it.price }}</text>
									</view> -->
								</view>
								<view class="item_cont">{{ it.jianjie }}</view>
								<view class="item_but">
									<image :style="{width:current == 0 ? '160rpx' : '220rpx'}" :src="it.photo" mode="aspectFill"></image>
									<view class="item_but_right">
										<!-- <view class="">找相似</view> -->
										<view class="" @click.stop="noCollect(it.bzUuid,ind)">取消收藏</view>
									</view>
								</view>
							</view>
						</view>
						<view class="kun" v-if="pageList == '' && current == 0">
							<tb-kunNews></tb-kunNews>
						</view>
					</view>
					<view class="content" > 
						<view v-show="current == 1 && pageListTwo.length > 0">
							<view class="item" v-for="(it, ind) in pageListTwo" :key="ind" @click="detail(it)">
								<view class="item_top">
									<view class="item_top_left"><image :src="it.img" mode="aspectFill"></image></view>
									<view class="item_top_content">
										<view class="item_top_content_top">{{ it.bkName }}</view>
										<text>初入江湖</text>
									</view>
									<!-- <view class="item_top_right">
										{{current == 0 ? '酬金：' : '参考酬金：'}}
										<text style="color: #ff0000;">￥{{ it.price }}</text>
									</view> -->
								</view>
								<view class="item_cont">{{ it.jianjie }}</view>
								<view class="item_but">
									<image :style="{width:current == 0 ? '160rpx' : '220rpx'}" :src="it.photo" mode="aspectFill"></image>
									<view class="item_but_right">
										<!-- <view class="">找相似</view> -->
										<view class="" @click.stop="noCollect(it.bzUuid,ind)">取消收藏</view>
									</view>
								</view>
							</view>
						</view>
						<view class="kun" v-if="pageListTwo == '' && current == 1">
							<tb-kunNews></tb-kunNews>
						</view>
					</view>
				</view>
			</view>
		</tb-pulldown>
	</view>
</template>

<script>
export default {
	data() {
		return {
			pageshoe:true,//页面显示
			headInd: 0,
			pageList: [],
			pageListTwo:[],
			list: [
				{
					name: '求助'
				},
				{
					name: '帮助'
				}
			],
			current: 0,
			page:1,
			pageTwo:1,
			status: 'more',
		};
	},
	onLoad() {
		this.pageData(this.page);
		this.pageDataTwo(this.pageTwo)
	},
	methods: {
		pulldown(){
			this.status = 'loading'
			if(this.current == 0){
				this.page ++
				this.pageData(this.page)
			}else{
				this.pageTwo ++
				this.pageDataTwo(this.pageTwo)
			}
		},
		//下拉刷新
		onRefresh(){
			// 刷新
			this.pageshoe = true
			if(this.current == 0){
				this.pageList = []
				this.page = 1
				this.pageData(this.page)
			}else{
				this.pageListTwo = []
				this.pageTwo = 1
				this.pageDataTwo(this.pageTwo)
			}
		},
		pageData(e) {
			this.api.get('record/store/' + 0,{page:e,size:10}).then(res => {
				console.log(res);
				if (res.flag) {
					this.pageshoe = false
					this.pageList =this.pageList.concat(res.data) 
					if(res.data && res.data.length < 10){
						this.status = 'noMore'
					}
				}
			});
		},
		pageDataTwo(e) {
			this.api.get('record/store/' + 1,{page:e,size:10}).then(res => {
				console.log(res);
				if (res.flag) {
					this.pageshoe = false
					this.pageListTwo = this.pageListTwo.concat(res.data) 
					if(res.data && res.data.length < 10){
						this.status = 'noMore'
					}
				}
			});
		},
		headCli(e) {
			this.headInd = e;
		},
		noCollect(e) {
			this.api.get('record/isStore/' + e + '/' + 1).then(res => {
				console.log(res);
				if (res.flag) {
					this.com.msg(res.message);
					this.pageData(this.current);
				}
			});
		},
		change(e) {
			this.current = e;
			this.pageshoe = true
			setTimeout(()=>{
				this.pageshoe = false
			},200)
		},
		detail(e){
			if(this.current == 0){ //需求
				if(e.bzState == 0){
					this.com.navto('../../index/task_detail?id='+e.bzUuid)
				}else{
					this.com.navto('../details?data=' + JSON.stringify(e));
				}
			}else{
				if(e.bzState == 0){
					this.com.navto('../../serve_detail/serve_detail?id='+e.bzUuid )
				}else{
					this.com.navto('../details?data=' + JSON.stringify(e)+'&type='+2);
				}
			}
		}
	}
};
</script>

<style>
page {
	background-color: #f6f6f6;
}
</style>
<style scoped lang="scss">

.head_top {
	width: 100%;
	line-height: 6vh;
	display: flex;
	.head_top_item {
		width: 25%;
		text-align: center;
		color: #999999;
	}
	.active {
		color: #000;
		width: 25%;
		text-align: center;
		font-weight: bold;

		position: relative;
		&:after {
			position: absolute;
			bottom: 0%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 60rpx;
			height: 4rpx;
			background-color: #00b4ff;
			border-radius: 50rpx;
		}
	}
}
.content {
	padding: 0 3%;
	.item {
		width: 100%;
		padding: 3%;
		margin: 20rpx 0;
		border-radius: 10rpx;
		background-color: white;
		.item_top {
			width: 100%;
			display: flex;
			.item_top_left {
				width: 18%;
				image {
					width: 100rpx;
					height: 100rpx;
					border-radius: 52%;
				}
			}
			.item_top_content {
				width: 50%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				.item_top_content_top {
					line-height: 50rpx;
					font-size: 32rpx;
					font-weight: bold;
				}
				text {
					color: #999;
				}
			}
			.item_top_right {
				color: #999;
				white-space: nowrap;
				margin-top: 30rpx;
			}
		}
		.item_cont {
			line-height: 44rpx;
			font-size: 30rpx;
		}
		.item_but {
			margin-top: 20rpx;
			display: flex;
			justify-content: space-between;
			image {
				max-width: 220rpx;
				height: 160rpx;
				border-radius: 20rpx;
			}
			.item_but_right {
				display: flex;
				view {
					height: 60rpx;
					line-height: 58rpx;
					border-radius: 50rpx;
					color: #999999;
					margin-top: 100rpx;
					margin-left: 20rpx;
					padding: 0 20rpx;
					border: 2rpx solid #999999;
				}
			}
		}
	}
}
</style>
