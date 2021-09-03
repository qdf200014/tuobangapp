<template>
	<view>
		<view class="content">
			<view class="items" v-for="(it,index) in list" :key="index" @click="go_tian(index,it.name)">	
					<view>{{it.name}}</view>
					<u-icon name="arrow-right" color="#999"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						name:'发布违规内容'
					},
					{
						name:'疑似欺诈' /////////
					},
					{
						name:'个人主页资料违规'
					}
				],
				userinfo:'',//个人信息接受
			}
		},
		onLoad(e) {
			console.log(e)
			this.userinfo = e.cont
		},
		methods: { 
			go_tian(e,text){
				if (e == 1){
					this.com.navto('./pricelose?type='+ 0 +'&cont='+this.userinfo+'&reasonText='+text)
				}else if(e == 2){
					this.com.navto('./master_data_weig?cont='+this.userinfo)
				}
			}
		}
	}
</script>

<style>
page{
	background-color: #F6F6F6;
}
</style>
<style scoped lang="scss">
.content{
	background-color: #FFFFFF;
	.items{
		
		padding:30rpx 3%;width: 100%;
		display: flex;justify-content: space-between;
		border-bottom: 1rpx solid #eee;
	}
	.items:last-child{
		border-bottom: none;
	}
}
	

</style>
