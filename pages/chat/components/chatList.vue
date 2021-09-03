<template>
	<scroll-view :style="{justifyContent: isScrollerFlex ? 'flex-start' : 'flex-end',}" ref="scrollerDom" class="scroller"
	 @scrolltoupper="loadmore" scroll-y="true">
		<div class="row_top" ref="rowTop">
		</div>
		<div @click.stop="hideTips" v-if="rows">
			<div class="row"  v-for="(item, index) in rows" :key="index" :ref="item.sendContent"
				style="direction: ltr;transform:rotate(180deg);-ms-transform:rotate(180deg);-moz-transform:rotate(180deg);-webkit-transform:rotate(180deg);-o-transform:rotate(180deg);">
				<template v-if="index == showTips && item.senderId == userId">
					<view class="tips_box" :class="item.senderId != userId ?  'tips_left' : 'tips_right'">
						<text class="tips_text" @click="cliList(1,item,index)" v-if="item.type == 0"
							style="border-right-width: 1rpx;border-right-color: #fefefe;">复制</text>
						<text class="tips_text" @click="cliList(2,item,index)"
							style="border-right-width: 1rpx;border-right-color: #fefefe;">撤回</text>
					</view>
				</template>
				<!-- 发送时间 -->
				<div class="time_box">
					<!-- 请使用服务器返回的发送成功时间 或者 使用本地存储的时间 -->
					<!-- 可以判断时间大于当前时间5分钟再显示 -->
					<text class="time_text">{{item.time}}</text>
				</div>
				<text class="chehui" v-if=" item.chatState == 2">{{item.senderId == userId ?'您撤回了一条消息' : '对方撤回了一条消息'}}</text>
				<div class="row_box" v-if="item.chatState != 2" :style="{direction:item.senderId == userId?  'rtl' : 'ltr'}">
					<!-- 对方 -->
					<image v-if="item.senderId != userId" lazy-load class="avatar_box" mode="aspectFill"
						:src="item.senderImg" @click="go_master(item.senderId)"/>
					<!-- 我的 -->
					<image v-if="item.senderId == userId" lazy-load class="avatar_box" mode="aspectFill"
						:src="item.senderImg" style="direction: rtl;" @click="go_master(item.senderId)"/>
					<!-- 文字 -->
					<template v-if="item.type == 0">
						<div class="content_text_box" :class="item.senderId == userId ? 'content_box_color' : ''">
							<text @click.stop="hideTips" @longpress="msgLongpress(item,index)" class="content_box"
								style="max-width:500rpx;" >{{item.sendContent}}</text>
						</div>
					</template>
					<!-- 图片 -->
					<template v-if="item.type == 1">
						<image @click="viewImg(item.sendContent)" :style="textStyle" class="content_img" :src="item.sendContent"
							mode="aspectFill" @longpress="msgLongpress(item,index)" ></image>
					</template>
					<!-- 语音 -->
					<template v-if="item.type == 2">
						<div class="audio_box"   :class="item.senderId == userId ? 'content_box_color' : ''" @click="payAudio(item,index)">
							<text class="content_box"  
							@longpress="msgLongpress(item,index)">{{item.voiceLength}}''</text>
							<image class="audio_img" :src="item.senderId == userId ? '/static/temp/audio.png' : '/static/temp/audio_fan.png'"
							mode="aspectFill" ></image>
						</div>
					</template>
				</div>
			</div>
		</div>
	</scroll-view>
</template>

