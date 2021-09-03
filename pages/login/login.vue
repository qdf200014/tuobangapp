<template>
	<view class="pages">
		<view class="login_header">
			<view v-if="fanhui" @click="gotop">返回</view>
			<view></view>
			<view v-show="qiehuan_shou && user_storage" @click="button_gd">更多</view>
		</view>
		<view style="color: #666;font-weight: bold; padding:0 3%;font-size: 46rpx;">欢迎登录妥帮</view>
		<!-- 登录切换 -->
		<view class="user_img" v-if="!user_storage" >
			<view class="user_img_child">妥帮</view>
		</view>
		<view class="user_img" v-else @click="button_gd">
			<view class="user_img_childs">
				<image :src="user_storage_cont.img" mode="aspectFill"></image>
				
			</view>
			<!-- <view class="user_name">{{tels(user_storage.moblie)}}</view> -->
			<view class="user_name">{{user_storage_cont.name}}</view>
		</view>
		<!-- 输入区域 -->
		<view class="input_area">
			<u-form :model="form" ref="form">
				<u-form-item  v-if="!user_storage">
					<u-input type="number"  v-model="form.phone" :clearable="false" placeholder="请输入手机号或账号" maxlength="11"
					:placeholder-style="'color: #999;'" />
					<text class="title" @click="form.phone = ''"><u-icon name="close"></u-icon></text>
				</u-form-item>
				
				<u-form-item v-if="pass_code == 0">
					<u-input type="password" v-model="form.password" :clearable="false" placeholder="请填写密码" 
					:placeholder-style="'color: #999;'" @confirm="but_cli"/>
					<view class="forget_prss" @click="forget">忘记密码</view>
				</u-form-item>
				<u-form-item v-else>
					<u-input type="number" v-model="form.yanzhengma" :clearable="false" placeholder="请填写验证码" 
					:placeholder-style="'color: #999;'" @confirm="but_cli"/>
					<view>
						<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
						<view class="yanzhengma_sty" @click="getCode">{{tips}}</view>
					</view>
				</u-form-item>
			</u-form>
		</view>
		<!-- 顶部提示 	 -->
		<u-top-tips ref="uTips"></u-top-tips>
		
		<!-- 按钮 -->
		<tb-button radius="50rpx" :buttitle="'登录'" :but_type="but_type" @but_cli="but_cli" :bgcolor="'#fd3b48'"></tb-button>
		<!-- 协议 -->
		<view class="xieyi_type">
			<tb-xieyi @radioClick="radioClick" @agreement="agreement"></tb-xieyi>
		</view>
		<!-- 注册 -->
		<view class="register">
			<!-- 短信验证码登录 -->
			<view @click="qih_loginType">{{auto_code_login }}</view>
			<navigator url="./register" v-if="!user_storage">注册</navigator>
		</view>
		<!-- 第三方登录 -->
		<view class="opidoauth">
			<u-divider color="#999">更多登录方式</u-divider>
			<view class="loginItems">
				<view class="itemWeiXin" @click="logins">
					<u-icon name="weixin-circle-fill" size="120" color="#20D86E"></u-icon>
				</view>
			</view>
		</view>
		<!-- 弹框 -->
		<tb-loginToast :toast="textaType" v-if="page_show" @yesag="yesag" @agreement="agreement"></tb-loginToast>
		<!-- 菜单 -->
		<u-popup v-model="popup_show" mode="bottom" border-radius="14">
			<view class="popup"> 
				<view v-for="(it,ind) in pops" :key="ind" @click="qiehuan(ind)">
					{{it}}
				</view>
			</view> 
		</u-popup>
	</view> 
</template>

