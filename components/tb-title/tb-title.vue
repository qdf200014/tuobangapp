<template>
	<view>
		<view class="title active">
			{{title}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			title:{}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.title{
	font-size: 36rpx;padding: 20rpx 0;font-family: 'PingFangSC-Medium';margin-left: 20rpx;font-weight: 400;
	position: relative;
	&.active{
			color: #000;
		// background: #f8f8f8;
		&:before{
			content: '';
			position: absolute;
			left: 20%; 
			bottom: 10rpx;
			transform: translateY(-50%);
			height: 10rpx;
			width: 30%;
			border-radius: 8rpx;
			background-color: #eb3745;
			opacity: .8;
		}
	}
}
</style>
