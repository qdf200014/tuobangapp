<template>
	<view style="padding: 2%;">
		<view class="items" v-for="(it,ind) in cont" :key="ind">
			<view class="top">
				<view class="title">
					{{it.title}}
				</view>
				<view class="texts">
					{{it.describe}}
				</view>
			</view>
			<view class="but">
				<view class="time">
					积分时间：{{it.time}}
				</view>
				<view class="jif" v-if="it.type == 0">
					+{{it.score}}积分
				</view>
				<view class="jif_two" v-else>
					{{it.score}}积分
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cont:[],
				page:1
			}
		},
		onLoad() {
			this.pageData(this.page)
		},
		onReachBottom() {
			this.page ++
			this.pageData(this.page)
		},
		methods: {
			pageData(e){
				this.api.get('integral/pointsDetails',{page:e}).then(res=>{
					console.log(res)
					if(res.flag){
						this.cont =this.cont.concat(res.data)
						if(this.page > 1 && res.data.length < 10){
							this.com.msg('到底了~')
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.items{
	border-top:1rpx solid #EEEEEE;padding: 30rpx 10rpx;
	.top{
		.title{
			font-weight: bold;line-height: 60rpx;
		}
		.texts{
			color: #999;
		}
	}
	.but{
		margin-top: 40rpx;
		display: flex;justify-content: space-between;
		.jif{
			color: #4CD964;
		}
		.jif_two{
			color: red;
		}
	}
}
.items:last-child{
	border-bottom:1rpx solid #EEEEEE;
}
</style>
