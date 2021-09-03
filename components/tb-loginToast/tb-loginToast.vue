<template>
	<view>
		<view class="toast">
			<view class="toast_it">
				<view class="toast_it_title">{{titles}}</view>
				<view class="toast_it_cont" v-if="textaType"> 
					请你务必审慎阅读，充分理解"服务协议"和"隐私政策"各条款，包括但不限于：为了向你提供即时通讯、内容分享等服务，我们需要搜集你的设备信息、操作日志等个人信息。你可以在"设置"中查看、变更、删除个人信息并管理你的授权。你可阅读 
					<text style="color: #2B85E4;" @click="fuw(2)">《服务协议》</text> 和 <text style="color: #2B85E4;" @click="fuw(1)">《隐私政策》</text>了解详细信息。如你同意、请点击"同意"开始接受我们的服务。
				</view>
				<view class="toast_it_cont" v-else>
					若您不同意隐私权政策，我们将无法为您提供服务
				</view>
				<view class="toast_but">
					<view @click="butyi">
						{{no_tit}}
					</view>
					<view style="color: #2B85E4;" @click="yes_xy">
						{{yes_tit}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				titles:'服务协议和隐私政策',
				no_tit:'不同意',
				yes_tit:'同意',
				textaType:true,
				textbType:false,//第二个弹框
				textcType:false,//第三个弹框
			}
		},
		methods: {
			//暂不使用
			no_app(){
				//退出app
				// #ifdef APP-PLUS
				if (plus.os.name.toLowerCase() === 'android') {
					plus.runtime.quit();
				}
				else{ 
					const threadClass = plus.ios.importClass("NSThread");
					const mainThread = plus.ios.invoke(threadClass, "mainThread");
					plus.ios.invoke(mainThread, "exit");
				}
				// #endif
			},
			
			// 第一次不同意
			butyi(){
				if(this.no_tit == '不同意'){
					this.textaType = false
					if(!this.textaType){
						this.textbType = true
						this.no_tit = '仍不同意'
						this.yes_tit = '查看协议'
						this.titles ="您需要同意才能继续使用"
					}
				}else if(this.no_tit == '仍不同意'){
					this.no_tit = '退出应用'
					this.yes_tit = '再次查看'
					this.titles ="要不您在想想？"
				}else if(this.no_tit == '退出应用'){
					this.no_app()
				}
			},
			//同意
			yes_xy(){
				if(this.yes_tit == '同意'){
					this.$emit("yesag")
				}else{
					this.com.navto('../../pages/login/agreement_page?type='+2)
					this.textaType = true
					this.textbType = false
					this.titles = '服务协议和隐私政策',
					this.no_tit = '不同意'
					this.yes_tit = '同意'
				}
			},
			//协议
			fuw(e){
				this.$emit("agreement",e)
			}
		}
	}
</script>

<style lang="scss" scoped>
.toast{
	position: fixed;left: 0;top: 0;z-index: 99;
	width: 100%;height: 100vh;background-color: rgba(0,0,0,0.36);
	display: flex;
	.toast_it{
		width: 80%;background-color: white;border-radius: 15rpx;
		margin: auto;
		padding-top: 40rpx;
		.toast_it_title{
			width: 100%;text-align: center;font-size: 40rpx;
		}
		.toast_it_cont{
			width: 100%;padding: 24rpx 50rpx;
			line-height: 40rpx;font-size: 30rpx;
		}
		.toast_but{
			width: 100%;display: flex;justify-content: space-between;font-size: 38rpx;line-height: 88rpx;border-top: 1rpx solid #f1f1f1;margin-top: 20rpx;
			view{
				width: 50%;text-align: center;
			}
		}
	}
}
</style>
