<template>
	<view>
		<view >
			<view class="items" v-for="(it,index) in datas" :key="index" @click="go_master(it.ryUuid)">
				<view class="items_top">
					<image :src="it.ryHeadImg" mode="aspectFill"></image>
					<view class="items_top_cont">
						<view class="cont_name">{{it.ryPetName}}</view>
						<view class="rowTwo">{{it.ryIntro}}</view>
					</view>
					<!-- <view v-if="type == 1">
						<view class="items_top_right" v-if="it.isHuGuan" @click.stop="quguan(it.ryUuid,index)">已关注</view>
						<view class="items_top_right_active" v-else @click.stop="guanz(it.ryUuid,index)">+ 关注</view>
					</view> -->
					<view>
						<view @click.stop="quguan(it.ryUuid,index)">
							<view class="items_top_right" v-if="it.state == 3">互相关注</view>
							<view class="items_top_right" v-else-if="it.state == 2">已关注</view>
						</view>
						<view v-if="it.state == 1" >
							<view class="items_top_right_active"  @click.stop="quguan(it.ryUuid,index)">+ 关注</view>
						</view>
					</view>
				</view>
				<view class="items_bottom">
					<view class="items_bottom_l">
						初入江湖
					</view>
					<view class="items_bottom_r">
						{{it.fans}}位粉丝
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				my_attention:false,
				guanzhuType:true
			}
		},
		props:{
			datas:{},
			type:{
				default:1,//1粉丝 2关注
			}
		},
		methods: {
			//取关
			quguan(e,ind){
				// console.log(e)
				this.$emit("quguan",e,ind)
				
			},
			
			//查看主页
			go_master(e){
				this.$emit("go_master",e)
				
			}
			
		}
	}
</script>

<style scoped lang="scss">
.items{
	width: 100%;padding: 3%;margin: 15rpx 0;border-radius: 20rpx;
	background-color: #fff;
	.items_top{
		display: flex;
		image{
			width: 140rpx;height: 140rpx;border-radius: 50%;
			margin-right: 15rpx;
		}
		.items_top_cont{
			width: 46%;
			.cont_name{
				margin-top: 10rpx;
				font-size: 34rpx;
			}
		}
		.items_top_right{
			text-align: center;margin: 20rpx ;
			padding: 10rpx 20rpx;border-radius: 50rpx;
			color: white;border: 2rpx solid #999999;color: #999999;
		}
		.items_top_right_active{
			text-align: center;
			padding: 10rpx 20rpx;background-color: #f30a06;border-radius: 50rpx;
			color: white;
			margin: 20rpx ;
		}
	}
	.items_bottom{
		display: flex;
		margin-left: 23%;color: #999999;line-height: 66rpx;
		.items_bottom_l{
			width: 170rpx;
		}
	}
}
</style>
