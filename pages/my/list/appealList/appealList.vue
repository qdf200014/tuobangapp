<template>
	<view style="padding: 3%;">
		<view class="kun" v-if="cont == ''">
			<tb-kunNews></tb-kunNews>
		</view>
		<view class="items" v-for="(it,index) in cont" :key="index">
			<view class="itemTop" @click="go_Detail(it.id)">
				{{it.reason}}
			</view>
			<view class="button">
				<view></view>
				<view class="but_r">
					<view class="butSty" @click="go_Detail(it.id)">
						申诉详情
					</view>
					<view class="butSty" @click="no_shens(it.id)" v-if="it.state != 2">
						取消申诉
					</view>
					<view class="butSty" @click="del_shens(it.id)" v-else>
						删除
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
				cont:[]
			};
		},
		onLoad() {
			this.pagedata()
		},
		methods:{
			pagedata(){
				this.api.get('hsAppeal/viewUserAppeal').then(res=>{
					console.log(res)
					if(res.flag){
						this.cont = res.data
					}
				})
			},
			go_Detail(e){
				this.com.navto('../appeal_liuc?id='+e)
			},
			// 取消申诉
			no_shens(e){
				this.api.get('hsAppeal/cancelAppeal/'+e).then(res=>{
					console.log(res)
					this.com.msg(res.message)
				})
			},
			// 删除申诉
			del_shens(e){
				
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
.items{
	width: 100%;background-color: white;padding: 2%;border-radius: 18rpx;
	margin-bottom: 26rpx;
	.itemTop{
		line-height: 44rpx;font-size: 30rpx;
		border-bottom: 0.5px solid #eee;padding-bottom: 2%;
	}
	.button{
		display: flex;justify-content: space-between;
		.but_r{
			display: flex;
			.butSty{
				color: #999;border: 1rpx solid #999;padding: 4rpx 20rpx;margin-top: 2%;margin-left: 26rpx;
				border-radius: 50rpx;
			}
		}
	}
}
</style>
