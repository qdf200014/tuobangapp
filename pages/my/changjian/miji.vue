<template>
	<view style="padding: 0 3%;">
		<u-parse :html="content"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content:''
			}
		},
		onLoad(op) {
			if(op.type == 3){
				uni.setNavigationBarTitle({
				title: '快速得到帮助' //这是修改后的导航栏文字
				})
			}else if(op.type == 4){
				uni.setNavigationBarTitle({
				title: '帮主秘籍' //这是修改后的导航栏文字
				})
			}else if(op.type == 5){
				uni.setNavigationBarTitle({
				title: '发布规则' //这是修改后的导航栏文字
				})
			}
			// type 1秘籍
			this.api.get('protocol/getPersonProtocolById/'+op.type).then(res=>{
				console.log(res)
				if(res.flag){
					this.content = res.data.protocolContent
				}
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
