<template>
	<view>
		<view class="fuwu" v-for="(its,index) in 6" :key="index">
			<view class="items">
				<view class="task_detail_top" @click="go_detail()">
					<image class="top_img" src="../../../static/shouy_36.png" mode="aspectFill"></image>
					<text class="top_text">简介</text>
				</view>
			</view>
			<image class="xiantiao" src="../../../static/index/xiantiao.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
</style>
<style lang="scss" scoped>
.fuwu{
	width: 100%;padding: 0 3%;
	.items{
		background-color: #fff;padding: 10rpx;	border-radius: 20rpx;
		.task_detail_top{
			display: flex;justify-content: space-between;flex-direction: row;
			.top_img{
				width: 210rpx;height: 170rpx;border-radius: 20rpx;
				background-color: #F8F8F8;
			}
			.top_text{
				width: 420rpx;lines: 3;text-overflow: ellipsis;
				font-size: 32rpx;
			}
		}
	}
	.xiantiao{
		margin: 15rpx 0 8rpx 0;
		width: 100%;height: 10rpx;
	}
	
}
</style>
