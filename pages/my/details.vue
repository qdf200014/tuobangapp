<template>
	<view>
		<view class="head">
			<image class="labimg" v-if="pagedata.bzState == 1" src="../../static/guoqi.png" mode=""></image>
			<image class="labimg" v-if="pagedata.bzState == 3" src="../../static/chengg.png" mode=""></image>
			<image class="labimg" v-if="pagedata.bzState == 4" src="../../static/xiajia.png" mode=""></image>
			<image class="labimg" v-if="pagedata.bzState == 2" src="../../static/beijie.png" mode=""></image>
			<view class="titles" v-if="pagedata.bzState == 4">帮客已将该{{type == 2 ? '帮助' : '求助'}}下架</view>
			<view class="titles" v-if="pagedata.bzState == 1">{{type == 2 ? '帮助' : '求助'}}已过最晚接单时间</view>
			<view class="titles" v-if="pagedata.bzState == 3">{{type == 2 ? '帮助' : '求助'}}已经完成</view>
			<view class="titles" v-if="pagedata.bzState == 2">{{type == 2 ? '帮助' : '求助'}}已被响应</view>
		</view>
		<view class="task_list" >
			<view class="task_list_left">
				<image class="task_list_left_img" :src="pagedata.photo" mode="aspectFill"></image>
				<!-- <view class="task_list_left_userinfo">
				<image class="left_userinfo_img" src="../../static/daibangliebiaotouxiang.png" mode="aspectFill"></image>
				<text class="left_userinfo_text">这是标题</text>
			</view> -->
			</view>
			<view class="task_list_right">
				<text class="task_list_right_tpagedata rowTwo">{{ pagedata.jianjie || pagedata.title}}</text>
				<view class="task_list_right_address">
					<!-- <text class="right_address_time">123</text> -->
				</view>
			</view>
			<!-- <view class="collect" v-if="pagedata.countStore != 0">{{ pagedata.countStore }}人收藏</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pagedata:'',
				type:0
			}
		},
		onLoad(e) {
			if(e.type){
				this.type = e.type
			}
			console.log(JSON.parse(e.data))
			this.pagedata = JSON.parse(e.data)
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.head{
	width: 94%;height: 300rpx;margin-left: 3%;
	text-align: center;padding-top: 80rpx;
	border-bottom: 1rpx solid #eee;
	image{
		width: 120rpx;height: 120rpx;
	}
	.titles{
		font-size: 32rpx;margin-top: 26rpx;
	}
}
.task_list {
	width: 100%;
	background-color: white;
	margin: 14rpx 0;
	border-radius: 20rpx;
	padding: 50rpx 25rpx 0 25rpx;
	display: flex;
	flex-direction: row;
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
		width: 150rpx;
		height: 150rpx;
		margin-bottom: 20rpx;
		border-radius: 20rpx;
		background-color: #F8F8F8;
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
