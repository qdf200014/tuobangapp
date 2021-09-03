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
						<!-- <view v-if="it.serveState == 1" @click.stop="reshelf(it.serveUuid,index)">重新上架</view> -->
						<view  @click.stop="compile(it.serveUuid)">编辑</view>
						<text  @click.stop="genduo(it,index)">
							<u-icon  name="more-dot-fill" size="38"></u-icon>
						</text>
					</view>
				</view>
				
			</view>
		</view>
		<tb-share ref="share" :page_content_two="page_content_two" :contentHeight="450" type="2"></tb-share>
		<!-- 弹框 -->
		<u-popup v-model="bragpopup" mode="bottom" border-radius="20">
			<view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(1)">
				分享
			</view>
			<view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(4)">
				点亮
			</view>
			<view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(2)" >
				下架
			</view>
			<view class="del_item"  style="color: red;border-bottom: 1rpx solid #eee;" @click="bargClick(3)">
				删除
			</view>
			<view class="del_item" @click="bragpopup = false">
				取消
			</view>
		</u-popup>
		<!-- 占位 -->
		<view style="height: 30rpx;width: 100%;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				bragpopup:false,
				fbDetail:'',
				xiajIndex:0,//下标
				page_content_two:''
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
				this.api.get('serve/myServe').then(res=>{
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
			//更多
			genduo(e,index){
				console.log(e)
				this.fbDetail = e
				this.xiajIndex = index
				this.bragpopup = true
			},
				bargClick(e){
				this.bragpopup =  false
				if(e == 1){
					this.page_content_two = {
						serveUuid:this.fbDetail.serveUuid,
						serveTitle:this.fbDetail.serveTitle,
						photo:this.fbDetail.photo 
					}
					this.$refs.share.toggleMask();
				}else if(e == 2){ //下架
					this.api.get('serve/serveState/'+this.fbDetail.serveUuid).then(res=>{
						if(res.flag){
							this.list.splice(this.xiajIndex,1)
							this.com.msg('已下架')
						}
					})
				}else if(e == 3){ //删除
					
					uni.showModal({
						content:"确定要删除吗？",
						success:function(e) {
							if(e.confirm){
								this.api.get('serve/deleteServe/'+this.fbDetail.serveUuid).then(res=>{
									this.list.splice(this.xiajIndex,1)
									this.com.msg('删除成功')
								})
							}
						}.bind(this)
					})
				}else{
					this.api.get('serve/lightUp/'+this.fbDetail.serveUuid).then(res=>{
						console.log(res)
						this.com.msg(res.flag)
					})
				}
			},
			// //重新上架
			// reshelf(e,index){
			// 	console.log(e,index)
			// 	this.api.post('help/change',{bzUuid:e}).then(res=>{
			// 		if(res.flag){
			// 			this.list[index].serveState = this.list[index].serveState == 0 ? 1 : 0
			// 			this.com.msg('上架成功')
			// 		}
			// 	})
			// }
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
