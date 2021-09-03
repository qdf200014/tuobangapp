<template>
	<view style="padding: 3%;">
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
			this.content = op.data
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
