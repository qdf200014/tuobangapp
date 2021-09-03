<template>
	<view>
		<view class="headBg">
			<view class="head">
				<view class="yue">
					账号余额（元）
				</view>
				<view class="money">
					<view class="moneyL">
						{{zhanghbalance}}
					</view>
					<view class="moneyR" @click="gotix">
						提现<u-icon name="arrow-right"></u-icon>
					</view>
				</view>
				<view class="leiji">
					累计收入（元）：{{leiji}}
				</view>
			</view>
		</view>
		<view class="items marTop" @click="gopage('./zhangd')">
			<view class="itemL">
				<image src="../../../static/my/zhangdan.png" mode=""></image>
				账单
			</view>
			<view class="itemR">
				<u-icon name="arrow-right" ></u-icon>
			</view>
		</view>
		<!-- <view class="items marTop" @click="gopage('./greenCard')">
			<view class="itemL">
				<image src="../../../static/my/bangka.png" mode=""></image>
				绑定银行卡
			</view>
			<view class="itemR">
				未绑定<u-icon name="arrow-right" ></u-icon>
			</view>
		</view> -->
		<view class="items marTop" @click="gopage('./addCard')">
			<view class="itemL">
				<image src="../../../static/my/bangka.png" mode=""></image>
				银行卡
			</view>
			<view class="itemR">
				<u-icon name="arrow-right" ></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				zhanghbalance:0,
				leiji:0
			}
		},
		onShow() {
			//账户余额
			this.api.get('hsTransaction/checkUserBalance').then(res=>{
				console.log(res)
				if(res.flag){
					this.zhanghbalance = res.data
				}
			})
			// 累计收入
			this.api.get('hsTransaction/queryUserCumulativeIncome').then(res=>{
				console.log(res)
				if(res.flag){
					this.leiji = res.data
				}
			})
		},
		methods: {
			gotix(){
				this.com.navto('./tixian')
			},
			gopage(e){
				this.com.navto(e)
			}
		}
	}
</script>

<style>
	page{
		background-color: #f8f8f8;
	}
</style>
<style lang="scss" scoped>
.headBg{
	width: 100%;height: 400rpx;background-color: #fff;
	.head{
		width: 94%;padding: 4%;height: 340rpx;margin: 0 3%;
		background-image: url(../../../static/my/zhanghu.png);
		background-size: 100% 100%;
		color: #da8c2f;
		position: relative;
		.yue{
			color: #da8c2f;font-size: 30rpx;
		}
		.money{
			display: flex;justify-content: space-between;margin: 50rpx 0;
			.moneyL{
				font-size: 46rpx;font-weight: bold;
			}
			.moneyR{
				background-color: white;padding: 0 20rpx 0 25rpx;border-radius: 50rpx;line-height: 48rpx;height: 50rpx;
				margin-top: 10rpx;
			}
		}
		.leiji{
			font-size: 30rpx;
			position: absolute;bottom: 28rpx;left: 20rpx;
		}
	}
}
.items{
	width: 100%;padding: 3%;background-color: white;
	display: flex;justify-content: space-between;font-size: 30rpx;
	.itemL{
		display: flex;
		image{
			width: 45rpx;height: 38rpx;margin-right: 20rpx;
		}
	}
	.itemR{
		color: #666;
	}
}

</style>
