<template>
	<view>
		<view class="fanhui" @click="gotopage">
			<u-icon name="arrow-left" size="48"></u-icon>
		</view>
		<view class="head">
		
			<view class="text" v-if="false">
				截至12月30日前20位帮主
				<view>
					海南岛七日免费游
				</view>
			</view>
		</view>
		<view class="conts">
			<view class="items redius26 marTop" v-for="(it,ind) in seniority" :key="ind">
				<view class="paiming" 
				:style="{'background-size': '100% 100%','background-image':ind < 5? 'url(../../../static/index/paihang/paimingfive.png)' : 'url(../../../static/index/paihang/four.png)',
				color:ind < 5 ? '#000' : '#fff'}">
					 {{ind + 1}}
				</view>
				<view class="itemsLeft">
					<view class="images" @click="go_zhuy(it.ryUuid)">
						<image :src="it.img" mode="aspectFill"></image>
					</view>
					<view class="userinfo">
						<view class="name norow" @click="go_zhuy(it.ryUuid)">
							{{it.name}}
						</view>
						<view>
							<u-rate :count="5" v-model="it.averageScore" active-color="#ff8a00" :disabled="true" gutter="0"></u-rate>
						</view>
						<view class="xiangy">
							响应次数 {{it.countResponse || 0}}
						</view>
					</view>
				</view>
				<view class="itemsRig" v-if="it.state == 1" @click="guanzhu(it.ryUuid,ind)">
					关注
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:2,
				page:1,
				district:'',
				seniority:[],
				backgroundColor:''
			}
		},
		onLoad(e) {
			this.district = e.address
			this.pageData(this.page)
		},
		onReachBottom(){
			this.page ++
			this.pageData(this.page)
		},
		methods: {
			pageData(e){
				this.api.get('integral/king/'+0,{
					address:this.district,
					size:10,page:e,
					fid:uni.getStorageSync('userinfo_Data').id
				}).then(res=>{
					console.log(res)
					if(res.flag){
						this.seniority =this.seniority.concat(res.data) 
						if(res.data < 10){
							this.com.msg('到底了')
						}
					}
				})
			},
			// 关注
			guanzhu(e,ind){
				this.api.post('hsFansInfo/addGuanZhu',{uid:e,fid:uni.getStorageSync("userinfo_Data").id}).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.msg(res.message)
						this.seniority[ind].state = 2
					}
				})
			},
			//到主页
			go_zhuy(e){
				this.com.navto('../../my/master_page?id='+e)
			},
			gotopage(){
				uni.navigateBack()
			}
		}
	}
</script>

<style>
	page{
		background-color: #f8f8f8;
	}
</style>
<style scoped lang="scss"> 
.fanhui{
	height: 80rpx;line-height: 80rpx;color: #000;
	position: fixed;top: 80rpx;left: 30rpx;z-index: 999;
}
.head{
	width: 100%;height: 80rpx;
	
	width: 100%;height: 470rpx;
	background: url(../../../static/index/paihang/paihangBg.png);
	background-size: 100% 100%;
	position: relative;
	.text{
		color: #fce4cc;position: absolute;left: 8%;bottom: 100rpx;
	}
}
.conts{
	padding: 0 3% 3% 3%;
	.items{
		width: 100%;
		background-color: #FFFFFF;padding: 3%;
		position: relative;
		display: flex;
		.paiming{
			position: absolute;top: -4rpx;left: 26rpx;
			width: 76rpx;height: 80rpx;line-height: 90rpx;text-align: center;font-weight: bold;
			background-size: 100% 100%;
			z-index: 99;
		}
		.itemsLeft{
			display: flex;
			width: 78%;
			.images{
				margin-left: 50rpx;margin-right: 20rpx;
				width: 128rpx;height: 128rpx;padding: 6rpx;border: 1rpx solid #ca7d47;
				border-radius: 50%;
				image{
					width: 100%;height: 100%;
					border-radius: 50%;
				}
			}
			.userinfo{
				.name{
					width: 280rpx;
					font-size: 34rpx;margin-top: 10rpx;
				}
				.xiangy{
					display: inline-block;border-radius: 50rpx; color:#c28d49;
					background-color: #fef4e8;padding: 0 20rpx 4rpx 20rpx;
				}
			}
		}
		.itemsRig{
			margin-top: 48rpx;margin-left: 20rpx;
			border: 1rpx solid #c2c2c2;border-radius: 50rpx;
			height: 44rpx;line-height: 40rpx; padding: 0 30rpx;
		}
	}
}
</style>
