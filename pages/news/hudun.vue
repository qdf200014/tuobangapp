<template>
	<view>
		<view class="kun" v-if="lists == []">
			<tb-kunNews></tb-kunNews>
		</view>
		<view >
			<view class="item" v-for="(it,ind) in lists" :key="ind" @click="go_master(it.ryUuid)">
				<view style="display: flex;justify-content: space-between;">
					<view style="display: flex;">
						<image class="toux" :src="it.img" mode="aspectFill"></image>
						<view class="text norow">
							{{it.name}} <text>{{it.content}}</text>
							<view class="time">
								{{it.time}}
							</view>
						</view>
					</view>
					<view style="margin-right: 20rpx;" >查看</view>
				</view>
				<image  class="tiaozi" src="../../static/index/xiantiao.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lists:[]
			};
		},
		onLoad() {
			this.api.get('systemMessage/interaction',{token:uni.getStorageSync('token')}).then(res=>{
				console.log(res)
				if(res.flag){
					this.lists = res.data
				}
			})
		},
		methods:{
			go_master(e){
				this.com.navto('../my/master_page?id='+ e)
			}
		}
	}
</script>

<style lang="scss" scoped>
.item{
	width: 100%;padding: 3%;margin: 10rpx 0;
	position: relative;
	.toux{
		width: 90rpx;height: 90rpx;background-color: #f8f8f8;border-radius: 50%;
		margin-right: 20rpx;
	}
	.text{
		width: 420rpx;
		padding-top: 10rpx;font-size: 30rpx;
		text{
			margin-left: 20rpx;
		}
		.time{
			font-size: 26rpx;color: #999;margin-top: 30rpx;
		}
	}
	.tiaozi{
		width: 94%;height: 10rpx;position: absolute;left: 3%;bottom: 0;
	}
}

</style>
