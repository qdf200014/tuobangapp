<template>
	<view>
		<view class="content">
			<view class="items" v-for="(it,index) in list" :key="index" @click="go_tian(it.name)">	
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
						name:'有资金损失'
					},
					{
						name:'无资金损失' /////////
					}
				],
				types:0, //举报类型
				userid:'',//被举报人id
				reasonText:'',
				bzuuid:''
			}
		},
		onLoad(e) {
			// type 1是个人主页举报
			this.types = e.type
			this.userid = e.cont
			this.reasonText = e.reasonText
			if(e.id !== undefined){
				this.bzuuid = e.id 
			}
		},
		methods: {
			go_tian(e){
				this.com.navto('./reportLoad?yy='+e+'&type='+this.types+'&userid='+this.userid+'&reasonText='+this.reasonText+'&id='+this.bzuuid)
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
