<template>
	<view>
		<view class="head">
			<view class="tab">
				<view class="gotop" @click="gotopage">
					<u-icon name="arrow-left" size="40"></u-icon>
				</view>
				<view class="title" >提现</view>
			</view>
			<!-- 总余额 -->
			<view class="overall_balance">
				<view class="money">总余额（元）</view>
				<view class="moneyNum">
					{{zhanghbalance}}
				</view>
			</view>
			
			<view class="bgcol">
				<view class="payType" >
					<view class="typeL">
						<u-icon name="weixin-circle-fill" color="#44b83b" size="46"></u-icon>
						<text>微信</text>
					</view>
					<view class="typeR">
						
						<view class="typeRtix" @click="tix(1)">
							提现
						</view>
					</view>
				</view>
				<view class="payType" >
					<view class="typeL">
						<u-icon name="zhifubao-circle-fill" color="#32afff" size="46"></u-icon>
						<text>支付宝</text>
					</view>
					<view class="typeR">
						
						<view class="typeRtix"  @click="tix(2)">
							提现
						</view>
					</view>
				</view>
			</view>
			
		</view>
		<!-- //记录 -->
		<view class="jilu">
			<view class="jiluTitle">
				全部记录<u-icon name="arrow-down"></u-icon>
			</view>
			<view class="timeXZ">
				<view class="timeLeft">
					<view class="riqi" @click="timeShow(1)">
						<text class="timeText">{{creatTime}}</text>
						 <u-icon name="calendar" size="36" ></u-icon>
					</view>
				</view>
				<view class="timeRight">
					<view class="riqi" @click="timeShow(2)">
						<text class="timeText">{{endTime}}</text>
						 <u-icon name="calendar" size="36"></u-icon>
					</view>
				</view>
			</view>
			<!-- 记录内容 -->
			<view class="recordCent" v-if="list == ''">
				<view class="noCenter">
					当前暂无提现记录！
				</view>
			</view>
		</view>
		<view style="background-color: #fff;">
			<view class="jyItem" v-for="(it,ind) in list" :key="ind" @click="go_it(it.id)">
				<view class="jytop">
					<view class="tops">
						提现到{{it.payType == 1 ? '微信' : '支付宝'}}
					</view>
					<view class="tops" style="color: #4CD964;">
						{{it.price}}
					</view>
				</view>
				<view class="jytop">
					<view class="but">
						{{it.time}}
					</view>
				</view>
			</view>
		</view>
		
		<u-picker mode="time" v-model="show" @confirm="confirm"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show:false,
				type:0,
				creatTime:'',
				endTime:new Date().toISOString().slice(0, 10),
				afterTradingHours:'',//开始
				beforeTradingHours:'',
				page:1,
				list:[],
				zhanghbalance:0
			}
		},
		onLoad() {
			let arr
			arr = new Date().toISOString().slice(0, 8);
			this.creatTime = arr + '0'+1
			if(this.creatTime){
				this.pagedata(this.page) 
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
		},
		methods: {
			gotopage(){
				uni.navigateBack()
			},
			pagedata(e){
				this.api.get('hsTransaction/withdrawalRecordsBetweenTwoDates',{
					afterTradingHours:this.creatTime,
					beforeTradingHours:this.endTime,
					page:e,
					size:20
				}).then(res=>{
					console.log(res)
					this.list = this.list.concat(res.data)
				})
			},
			//选择时间
			timeShow(e){
				this.show = true
				this.type = e
			},
			confirm(e){
				// console.log(e)
				if(this.type == 1){ //开始时间
					this.creatTime = e.year +'-'+ e.month +'-'+ e.day
				}else{//结束时间
					this.endTime = e.year +'-'+ e.month +'-'+ e.day
				}
				this.page = 1
				this.pagedata(this.page)
			},
			tix(e){
				this.com.msg('测试阶段暂不支持提现，10月20日开放')
				if(e == 1){
					// this.com.msg('测试阶段暂不支持提现')
				}else if (e == 2){
					
				}else{
					
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #F8F8F8;
	}
</style>
<style lang="scss" scoped>
.jyItem{
	width: 100%;padding: 2% 4%;
	.jytop{
		display: flex;justify-content: space-between;margin: 10rpx 0;
		.tops{
			font-size: 34rpx;
		}
		.but{
			color: #C8C7CC;
		}
	}
}
.head{
	width: 100%;height: 500rpx;
	background:url(../../../static/my/tixianbg.png) no-repeat;
	background-size: 100% 100%;
	.tab{
		display: flex;padding-top: 100rpx;
		.gotop{
			width: 44%;padding-left: 4%;
		}
		.title{
			font-size: 36rpx;line-height: 40rpx;
		}
	}
	.overall_balance{
		width: 100%;text-align: center;margin-top: 30rpx;color: #d1770f;
		.money{
			line-height: 60rpx;
		}
		.moneyNum{
			font-size: 50rpx;font-weight: bold;
		}
	}
	.bgcol{
		width: 96%;padding: 3%;
		background-color: #fff;border-radius: 20rpx;
		margin-left: 2%;margin-top: 50rpx;
		.payType{
			margin: 30rpx 0;
			display: flex;justify-content: space-between;
			line-height: 66rpx;
			.typeL{
				display: flex;
				text{
					margin-left: 20rpx;
				}
			}
			.typeR{
				display: flex;padding-right: 20rpx;
				.typeRtix{
					width: 120rpx;text-align: center;color: #ff6634;
					background-color: #f5f5f5;border-radius: 50rpx;
					margin-left: 50rpx;
				}
			}
		}
	}
}
.jilu{
	width: 100%;
	background-color: #fff;
	margin-top: 140rpx;
	.jiluTitle{
		padding: 3%;font-size: 32rpx;
		border-bottom: 0.5px solid #e1d8ce;
	}
	.timeXZ{
		width: 100%;
		display: flex;justify-content: space-evenly;
		padding: 20rpx 14%;
		.timeLeft{
			padding-right: 10rpx;
		}
		.timeRight{
			padding-left: 10rpx;
		}
		.riqi{
			color: #757575;
			border: 1rpx solid #999;
			padding: 6rpx 16rpx;border-radius: 10rpx;
			.timeText{
				margin-right: 20rpx;
			}
		}
	}
}
.recordCent{
	width: 100%;
	.noCenter{
		width: 100%;text-align: center;padding: 50rpx 0;color: #999;
	}
}
</style>
