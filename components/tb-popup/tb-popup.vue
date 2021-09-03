<template>
	<view class="page">
		<view class="popup" :style="{height:height+'rpx',}" @touchstart.stop.prevent="touchstart" @touchmove="touchmove"  @touchend="touchend ">
			1
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			height:{
				default:"900"
			}
		},
		methods: {
			//滑动开始
			touchstart(e){
				console.log(e)
			},
			// 滑动中
			touchmove(e){
				console.log(e)
			},
			//滑动结束
			 touchend: function(event) {
                console.log("滑动结束",event);
				
                const endTime = Date.now();
                const endX = event.changedTouches[0].clientX;
                const endY = event.changedTouches[0].clientY;

                //判断按下的时间 时间太长表示不是滑动
                if (endTime - this.startTime > 2000) {
                    return;
                }
                //滑动方向
                let direction = "";
                //判断滑动的距离 这里超过10算滑动
                if (Math.abs(endX - this.startX) > 10) {
                    //判断方向
                    direction = endX - this.startX > 0 ? "right" : "left";
                } else {
                    return;
                }
                
                this.$emit("swiperAction",{direction});

            },
		}
	}
</script>

<style lang="scss" scoped>
.page{
	position: fixed;left: 0;top: 0;
	width: 100%;height: 100vh;
	background-color: rgba(0,0,0,0.2);
	
	.popup{
		width: 100%;
		background-color: #fff;position: absolute;left: 0;bottom: 0;
	}
}
</style>
