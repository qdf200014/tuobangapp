<template>
	<view >
		<view @click.stop="page_top" style="width: 100%;height: 100vh;">
			<view class="posi" >
				<view class="items" v-for="(it,index) in list" :key="index" @click.stop="page_go(index)">
					<view class="item_left" >
						<image :src="it.img" mode=""></image>
					</view>
					<view class="item_right">
						<view class="right_title">
							{{it.name}}
						</view>
						<view class="right_tips">
							{{it.cont}}
						</view>
					</view>
				</view>
				<view class="but_fu" @click.stop="page_top">
					<vie class="button">
						<u-icon name="close" size="40"></u-icon>
					</vie>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						name:'发布求助',
						cont:'让帮助来的快一点',
						img:'../../static/xuqiu.png'
					},
					{
						name:'发布帮助',
						cont:'帮助更多的人',
						img:'../../static/fuwu.png'
					},
				],
				pageNums:0
			}
		},
		onShow() {
			if(!uni.getStorageSync('token')){
				this.pageNums ++
				if(this.pageNums == 1){
					this.com.navto('../login/login?type='+1)
				}else{
					this.pageNums = 0
					uni.switchTab({
						url:'../index/index' 
					})
				}
			}
		},
		methods: {
			page_top(){
				uni.navigateBack()
			},
			page_go(e){
				this.api.get('help/isRelease').then(res=>{
					if(res.flag){
						if(res.data.state == 0){
							if( e== 0){
								this.com.redto('./publish')
							}else{
								this.com.redto('../my/list/addService')
							}
						}else if(res.data.state == 3){
							this.com.msg('您现在处于封禁状态'+res.data.bannedTime+'天内不能发布')
						}else if(res.data.state == 2){
							uni.showModal({
								content:"您现在个人资料违规，请更改个人资料，并审核通过后即可发布！",
								success(a) {
									if(a.confirm){
										this.com.navto('../my/user_set')
									}
								}
							})
						}
					}
				})
				
			}
		}
	}
</script>

<style>
page{
	background: url(../../static/fabuimg.png);
	background-size:  100% 100%;
}
</style>
<style lang="scss" scoped>
.posi{
	width: 100%;padding: 45rpx 130rpx ;
	position: fixed;left: 0;bottom: 0;
	.items{
		display: flex;margin-bottom: 100rpx;
		.item_left{
			width: 130rpx;height: 146rpx;margin-right: 30rpx;
			image{
				width: 100%;height: 100%;
			}
		}
		.item_right{
			.right_title{
				color: #ff0202;font-size: 36rpx;margin-top: 16rpx;font-weight: bold;
			}
			.right_tips{
				color: #333;line-height: 60rpx;
			}
		}
	}
	.but_fu{
		width: 100%;text-align: center;
		.button{
			border-radius: 50%;
			display: inline-block;text-align: center;line-height: 100rpx;
			width: 90rpx;height: 90rpx;background-color: #fff;
			text-align: center;
			box-shadow:5px 0rpx 10px gray;
		}
	}
	
}
</style>
