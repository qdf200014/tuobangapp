<template>
	<view class="page">
		<input type="text" v-model="name" placeholder="设置昵称" maxlength="8"/>
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
				label:''
			}
		},
		onLoad(e) {
			this.name = e.name
			this.label = e.label
			this.id = uni.getStorageSync("userinfo_Data")
		},
		methods: {
			but_cli(){
				this.api.post('person/comInfo',{
					ryPetName:this.name,
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
	
	input{
		font-size: 28rpx;margin: 5% ;
	}
	.button{
		margin-top: 100rpx;
	}
}
</style>
