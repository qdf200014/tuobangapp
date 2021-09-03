<template>
	<view>
		<uni-nav-bar  :title="page_title" left-icon="back" @clickLeft="gotop" />
		 <view style="padding: 3%;">
			<u-parse :html="cont"></u-parse>
		 </view>
	</view>
</template>

<script>
	import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue'
	export default {
		data() {
			return {
				page_title:'用户使用协议',
				cont:''
			}
		},
		components:{
			uniNavBar
		},
		onLoad(e) {
			//e= 2服务协议 1隐私政策 
			if(e.type == 1){
				this.page_title = '隐私政策'
			}else if(e.type == 6){
				this.page_title = '积分规则'
			}else if(e.type == 7){
				this.page_title = '取消规则'
			}else{	
				this.page_title = '用户使用协议'
			}
			console.log(e)
			this.api.get('protocol/getPersonProtocolById/'+e.type).then(res=>{
				console.log(res)
				if(res.flag){
					this.cont = res.data.protocolContent
				}
			})
		},
		methods: {
			gotop(){
				uni.navigateBack()
			}
		}
	}
</script>

<style>

</style>
