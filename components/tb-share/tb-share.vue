<template>
	<view v-if="show" class="mask" @click="toggleMask" 	@touchmove.stop.prevent="stopPrevent" :style="{backgroundColor: backgroundColor}">
		<view class="mask-content" @click.stop.prevent="stopPrevent" :style="[{height: config.height, transform: transform}]">
			<text class="share-header">
				分享到
			</text>
			<scroll-view :style="{height: config.height,'padding-bottom':'200rpx'}" scroll-y>
				
				<view class="share-list">
					<view v-for="(item, index) in shareList" :key="index" class="share-item" @click="shareToFriend(item.type)">
						<u-icon :name="item.icon" size="100" color="#20D86E"></u-icon>
						<text style="font-size: 32rpx;">{{item.text}}</text>
					</view>
				</view>
			</scroll-view>
			<text style="font-size: 36rpx;" class="bottom" @click="toggleMask">取消</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				transform: 'translateY(50vh)',
				timer: 0,
				backgroundColor: 'rgba(0,0,0,0)',
				show: false,
				config: {},
				shareList: [{
						type: 1,
						icon: 'weixin-circle-fill',
						text: '微信好友'
					},
					{
						type: 2,
						icon: 'moments-circel-fill',
						text: '朋友圈'
					}
				]
			};
		},
		props: {
			contentHeight: {
				type: Number,
				default: 0
			},
			//是否是tabbar页面
			hasTabbar: {
				type: Boolean,
				default: false
			},
			page_content_two:{},
			type:{},//1需求 2 服务 3嘚瑟
		},
		created() {
			const height = uni.upx2px(this.contentHeight) + 'px';
			this.config = {
				height: height,
				transform: `translateY(${height})`,
				backgroundColor: 'rgba(0,0,0,.4)',
			}
			this.transform = this.config.transform;
		},
		methods: {
			toggleMask() {
				//防止高频点击
				if (this.timer == 1) {
					return;
				}
				this.timer = 1;
				setTimeout(() => {
					this.timer = 0;
				}, 500)

				if (this.show) {
					this.transform = this.config.transform;
					this.backgroundColor = 'rgba(0,0,0,0)';
					setTimeout(() => {
						this.show = false;
						this.hasTabbar && uni.showTabBar();
					}, 200)
					return;
				}

				this.show = true;
				//等待mask重绘完成执行
				if (this.hasTabbar) {
					uni.hideTabBar({
						success: () => {
							setTimeout(() => {
								this.backgroundColor = this.config.backgroundColor;
								this.transform = 'translateY(0px)';
							}, 10)
						}
					});
				} else {
					setTimeout(() => {
						this.backgroundColor = this.config.backgroundColor;
						this.transform = 'translateY(0px)';
					}, 10)
				}
			},
			//防止冒泡和滚动穿透
			stopPrevent() {},
			//分享操作
			shareToFriend(e) {
				console.log(e)
				// this.$emit('shaer_app',e)
				console.log(this.page_content_two)
				this.toggleMask();
				let urlz
				if(this.type == 1){
					urlz = 'http://www.tuobangok.com/h5/#/pages/index/taskDetail?id='+this.page_content_two.bzUuid+'&ryuuid='+uni.getStorageSync('userinfo_Data').id
				}else{
					urlz = 'http://www.tuobangok.com/h5/#/pages/index/serveDetail?id='+this.page_content_two.serveUuid+'&ryuuid='+uni.getStorageSync('userinfo_Data').id
				}
				if(e == 1){ // 微信好友
					uni.share({
					    provider: "weixin",
					    scene: "WXSceneSession",
					    type: 0,
					    href: urlz,
					    title: this.type == 1 ?  this.page_content_two.jianjie : this.page_content_two.serveTitle ,
					    summary: '点击查看',
					    imageUrl: this.page_content_two.photo[0],
					    success: function (res) {
							console.log(res)
							
					    },fail: function (err) {
							// console.log(err)
					        that.com.msg('失败')
					    }
					});
				}else{ //朋友圈
					uni.share({
					    provider: "weixin",
					    scene: "WXSenceTimeline",
					    type: 0,
					    href: urlz,
					    title:  this.type == 1 ?  this.page_content_two.jianjie : this.page_content_two.serveTitle,
					    summary: '点击查看',
					    imageUrl: this.page_content_two.photo[0],
					    success: function (res) {
							// console.log(res)
							
					    },fail: function (err) {
							// console.log(err)
					        // that.com.msg('失败')
					    }
					});
				}
			},
		}
	}
</script>

<style lang='scss' scoped>
	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		display: flex;flex-direction: row;
		justify-content: center;
		align-items: flex-end;
		z-index: 998;
		transition: .3s;

		.bottom {
			position: absolute;
			left: 0;
			bottom: 0;
			width: 750rpx;text-align: center;
			height: 90upx;
			background: #fff;
			z-index: 9;
			font-size: 30rpx;
			/* color: $font-color-dark; */
		}
	}

	.mask-content {
		width: 750rpx;
		height: 580upx;
		transition: .3s;
		background: #fff;

		&.has-bottom {
			padding-bottom: 90upx;
		}

		
	}

	.share-header {
		width: 100%;display: inline-block;
		font-size: 30rpx;
		/* color: font-color-dark; */
		text-align: center;
		padding: 10upx 0;
		&:before,
		&:after {
			content: '';
			width: 240upx;
			height: 0;
			/* border-top: 1px solid $border-color-base; */
			transform: scaleY(.5);
			margin-right: 30upx;
		}

		&:after {
			margin-left: 30upx;
			margin-right: 0;
		}
	}

	.share-list {
		display: flex;flex-direction: row;
		flex-wrap: wrap;
	}

	.share-item {
		min-width: 250rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 180upx;

		.images {
			width: 80upx;
			height: 80upx;
			margin-bottom: 16upx;
		}
	}
</style>
