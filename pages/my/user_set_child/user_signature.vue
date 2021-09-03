<template>
	<view class="page">
		<textarea v-model="name" placeholder="请输入您的个性签名~"  maxlength="150"/>
		<view class="lengths">{{name.length}}/150</view>
		<view class="button">
			<tb-button @but_cli="but_cli"></tb-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name:"",
				id:'',
				text_length:0,
				label:''
			}
		},
		onLoad(e) {
			this.name = e.name
			this.id = uni.getStorageSync("userinfo_Data")
			console.log(this.id)
			this.label = e.label
		},
		// watch:{
		// 	name(e){
		// 		console.log(e)
		// 		this.text_length = e.length
		// 	}
		// },
		methods: {
			but_cli(){
				this.api.post('person/comInfo',{
					ryIntro:this.name,
					ryUuid:this.id.id,
					ryLabel:this.label}).then(res=>{
					console.log(res)
					if(res.flag){
						uni.navigateBack()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.page{
	width: 100%;
	textarea{
		width: 90%;height: 250rpx;margin: auto;border-radius: 20rpx;
		font-size: 28rpx;padding: 1%;background-color: #f5f5f5;
	}
	.lengths{
		margin: 10rpx  5%;color: #999;
		float: right;
	}
	.button{
		margin-top: 80rpx;
	}
}
</style>
