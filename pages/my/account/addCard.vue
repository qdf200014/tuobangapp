<template>
	<view>
		<view class="headBg">
			<view class="head">
				<view class="yue">
					中国农业银行 储蓄卡
				</view>
				<view class="money">
					<view class="moneyL">
						<!-- 0.00 -->
					</view>
					<view class="moneyR" @click="gotix">
						使用中
					</view>
				</view>
				<view class="leiji">
					6217232903000900315
				</view>
			</view>
		</view>
		<view class="addcard" @click="gotopage('./greenCard')">
			<u-icon name="plus" size="44" color="#999"></u-icon>
			<text class="tianj">
				添加银行卡
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			gotopage(e){
				this.com.navto(e)
			},
			gotix(){
				
			}
		}
	}
</script>

<style scoped lang="scss">
.headBg{
	width: 100%;height: 400rpx;background-color: #fff;
	.head{
		width: 94%;padding: 4%;height: 340rpx;margin: 0 3%;
		background-image: url(../../../static/my/zhanghu.png);
		background-size: 100% 100%;
		color: #da8c2f;
		position: relative;
		.yue{
			color: #da8c2f;font-size: 30rpx;margin: 10rpx;
		}
		.money{
			display: flex;justify-content: space-between;margin: 50rpx 0;
			.moneyL{
				font-size: 46rpx;font-weight: bold;
			}
			.moneyR{
				line-height: 48rpx;height: 50rpx;
				margin-top: 10rpx;
			}
		}
		.leiji{
			font-size: 30rpx;
			position: absolute;bottom: 28rpx;left: 20rpx;
		}
	}
}
.addcard{
	width: 94%;margin-left: 3%;
	display: flex;line-height: 42rpx;
	border: 0.5rpx solid #eee;padding: 18rpx 30rpx;border-radius: 10rpx;
	.tianj{
		margin-left: 3%;font-size: 32rpx;color: #565656;
	}
}
</style>
