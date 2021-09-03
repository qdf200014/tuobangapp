<template>
	<view>
		<view class="kun" v-if="list == ''">
			<tb-kunNews></tb-kunNews>
		</view>
		<!-- 待帮 -->
		<view class="daibang">
			<view class="task_list" v-for="(it,index) in list" :key="index" @click="go_detail(it.serveUuid)">
				<view style="display: flex;">
					<view class="task_list_left">
						<image class="task_list_left_img" :src="it.photo[0]" mode="aspectFill"></image>
					</view>
					<view class="task_list_right">
						<text class="task_list_right_tit">{{it.serveTitle || '内容'}}</text>
					
					</view>
				</view>
				<view class="task_list_left_userinfo">
					<view class="user_left">
						<!-- 服务费:<text style="color: #ff0000;">￥{{it.price}}</text> -->
					</view>
					<view class="user_button">
						<view  @click.stop="reshelf(it.serveUuid,index)">重新上架</view>
						<view  @click.stop="bargClick(it,index)">
							删除
						</view>
					</view>
				</view>
				
			</view>
		</view>
		<!-- 弹框 -->
		<!-- 占位 -->
		<view style="height: 30rpx;width: 100%;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				fbDetail:'',
				xiajIndex:0,//下标
			}
		},
		onNavigationBarButtonTap(e) {
			this.com.navto('./bangzhuxj')
		},
		onShow() {
			this.pagedata()
		},
		methods: {
			pagedata(){
				this.api.get('serve/notHaveReleaseServe').then(res=>{
					console.log(res)
					if(res.flag){
						this.list = res.data
					}
				})
			},
			//到详情
			go_detail(e){
				this.com.navto('../../serve_detail/serve_detail?id='+e )
			},
			// 去编辑
			compile(e){
				this.com.navto('./addService?id='+e)
			},

			bargClick(e,index){
				console.log(e.serveUuid)
				let id  = e.serveUuid
				uni.showModal({
					content:"确定要删除吗？",
					success:function(e) {
						if(e.confirm){
							this.api.get('serve/deleteServe/'+id).then(res=>{
								this.list.splice(index,1)
								this.com.msg('删除成功')
							})
						}
					}.bind(this)
				})
			},
			//重新上架
			reshelf(e,index){
				console.log(e,index)
				this.api.post('serve/republish',{serveUuid:e}).then(res=>{
					if(res.flag){
						this.list.splice(index,1)
						this.com.msg('上架成功')
					}
				})
			}
		}
	}
</script> 

<style>
	page{
		background-color: #F5F5F5;
	}
</style>
<style scoped lang="scss">
//删除
.del_item{
	width: 100%;text-align: center;line-height: 100rpx;
}
//待帮
.task_list {
	width: 94%;margin: 15rpx 3%;
	background-color: white; 
	border-radius: 20rpx;
	padding: 30rpx 25rpx;

	
	.task_list_left {
		width: 220rpx;
	}
	.task_list_left_img {
		width: 200rpx;
		height: 160rpx;margin-bottom: 20rpx;
		border-radius: 20rpx;
	}
	.task_list_left_userinfo{
		display: flex;justify-content: space-between;
		width: 100%;
		.user_left{
			color: #999;width: 40%;
			white-space: nowrap;
		}
		.user_button{
			display: flex;justify-content: space-around;
			view{
				white-space: nowrap;
				padding: 8rpx 25rpx;border: 1rpx solid #fd3b41;
				margin: 0 10rpx;color: #fd3b41;border-radius: 50rpx;
			}
		}
	}
	
	.task_list_right {
		width: 450rpx;
	}
	.task_list_right_tit{
		font-size: 34rpx;line-height: 40rpx;display: inline-block;
		overflow: hidden; //超出部分隐藏
		
		-webkit-line-clamp: 3; //只显示两行
		
		text-overflow: ellipsis; //超出部分显示省略号
		
		display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
		
		-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式 纵向
		
	}
	.task_list_right_address{
		margin-top: 10rpx;
		display: flex;flex-direction: row;justify-content: space-between;
	}
	.right_address_jl{
		color: red;font-size: 28rpx;
	}
	.right_address_time{
		color: #565d67; font-size: 30rpx;lines: 3;text-overflow: ellipsis;
	} 
	.right_address_time_s{
		height: 80rpx;line-height: 40rpx;width: 480rpx;
		color: #565d67; font-size: 30rpx;lines: 2;text-overflow: ellipsis;
	} 
}

</style>
