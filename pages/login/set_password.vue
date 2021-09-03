<template>
	<view class="register">
		
		<u-form :model="form" ref="form">
			
			<u-form-item>
				<u-input type="password" v-model="form.password" :clearable="false" placeholder="请设置6~18位密码" maxlength="18"/>
			</u-form-item>
			<u-form-item>
				<u-input type="password" v-model="form.password_two" :clearable="false" placeholder="请确认密码" maxlength="18"/>
			</u-form-item>
			
		</u-form>
		<tb-button style="margin-top: 30rpx;" radius="50rpx" :buttitle="'注册'" :but_type="but_type" @but_cli="submit" 
		:bgcolor="'#fd3b48'"></tb-button>
		
	</view>
</template>

<script>
	import {ip} from '../../api.js';
	
	export default {
		data() {
			return {
				form: {
					password: '',
					password_two:''
				},
				xieyi: true,//协议
				tips: '获取验证码',
				uploadAction: ip + 'img/upload2',
				type:'',
				lists:[]
			}
		}, 
		onLoad(option) {
			this.type = option;
		},
		computed: {
			but_type() {
				if (this.form.password && this.form.password_two) {
					return false;
				}
				return true;
			}
		},
		
		methods: {
			submit() {
				if(this.form.password.length < 6){
					this.com.msg('密码长度不能小于六位')
				}else if(this.form.password != this.form.password_two){
					this.com.msg('密码不一致')
				}else{
					// return
					let info
					// #ifdef APP-PLUS
					info = plus.push.getClientInfo() 
					
					console.log(info.clientid)
					// #endif
					this.api.post('person/register', {
						telephone: this.type.phone,
						validateCode:this.type.code,
						password:this.form.password,
						registrationId:info.clientid
					},'application/json;charset=UTF-8').then(res => {
						// console.log(res)
						if(res.flag){
							let userinfo_Data={
								name:res.data.ryPetname,
								img:res.data.ryHeadimg,
								id:res.data.ryUuid,
								moblie:res.data.ryPhonenumber
							}
							uni.setStorageSync('userinfo_Data',userinfo_Data)
							uni.setStorageSync("token",res.data.token)
							this.com.msg(res.message)
							uni.switchTab({
								url:'../index/index',
								animationType: 'zoom-fade-out'
							})
						}else{
							this.com.msg(res.message)
						}
						
					})
				}
				
			},
			
		}
	}
</script>

<style scoped lang="scss">
	.register {
		width: 92%;
		margin: auto;

		.zhuce {
			padding-top: 50rpx;
			padding-left: 20rpx;
			color: #191919;
			font-size: 40rpx;
		}

		.form-item {
			display: flex;
			align-items: end;
			justify-content: space-around;
			flex: 1;

			.slot-btn {
				width: 150rpx;
				height: 150rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: #DDDDDD;
			}

			.slot-btn__hover {
				background-color: #DDDDDD;
			}
		}

		.title {
			width: 200rpx;
			display: inline-block;
		}

		.color {
			color: #5FC973;
		}

		.yuedu {
			color: #BEBEBE;
		}

		.xieyi {
			color: #5A6E96;
		}

		.yanzhengma {
			border: none;
			line-height: 60rpx;
			font-size: 28rpx;
		}

		.disabled {
			background-color: #F2F2F2;
			color: #C7C7C7;
			line-height: 80rpx;
			border: none;
		}

		.no-disabled {
			background-color: #1282F2;
			color: #FFFFFF;
			line-height: 80rpx;
			border: none;
		}

		.a {
			color: #1816ff;
			margin-top: 20rpx;
		}
	}
</style>
