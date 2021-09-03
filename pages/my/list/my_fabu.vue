<template>
	<view style="padding:0 3%;">
		<view class="kun" v-if="list == ''">
			<tb-kunNews></tb-kunNews>
		</view>
		<tb-list-li @genduo="genduo" :datas="list" @items="items" @adjust_sj="adjust_sj" @reshelf="reshelf"></tb-list-li>
		<u-popup v-model="rewordshow" mode="center" border-radius="20">
			<view class="popups">
				<view class="shopdetail">
					<image :src="MoneyReword.photo" mode="aspectFill"></image>
					<view class="shopdetail_text">
						<view class="text_top">现价：<text style="color: red;">￥{{MoneyReword.price}}</text></view>
						<view class="text_bot">调整为<input type="number" v-model="reword_price" /></view>
					</view>
				</view>
				<view class="buttons">
					<tb-button height="66" @but_cli="but_cli"></tb-button>
				</view>
			</view>
		</u-popup>
		
		<tb-share ref="share" :page_content_two="page_content_two" :contentHeight="450" type="1"></tb-share>
		
		<u-popup v-model="bragpopup" mode="bottom" border-radius="20">
			<view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(1)">
				分享
			</view>
			<view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(4)">
				点亮
			</view>
			<view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(2)" >
				下架
			</view>
			<view class="del_item"  style="color: red;border-bottom: 1rpx solid #eee;" @click="bargClick(3)">
				删除
			</view>
			<view class="del_item" @click="bragpopup = false">
				取消
			</view>
		</u-popup>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				list:'',
				MoneyReword:'',//调整赏金
				rewordshow:false,//修改赏金弹框
				reword_price:'',//赏金
				fbDetail:'',//发布详情
				bragpopup:false,
				xiajIndex:0,//下架或上架下标
				page_content_two:''
			}
		},
		onShow() {
			this.pagedata()
		},
		onNavigationBarButtonTap(e) {
			this.com.navto('./qiuzhuxj')
		},
		methods: {
			pagedata(){
				this.api.get('help/myHelp').then(res=>{
					console.log(res)
					if(res.flag){
						this.list = res.data
					}
				})
			},
			items(e,type){
				console.log(e,type)
				this.com.navto('../../index/task_detail?id='+e.bzUuid)
			},
			//调整赏金
			adjust_sj(it){
				this.MoneyReword = it
				this.rewordshow = true
			},
			//调整赏金确定
			but_cli(){
				let publish = {
					bzUuid: this.MoneyReword.bzUuid,			//发布人id
					
					bzPrice:this.reword_price,				//价格
					
				}
				this.api.post('help/change',publish,'application/json').then(res=>{
					console.log(res)
					if(res.flag){
						this.rewordshow = false     //弹框状态
						this.com.msg("修改成功")  //提示
						this.reword_price = '' 	  //清空
						this.pagedata()			 //刷新
					}else{
						this.com.msg(res.message)
						this.rewordshow = false
					}
				})
			},
			//更多
			genduo(e,index){
				console.log(e)
				this.fbDetail = e
				this.xiajIndex = index
				this.bragpopup = true
			},
			bargClick(e){
				this.bragpopup =  false
				if(e == 1){
					this.page_content_two = {
						bzUuid:this.fbDetail.bzUuid,
						jianjie:this.fbDetail.jianjie,
						photo:[this.fbDetail.photo]
					}
					this.$refs.share.toggleMask();
				}else if(e == 2){ //下架
					this.api.get('help/isRelease/'+this.fbDetail.bzUuid).then(res=>{
						console.log(res)
						if(res.flag){
							this.list.splice(this.xiajIndex,1)
							this.com.msg('已下架')
						}
					})
				}else if(e == 3){ //删除
					uni.showModal({
						content:"确定要删除吗？",
						success:function(e) {
							if(e.confirm){
								this.api.get('help/deleteHelp/'+this.fbDetail.bzUuid).then(res=>{
									this.list.splice(this.xiajIndex,1)
									this.com.msg('删除成功')
								})
							}
						}.bind(this)
					})
					
				}else{
					this.api.get('help/lightUp/'+this.fbDetail.bzUuid).then(res=>{
						console.log(res)
						this.com.msg(res.flag)
					})
				}
			},
			//重新上架
			reshelf(e,index){
				console.log(e,index)
				this.api.post('help/change',{bzUuid:e}).then(res=>{
					if(res.flag){
						this.list[index].releaseState = this.list[index].releaseState == 0 ? 1 : 0
						this.com.msg('上架成功')
					}
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
	}
</style>
<style lang="scss" scoped>
//删除
.del_item{
	width: 100%;text-align: center;line-height: 100rpx;
}
.popups{
	height: 400rpx;width: 76vw;
	padding: 30rpx;
	.shopdetail{
		display: flex;
		image{
			width: 120rpx;height: 120rpx;margin-right: 40rpx;
		}
		.shopdetail_text{
			width: 60%;
			.text_bot{
				display: flex;margin-top: 20rpx;
				input{
					width: 200rpx;margin-left: 10rpx;
					border-bottom: 1rpx solid #C8C7CC;
				}
			}
		}
	}
	.buttons{
		margin-top: 80rpx;
	}
}
</style>
