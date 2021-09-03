<template>
	<view>
		<view class="comment" >
			<!-- 用户 -->
			<view class="commentuser">
				<view class="userimgs" @click="go_master(bkInfo.ryUuid)">
					<view style="display: flex;">
						<image :src="bkInfo.img" mode="aspectFill"></image>
						<view style="color: #999;">
							{{bkInfo.petName}}
						</view>
					</view>
					<view >
						<u-rate :current="detail.score" :disabled="true" gutter="0"></u-rate>
					</view>
				</view>
				
			</view>
			<view class="textcontent paddleft">
				{{detail.proposal}}
			</view>
			<view class="imgswiper paddleft">
				<image v-for="(it,ind) in detail.photo" :key="ind" :src="it" mode="aspectFill"></image>
			</view>
			<view class="userTime paddleft">
				{{detail.time}}
			</view>
			<!-- 订单 -->
			<view class="order" @click="go_order(helpResponse.bzUuid)">
				<view class="order_img">
					<image :src="helpResponse.photo" mode=""></image>
				</view>
				<view class="order_right">
					<view class="rigTop">{{helpResponse.jdTitle}}我电话答复或健身房哈经典款交换机我电话答复或健身房哈经典款交换机</view>
					<view class="rigTime">{{helpResponse.time}}</view>
				</view>
			</view>
		</view>
		<view class="huif">回复</view>
		<view class="huifu_item">
			<view class="userimg" @click="go_master(bzInfo.ryUuid)">
				<image :src="bzInfo.img" mode="aspectFill"></image>
				<view class="item_tig" >
					<view style="color: #999;">{{bzInfo.petName}}</view>
					<view class="pl_text">我电话答复或健身房哈经典款交换机我电话答复或健身房哈经典款交换机</view>
					<view class="userTime">
						2021-7-9
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
				serveId:0,
				detail:'',//评价
				bkInfo:'',//帮客
				bzInfo:'',//帮主
				helpResponse:''
			}
		},
		onLoad(op) {
			this.serveId = op.id
			this.pageData()
		},
		methods: {
			pageData(){
				this.api.get('appraise/queryAppraiseDetails/'+this.serveId).then(res=>{
					console.log(res)
					if(res.flag){
						this.detail = res.data.appraise//内容
						this.bkInfo = res.data.bkInfo
						this.bzInfo = res.data.bzInfo
						this.helpResponse = res.data.helpResponse
					}
				})	
			},
			go_master(e){
				this.com.navto('../../my/master_page?id='+e)
			},
			go_order(e){
				if(this.detail.type == 1){
					this.com.navto('../serve_detail?id=' + e);
				}else{
					
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.order{
	
	padding: 10rpx 4rpx;margin:15rpx 0 0 14%;border-radius: 10rpx;
	background-color: #f7f7f7;
	display: flex;
	.order_img{
		width: 20%;margin-right: 2%;
		image{
			width: 100rpx;height: 100rpx;border-radius: 8rpx;
		}
	}
	.rigTop{
		width: 40%;
		line-height: 60rpx;
		white-space: nowrap;overflow: hidden;text-overflow: ellipsis;
	}
	.rigTime{
		font-size: 26rpx;color: #999;
	}
}
.huif{
	margin: 40rpx 0 30rpx 3%;font-size: 34rpx;font-weight: bold;
}
.huifu_item{
	margin: 3%;
	.userimg{
		display: flex;
		image{
			width: 80rpx;height: 80rpx;border-radius: 50%;margin-right: 14rpx;
		}
		.item_tig{
			width: 80%;
			.pl_text{
				line-height: 50rpx;font-size: 30rpx;line-height: 40rpx;margin: 10rpx 0;
			}
			.userTime{
				color: #999;font-size: 26rpx;
			}
		}
	}
	
}
.comment{
	padding: 3%;border-bottom: 18rpx solid #F5F5F5;
	.commentuser{
		.userimgs{
			display: flex;justify-content: space-between;
			image{
				width: 80rpx;height: 80rpx;border-radius: 50%;margin-right: 14rpx;
			}
		}
	}
	.textcontent{
		font-size: 30rpx;line-height: 40rpx;margin: 10rpx 0;
	}
	.paddleft{
		padding-left: 14%;
	}
	.imgswiper{
		display: flex;flex-wrap: wrap;
		image{
			width: 210rpx;height: 210rpx;border-radius: 10rpx;
			margin: 10rpx;
		}
	}
	.userTime{
		color: #999;
	}
	.thumbs{
		padding: 3%;border-bottom: 1rpx solid #eee;text-align: right;margin-bottom: 20rpx;
	}
	
}
</style>
