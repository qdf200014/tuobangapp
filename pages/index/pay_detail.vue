<template>
	<view>
		<view class="bgcol">
			<view class="tips">
				支付剩余时间
				<u-count-down :timestamp="timestamp" bg-color="#f30a06" color="white" 
				separator-color="white" :show-days="false"></u-count-down>
				<view class="price">
					￥{{cont.price}}
				</view>
			</view>
			<view class="orders">
				<view class="orde_detail" @click="go_Detail(cont.bzUuid,cont.type)">
					<view class="detail_img">
						<image :src="cont.photo" mode="aspectFill"></image>
					</view>
					<view class="detail_title">
						{{cont.jianjie}}            
					</view>
				</view>
				<view class="pay">
					<view class="pay_item" v-for="(it,ind) in paylist" :key="ind" @click="check(ind)" >
						<view class="item_left">
							<u-icon :name="it.icon" :color="it.iconCol"size="44"></u-icon>
							<view class="item_left_text">{{it.tit}}</view>
						</view>
						<view>
							<u-checkbox-group @change="check(ind)" size="40">
								<u-checkbox 
									 shape="circle" active-color="#ffc300"
									v-model="it.checked" 
								></u-checkbox>
							</u-checkbox-group>
						</view>
					</view>
					<view class="but">
						<tb-button buttitle="确认支付" bgcolor="#f20100" @but_cli="but_cli"></tb-button>
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
				timestamp:0,
				orderId:0,
				paylist:[
					{
						icon:'zhifubao-circle-fill',
						iconCol:'#20abee',
						tit:'支付宝支付',
						checked:false
					},
					{
						icon:'weixin-fill',
						iconCol:'#4ec66f',
						tit:'微信支付',
						checked:true
					},
					// {
					// 	icon:'rmb-circle-fill',
					// 	iconCol:'#00a0b0',
					// 	tit:'银联支付',
					// 	checked:false
					// }
				],
				cont:'',//内容
				patType:1,//支付类型
				paydan:''
			}
		},
		onLoad(op) {
			console.log(op)
			this.orderId = op.id
			this.pageData()
		},
		methods: {
			pageData(){
				this.api.get('pay/payInfo/'+this.orderId).then(res=>{
					console.log(res)
					if(res.flag){
						this.cont = res.data
					
						let tim = 0
						var times = Date.parse(new Date())
						if(res.data.time - times >=0){
							tim = res.data.time - times
							this.timestamp = Math.floor(tim / 1000)
						}
						//支付单号
						this.api.post('vx/placeTheOrder',{title:res.data.jianjie,total:res.data.price}).then(res=>{
							console.log(res)
							if(res.flag){
								this.paydan = res.data
							}
						})
					}
				})
			},
			
			// 到详情
			go_Detail(e,type){
				if(type == 1){ // 服务
					this.com.navto('../serve_detail/serve_detail?id='+e)
				}else{
					this.com.navto('./task_detail?id='+e)
				}
			},
			check(e){
				console.log(e)
				this.paylist.forEach(i=>{
					i.checked = false
				})
				this.paylist[e].checked = true
				this.patType = e
			},
			// 支付
			but_cli(){
				// this.api.post('pay/pay',{jdUuid:this.orderId}).then(res=>{
				// 	console.log(res)
				// 	this.com.msg(res.data)
					// this.com.redto('../my/list/response_my')
				// })
				if(this.patType == 0){ //支付宝
					if(plus.runtime.isApplicationExist({
						pname: 'com.eg.android.AlipayGphone',  
						action: 'alipay://'  
					})){  
						plus.nativeUI.alert("支付宝已安装");
					}else{  
						plus.nativeUI.alert("支付宝未安装");
					}
				}else if(this.patType == 1){ // 微信
					// wx15162159757604cc0fc98284bc20b00000
					this.api.post('vx/payTheOrder',{
						prepayid:this.paydan.prepayid,
						out_trade_no:this.paydan.out_trade_no,
						jdUuid:this.cont.jdUuid
					}).then(res=>{
						console.log(res)
						let arr = res.data
						uni.requestPayment({
						    provider: 'wxpay',
							orderInfo:{ //微信、支付宝订单数据 【注意微信的订单信息，键值应该全部是小写，不能采用驼峰命名】
								"appid": arr.appid,
								"noncestr": arr.noncestr,
								"package": 'Sign=WXPay', // 固定值，以微信支付文档为主
								"partnerid": arr.partnerid,
								"prepayid": arr.prepayid,
								"timestamp": arr.timestamp,
								"sign": arr.sign // 根据签名算法生成签名
						   }, 
						    success: function (res) {
						        console.log('success:' + JSON.stringify(res));
								uni.navigateBack()
						    },
						    fail: function (err) {
						        console.log('fail:' + JSON.stringify(err));
						    }
						});
					})
				}else{   //银行啦
					
				}
			},
		}
	}
</script>

<style scoped lang="scss">
.bgcol{
	width: 100%;height: 300rpx;padding-top: 40rpx;
	background-image: linear-gradient(#f30a06,#ff8253,#fff);
	.tips{
		text-align: center;
		color: #fff;
		.price{
			font-size: 54rpx;line-height: 100rpx;
		}
	}
	.orders{
		width: 94%;border-radius: 20rpx;background-color: #fff;margin: 3%;
		padding: 4%;
		.orde_detail{
			width: 100%;
			display: flex;justify-content: space-between;
			.detail_img{
				width: 30%;
				image{
					width: 206rpx;height: 160rpx;border-radius: 20rpx;
				}
			}
			.detail_title{
				width: 65%;font-size: 30rpx;line-height: 50rpx;height: 150rpx;
				
				
				-webkit-line-clamp: 3; //只显示两行
				overflow: hidden;
				text-overflow: ellipsis; //超出部分显示省略号
				
				display: -webkit-box; //将对象作为弹性伸缩盒子模型显示
				
				-webkit-box-orient: vertical; //设置或检索伸缩盒对象的子元素的排列方式 纵向
			}
		}
	}
	.pay{
		margin: 60rpx 15rpx;width: 100%;
		.pay_item{
			line-height: 100rpx;border-bottom: 1rpx solid #eee;
			display: flex;justify-content: space-between;
			.item_left{
				display: flex;
				.item_left_text{
					margin-left: 15rpx;
				}
			}
		}
	}
	.but{
		margin-top: 80rpx;
	}
}
</style>
