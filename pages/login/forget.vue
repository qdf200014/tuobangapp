<template>
	<view class="forget">
		<view style="width: 100%;">
			<view class="phone" v-if="type == 2">
				账号：{{mobile}}
			</view>
			<view class="write">
				<input type="text" v-model="phone" placeholder="输入手机号" maxlength="11"/>
			</view>
			<view class="write">
				<input type="text" v-model="note" placeholder="输入验证码"/>
				<text class="give" v-if="code_show" @click="acquireCode">{{code_tit}}</text>
				<text style="margin-right: 20rpx;" v-else>{{ time }}s</text>
			</view>
			<view class="write" style="border: none;">
				<input type="text" v-model="pass" placeholder="输入新密码"/>
			</view>
			<view class="login_s" @click="changepassword">确定</view>
		</view>
		<!-- 顶部提示 	 -->
		<u-top-tips type="error" ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				type:0,//1 登录跳 2 个人跳
				phone:'',
				pass:'',
				note:'',
				code:"",//获取到的验证码
				code_tit:'获取验证码',
				time:60,
				code_show:true,//提示语显示
				mobile:'',
			}
		},
		onLoad(op) {
			this.type = op.type
			if(op.type == 2){
				uni.setNavigationBarTitle({
					title: '修改密码' //这是修改后的导航栏文字
				})
			}
			if(op.mobile){
				this.mobile = op.mobile
			}
			
		},
		methods:{
			//获取验证码
			acquireCode(){
				this.time = 60
				let arrs = this.phone
				let phone = this.$u.trim( arrs)
				if ((/^1[3456789]\d{9}$/).test(phone)) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					
					this.api.post('validateCode/send4ForgetPassword?telephone='+arrs).then(res=>{
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
						title: "手机号格式不正确",
						type: 'error',
						duration: '2000'
					})
				}
				
			},
			//修改
			changepassword(){
				let data = {
					telephone:this.phone,
					password:this.pass,
					validateCode:this.note
				}
				if(this.phone == ''){
					this.$refs.uTips.show({
						title: "手机号不能为空",
						type: 'error',
						duration: '2000'
					})
				}else{
					this.api.post('person/forgetPassWord',data).then(res=>{
						console.log(res)
						this.com.msg(res.message)
						if(res.flag){
							this.com.two_back()
						}
					})
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.forget{
		background-color: #f6f6f6;
		height: 100vh;
		display: flex;
		flex-wrap: wrap;
		.phone{
			width: 100%;color: red;
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 30rpx;
		}
		.write{
			width: 100%;
			display: flex;
			justify-content: space-between;
			background-color: #fff;
			height: 120rpx;
			align-items: center;
			border-bottom: 1rpx solid #dedede;
			padding: 0 30rpx;
			.give{
				padding:10rpx 20rpx;
				color: #fd3b48;
				border-radius: 35rpx;
				font-size: 28rpx;
			}
		}
		.login_s{
			width: 94%;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			border-radius: 50rpx;
			background-color: #fd3b48;
			color: #fff;
			margin: 200rpx auto;
		}
	}
</style>
