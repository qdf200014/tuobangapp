<template>
	<view>
		<view class="items" v-for="(it,index) in lists" :key="index" @click="goDetail(it.id,it.title)" v-if="it.id != 7">
			<view class="itemsLeft">
				{{it.title}}
			</view>
			<view class="itemsRig">
				<u-icon name="arrow-right"></u-icon>
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
			this.api.get('hsCommonProblem/query').then(res=>{
				console.log(res)
				if(res.flag){
					this.lists = res.data
				}
			})
		},
		methods:{
			goDetail(e,tit){
				this.com.navto('./changjianDetail?id='+e+'&title='+tit)
			}
		}
	}
</script>

<style>
	page{
		background-color: #f9f8fd;
	}
</style>
<style lang="scss" scoped>
.items{
	background-color: #FFFFFF;color: #52555c;
	margin-bottom: 4rpx;padding: 26rpx 3%;font-size: 30rpx;
	display: flex;justify-content: space-between;
}
</style>