<script>
	const dom = weex.requireModule('dom')
	const innerAudioContext = uni.createInnerAudioContext(); //音频
	import api from '../../../api.js'
	export default {
		props: {
			keyboardHeightFlg: {
				type: Boolean,
				default: false
			},
			keyboardHeight: {
				type: Number,
				default: 0
			},
			windowHeight: {
				type: Number,
				default: 0
			},
			windowHeight: {
				type: Number,
				default: 0
			},
			rows: {
				type: Array,
				default: []
			},
			chatInputBoxHeight: {
				type: Number,
				default: 0
			}
		},
		watch: {
			//监听键盘变化
			keyboardHeightFlg(val) {
				if(this.rows.length <= 0 || this.isLoadmore) return
				setTimeout(() => {
					dom.getComponentRect(this.$refs.scrollerDom, res => {
						// console.log(res)
						let scrollerDomH = res.size.height
						this.$nextTick(() => {
							if(this.isScrollerFlex) {
								console.log('111')
								let refName = this.rows[this.rows.length - 1].sendContent
								dom.getComponentRect(this.$refs[refName], resDom => {
									console.log(resDom)
									// 100 是导航栏高度 
									if (resDom.size.bottom < 100) {
										console.log('超过一屏')
										this.isScrollerFlex = true
										if(!this.keyboardHeightFlg) {
											this.isLoadmore = true
										}
									} else {
										this.isScrollerFlex = false
										console.log('不够一屏')
									}
								})
							} else {
								// console.log('222')
								let refName = this.rows[0].sendContent
								dom.getComponentRect(this.$refs[refName][0], resDom => {
									let rowsDomB = resDom.size.bottom
									console.log(scrollerDomH,rowsDomB)
									if((scrollerDomH - rowsDomB) < 20) {
										console.log('超过一屏')
										this.isScrollerFlex = true
										if(!this.keyboardHeightFlg) {
											this.isLoadmore = true
										}
									} else {
										this.isScrollerFlex = false
										console.log('不够一屏')
									}
								})
							}
							
						})
					})
				}, 60)
			},
			//监听聊天数据变化
			rows(NewVal) {
				console.log('改变了')
				this.isScroller()
			}
		},
		computed: {},
		data() {
			return {
				payAudioIndex:null,
				isLoadmore:false,
				isScrollerFlex:false,
				showTips: null,
				loadmoreoffset: 20,
				scrollHeight: 0,
				textStyle: 'max-width:500rpx;',
				userId:uni.getStorageSync("userinfo_Data").id,
			}
		},
		mounted() {
			this.isScroller()
			//语音自然播放结束
			innerAudioContext.onEnded((res) => {
				console.log('播放结束')
				console.log(res)
				this.payAudioIndex = null
			});
		},
		updated() {
			this.isScroller()
		},
		methods: {
			// 检测数据是否够一屏
			isScroller() {
				// console.log(this.rows)
				// isLoadmore == true 说明数据超过了一屏
				if(this.rows.length <= 0 || this.isLoadmore) return
				setTimeout(() => {
					dom.getComponentRect(this.$refs.scrollerDom, res => {
						// console.log(res)
						let scrollerDomH = res.size.height
						this.$nextTick(() => {
							if(this.isScrollerFlex) {
								console.log('111')
								let refName = this.rows[this.rows.length - 1].sendContent
								dom.getComponentRect(this.$refs[refName], resDom => {
									console.log(resDom)
									// 100 是导航栏高度 
									if (resDom.size.bottom < 100) {
										console.log('超过一屏')
										this.isScrollerFlex = true
										if(!this.keyboardHeightFlg) {
											this.isLoadmore = true
										}
									} else {
										this.isScrollerFlex = false
										console.log('不够一屏')
									}
								})
							} else {
								// console.log('222')
								let refName = this.rows[0].sendContent
								dom.getComponentRect(this.$refs[refName][0], resDom => {
									let rowsDomB = resDom.size.bottom
									// console.log(scrollerDomH,rowsDomB)
									if((scrollerDomH - rowsDomB) < 20) {
										console.log('超过一屏')
										this.isScrollerFlex = true
										if(!this.keyboardHeightFlg) {
											this.isLoadmore = true
										}
									} else {
										this.isScrollerFlex = false
										console.log('不够一屏')
									}
								})
							}
							
						})
					})
				}, 60)
			},
			hideTips() {
				this.showTips = null

			},
			msgLongpress(item, index) {
				console.log(index)
				this.showTips = index
			},
			scrollData(e) {
				this.scrollHeight = e.contentSize.height
				console.log(this.scrollHeight)
			},
			loadmore() {
				console.log(333)
				this.$emit('loadmore')
			},
			onrefresh() {
				let doms = this.rows[0].name
				console.log(doms)
				console.log('下拉')
				let list = []
				for (let i = 0; i < 30; i++) {
					list.push({
						name: 'row' + (i + 100),
						id: 1,
						type: 0
					})
				}
				console.log(list)
				this.rows = [...list, ...this.rows]
				this.$nextTick(() => {
					let el = this.$refs[doms][0]
					console.log(el)
					dom.scrollToElement(el, {
						offset: 0,
						animated: false
					})
					console.log(111111)
				})
			},
			// 播放语音
			payAudio(item,index) {
				console.log(item)
				if(this.payAudioIndex == index) {
					innerAudioContext.src = '';
					this.$nextTick(function() {
						innerAudioContext.stop();
						this.payAudioIndex = null
					});
				} else {
					this.payAudioIndex = index
					console.log(item)
					innerAudioContext.src = item.sendContent
					this.$nextTick(function() {
						innerAudioContext.play();
					});
				}
			},
			// 查看图片
			viewImg(url) {
				uni.previewImage({
					urls: [url]
				})
			},
			// 滚动到底部
			async scrollerBottom() {
				const el = this.$refs.rowTop
				if( this.isLoadmore) {
					//加入列队
					setTimeout(() => {
						dom.scrollToElement(el, {
							offset: 0,
						})
					}, 60)
				}
			},
			//消息的复制撤回
			cliList(type,item,index){
				// type 1复制 2撤回
				if(type == 1){
					uni.setClipboardData({
					    data: item.sendContent,
					    success: function () {
					        console.log('success');
					    }
					});
				}else{
					api.get('chat/revokeChat/'+item.id).then(res=>{
						console.log(res,item.id)
						if(res.flag){
							this.rows[index].chatState = 2
						}
					})
				}
			},
			// 进主页
			go_master(e){
				console.log(e)
				uni.navigateTo({ 
					url:'../my/master_page?id='+e,
					animationType:'slide-in-right' 
				})
			}
		}
	}
