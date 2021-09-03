<template>
	<view>
		<view class="head" v-if="pagecont.cancelState === null">
			<view class="qxiaotitle">
				取消申请
			</view>
			<view class="headTime">
				还剩 <u-count-down :timestamp="timestamp" bg-color="#f30a06" color="white" separator-color="white"></u-count-down>
			</view>
		</view>
		<view class="head" v-if="pagecont.cancelState == 0">
			<view class="qxiaotitle">
				取消成功
			</view>
			<view class="headTime">
				
			</view>
		</view>
		<view class="head" v-if="pagecont.cancelState == 1">
			<view class="qxiaotitle">
				拒绝取消
			</view>
			<view class="headTime">
				
			</view>
		</view>
		<view class="head" v-if="pagecont.cancelState == 2">
			<view class="qxiaotitle">
				系统自动取消
			</view>
			<view class="headTime">
				
			</view>
		</view>
		<view class="tipsText" v-if="pagecont.cancelState === null || pagecont.cancelState == 2">
			{{pagecont.who == 5 ? '您已取消，待对方处理，对方超过三分钟无操作，将视为同意取消。如有异议，可以跟对方协商或申诉' : '对方已取消，请及时处理，超过三分钟无操作，将视为同意取消。如有异议，可以跟对方协商或申诉'}}
		</view>
		
		<!-- <view class="tipsText" v-if="pagecont.cancelState === 1">
			对方拒绝取消
		</view> -->
		<view class="button" v-if="pagecont.jdState != pagecont.who">
			<view></view>
			<view class="button_right" v-if="pagecont.cancelState === null">
				<view @click="buts(pagecont.jdUuid,1)">拒绝取消</view>
				<view @click="buts(pagecont.jdUuid,0)">同意取消</view>
			</view>
		</view>
		<!-- <view class="gp_chat">
			协商历史
			<u-icon name="arrow-right" color='#888'></u-icon>
		</view> -->
		<view class="gp_chat" style="margin-bottom: 0;">
			取消信息
		</view>
		<view class="task_detail" @click="go_detail(pagecont.bzUuid,pagecont.type)">
			<view class="task_left">
				<image :src="pagecont.photo" mode="aspectFill"></image>
			</view>
			<view class="task_right">
				<view class="title">
					{{pagecont.jianjie}}
				</view>
				<view class="price">
					￥{{pagecont.price}}
				</view>
			</view>
		</view>
		<view class="cause">
			<view class="cause_item">
				取消原因：{{pagecont.cancelCause}}
			</view>
			<view class="cause_item">
				退款金额：￥{{pagecont.price == 0 ? '无偿' : pagecont.price}}
			</view>
			<view class="cause_item">
				申请时间：{{pagecont.cancelTime}}
			</view>
			<view class="cause_item">
				退款编号：02121315251
			</view>
		</view>
		<view class="service" @click="go_service(pagecont.jdUuid,ryuuid)" v-if="pagecont.cancelState == 1">
			申诉
		</view>
		<view class="service" style="border-top: 1rpx solid #eee;" @click="no_service(pagecont.jdUuid)" v-if="pagecont.cancelState === null && pagecont.jdState == pagecont.who">
			撤回取消
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pagecont:'',
				timestamp: 0,
			}
		},
		onLoad(op) {
			this.cancelId = op.id
			this.type = op.type
			this.pageData()
		},
		methods: {
			pageData(){
				this.api.get('response/cancelDetails/'+this.cancelId).then(res=>{
					console.log(res)
					if(res.flag){
						this.pagecont = res.data
						
						let tim = 0
						var times = Date.parse(new Date())
						if(res.data.time - times >=0){
							tim = res.data.time - times
							this.timestamp = Math.floor(tim / 1000)
						}
						
					}
				})
			},
			// 到详情
			go_detail(e,type){
				if(type == 1){ // 服务
					this.com.navto('../serve_detail/serve_detail?id='+e)
				}else{
					this.com.navto('../index/task_detail?id='+e)
				}
			},
			go_service(e,ry){
				this.com.navto('./list/appeal?id='+e+'&type='+this.type)
			},
			buts(e,type){
				this.api.get('response/isAgreeCancel/'+e+'/'+type).then(res=>{
					if(res.flag){
						this.pageData()
					}else{
						this.com.msg(res.message)
					}
				})
			},
			no_service(e){
				this.api.post('response/withdrawCancel/'+e).then(res=>{ 
					console.log(res)
					if(res.flag){
						uni.navigateBack()
						this.com.msg(res.message)
					}
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f4f4f4;
	}
</style>
<style scoped lang="scss">
.head{
	padding: 60rpx 4%;background-color: #f30a06;color: white;
	.qxiaotitle{
		font-size: 32rpx;
	}
	.headTime{
		margin-top: 20rpx;
	}
}
.tipsText{
	padding: 3%;font-size: 30rpx;
	background-color: white;
}
.button{
	width: 100%;padding: 10rpx 0;border-bottom: 1rpx solid #EEEEEE;border-top: 1rpx solid #EEEEEE;
	display: flex;justify-content: space-between;background-color: white;margin-bottom: 20rpx;
	.button_right{
		width: 60%;
		display: flex;justify-content: space-around;
		view{
			padding: 12rpx 30rpx;border: 1rpx solid #f30a06;border-radius: 50rpx;color: #f30a06;
		}
	}
}
.gp_chat{
	padding: 3%;display: flex;justify-content: space-between;;margin-bottom: 20rpx;font-weight: bold;
}
.task_detail{
	padding: 3%;display: flex;
	.task_left{
		width: 32%;
		image{
			width: 200rpx;height: 200rpx;border-radius: 20rpx;
		}
	}
	.task_right{
		width: 68%;
		.title{
			height: 130rpx;
			line-height: 56rpx;
			-webkit-line-clamp: 2; //只显示两行
			
			text-overflow: ellipsis; //超出部分显示省略号
			
			display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
			
			-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式 纵向
		}
	}
}
.cause{
	padding: 3%;background-color: #FFFFFF;border-bottom: 1rpx solid #eee;
	.cause_item{line-height: 50rpx;}
}
.service{
	padding: 30rpx 0;width: 100%;text-align: center;background-color: white;
}
</style>
