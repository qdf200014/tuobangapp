<template>
	<view>
		<view class="head_tishi">
			发布风险内容
		</view>
		<view class="cont">
			<view class="title">
				违规详情
			</view>
			<view class="weiguidetail">
				<view class="detailItem">
					<view class="itemL">
						违规名称
					</view>
					<view class="itemR">
						{{cont.name}}
					</view>
				</view>
				<view class="detailItem">
					<view class="itemL">
						处置开始
					</view>
					<view class="itemR">
						{{cont.time}}
					</view>
				</view>
				<view class="detailItem">
					<view class="itemL">
						处置结束
					</view>
					<view class="itemR">
						{{cont.time}}
					</view>
				</view>
				<!-- <view class="detailItem">
					<view class="itemL">
						违规编号
					</view>
					<view class="itemR">
						放大数据开放基金
					</view>
				</view> -->
				<view class="detailItem" v-if="cont.type == 3">
					<view class="itemLs">
						违规信息场景
						<view class="shop">
							留言
						</view>
					</view>
				</view>
				<view class="detailItem" v-if="cont.type == 3">
					<view class="itemLs">
						相关文本
						<view class="shop">
							{{cont.content}}
						</view>
					</view>
				</view>
				<view class="detailItem">
					<view class="itemLs">
						违规内容
						<view class="shop">
							<image :src="cont.photo" mode="aspectFill"></image>
							<text class="rowTwo">{{cont.title}}</text>
						</view>
					</view>
					
				</view>
			</view>
			
			<view class="title">
				处置原因
			</view>
			<view class="weiguidetail">
				{{cont.reason}}
			</view>
			
			<!-- <view class="title">
				处置影响
			</view>
			<view class="weiguidetail">
				dasgfadsafdsa的撒噶发达的是
			</view> -->
			
			<view class="title">
				操作建议
			</view>
			<view class="weiguidetail">
				{{cont.result}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cont:''
			};
		},
		onLoad(op) {
			this.api.get('hsViolation/details/'+op.id).then(res=>{
				console.log(res)
				if(res.flag){
					this.cont = res.data
				}
			})
		}
	}
</script>

<style>
	page{
		background-color: #faf9fe;
	}
</style>
<style lang="scss" scoped>
.head_tishi{
	line-height: 100rpx;background-color: white;text-align: center;	font-size: 40rpx;color: #f76140;
}
.title{
	padding: 3% ;color: #969696;
}

.cont{
	
	.weiguidetail{
		background-color: #fff;padding: 10rpx 3%;
		.detailItem{
			display: flex;margin: 10rpx 0;
			.itemL{
				width: 160rpx;color: #969696;
				image{
					background-color: #F8F8F8;
					width: 160rpx;height: 160rpx;margin-top: 20rpx;
				}
			}
			.itemLs{
				color: #969696;
				
				.shop{
					margin-top: 20rpx;
					width: 100%;
					display: flex;color: #333;
					image{
						background-color: #F8F8F8;
						width: 160rpx;height: 160rpx;margin-right: 20rpx;
					}
					text{
						width: 480rpx;line-height: 40rpx;height: 80rpx;
						
					}
				}
			}
		}
	}
}

</style>
