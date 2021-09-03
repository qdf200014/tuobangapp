<template>
	<view >
		<view class="Sudoku">
			<view class="SudokuItem" v-for="(it,ind) in lista" :key="ind">
				<image :src="it.img" mode=""></image>
				<view>{{it.name}}</view>
			</view>
			<view class="xian"></view>
		</view>
		<view class="biglogo">
			<image src="../../static/list/biglogo.png" mode=""></image>
		</view>
		<view class="rank">
			<view class="rankL">
				时间正序
			</view>
			<view class="rankR">
				地图
			</view>
		</view>
		<view class="dianp">
			<view class="dpItem" v-for="(it,ind) in shangp" :key="ind" @click="goDetail(it)">
				<view class="img">
					<image :src="it.img" mode=""></image>
				</view>
				<view class="rig">
					<view class="rigTop">
						<view class="rigTopName norow"> {{it.dpname}} </view>
						<view class="distance"> 3km </view>
					</view>
					<view class="synopsis">
						{{it.intro}}
					</view>
					<view class="address">
						{{it.site}}
					</view>
					<view class="rigToptype">
						<view class="rigToptypeItem" v-for="(its,ind) in it.label" :key="ind">
							{{its}}
						</view>
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
				
			};
		},
		props:{
			lista:{},
			shangp:{}
		},
		methods:{
			goDetail(e){
				this.com.navto('../../pages/list/shangquan/sq_Detail?id='+e)
			}
		}
	}
</script>

<style lang="scss" scoped>
.Sudoku{
	width: 100%;padding: 3% 0;
	display: flex;flex-wrap: wrap;
	.SudokuItem{
		width: 20%;text-align: center;margin: 10rpx 0;
		image{
			width: 76rpx;height: 76rpx;
		}
	}
	.xian{
		margin: 15rpx 3%; 
		width: 100%; height: 4rpx;border-top: 0.5px solid #eee;border-bottom: 0.5px solid #eee;
	}
}
.biglogo{
	width: 100%;height: 220rpx;padding:0 2%;
	image{
		width: 100%;height: 220rpx;
	}
}
.rank{
	display: flex;justify-content: space-between;
	padding: 0 2%;margin: 26rpx 0;
	font-size: 30rpx;
}
.dianp{
	width: 100%;
	.dpItem{
		width: 100%;display: flex;
		padding: 0 2%;margin: 13rpx 0;
		.img{
			width: 33%;
			image{
				width: 220rpx;height: 160rpx;
			}
		}
		.rig{
			width: 67%;
			.rigTop{
				display: flex;
				.rigTopName{
					width: 380rpx;font-size: 32rpx;
				}
				.distance{
					color: #ff0101;
				}
			}
			.synopsis{
				margin: 15rpx 0;
				line-height: 40rpx;color: #666;
				
				overflow: hidden; //超出部分隐藏
				-webkit-line-clamp: 2; //只显示两行
				text-overflow: ellipsis; //超出部分显示省略号
				display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
				-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式 纵向
			}
			.address{
				font-size: 24rpx;
			}
			.rigToptype{
				display: flex;color: #999;
				.rigToptypeItem{
					margin: 10rpx;border: 0.5px solid #999;padding: 0 15rpx;border-radius: 50rpx;
				}
			}
		}
	}
}
</style>
