<template>
	<view>
		<view class="kun" v-if="lists == ''">
			<tb-kunNews></tb-kunNews>
		</view>
		<view class="content" v-else>
			<view class="item" v-for="(it,ind) in lists" :key="ind" @click="go_detail(it.details,it.type)">
				<view class="itemTime">
					{{it.time}}
				</view>
				<view class="itemCont">
					<view class="itemContTitle">
						{{it.title}}
					</view>
					<view class="item_cont" v-if="it.type == 1">
						<view class="item_contjianj">
							{{it.content}}
						</view>
						<view class="item_xiangq">
							查看详情
							<u-icon name="arrow-right" color='#eee'></u-icon>
						</view> 
					</view>
					<view class="tunzhi" v-else>
						<view class="tunzhijianj">
							{{it.content}}
						</view>
						<image :src="it.photo" mode="aspectFill"></image>
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
				lists:[]
			}
		},
		onLoad() {
			this.pageData()
		},
		methods: {
			pageData(){
				this.api.get('systemMessage/system',{token:uni.getStorageSync('token')}).then(res=>{
					console.log(res)
					if(res.flag){
						this.lists = res.data
					}
				})
			},
			// 到详情
			go_detail(e,type){
				if(type == 1){ //违规
					this.com.navto('./weigui?id='+e)
				}else{
					this.com.navto('./mation_detail/mation_detail?data='+e)
				}
			}
		}
	}
</script>

<style>
	page{
		background-color: #f7f7f7;
	}
</style>
<style scoped lang="scss">
.item{
	width: 100%;padding:10rpx 3%;
	.itemTime{
		text-align: center;color: #a8a8a8;
		line-height: 80rpx;
	}
	.itemCont{
		width: 100%;padding: 3%;background-color: white;
		border-radius: 20rpx;
		.itemContTitle{
			font-size: 34rpx;font-weight: bold;margin-bottom: 20rpx;
		}
		.item_cont{
			
			.item_xiangq{
				border-top: 0.5rpx solid #eee;margin-top: 20rpx;padding-top: 20rpx;color: #24aaf1;
				display: flex;justify-content: space-between;
			}
		}
	}
	.tunzhi{
		
		.tunzhijianj{
			color: #969696;
		}
		image{
			width: 100%;height: 320rpx;margin-top: 20rpx;
		}
	}
}
</style>
