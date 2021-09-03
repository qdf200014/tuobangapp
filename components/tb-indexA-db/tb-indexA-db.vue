<template>
	<view class="pagesty">
		<view class="title_line">
			<view >
				<tb-title style="width: 150rpx;" title="待帮助" ></tb-title>
			</view>
			<view class="title_line_r">
				<view class="tit_left">
					<view  @click="show = true"> {{shaiText}} <u-icon name='arrow-down-fill'></u-icon> </view>
					<view style="margin-left: 20rpx;" @click="priceshow = true">条件筛选 <u-icon name='list-dot'></u-icon> </view>
				</view>
				<view class="address" @click="go_map"> <u-icon name="map"></u-icon> 地图</view>
			</view>
		</view>
		<view class="task_list" v-for="(it,index) in datas" :key="index" @click="go_detail(it.bzUuid)">
			<view class="task_list_top">
				<view class="task_list_left">
					<image class="task_list_left_img" :src="it.photo" mode="aspectFill"></image>
				</view> 
				<view class="task_list_right">
					<text class="task_list_right_tit">{{it.jianjie}}</text>
					<view class="task_list_right_address">
						<view class="task_list_left_userinfo">
							<image class="left_userinfo_img" :src="it.img" mode="aspectFill"></image>
							<text class="left_userinfo_text">{{it.bkName}}</text>
							<text class="right_address_jl" v-show="it.distance">{{it.distance < 1 ? it.distance * 1000 + 'm' : it.distance + 'km'}}</text>
						</view>
						<view style="color: red;font-weight: bold;">
							{{it.price != 0 ?'￥'+it.price + '元' : '无偿帮助' }}
						</view>
					</view>
				</view>
			</view>
			<image  class="tiaozi" src="../../static/index/xiantiao.png" mode=""></image>
		</view>
		<!-- 弹框 -->
		<u-popup v-model="show" mode="top" border-radius="20">
			<view class="pops" v-for="(it,index) in popList" :key="index" @click="popCli(it)">
				<view :class="{active:it.type == paixInd}">
					{{it.name}}
				</view>
				<view v-if="it.type == paixInd">
					<u-icon name="checkbox-mark" ></u-icon>
				</view>
			</view>
		</u-popup>
		<!-- 价格 -->
		<u-popup v-model="priceshow" mode="top" border-radius="20">
			<view class="pricepop">
				<view class="price_title">价格</view>
				<view class="inps">
					<input type="number" v-model="lowprice" placeholder="最低价">
					<text style="line-height: 58rpx;margin: 0 10rpx;">—</text>
					<input type="number" v-model="tallprice" placeholder="最高价" @blur="inpBlue">
				</view>
				<view class="price_title">帮助方式</view>
				<view class="inps">
					<view class="xians" :class="{act:bztype == it.type}" v-for="(it,ind) in bztypeList" :key="ind" @click="bztyCli(it.type)">{{it.name}}</view>
				</view>
				<view class="button">
					<view class="but_l" @click="reset">重置</view>
					<view class="but_r" @click="priceConfirm">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shaiText:'时间倒序',
				show:false,
				priceshow:false,
				popList:[
					{name:'距离正序',type:2},
					{name:'时间正序',type:1},
					{name:'时间倒序',type:0},
					{name:'价格正序',type:3},
					{name:'价格倒序',type:4}
				],
				lowprice:'',//最低价
				tallprice:'',//最高价
				bztypeList:[
					{name:'线上',type:0},
					{name:'线下',type:1},
					{name:'不限',type:2}
				],
				bztype:2
			}
		},
		props:{
			datas:{},
			paixInd:{},
		},
		methods: {
			bztyCli(e){
				this.bztype = e
			},
			// 重置
			reset(){
				this.lowprice = ''  //最低价
				this.tallprice = ''  //最高价
			},
			go_detail(e){
				this.$emit('go_detail',e)
			},
			go_map(){
				this.$emit('go_map')
			},
			//点击
			popCli(it){
				this.shaiText = it.name
				this.$emit('popCli',it)
				this.show = false
			},
			// 最高价失去焦点
			inpBlue(e){
				if(e.detail.value < this.lowprice){
					this.tallprice = ''
					this.com.msg('不能小于最低价')
				}
			},
			// 确定
			priceConfirm(){
				if(this.tallprice < this.lowprice){
					this.tallprice = ''
					this.com.msg('不能小于最低价')
				}else{
					this.priceshow = false
					let arr = {
						lowprice:this.lowprice,
						tallprice:this.tallprice,
						bztype:this.bztype
					}
					this.$emit('priceConfirm',arr)
				}
			},
			// ycang(){
			// 	console.log(1)
			// 	this.priceshow = false
			// 	this.show = false
			// 	this.$emit('yc')
			// }
		}
	}
