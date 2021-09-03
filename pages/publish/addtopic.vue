<template>
	<view class="wrap">
		<view class="content" v-if="val == ''">
			<!-- 我的 -->
			<scroll-view class="content_left"  scroll-y scroll-with-animation>
				<view class="left_item" v-for="(item,ind) in leftLsit" :key="ind" @click="leftCli(item.id)">
					<view :class="{active:item.id == leftIndex}">
						{{item.name}}
					</view>
				</view>
			</scroll-view>                                                         
			<!-- 热门推荐 -->
			<scroll-view class="content_right"  scroll-y scroll-with-animation>
				<view class="right_item" v-for="(item,ind) in rightLsit" :key="ind" @click="rightCli(item)">
					<text style="color: #ffe946;margin-right: 20rpx;">#</text> {{item.name}}
				</view>
			</scroll-view>
		</view>
		<!-- 搜索 -->
		<view class="inputK" v-else>
			<view class="" v-if="keywordlist == '' && val != ''">
				<view class="addkeyword" @click="addKword(val)">
					<text style="margin-right: 20rpx;"><u-icon name="plus" size="30"></u-icon></text>{{val}}
					<view class="tips">添加标签</view>
				</view>
			</view>
			<view class="content_right"  v-else>
				<!-- <view class="title" >
					热门推荐
				</view> -->
				<view class="right_item" v-for="(item,ind) in keywordlist" :key="ind" @click="rightCli(item)">
					<text style="color: #ffe946;margin-right: 20rpx;">#</text>
					{{item.name}} 
					<text class="re">热{{item.usageNumber}}</text>
				</view>
			</view>
			
		</view>
		<view class="buttonc" >
			<view class="button_top">
				<view style="border-right: 1rpx solid #C8C7CC;padding-right: 30rpx;white-space: nowrap;">
					已选 {{history.length}}
				</view>
				<view class="topItem">
					<view class="items" v-for="(it,index) in history" :key="index">
						{{it.name}} <text style="margin-left: 15rpx;" @click="del(it,index)"><u-icon name="close"></u-icon></text>
					</view>
				</view>
			</view>
			<view class="button_bot">
				<tb-button buttitle="确定" bgcolor="#F25834" @but_cli="but_cli"></tb-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight + 'px', //导航栏
				leftIndex:0,//左边
				leftLsit:[],//侧边栏
				rightLsit:[],//关键字
				history:[],
				val:'',
				keywordlist:'',//搜索内容
				type: 0,// 1需求 2服务 3个人资料
			}
		},
		onLoad(op) {
			this.type = op.type
			this.pageData()
			if(op.type == 1){
				let arr = uni.getStorageSync('keyword')
				this.history =JSON.parse(arr)
			}else if(op.type == 2){
				let arr = uni.getStorageSync('keywordb')
				this.history =JSON.parse(arr)
			}else{
				let arr = uni.getStorageSync('keywordc')
				this.history =JSON.parse(arr)
			}
			console.log(this.history)
		},
		onNavigationBarSearchInputChanged(e) {
			this.val = e.text
			this.api.get('keyword/getkeyword?keyword='+e.text).then(res=>{
				console.log(res)
				if(res.flag){
					this.keywordlist = res.data
				}
			})
		},
		methods: {
			//删掉
			del(e,ind){
				this.history.splice(ind,1)
				if(this.type == 1){
					uni.setStorage({
						key: 'keyword',
						data: JSON.stringify(this.history)//转换为字符串形式
					})
				}else if(this.type == 2){
					uni.setStorage({
						key: 'keywordb',
						data: JSON.stringify(this.history)//转换为字符串形式
					})
				}else{
					uni.setStorage({
						key: 'keywordc',
						data: JSON.stringify(this.history)//转换为字符串形式
					})
				}
			},
			pageData(){
				this.api.get('keyword/queryKeywordCategory').then(res=>{
					console.log(res)
					if(res.flag){
						this.leftLsit = res.data
						this.leftCli( res.data[0].id)
					}
				})
			},
			//左边
			leftCli(e){
				this.leftIndex = e
				this.api.get('/keyword/getkeyword?id='+e).then(res=>{
					console.log(res)
					if(res.flag){
						this.rightLsit = res.data
					}
				})
			},
			// 右边点击 关键字
			rightCli(e){
				console.log(e)
				let flag = false;
				let ina = 0;
				for (let i = 0; i < this.history.length; i++) {
					if(this.history[i].id == e.id){
						flag = false;
						ina = i;
						break;
					}else{
						flag = true;
					}
				}
				//等于0时候不能循环所以直接加
				if(this.history.length == 0){
					this.history.unshift(e)
				}else{
					if(flag){
						this.history.unshift(e)
					}
				}
				if(this.history.length > 3){
					this.history.pop()
				}
				
			},
			//点击确定
			but_cli(){
				 // 1需求 2服务 3个人资料
				if(this.type == 1){
					uni.setStorage({
						key: 'keyword',
						data: JSON.stringify(this.history)//转换为字符串形式
					})
					uni.navigateBack()
				}else if(this.type == 2){
					uni.setStorage({
						key: 'keywordb',
						data: JSON.stringify(this.history)//转换为字符串形式
					})
					uni.navigateBack()
				}else{
					uni.setStorage({
						key: 'keywordc',
						data: JSON.stringify(this.history)//转换为字符串形式
					})
					console.log(JSON.stringify(this.history))
					let arr = ''
					this.history.forEach(i=>{
						arr += i.id+','
					})
					this.api.post('person/comInfo',{
						ryLabel:arr.substr(0,arr.length-1),
						ryUuid:uni.getStorageSync("userinfo_Data").id}).then(res=>{
						if(res.flag){
							uni.navigateBack()
						}
					})
				}
				
			},
			// 输入框
			inputval(){
				this.api.get('keyword/getkeyword?keyword='+this.val).then(res=>{
					console.log(res)
					if(res.flag){
						this.keywordlist = res.data
					}
				})
			},
			// 添加关键字
			addKword(e){
				this.api.get('keyword/insert/'+e).then(res=>{
					console.log(res)
					if(res.flag){
						if(this.history.indexOf(e) == -1){
							this.history.unshift(res.data)  //unshift:跟push性质一样 区别就是将新添加的数据放在第一位
						}
						if(this.history.length > 3){
							this.history.pop()
						}
						uni.setStorage({
							key: 'keyword',
							data: JSON.stringify(this.history)//转换为字符串形式
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.buttonc{
	width: 100%;padding-bottom: 30rpx;background-color: white;
	box-shadow: 0rpx 0rpx 1rpx 3rpx rgba(0,0,0,0.1);
	position: fixed;left: 0;bottom: 0;
	.button_top{
		padding: 3%;
		display: flex;
		.topItem{
			width: 85%;
			display: flex;
			.items{
				background-color: #FFEEEA;color: #F25834;padding: 5rpx 16rpx;margin: 0 6rpx;border-radius: 50rpx;
				white-space: nowrap;
			}
		}
	}
}
	.xuanz{
		width: 100%;height: 120rpx;background-color: pink;
	}
	.addkeyword{
		width: 100%;margin-top: 20rpx;
		font-weight: bold;font-size: 34rpx;
		.tips{
			font-weight: none;font-size: 24rpx;
			margin-left: 54rpx;
		}
	}

.serach{
	padding: 3%;
	display: flex;justify-content: space-between;
	.search_l{
		width: 80%;padding: 10rpx 20rpx;border-radius: 50rpx;
		display: flex;
		background-color: #eee;
		input{
			margin-left: 10rpx;
		}
	}
	.search_r{
		width: 20%;text-align: center;margin-top: 10rpx;
		font-size: 34rpx;
	}
}
.wrap{
	height: calc(100vh);
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
	display: flex;
	flex-direction: column;
}
.content{
	padding:3% 3% 220rpx 3%;width: 100%;
	display: flex;flex: 1;overflow: hidden;justify-content: space-between;
	
	.title{
		text-align: center;
		margin: 20rpx 0;
	}
	.content_left{
		width: 	26%;
		height: 100%;
		.left_item{
			padding: 8rpx 0;
			text-align: center;
			view{
				padding: 10rpx 0;
				&.active{
					background-color: #ffe946;
					border-radius: 50rpx;
				}
			}
		
		}
	}
	// 搜索框
	.inputK{
		padding-left: 30rpx;
		.right_item{
			width: 100%;
			line-height: 100rpx;
			font-weight: bold;
			.re{
				color: #999;font-size: 22rpx;margin-left: 20rpx;
			}
		}
	}
	.content_right{
		width: 70%;
		height: 100%;margin-bottom: 200rpx;
		.right_item{
			line-height: 100rpx;
			font-weight: bold;
		}
	}
}
</style>
