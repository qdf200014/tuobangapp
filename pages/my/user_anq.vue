<template>
	<view>
		<view class="items" v-for="(item,index) in page_list" :key="index" @click="item_cli(index)">
			<view class="itemLeft">
				{{item.title}}
				<view> {{item.cont}}</view>
			</view>
			<view class="itemRig">
				<view v-if="index == 1" class="itemRigPhone">
					{{moblie}}
				</view>
				<u-icon name="arrow-right" color="#999" v-if="index != 4"></u-icon>
			</view>
		</view>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page_list:[
					{
						title:'修改密码',
						cont:'建议您定期修改密码以保护账户安全'
					},
					{
						title:'更换绑定手机号',
						cont:'若手机号更换请尽快修改'
					}
				],
				moblie:''
			}
		},
		onLoad() {
		},
		onShow() {
			this.moblie = uni.getStorageSync('userinfo_Data').moblie
		},
		methods: {
			item_cli(e){
				if(e == 0){
					this.com.navto('../login/forget?type='+ 2+'&mobile='+this.moblie) //个人信息设置
				}else if(e == 1){
					this.com.navto('./bangphone/bangphone')
				}
			},
			agreement(e){
				console.log(e)
			},
			
			
		}
	}
</script>

<style>
page{
	background-color: #F6F6F6;
}
</style>
<style scoped lang="scss">
.items{
	width: 100%;padding:  2%;
	background-color: #FFFFFF;margin-bottom: 2rpx;
	display: flex;justify-content: space-between;
	.itemLeft{
		line-height: 50rpx;font-size: 30rpx;
		view{
			font-size: 26rpx;color: #9a9a9a;
		}
	}
	.itemRig{
		line-height: 100rpx;
		display: flex;
		.itemRigPhone{
			color: red;font-size: 32rpx;
		}
	}
}

</style>
