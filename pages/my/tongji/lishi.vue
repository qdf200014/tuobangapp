<template>
	<view >
		<tb-pulldown bgcolor="#fff" textcolor="#000" :scrollY="true" @onRefresh="onRefresh" @pulldown="pulldown"
		:status="status">
			<view slot="detail">
				<view style="position: sticky;top: 0;z-index: 999;background-color: #fff;">
					<u-tabs :list="list" :is-scroll="false" :current="current"  @change="change" item-width="200"
					 activeColor="#fd4142" bar-width="30"></u-tabs>
				</view>
				
				<view v-if="pageshoe">
					<tb-login></tb-login>
				</view>
				<view style="padding: 3% 3% 0 3%;" v-else>
					<view v-if="current == 0">
						<view class="items" v-for="(item,index) in pageList" :key="index">
							<view class="itemTime">
								{{item.total.day}}
							</view>
							<view class="itemChild" v-for="(it,ind) in item.browsingRecords" :key="ind" @click="go_detail(it)">
								<view class="itemChild_l"> 
									<image style="width:160rpx" :src="it.photo" mode="aspectFill"></image>
								</view>
								<view class="itemChild_r">
									<view class="itemChild_r_title rowTwo">
										{{it.jianjie}} 
									</view>
									<!-- <view class="itemChild_r_price">
										酬金：<text>￥{{it.helpInfo.price}}</text>
									</view> -->
								</view>
							</view>
						</view>
						<view class="kun" v-if="pageList == ''">
							<tb-kunNews></tb-kunNews>
						</view>
					</view>
					<view v-else>
						<view class="items" v-for="(item,index) in pageListTwo" :key="index">
							<view class="itemTime">
								{{item.total.day}}
							</view>
							<view class="itemChild" v-for="(it,ind) in item.browsingRecords" :key="ind" @click="go_detail(it)">
								<view class="itemChild_l"> 
									<image style="width:220rpx" :src="it.photo" mode="aspectFill"></image>
								</view>
								<view class="itemChild_r">
									<view class="itemChild_r_title rowTwo">
										{{it.jianjie}} 
									</view>
									<!-- <view class="itemChild_r_price">
										酬金：<text>￥{{it.helpInfo.price}}</text>
									</view> -->
								</view>
							</view>
						</view>
						<view class="kun" v-if="pageListTwo == ''">
							<tb-kunNews></tb-kunNews>
						</view>
					</view>
				</view>
				
			</view>
		</tb-pulldown>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pageList:[],
				pageListTwo:[],
				longitude:'',
				latitude:'',
				list:[
					{
						name:'求助'
					}, {
						name: '帮助'
					}
				],
				current:0,
				pageshoe:true,//页面显示
				page:1,
				pageTwo:1,
				status: 'more',
			}
		},
		onNavigationBarButtonTap(e) {
			let title = this.current == 0 ? '求助' : '帮助'
			uni.showModal({
				content:"您确定要清空"+title+"记录吗?这不可找回!",
				success:function(res) {
					if(res.confirm){
						this.api.get('record/emptyBrowse/'+this.current).then(res=>{
							console.log(res)
							if(res.flag){
								if(this.current == 0){
									this.pageList = []
								}else{
									this.pageListTwo = []
								}
							}
						})
					}
				}.bind(this)
			})
		},
		onLoad() {
			this.pageData(this.page)
			this.pageDataTwo(this.pageTwo)
			
		},
		methods: {
			pulldown(){
				this.status = 'loading'
				if(this.current == 0){
					this.page ++
					this.pageData(this.page)
				}else{
					this.pageTwo ++
					this.pageDataTwo(this.pageTwo)
				}
			},
			//下拉刷新
			onRefresh(){
				// 刷新
				this.pageshoe = true
				if(this.current == 0){
					this.pageList = []
					this.page = 1
					this.pageData(this.page)
				}else{
					this.pageListTwo = []
					this.pageTwo = 1
					this.pageDataTwo(this.pageTwo)
				}
			},
			//到详情
			go_detail(e){
				if(this.current == 0){ //需求
					if(e.bzState == 0){
						this.com.navto('../../index/task_detail?id='+e.bzUuid)
					}else{
						this.com.navto('../details?data=' + JSON.stringify(e));
					}
				}else{
					if(e.bzState == 0){
						this.com.navto('../../serve_detail/serve_detail?id='+e.bzUuid )
					}else{
						this.com.navto('../details?data=' + JSON.stringify(e)+'&type='+2);
					}
				}
			},
			// 求助
			pageData(e){
				this.api.get('record/browse/'+ 0,{page:e,size:10}).then(res=>{
					console.log(res)
					if(res.flag){
						this.pageList =this.pageList.concat(res.data) 
						this.pageshoe = false
						if(res.data && res.data.length < 10){
							this.status = 'noMore'
						}
					}
				})
			},
			//帮助
			pageDataTwo(e){
				this.api.get('record/browse/'+ 1,{page:e,size:10}).then(res=>{
					console.log(res)
					if(res.flag){
						this.pageListTwo =this.pageListTwo.concat(res.data) 
						this.pageshoe = false
						if(res.data && res.data.length < 10){
							this.status = 'noMore'
						}
					}
				})
			},
			change(e){
				// console.log(e)
				this.current = e
				this.pageshoe = true
				setTimeout(()=>{
					this.pageshoe = false
				},200)
			}
		}
	}
</script>

<style>
page{
	background-color: #F6F6F6;
}
</style>
<style scoped lang="scss">
.items{
	.itemTime{
		color: #666;
		line-height: 40rpx;
	}
	.itemChild{
		padding: 3%;background-color: white;border-radius: 10rpx;margin: 20rpx 0;
		display: flex;
		.itemChild_l{
			image{
				max-width: 220rpx;
				height: 160rpx;margin-right: 30rpx;border-radius: 20rpx; 
			}
		}
		.itemChild_r{
			.itemChild_r_title{
				line-height: 40rpx;height: 80rpx;overflow: hidden;
				margin-bottom: 20rpx;
			}
			.itemChild_r_price{
				color: #a6a6a6;
				text{
					color: red;
				}
			}
		}
	}
}
</style>
