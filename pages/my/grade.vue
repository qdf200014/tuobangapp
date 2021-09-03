<template>
	<view>
		<view class="headBgcil">
			<view class="headBg">
				<view class="head">
					<view class="yue">
						等级
					</view>
					<view class="money">
						<view class="moneyL">
							{{cont.grade}}
						</view>
						
					</view>
					<view class="leiji">
						<view>
							累计积分：{{cont.integral}}
						</view>
						<view class="moneyR" @click="gotix">
							积分明细<u-icon name="arrow-right"></u-icon>
						</view>
					</view>
				</view>
			</view>
			<view class="tips">
				<text style="color: red;">注：</text>
				每获得500积分升一级，初级为初入江湖
				<text class="guize" @click="goguiz(6)">积分规则</text>
			</view>
		</view>
		<!-- 升级任务 -->
		<view class="mission">
			<view class="title">
				升级任务
			</view>
			<view class="missionTips">
				您的响应速度慢，找您帮忙的帮客少，您可以通过完成任务提升等级
			</view>
			<!-- 任务列表 -->
			<view class="taskList" v-for="(it,ind) in gradeList" :key="ind" >
				<view class="left">
					<view class="taskTit">
						{{it.title}} <text class="jifen">+{{it.bonusPoints}}积分</text>
					</view>
					<view class="detailText">
						{{it.describe}} 
					</view>
				</view>
				<view class="right" v-if="it.progress == 0" @click="go_page(it.title)">
					去完善
				</view>
				<view class="right bgcol" v-else>
					已完成
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cont:'',
				gradeList:[]
			};
		},
		onLoad() {
			this.api.get('integral/grade').then(res=>{
				console.log(res)
				if(res.flag){
					this.cont = res.data
					this.gradeList = res.data.task
				}
			})
		},
		methods:{
			gotix(){
				this.com.navto('./gradeMx')
			},
			// 积分规则
			goguiz(e){
				this.com.navto('../login/agreement_page?type='+e)
			},
			go_page(e){
				if(e != '实名认证'){
					this.com.navto('./user_set')
				}else{
					this.com.navto('./user_set_child/identity')
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.headBgcil{
	background-color: #b5a77b;border-radius: 0 0 20rpx 20rpx;padding-top: 3%;
	.headBg{
		width: 100%;
		.head{
			width: 94%;padding: 4%;height: 340rpx;margin: 0 3%;
			background-image: url(../../static/my/zhanghu.png);
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
			
			}
			.leiji{
				width: 94%;
				font-size: 30rpx;line-height: 48rpx;
				position: absolute;bottom: 22rpx;left: 20rpx;
				display: flex;justify-content: space-between;
				.moneyR{
					background-color: white;padding: 0 20rpx 0 25rpx;border-radius: 50rpx;height: 50rpx;
				}
			}
		}
	}
	.tips{
		line-height: 100rpx;margin-left: 4%;color: white;font-size: 26rpx;
		.guize{
			color: #f0c019;margin-left: 20rpx;text-decoration: underline;
		}
	}
}
.mission{
	padding: 3%;
	.title{
		font-size: 38rpx;margin: 20rpx 0 30rpx 0;
	}
	.missionTips{
		color: #d27911;font-size: 26rpx;
	}
	.taskList{
		border-radius: 20rpx;border: 1rpx solid #dad7d7;
		padding: 30rpx 20rpx;margin-top: 26rpx;
		display: flex;justify-content: space-between;
		.left{
			width: 500rpx;
			font-size: 32rpx;
			.taskTit{
				text{
					color: red;margin-left: 20rpx;
				}
			}
			.detailText{
				font-size: 26rpx;
			}
		}
		.right{
			background-color: red;height: 46rpx;line-height: 44rpx;color: #fff;border-radius: 50rpx;padding: 0 24rpx;
			margin-top: 20rpx;
		}
		.bgcol{
			background-color: #eee;color: #999;
		}
	}
}
</style>
