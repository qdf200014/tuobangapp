<template>
	<view style="padding: 3%;">
		<view class="tips">请绑定持卡本人的银行卡</view>
		<view class="cont">
			<view class="userItem">
				<view class="itemL">
					持卡人
				</view>
				<view class="itemR">
					<input type="text" v-model="name" />
				</view>
			</view>
			<view class="userItem">
				<view class="itemL">
					银行卡号
				</view>
				<view class="itemR">
					<input type="text" v-model="cardNo" />
				</view>
			</view>
			<view class="userItem">
				<view class="itemL">
					银行名称
				</view>
				<view class="itemR">
					{{cardname + ' '+ cardType}}
				</view>
			</view>
		</view>
		
		<view class="but">
			<tb-button buttitle="添加" @but_cli="dianji"></tb-button>
		</view>
		
	</view>
</template>

<script>
	import BIN from "bankcardinfo"
	export default {
		data() {
			return {
				name:'',
				cardNo:'',
				cardname:'',
				cardType:''
			}
		},
		watch:{
			cardNo(a){
				let that = this
				if(a.length >=15){
					// '6217994910139984282'
					BIN.getBankBin(a).then(res=>{
						console.log(res)
						if(res.bankName){
							that.cardname = res.bankName
							that.cardType = res.cardTypeName
						}
					}).catch(err=> {
						console.log(err)
					})
				}
			}
		},
		methods: {
			dianji(){
				
			}
		}
	}
</script>

<style scoped lang="scss">
.tips{
	color: #565656;
}
.cont{
	width: 100%;
	margin-bottom: 100rpx;
	.userItem{
		padding: 23rpx 3%;
		display: flex;font-size: 30rpx;
		border-bottom: 2rpx solid #eee;
		.itemL{
			width: 160rpx;color: #565656;
		}
		input{
			width: 500rpx;
		}
	}
}
</style>
