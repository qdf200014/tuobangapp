<template>
	<view >
		<view class="userinfo">
			<view class="userItem">
				<view class="itemL">
					姓名:
				</view>
				<view class="itemR">
					<input type="text" v-model="name" />
				</view>
			</view>
			<view class="userItem">
				<view class="itemL">
					证件类型:
				</view>
				<view class="itemR">
					身份证
				</view>
			</view>
			<view class="userItem" style="border-bottom: 16rpx solid #eee;">
				<view class="itemL">
					证件号码:
				</view>
				<view class="itemR">
					<input type="text" v-model="code" />
				</view>
			</view>
		</view>
		<!-- 上传 -->
		<view v-if="resshow" style="padding: 3%;">
			<view>拍摄时请确认身份证边角完整、字迹清晰、亮度均匀</view>
			
			<view style="display: flex;justify-content: space-around;margin: 20rpx;">
				<u-upload  max-count="1" upload-text="上传身份证正面照" @on-success="sfz_z_up" :action="active" 
				width="620" height="330" :name="'file'">
					
				</u-upload>
			</view>
			<view style="display: flex;justify-content: space-around;margin: 20rpx;">
				<u-upload  max-count="1" upload-text="上传身份证反面照" @on-success="sfzFan" :action="active"
				 width="620" height="330" :name="'file'">
					
				</u-upload>
			</view>
			<view style="margin-top: 50rpx;">
				<tb-button buttitle="上传" @but_cli="but_cli"></tb-button>
			</view>
		</view>
		<!-- 成功 -->
		<view class="response" v-else>
			成功
			<view style="margin-top: 50rpx;">
				<tb-button buttitle="返回" @but_cli="topage"></tb-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {ip} from '../../../api.js'
	export default {
		data() {
			return {
				active: ip + 'upload/uploadAuthImg',
				idenzhen:'',
				idenfan:'',
				resshow:true,
				name:'',
				code:''
			}
		},
		methods: {
			// 正
			sfz_z_up(e){
				console.log(e)
				this.idenzhen = e.data
			},
			// 反
			sfzFan(e){
				this.idenfan = e.data
			},
			// 上传
			but_cli(){
				if(this.name == ''){
					this.com.msg('请输入姓名')
					return
				}else if(this.code == ''){
					this.com.msg('请输入证件号码')
					return
				}else if(!this.idenzhen){
					this.com.msg('请上传正面照片')
					return
				}else if(!this.idenfan){
					this.com.msg('请上传反面照片')
					return
				}
				let arr = {
				    "userFullName": this.name,
				    "userIDCard": this.code,
				    "imgFront": this.idenzhen,
				    "imgBack": this.idenfan,
					"ryUuid":uni.getStorageSync('userinfo_Data').id
				}
				this.api.post('person/authentication',arr).then(res=>{
					console.log(res)
					this.com.msg(res.message)
					if(res.flag){
						this.resshow = false
					}
					
				})
			},
			topage(){
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
.response{
	width: 100%;padding-top: 200rpx;text-align: center;
	font-size: 46rpx;
	
}
.userinfo{
	width: 100%;
	.userItem{
		padding: 23rpx 3%;
		display: flex;font-size: 30rpx;
		border-bottom: 2rpx solid #eee;
		.itemL{
			width: 160rpx;color: #565656;
		}
	}
	
}
</style>