</script>

<style>
	page{
		background-color: #F6F6F6;
	}
</style>
<style scoped lang="scss">
	.pops{
		width: 100%;padding: 25rpx;
		display: flex;justify-content: space-between;
		.active{
			font-weight: bold;
		}
	}
	.pricepop{
		padding: 35rpx;
		.inps{
			display: flex;margin: 20rpx 0 50rpx 0;
			input{
				background-color: #f4f5f6;
				width: 220rpx;border-radius: 50rpx;
				font-size: 28rpx;padding: 10rpx 20rpx;
			}
			.xians{
				background-color: #F5F5F5;border-radius: 50rpx;
				margin: 2rpx 20rpx;padding: 2rpx 26rpx;
				
			}
			.act{
				background-color: #f30a06;color: #fff;
			}
		}
		.button{
			width: 100%;
			display: flex;justify-content: space-between;
			view{
				width: 48%;text-align: center;
				padding: 14rpx 0;border-radius: 50rpx;
			}
			.but_l{
				border: 1rpx solid #999;
			}
			.but_r{
				color: white;background-color: red;
			}
		}
		
	}
	.title_line{
		display: flex;padding: 0 3%;
		.title_line_r{
			width: 80%;line-height: 86rpx;
			display: flex;justify-content: space-between;
			.address{
				display: flex;
			}
			.tit_left{
				display: flex;
			}
		}
	}
//待帮
.task_list {
	width: 100%;
	// height: 300rpx;
	// background-color: pink;
	margin: 50rpx 0;
	padding: 0 30rpx;
	position: relative;
	.tiaozi{
		width: 94%;height: 10rpx;position: absolute;left: 3%;bottom: -20rpx;
	}
	.task_list_top{
		display: flex;
	}
	.task_list_left {
		width: 200rpx;
	}
	.task_list_left_img {
		width: 160rpx;
		height: 160rpx;margin-bottom: 20rpx;
		border-radius: 26rpx;
	}
	.task_list_left_userinfo{
		display: flex;
		
		.left_userinfo_img{
			width: 54rpx;height: 54rpx;border-radius: 50%;
		} 
		.left_userinfo_text{
			margin: 0 10rpx;
			width: 150rpx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
			font-size: 30rpx;line-height: 60rpx;color: #a3a3a3;
		}
	}
	
	.task_list_right {
		width: 550rpx;line-height: 60rpx;
	}
	.task_list_right_tit{
		height: 100rpx;font-weight: bold;
		font-size: 34rpx;line-height: 50rpx;display: inline-block;
		
		overflow: hidden; //超出部分隐藏
		-webkit-line-clamp: 2; //只显示两行
		text-overflow: ellipsis; //超出部分显示省略号
		display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
		-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式 纵向
		
	}
	.task_list_right_address{
		margin-top: 10rpx;
		display: flex;flex-direction: row;justify-content: space-between;
	}
	.right_address_jl{
		color: #ff6000;font-size: 28rpx;
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