<script>
	export default {
		data() {
			return {
				page_show:false,//协议弹框展示
				textaType:false,
				form: {
					phone: '',
					password: '',
					yanzhengma: '',
				},
				tips: '获取验证码',
				time:60,
				code_type:true,//验证码倒计时状态
				auto_code_login:'短信验证码登录',
				pass_code:0,// 0 密码 1 短信
				user_storage:false,//是否有账号
				user_storage_cont:false,//账号信息
				radio_type:false,//协议状态
				moblies:'',//账号号码
				popup_show:false,
				pops:[
					'切换账号',
					'注册',
					'取消',
					
				],
				qiehuan_shou:false, //切换账号
				toast:'' ,//弹框显示
				pageType:0,//打哪来
				fanhui:false,
			}
		},
		onLoad(op) {
			if(op.type){
				this.pageType = op.type
			}
		},
		onShow() {
			//判断是否有账号
			//判断是否同意协议
			// if(!uni.getStorageSync('type')){
			// 	this.page_show = true
			// }
			this.userinfos()
		
		},
		computed: {
			//按钮状态
			but_type(){
				//密码
				if(!uni.getStorageSync('userinfo_Data')){
					// 0 密码 1 短信
					if(this.pass_code == 0){
						if(this.form.phone != '' && this.form.password !=''){
							return false
						}else{
							return true
						}
					}else{
						if(this.form.phone != '' && this.form.yanzhengma !=''){
							return false
						}else{
							return true
						}
					}
					
				}else{
					// 0 密码 1 短信
					if(this.pass_code == 0){
						if(this.form.password !=''){
							return false
						}else{
							return true
						}
					}else{
						if(this.form.yanzhengma !=''){
							return false
						}else{
							return true
						}
					}
					
				}
				
				
			}
		},
		methods: {
			//密码
			forget(){
				this.com.navto('./forget')
			},
			// 返回
			gotop(){
				this.fanhui = false
				this.userinfos()
			},
			//右上角更多
			button_gd(){
				if(this.user_storage){
					this.popup_show = true
				}else{
					this.userinfos()
				}
				
			},
			//切换账号
			qiehuan(e){
				this.popup_show = false
				if(e == 0){
					
					this.user_storage = !this.user_storage
					this.fanhui = true
					if(this.user_storage){
						this.userinfos()
					}
				}else if(e==1){
					this.com.navto('./register')
				}
				
			},
			userinfos(){
				console.log(!uni.getStorageSync('userinfo_Data'))
				if(!uni.getStorageSync('userinfo_Data')){
					//头像展示
					this.user_storage = false
					this.qiehuan_shou = false //切换账号
					//i电话
				}else{
					this.user_storage = true
					this.user_storage_cont = uni.getStorageSync('userinfo_Data')
					//i电话
					this.moblies = uni.getStorageSync('userinfo_Data').moblie
					this.qiehuan_shou = true
				}
			},
			//手机号码前三后四
			tels(tel) {
				tel = "" + tel;
				var ary = tel.split("");
				ary.splice(3, 4, "****");
				return ary.join("");
			},
			//协议状态
			radioClick(e){
				this.radio_type = e
			},
			// //同意协议
			// yesag(){
			// 	uni.setStorageSync("type",1)
			// 	this.page_show = false
			// },
			agreement(e){
				console.log(e)
				this.com.navto('./agreement_page?type='+e)
			},
			//切换登录状态
			qih_loginType(){
				if(this.auto_code_login == '短信验证码登录'){
					this.pass_code = 1
					this.auto_code_login = '账号密码登录'
					this.form.password = ''
				}else{
					this.pass_code = 0
					this.auto_code_login = '短信验证码登录'
					this.form.yanzhengma = ''
				}
			},
			// 获取验证码
			getCode() {
				let arrs = ''
				if(this.user_storage){
					arrs =  this.moblies
				}else{
					arrs = this.form.phone, 'all'
				}
				let phone = this.$u.trim( arrs)
				if ((/^1[3456789]\d{9}$/).test(phone)) {
					if (this.$refs.uCode.canGetCode) {
						// 模拟向后端请求验证码
						uni.showLoading({
							title: '正在获取验证码'
						})
						
						this.api.post('validateCode/send4Login?telephone='+arrs).then(res=>{
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
							}else{
								this.$refs.uTips.show({
									title: res.message,
									type: 'error',
									duration: '2000'
								})
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
			codeChange(t){
				// console.log(t) 
				this.tips = t
			},
			//点击登录
			but_cli(){
				
				if(!this.radio_type){
					this.com.msg('请先阅读并同意相关协议')
					return
				}
				//是否有账号
				let arrs = ''
				if(this.user_storage){
					arrs =  this.moblies
				}else{
					arrs = this.form.phone, 'all'
				}
				console.log(arrs)
				var info = ''
				// #ifdef APP-PLUS
				info = plus.push.getClientInfo()
				console.log(info.clientid)
				// #endif
				this.api.post('person/login',{
						telephone:arrs,
						validateCode:this.form.yanzhengma,
						password:this.form.password,
						registrationId: info.clientid //'d6b0812b6ae6005b91685bc66c20134d'
					},'application/json;charset=UTF-8').then(res=>{
					console.log(res)
					if(res.flag){
						let userinfo_Data={
							name:res.data.ryPetname,
							img:res.data.ryHeadimg,
							id:res.data.ryUuid,
							moblie:res.data.ryPhonenumber,
							
						}
						uni.setStorageSync('userinfo_Data',userinfo_Data)
						uni.setStorageSync("token",res.data.token)
						
						if(this.pageType == 1){
							uni.navigateBack()
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
			// 第三方登录
			logins(){
				let that = this
				var info
				// #ifdef APP-PLUS
				info = plus.push.getClientInfo() 
				
				console.log(info.clientid)
				// #endif
				uni.login({
				  provider: 'weixin',
				  success: function (loginRes) {
				    console.log(loginRes);
						that.api.post('vx/vxLogin',{
								access_token:loginRes.authResult.access_token,
								openid:loginRes.authResult.openid,
								registrationId:info.clientid
							}).then(res=>{
							console.log(res)
							if(res.flag){
								// state 1 登录 2绑定手机号
								if(res.data.status == 2){
									console.log(111)
									that.com.navto('./bangding?id='+res.data.ryUuid+'&type='+that.pageType)
								}else{
									console.log(res.data.hsPerson)
									let userinfo_Data={
										name:res.data.hsPerson.ryPetname,
										img:res.data.hsPerson.ryHeadimg,
										id:res.data.hsPerson.ryUuid,
										moblie:res.data.hsPerson.ryPhonenumber
									}
									console.log(that.pageType)
									uni.setStorageSync('userinfo_Data',userinfo_Data)
									uni.setStorageSync("token",res.data.hsPerson.token)
									if(that.pageType == 1){
										uni.navigateBack()
									}else{
										uni.switchTab({
											url:'../index/index',
											animationType: 'zoom-fade-out'
										})
									}
								}
									
							}
							that.com.msg(res.message)
						})
				  }
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pages{
		background: url(../../static/my/loginBg.png) no-repeat;
		background-size: 100% 600rpx;
	}
	.opidoauth{
		width: 100%;position: 0 3%;
		text-align: center;
		position: fixed;left: 0;bottom: 3%;
		.loginItems{
			margin-top: 20rpx;
			.itemWeiXin{
				
			}
		}
	}
	.forget_prss{
		margin-left: 30rpx;
	}
	//弹出层
	.popup{
		width: 750rpx;text-align: center;
		padding: 30rpx; 
		view{ 
			line-height: 100rpx;font-size: 36rpx;
		}
		view:last-child{
			color: red;
		}
	}
.login_header{
	color: #fd3b48;padding: 98rpx 50rpx 50rpx 50rpx;
	display: flex;flex-direction: row;justify-content: space-between;
}
.user_img{
	width: 100%;height: 220rpx;text-align: center;
	.user_img_child{
		width: 180rpx;height: 180rpx;background-color: #fd3b48;border-radius: 50%;text-align: center;line-height: 180rpx;
		font-size: 44rpx;color: white;
		display: inline-block;

	}
	.user_img_childs{
		width: 180rpx;height: 180rpx;text-align: center;line-height: 180rpx;
		font-size: 44rpx;color: white;
		display: inline-block;
		image{
			width: 100%;height:100%;border-radius: 50%;
		}
	}
	.user_name{
		margin: 12rpx 0;font-size: 32rpx;
	}
}
.input_area{
	width: 100%;padding: 4%;
	.u-border-bottom:after, .u-border-left:after, .u-border-right:after, .u-border-top-bottom:after, .u-border-top:after, .u-border:after {
		border-bottom: 1rpx solid #C8C7CC;
	}
	.title {
		width: 150rpx;text-align: right;
		display: inline-block;
	}
	.yanzhengma {
		background-color: #fd3b48;
		color: #FFFFFF;
		line-height: 60rpx;
		font-size: 28rpx;
		width: 200rpx;
	}
	.yanzhengma2 {
		background-color: #F8F8F8;width: 200rpx;
		color: #8F8F94;
		line-height: 60rpx;
		font-size: 28rpx;
	}
}
//协议
.xieyi_type{
	margin: 4% 5%;
}
.register{
	margin: 5%;display: flex;justify-content: space-between;color: #fd3b48;
}
</style>
