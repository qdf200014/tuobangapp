<template>
	<view>
		<view style="padding: 3%;">
			<u-parse :html="cont"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cont:''
			};
		},
		onLoad(op) {
			uni.setNavigationBarTitle({
				title: op.title //这是修改后的导航栏文字
			})
			this.api.get('hsCommonProblem/queryDetails/'+op.id).then(res=>{
				console.log(res)
				if(res.flag){
					this.cont = res.data.content
				}
			})
		}
	}
</script>

<style lang="scss" scoped>

</style>
