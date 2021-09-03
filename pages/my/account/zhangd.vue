<template>
	<view >
		<view class="top">
			<view class="topTime" @click="timeshow = true">
				{{time}}
				<u-icon name="arrow-down" ></u-icon>
			</view>
			<view class="topTime" @click="selectShow1 = true">
				分类
				<u-icon name="arrow-down" ></u-icon>
			</view>
		</view>
		<!-- 内容 -->
		<view class="cont">
			 <view class="items" v-for="(item,index) in billList" :key="index">
				 <view class="itemTop">
					 <view class="topYue"> 
						<text class="num" >{{item.total.month.slice(5,7)}}</text>
						<text class="zi">月</text>
					</view>
					 <view class="topPrice">
						<view class="jizhang">
							<text>支出</text>
							<text class="pricenum">
								￥{{item.total.monthlyExpenditure || 0}}
							</text>
						</view>
						<view class="jizhang">
							<text>收入</text>
							<text class="pricenum">
								 ￥{{item.total.monthlyIncome}}
							</text>
						</view>
					 </view>
				 </view>
				 <!-- 循环 -->
				<view class="jyItem" v-for="(it,ind) in item.info" :key="ind" @click="go_it(it.id)">
					<view class="jytop">
						<view class="tops">
							 {{it.payCategory == 0 ? '求助' : it.payCategory == 1 ? '帮助' :'提现'}}
						</view>
						<view class="tops">
							 {{it.payClass == 0 ? '' : '+'}}{{it.price}}
						</view>
					</view>
					<view class="jytop">
						<view class="but">
							{{it.time}}
						</view>
						<view class="but" v-if="it.payClass == 2">
						 	退款
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="wu" v-if="pageshow">
			<text v-if="loagind == 'log'" style="margin-right: 20rpx;">
				<u-loading mode="circle" size="40" color="red" ></u-loading>
			</text>
			{{loagind == 'log' ? '加载中' : '暂无更多'}}
		</view>
		<u-picker mode="time" v-model="timeshow" :params="params" @confirm="timeOk"></u-picker>
		<u-select v-model="selectShow1" cancel-text="不限制" :list="list1" @confirm="confirm1" @cancel="cancelCli(1)"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				time:new Date().toISOString().slice(0, 7),
				timeshow:false,
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				list1:[
					{value: '1',label: '求助'}, 
					{value: '2',label: '帮助'},
					{value: '2',label: '提现'}
				],
				selectShow1:false,
				billList:[],//账单列表
				page:1,
				pageshow:true,//加载更多
				loagind:''
			}
		},
		onLoad() {
			this.pageData(this.page)
		},
		onReachBottom() {
			this.loagind = 'log'
			// this.time = 
			this.page ++
			this.pageData(this.page)
		},
		methods: {
			pageData(e){
				this.api.get('hsTransaction/viewTransactionDetails',{
					transactionHour:this.time,
					page:e,
				}).then(res=>{
					console.log(res)
					if(res.flag){
						if(res.message == '暂无明细'){
							this.loagind = 'no'
							this.pageshow = true
						}
						let arr = []
						if(this.billList.length == 0){
							this.billList = this.billList.concat(res.data)
						}else{
							var timeTwo = this.billList[this.billList.length - 1].total.month
							this.billList.forEach((a,ind)=>{
								res.data.forEach((b,index)=>{
									if(a.total.month == b.total.month){
										if(this.billList[ind].info && res.data[index].info){
											// console.log(this.billList[ind].info)
											// console.log(res.data[index].info)
											// console.log(this.billList[ind].info.concat(res.data[index].info))
											this.billList[ind].info = this.billList[ind].info.concat(res.data[index].info)
											console.log(this.billList)
										}
									}else if(this.billList[this.billList.length - 1].total.month > b.total.month){
										this.billList = this.billList.concat(b)
										return false
									}
								})
							})
						}
						
					}
				})
			},
			timeOk(e){
				console.log(e)
				this.time = e.year + '-' + e.month
				this.page = 1
				this.billList = []
				this.pageData(this.page)
				
			},
			//交易详情
			go_it(e){
				this.com.navto('./zhangdDetail?id='+e)
			}
		}
	}
</script>

<style>
page{
	background-color: #F8F8F8;
}
</style>
<style lang="scss" scoped >
.top{
	width: 100%;padding: 3%;
	display: flex;
	.topTime{
		margin-right: 20rpx;
	}	
}
.cont{
	.items{
		width: 100%;
		margin-bottom: 26rpx;background-color: #fff;padding: 3% 3% 0 3%;	
		.itemTop{
			border-bottom: 0.5rpx solid #eee;padding-bottom: 26rpx;
			.topYue{
				font-weight: bold;display: flex;
				.num{
					font-size: 50rpx;margin-right: 40rpx;
				}
				.zi{
					margin-top: 18rpx;
				}
			}
			.topPrice{
				display: flex;margin-top: 20rpx;
				.jizhang{
					margin-right: 20rpx;
					.pricenum{
						font-weight: bold;
					}
				}
			}
		}
		.jyItem{
			width: 100%;padding: 4% 0;
			.jytop{
				display: flex;justify-content: space-between;margin: 10rpx 0;
				.tops{
					font-size: 34rpx;font-weight: bold;
				}
				.but{
					color: #C8C7CC;
				}
			}
		}
	}
	
}
.wu{
	width: 100%;text-align: center;color: #999;line-height: 44rpx;
}
</style>
