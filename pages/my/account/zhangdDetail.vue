<template>
	<view style="padding: 3%;">
		<view class="head">
			<image src="../../../static/daibangliebiaotouxiang.png" mode=""></image>
			<view class="name">{{cont.jdTitle}}</view>
			<view class="price">{{cont.price}}</view>
			<view class="type">交易成功</view>
		</view>
		<view class="items">
			<view class="left">交易方式</view>
			<view class="right" v-if="cont.type == 0">银联</view>
			<view class="right" v-if="cont.type == 1">微信</view>
			<view class="right" v-if="cont.type == 2">支付宝</view>
			<view class="right" v-if="cont.type == 3">余额</view>
		</view>
		<view class="items">
			<view class="left">交易时间</view>
			<view class="right">{{cont.time}}</view>
		</view>
		<view class="items">
			<view class="left">交易单号</view>
			<view class="right">{{cont.transactionId}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cont:''
			}
		},
		onLoad(op) {
			console.log(op)
			this.api.post('hsTransaction/transactionDetail?id='+op.id).then(res=>{
				console.log(res)
				if(res.flag){
					this.cont = res.data
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.head{
	width: 100%;padding: 80rpx 0;text-align: center;
	border-bottom: 0.5px solid #eee;
	image{
		width: 100rpx;height: 100rpx;
	}
	.name{
		margin-top: 30rpx;
	}
	.price{
		font-size: 56rpx;
		line-height: 100rpx;
	}
	.type{
		color: #999;
	}
}
.items{
	width: 100%;
	line-height: 80rpx;display: flex;justify-content: space-between;
	.left{color: #999;}
}
</style>
