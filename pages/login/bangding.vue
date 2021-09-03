<template>
	<view class="register">
		
		<u-form :model="form" ref="form">
		
			<u-form-item>
				<u-input v-model="form.telephone" :clearable="false" placeholder="请填写手机号" maxlength="11"/>
			</u-form-item>
			
			<u-form-item>
				<u-input type="number" v-model="form.validateCode" :clearable="false" placeholder="请填写验证码" />
				<view>
					<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
					<view class="yanzhengma" @click="getCode">{{tips}}</view>
				</view>
			</u-form-item>

			<!-- 协议 -->
			<view class="xieyi_type">
				<tb-xieyi @radioClick="radioClick" @agreement="agreement"></tb-xieyi>
			</view>
			
		</u-form>
		<tb-button radius="50rpx" buttitle="确定" :but_type="but_type" @but_cli="submit" :bgcolor="'#fd3b48'"></tb-button>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {ip} from '../../api.js';
	
	export default {
		data() {
			return {
				form: {
					telephone: '',
					validateCode:''
				},
				xieyi: true,//协议
				tips: '获取验证码',
				uploadAction: ip + 'img/upload2',
				lists:[],
				radio_type:false,
				ryuuid:'',
				pageType:0
			}
		}, 
		onLoad(option) {
			this.ryuuid = option.id
			this.pageType = option.type
		},
		computed: {
			but_type() {
				if (this.form.telephone && this.form.validateCode) {
					return false;
				}
				return true;
			}
		},
		
		methods: {
			agreement(e){
				console.log(e)
				this.com.navto('./agreement_page?type='+e)
			},
			//返回上一页
			gotop(){
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 300
				})
			},
			//协议状态
			radioClick(e){
				this.radio_type = e
			},
			
			codeChange(text) {
				// console.log(text)
				this.tips = text;
			},
			getCode() {
				
				let phone = this.$u.trim(this.form.telephone, 'all')
				if ((/^1[3456789]\d{9}$/).test(phone)) {
					if (this.$refs.uCode.canGetCode) {
						// 模拟向后端请求验证码
						uni.showLoading({
							title: '正在获取验证码'
						})
						this.api.post('validateCode/send4VXLogin?telephone='+this.form.telephone).then(res=>{
							console.log(res)
							uni.hideLoading();
							if(res.flag){
								
								this.$refs.uTips.show({
									title: "验证码已发送",
									type: 'success',
									duration: '2000'
								})
								// 通知验证码组件内部开始倒计时
								this.$refs.uCode.start();
							}
						})
						return
				
					} else {
						this.$refs.uTips.show({
							title: "倒计时结束后再发送",
							type: 'success',
							duration: '2000'
						})
					}
				} else {
					this.$refs.uTips.show({
						title: "手机号格式不正确",
						type: 'success',
						duration: '2000'
					})
				}
			},
			submit() {
				if(this.form.telephone.length <11 && !(/^1[3456789]\d{9}$/).test(this.form.telephone)){
					this.com.msg('手机号不正确')
					return
				}
				if(!this.radio_type){
					this.com.msg('请先阅读并同意相关协议')
					return
				}
				var info
				// #ifdef APP-PLUS
				info = plus.push.getClientInfo() 
				
				console.log(info.clientid)
				// #endif
				this.api.post('vx/vxPhoneNumber',{
					ryUuid:this.ryuuid,
					telephone:this.form.telephone,
					validateCode:this.form.validateCode,
					registrationId:info.clientid
					}).then(res=>{
						console.log(res)
						if(res.flag){
							let userinfo_Data={
								name:res.data.ryPetname,
								img:res.data.ryHeadimg,
								id:res.data.ryUuid,
								moblie:res.data.ryPhonenumber
							}
							uni.setStorageSync('userinfo_Data',userinfo_Data)
							uni.setStorageSync("token",res.data.token)
							
							if(this.pageType == 1){
								uni.switchTab({
									url:'../my/my',
									animationType: 'zoom-fade-out'
								})
							}else{
								uni.switchTab({
									url:'../index/index',
									animationType: 'zoom-fade-out'
								})
							}
						}else{
							this.com.msg(res.message)
						}
					})
			},
			
		}
	}
</script>

<style scoped lang="scss">
	//协议
	.xieyi_type{ 
		margin: 3% 5%;
	}
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
			border: none;color: #fd3b48;
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
			background-color: #fd3b48;
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
