<template>
	<view>

		<u-checkbox-group>
			<u-checkbox size="45" shape="circle" v-model="radio_type"  active-color="#fd3b48"  @change="radios">
				阅读并同意<text style="line-height: 52rpx;">
				<text style="color: #fd3b48;" @click="agreement(2)">《用户使用协议》</text>
				及<text style="color: #fd3b48;" @click="agreement(1)">《隐私政策》</text>
			</text>
			</u-checkbox>
			
		</u-checkbox-group>
	</view>
</template>

<script>
	export default {
		name:"tb-xieyi",
		data() {
			return {
				radio_type:false
			};
		},
		methods:{
			radios(e){
				this.$emit('radioClick',e.value)
			},
			//协议
			agreement(e){
				//服务协议
				this.$emit("agreement",e)
			}
		}
	}
</script>

<style lang="scss">

</style>
