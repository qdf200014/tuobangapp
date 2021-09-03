<template>
	<view style="margin-bottom: 240rpx;">
		<!-- 待帮 -->
		<view class="title_line">
			<view class="title_line_r">
				<view class="tit_left">
					<view  @click="show = true"> {{shaiText}} <u-icon name='arrow-down-fill'></u-icon> </view>
					<view style="margin-left: 20rpx;" @click="priceshow = true">条件筛选 <u-icon name='list-dot'></u-icon> </view>
				</view>
				<view @click="go_map">地图</view>
			</view>
		</view>
		<view class="task_list" v-for="(it,index) in datas" :key="index" @click="go_detail(it.bzUuid)">
			<view style="display: flex;">
				<view class="task_list_left">
					<image class="task_list_left_img" :src="it.photo" mode="aspectFill"></image>
				</view>
				<view class="task_list_right">
					<text class="task_list_right_tit">{{it.jianjie}}</text>
					<view class="task_list_right_address">
						<view class="task_list_left_userinfo norow">
							<image class="left_userinfo_img" :src="it.img" mode="aspectFill"></image>
							<text class="left_userinfo_text">{{it.bkName}}</text>
						</view>
						<text class="right_address_jl">{{it.distance < 1 ? it.distance * 1000 + 'm' : it.distance + 'km'}}</text>
					</view>
				</view>
			</view>
			
			<view class="reward_king">
				<view class="king_left">
					<text>酬金：{{it.price != 0 ?'￥'+it.price + '元' : '无偿帮助' }}</text>
					
				</view>
				<view class="king_right" @click.stop="gochat(it)" v-if="it.ryId != userId">
					<u-icon name="chat" size="40"></u-icon>
					<text>联系帮客</text>
				</view>
			</view>
		</view>
		<view class="nogd" v-if="jiaz"> 没有更多了</view>
		<!-- 排序弹框 -->
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
				<view class="button">
					<view class="but_l" @click="reset">重置</view>
					<view class="but_r" @click="priceConfirm">确定</view>
				</view>
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
				show:false,
				priceshow:false,
				lowprice:'',
				tallprice:'',
				shaiText:'排序',
				paixInd:0,
				popList:[
					{name:'距离正序',type:2},
					{name:'时间正序',type:1},
					{name:'时间倒序',type:0},
					{name:'价格正序',type:3},
					{name:'价格倒序',type:4}
				],
				
			}
		},
		props:{
			datas:{},
			userId:{},
			jiaz:{
				default:false
			}
		},
		methods: {
			go_detail(e){
				this.$emit('go_detail',e)
			},
			reset(){
				this.lowprice = ''  //最低价
				this.tallprice = ''  //最高价
			},
			priceConfirm(){
				let arr = {
					priceFilter:[this.lowprice,this.tallprice],
				}
				this.priceshow = false
				if(this.tallprice > this.lowprice){
					this.$emit('priceConfirmC',arr)
				}
			},
			inpBlue(e){
				console.log(e)
				if(this.tallprice < this.lowprice){
					this.tallprice = ''
					this.com.msg('不能小于最低价')
				}
			},
			//排序
			popCli(it){
				this.shaiText = it.name
				this.paixInd = it.type
				this.show = false
				this.$emit('popCliC',it.type)
			},
			//地图
			go_map(){
				this.$emit('go_map')
			},
			//聊天
			gochat(e){
				this.$emit('gochaC',e)
			},
		}
	}
</script> 

<style scoped lang="scss">
.nogd{
	text-align: center;
}
	.pricepop{
		padding: 35rpx;
		.inps{
			display: flex;margin: 20rpx 0;
			input{
				background-color: #f4f5f6;
				width: 220rpx;border-radius: 50rpx;
				font-size: 28rpx;padding: 10rpx 20rpx;
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
	.pops{
		width: 100%;padding: 25rpx;
		display: flex;justify-content: space-between;
		.active{
			font-weight: bold;
		}
	}
.title_line{
	display: flex;padding: 0 4%;
	.title_line_r{
		width: 100%;line-height: 86rpx;
		display: flex;justify-content: space-between;
		.tit_left{
			display: flex;
		}
	}
}
//待帮
.task_list {
	width: 100%;
	// height: 300rpx;
	background-color: white; 
	margin-bottom: 26rpx;
	border-radius: 20rpx;
	padding: 30rpx 25rpx;
	.reward_king{
		display: flex;justify-content: space-between;border-top: 1rpx solid #eee;padding-top: 20rpx;
		.king_left{
			text{
				color: red;
			}
		}
		.king_right{
			display: flex;border: 1rpx solid #ffa800;border-radius: 50rpx;padding: 4rpx 10rpx;
			color: #ffa800;
			text{
				margin-left: 15rpx;
			}
		}
	}
	
	.task_list_left {
		width: 180rpx;
	}
	.task_list_left_img {
		width: 160rpx;
		height: 160rpx;margin-bottom: 20rpx;
		border-radius: 20rpx;
	}
	.task_list_left_userinfo{
		display: flex;width: 280rpx;
		.left_userinfo_img{
			width: 60rpx;height: 60rpx;margin-right: 14rpx;border-radius: 50%;
		} 
		.left_userinfo_text{
			font-size: 30rpx;line-height: 60rpx;color: #a3a3a3;
			white-space: nowrap;
		}
	}
	
	.task_list_right {
		width: 450rpx;
	}
	.task_list_right_tit{
		height: 100rpx;
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
		color: red;font-size: 28rpx;line-height: 56rpx;
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