</script>

<style>
	.scroller {
		flex: 1;margin-top: 130rpx;
		direction: rtl;
		min-height: 100%;transform:rotate(180deg);
		-ms-transform:rotate(180deg);
		-moz-transform:rotate(180deg);
		-webkit-transform:rotate(180deg);
		-o-transform:rotate(180deg);
		/* justify-content: flex-end; */
		/* justify-content: flex-start; */
		background-color: #F1F1F1;
	}
	.flex1 {
		flex: 1;
	}
	.row {
		padding-top: 10rpx;
		position: relative;
		flex-direction: column;
	}
	.row_top {
		height: 1rpx;
	}

	.time_box {
		height: 37rpx;
		margin-bottom: 30rpx;
		align-items: center;
		justify-content: center;
	}

	.time_text {
		color: #999999;
		font-size: 26rpx;
	}
	.chehui{
		width: 750rpx;text-align: center;
		font-size: 30rpx;
		color: #999;
	}
	.row_box {
		width: 750rpx;
		text-align: left;
		flex-direction: row !important;
		margin-bottom: 30rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}

/* 	.flex_end {
		direction:  rtl;
	}
.flex_start {
	direction: ltr;
	} */
	.avatar_box {
		width: 74rpx;
		height: 74rpx;
		border-radius: 6rpx;
	}

	.content_text_box {
		padding-left: 20rpx;
		padding-right: 20rpx;
		border-radius: 6rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		padding-bottom: 17rpx;
		padding-top: 17rpx;
		background-color: #FFFFFF;
	}
	.audio_box {
		flex-direction: row !important;
		align-items: center;
		padding-left: 20rpx;
		padding-right: 20rpx;
		border-radius: 6rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		padding-bottom: 17rpx;
		padding-top: 17rpx;
		background-color: #FFFFFF;
	}

	.content_box {
		text-align: left;
	}


	.content_img {
		width: 300rpx;
		margin-left: 15rpx;
		margin-right: 15rpx;
		border-radius: 6rpx;
	}


	.tips_box {
		position: absolute;
		flex-direction: row;
		top: 0;
		background-color: #555555;
		border-radius: 15rpx;
	}

	.tips_left {
		left: 120rpx;
	}

	.tips_right {
		right: 120rpx;
	}

	.tips_text {
		font-size: 30rpx;
		width: 100rpx;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		text-align: center;
		color: #FFFFFF;
	}
	.content_box_color {
		text-align: left;
		background-color: #C2C5F5;
	}
	.tal {
		text-align: left;
	}
	.audio_img {
		width: 50rpx;
		height: 50rpx;
		margin-left: 5rpx;
		margin-right: 5rpx;
		transform:rotate(180deg);
	}
</style>
