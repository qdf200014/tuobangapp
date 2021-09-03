<template>
	<view>
		<view class="items" :class="{ 'active': index == listInd  }" v-for="(it,index) in list" :key="index" @click="itemCli(it.jobId,index)">
			{{it.jobName}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				listInd:0,
				zhiy:'',
				id:''
			}
		},
		onLoad() {
			this.pages()
			this.id = uni.getStorageSync("userinfo_Data")
		},
		onNavigationBarButtonTap(e) {
			this.api.post('person/comInfo',{
				ryProfession:this.zhiy,
				ryUuid:this.id.id}).then(res=>{
				if(res.flag){
					uni.navigateBack()
				}
			})
		},
		methods: {
			pages(){
				this.api.get('job/getJobNames').then(res=>{
					console.log(res)
					if(res.flag){
						this.list = res.data.jobNames
					}
				})
			},
			itemCli(e,ind){
				// console.log(e)
				this.zhiy = e
				this.listInd = ind
			}
		}
	}
</script>

<style scoped>
.items{
	padding:30rpx 3%;border: 1rpx solid #F5F5F5;
	font-size: 32rpx;
}
.active{
	color: red;
}
</style>
