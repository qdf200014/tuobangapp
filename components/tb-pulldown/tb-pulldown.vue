<template>
	<view class="pages">
		 <scroll-view style="height: 100vh;"  :refresher-enabled="refreshT" :refresher-triggered="triggered"
			:refresher-background="bgcolor" 
			refresher-default-style="block" :refresher-threshold="60"
			@refresherpulling="onPulling" 
			@refresherrefresh="onRefresh" 
			@refresherrestore="onRestore" 
			@refresherabort="onAbort" 
			>
			
			<!-- <view class="pullsty" v-if="xiala"
			:style="{'background-color':bgcolor,'color':textcolor}" >
				{{textC}}
			</view> -->
			<slot name="waib"></slot>
			<scroll-view style="height: 100vh;" :scroll-y="scrollY" @scrolltolower="pulldown" @scrolltoupper="scrolltoupper">
				<slot name="detail"></slot>
				<view class="loadmore" v-if="pullshow">
					
					<view class="loadf">
						<text v-if="status === 'loading'" style="margin-right: 20rpx;">
							<u-loading mode="circle" size="40" color="red" ></u-loading>
						</text>
						{{ status === 'more' ? contentText.contentdown : status === 'loading' ? contentText.contentrefresh : contentText.contentnomore }}
					</view>
				</view>
			</scroll-view>
			
		</scroll-view>
	</view>
</template>


<script>
    export default {
        data() {
            return {
                triggered: true,
				textC:'',
				xiala:false,
				lineheight:0,
				
            }
        },
		props:{
			// 滑动背景色
			bgcolor:{
				default:'#fff'
			},
			//是否展示加载更多文字
			pullshow:{
				default:true
			},
			//下拉加载文字
			textcolor:{
				default:'#fff'
			},
			//是否可以滑动
			scrollY:{
				default:true
			},
			status: {
				// 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
				type: String,
				default: 'more'
			},
			contentText: {
				type: Object,
				default () {
					return {
						contentdown: '查看更多',
						contentrefresh: '加载中~',
						contentnomore: '没有更多了'
					}
				}
			},
			// 是否可以下拉刷新
			refreshT:{
				default:true
			}
		},
        onLoad() {
            this._freshing = false;
           
        },
        methods: {
			//下拉中
            onPulling(e) {
				// console.log(e.detail.deltaY )
				
				if(e.detail.deltaY > 60){
					this.textC = "松开刷新"
					this.xiala = true
				}else if(e.detail.deltaY > 35 && e.detail.deltaY < 50){
					this.textC = "↓下拉刷新" 
					this.xiala = true
					
				}else if(e.detail.deltaY < 10){
					this.xiala = false
				}
				
				
            },
			//下拉松开
            onRefresh(){
                if (this._freshing) return;
                this._freshing = true;
				this.textC = "正在刷新"
				
				setTimeout(() => {
					this.textC = "已刷新"
					
				}, 1500)
                setTimeout(() => {
                    this.triggered = false;
                    this._freshing = false;
					this.xiala = false
					
                }, 2000)
				this.$emit("onRefresh")
            },
            onRestore() {
                this.triggered = 'restore'; // 需要重置
				this.xiala = false
                // console.log("onRestore");
            },
            onAbort() {
				this.xiala = false
                // console.log("onAbort");
            },
			//加载更多
			pulldown(e){
				this.$emit('pulldown')
			},
			// 滚动顶部
			scrolltoupper(){
				this.$emit('scrolltoupper')
			}
        }
    }
</script>

<style lang="scss" scoped>
	$color: var(--color);
.loadmore{
	width: 100%;padding: 20rpx 0;text-align: center;
	.loadf{
		color: #999;
	}

}

.pullsty{
	width: 100%;text-align: center;
	color: #fff;max-height: 60rpx;
	transition: all 0.3s;
}

	/* 动画 */
	.animation {
		width: 100%;
		height: 100rpx;
		.remind {
			width: 100%;
			height: 100rpx;
			text-align: center;
			line-height: 100rpx;
		}
		.refresh {
			width: 100%;
			height: 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			view {
				// animation-play-state: $playState!important;
			}
		}
		
	
		/* swappingSquares */
		.swapping-squares-spinner {
		  position: relative;
		}
		.swapping-squares-spinner .square {
		  height: calc(65rpx * 0.25 / 1.3);
		  width:  calc(65rpx * 0.25 / 1.3);
		  animation-duration: 1000ms;
		  border: calc(65rpx * 0.04 / 1.3) solid $color;
		  margin-right: auto;
		  margin-left: auto;
		  position: absolute;
		  animation-iteration-count: infinite;
		}
		.swapping-squares-spinner .square:nth-child(1) {
		  animation-name: swappingSquares-child-1;
		  animation-delay: 500ms;
		}
		.swapping-squares-spinner .square:nth-child(2) {
		  animation-name: swappingSquares-child-2;
		  animation-delay: 0ms;
		}
		.swapping-squares-spinner .square:nth-child(3) {
		  animation-name: swappingSquares-child-3;
		  animation-delay: 500ms;
		}
		.swapping-squares-spinner .square:nth-child(4) {
		  animation-name: swappingSquares-child-4;
		  animation-delay: 0ms;
		}
		@keyframes swappingSquares-child-1 {
		  50% {
			transform: translate(150%,150%) scale(2,2);
		  }
		}
		@keyframes swappingSquares-child-2 {
		  50% {
			transform: translate(-150%,150%) scale(2,2);
		  }
		}
		@keyframes swappingSquares-child-3 {
		  50% {
			transform: translate(-150%,-150%) scale(2,2);
		  }
		}
		@keyframes swappingSquares-child-4 {
		  50% {
			transform: translate(150%,-150%) scale(2,2);
		  }
		}
	}
</style>
