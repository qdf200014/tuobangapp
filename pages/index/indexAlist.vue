<template>
	<view>
		<tb-pulldown bgcolor="#f5f5f5" textcolor="#000" :scrollY="true" @onRefresh="onRefresh" @pulldown="pulldown"
		:status="status" :content-text="contentText">
			<view slot="detail" style="position: relative;">
				<view>
					<tb-indexA-db :paixInd="paixInd" @go_detail="goDetail" @yc="yc" @go_map="go_map" @popCli="popCli"
					 :datas="pageList" @priceConfirm="priceConfirm"></tb-indexA-db>
				</view>
			</view>
		</tb-pulldown>
	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navValue:'',
				addresscont:'',//地址经纬度
				isUrgent:0,//是否是加急列表 0-不加急 1-加急
				pages:1,
				pageList:[],//数据
				district:'',
				show:false,
				paixInd:0,
				priceshow:false,//价格
				lowprice:'',//最低价
				tallprice:'',//最高价
				status: 'more',
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中~',
					contentnomore: '没有更多了'
				},
				bzType:2
			}
		},
		onNavigationBarButtonTap() {
			this.pageList = []
			this.pageData(this.pages)
		},
		onNavigationBarSearchInputChanged(e) {
			this.navValue = e.text
		},
		//用户点击软键盘上的“搜索”按钮时触发。
		onNavigationBarSearchInputConfirmed	(){
			this.pageList = []
			this.pageData(this.pages)
		},
		onShow() {
			
		},
		onLoad(e) {
			this.district = e.address
			var that = this;
			uni.getLocation({
				type: 'wgs84',
				geocode: true, //必写项
				success: data => {
					console.log(data);
					if (data.address) {
						that.addresscont = data;
						if(that.addresscont){
							that.pageData(that.pages)
						}
					}
				}
			});
			
		},
		methods: {
			// 下拉刷新
			onRefresh(){
				this.pageList = []
				this.pages = 1
				this.pageData(this.pages)
			},
			//加载中
			pulldown(){
				this.status = 'loading'
				this.pages++
				this.pageData(this.pages)
			},
			pageData(e){
				let pri = {
					 priceFilter:[this.lowprice,this.tallprice]
				}
				this.api.post('help/list',{
					page:e,
					size:10,
					isUrgent:this.isUrgent,
					longitude: this.addresscont.longitude,
					latitude: this.addresscont.latitude,
					keyword:this.navValue,
					sort:this.paixInd,
					address:this.district,
					filter:pri,
					bzType:this.bzType
				}).then(res=>{
					console.log(res)
					this.pageList = this.pageList.concat(res.data)
					if(e != 1){
						if(res.data.length < 10){
							this.status = 'noMore'
						}
					}
				})
			},
		
			// 确定
			priceConfirm(di,gao){
				this.bzType = e.bztype
				this.lowprice = e.lowprice//最低价
				this.tallprice = e.tallprice//最高价
				this.pageList = []
				this.pages = 1
				this.pageData(this.pages)
			},
			// 到详情
			goDetail(e){
				this.com.navto('./task_detail?id='+e)
			},
			//点击
			popCli(it){
				this.pageList = []
				this.paixInd = it.type
				this.pages = 1
				this.pageData(this.pages)
			},
			//到地图
			go_map(){
				this.com.navto('./map_page?data='+JSON.stringify(this.pageList)+'&longitude='+this.addresscont.longitude+'&latitude='+this.addresscont.latitude)
			},
		}
	}
</script>

<style scoped lang="scss">
	.pricepop{
		padding: 35rpx;background-color: #eef3f6;
		.inps{
			display: flex;margin: 20rpx 0 100rpx 0;
			input{
				background-color: #fff;
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
</style>
