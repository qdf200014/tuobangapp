<template>
	<view>
		<view class="cont" v-if="shouj">
			<view class="title">
				更换手机号
			</view>
			<view class="tips">
				可用于账号登陆
			</view>
			<input type="number" v-model="phoneMoblie" maxlength="11" placeholder="请输入手机号"/>
		</view>
		<view class="cont" v-else>
			<view class="title">
				请输入六位验证码
			</view>
			<view class="tips">
				验证码已发送至<text style="color: red;">{{phoneMoblie}}</text>
			</view>
			<input type="number" v-model="vidCode" maxlength="11" placeholder="请输入验证码"/>
		</view>
		<view class="but">
			<view class="times" v-if="bangd">
				重新发送({{time}}s)
			</view>
			<tb-button v-else :buttitle="annTit" @but_cli="butCli"></tb-button>
		</view>
		<u-top-tips type="error" ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneMoblie:'',
				time:60,
				bangd:false,
				shouj:true,
				annTit:'发送短信验证码',
				vidCode:'',
				uuid:uni.getStorageSync('userinfo_Data').id
			};
		},
		watch:{
			vidCode(a){
				console.log(a.length)
				if(a.length == 6){
					this.api.post('person/changeRyPhoneNumber',{
						ryUuid:this.uuid,
						telephone:this.phoneMoblie,
						validateCode:this.vidCode}).then(res=>{
						console.log(res)
						if(res.flag){
							let data = {
								id:res.data.ryUuid,
								img:res.data.ryHeadimg,
								moblie:res.data.ryPhonenumber,
								name:res.data.ryPetname
							}
							uni.setStorageSync('userinfo_Data',data)
							uni.navigateBack()
						}
					})
				}
			}
		},
		methods:{
			butCli(){
				this.time = 60
				this.api.post('validateCode/send4ChangeRyPhoneNumber?telephone='+this.phoneMoblie).then(res=>{
					console.log(res)
					if(res.flag){
						this.bangd = true //按钮
						this.shouj = false //密码
						let timeval = setInterval(()=>{
							if(this.time == 0){
								clearInterval(timeval)
								this.bangd = false
								this.annTit = '再次发送'
								
							}else{
								this.time -= 1
							}
						},1000)
						this.$refs.uTips.show({
							title: "验证码已发送",
							type: 'success',
							duration: '2000'
						})
						this.shouj = false
					}else{
						this.com.msg(res.message)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.cont{
	padding: 6%;
	.title{
		font-weight: bold;font-size: 50rpx;
	}
	.tips{
		line-height: 86rpx;
	}
	input{
		padding: 20rpx 0;border-bottom: 0.5rpx solid #EEEEEE;
	}
}
.but{
	margin-top: 50rpx;
}
.times{
	    background-color: #DD524D;
	    border-radius: 25px;
	    height: 80rpx;
	    line-height: 38px;
	    width: 90%;
	    color: #fff;
	    padding: 2px;
	    text-align: center;
	    margin-left: 5%;
	    font-size: 16px;
	    border: 0;
}
</style>
