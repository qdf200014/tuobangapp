<template>
	<view>
		<view class="items" v-for="(it, index) in datas" :key="index" @click="items(it)">
			<!-- //响应我的 -->
			<view v-if="pageType == 2" class="top_type">
				<view class="top_type_l" >
					<image :src="it.img" mode="aspectFill"></image>
					<text>{{ it.bzName }}</text>
				</view>
				<view class="top_type_rig">{{it.responseMy}}</view>

			</view>
			<view v-if="pageType == 3" class="top_type">
				<view class="top_type_l">
					<image :src="it.img" mode="aspectFill"></image>
					<text>{{ it.bkName }}</text>
				</view>
				<view class="top_type_rig" >{{it.responseMy}}</view>
			</view>
			<view class="items_top">
				<image :src="it.photo" mode="aspectFill"></image>
				<view class="items_top_cont">
					<view class="top_cont_text">{{ it.jianjie }}</view>
					<view class="cont_name">
						价格：
						<text>{{ it.price == 0 ? '无偿帮助' : '￥'+it.price}}</text>
					</view>
				</view>
			</view>
			<view class="items_bottom" v-if="pageType == 1">
				<view class="items_bottom_l">
					已有
					<text>{{ it.store }}</text>
					人收藏
				</view>
				<view class="items_bottom_r">
					<view @click.stop="adjust_sj(it)">调整赏金</view>
					<view  v-if="it.releaseState == 0" @click.stop="compile_data(it.bzUuid)">编辑</view>
					<view v-else @click.stop="reshelf(it.bzUuid,index)">重新上架</view>
					<text @click.stop="genduo(it,index)">
						<u-icon  name="more-dot-fill" size="40"></u-icon> 
					</text>
				</view>
			</view>
			<!-- //响应我的 -->
			<view class="items_bottom" v-else-if="pageType == 2">
				<view class="items_bottom_l" style="color: #f30a06;" @click.stop="gochat(it)">
					<u-icon name="chat" size="40"></u-icon>
					联系帮主
				</view>
				
				<view class="items_bottom_r" v-if="it.jdState == 0">
					<view @click.stop="Deselect(it.jdUuid)">取消帮助</view>
					<view @click.stop="good_task(it.jdUuid,it.price)" v-if="it.type ==  0">同意帮助</view>
				</view>
				
				<view class="items_bottom_r" v-if="it.jdState == 1">
					<view @click.stop="Deselect(it.jdUuid)" >取消帮助</view>
					<view @click.stop="go_pay(it.jdUuid)" v-if="it.payState ==  0">我要付款</view>
					<view  v-if="it.payState ==  1" @click.stop="no_acccom(it.jdUuid,3)">确认完成</view>
				</view>
				
				<view class="items_bottom_r" v-if="it.jdState == 2">
					<view @click.stop="no_acccom(it.jdUuid,4)">拒绝申请</view> 
					<view @click.stop="no_acccom(it.jdUuid,3)">确认完成</view>
				</view>
				
				<view class="items_bottom_r" v-if="it.jdState == 3">
					<view v-if="it.appraiseState == 0" @click.stop="go_pjia(it.jdUuid)">去评价</view> 
					<view @click.stop="shanchu(it.jdUuid,index)">删除订单</view>
				</view>
				
				<view class="items_bottom_r" v-if="it.jdState == 4">
					<!-- <view @click.stop="go_pjia(it.jdUuid)">查看钱款</view> -->
					<view @click.stop="shensu(it.jdUuid,it.ryUuid)">申诉</view>
					<view  v-if="it.payState ==  1" @click.stop="no_acccom(it.jdUuid,3)">确认完成</view>
					<!-- <view @click.stop="delOrder = true">更多</view> -->
				</view>
				<!-- 接单待同意 -->
			
				<view class="items_bottom_r" v-if="it.jdState == 5 || it.jdState == 6">
					<view v-if="it.cancelState == 0 || it.cancelState == 2" @click.stop="shanchu(it.jdUuid,index)">
						删除订单
					</view>
					<view @click.stop="cancel_Detail(it.jdUuid,it.type)" v-if="it.payState == 1">取消详情</view>
					<view @click.stop="no_acccom(it.jdUuid,3)" v-if="it.cancelState ==  1">确认完成</view>
				</view>
			</view>
			
			<!-- 我的任务 -->
			<view class="items_bottom"  v-else-if="pageType == 3">
				<view class="items_bottom_l" style="color: #f30a06;" @click.stop="gochat(it)">
					<u-icon name="chat" size="40"></u-icon>
					联系帮客
				</view>
				<!-- 未接单取消 -->
				<view class="items_bottom_r" v-if="it.jdState == 0">
					<view @click.stop="Deselect(it.jdUuid)" >取消帮助</view>
					<view @click.stop="good_task(it.jdUuid,it.price)" v-if="it.type ==  1">同意邀请</view>
				</view>
				
				<view class="items_bottom_r" v-if="it.jdState == 1">
					<view @click.stop="Deselect(it.jdUuid)" >取消帮助</view>
					<view @click.stop="task_ok(it.jdUuid)" v-if="it.payState ==  1">申请完成</view>
				</view>
				
				<view class="items_bottom_r" v-if="it.jdState == 2 || it.jdState == 4">
					<view @click.stop="shensu(it.jdUuid,it.ryUuid)">申诉</view>
					<view @click.stop="task_ok(it.jdUuid)">再次申请</view>
				</view>
				<!-- 接单后 -->
				<view class="items_bottom_r" v-if="it.jdState == 3">
					<view v-if="it.isShowContent == 0" @click.stop="xuany(it.jdUuid)">分享一下</view>
					<view>查看钱款</view>
					<text  @click.stop="moreDot(it.jdUuid,index)">
						<u-icon name="more-dot-fill" size="34"></u-icon>
					</text>
				</view>
				
				<!-- 提交任务失败 -->
				<view class="items_bottom_r" v-if="it.jdState == 5 || it.jdState == 6">
					<view v-if="it.cancelState == 0 || it.cancelState == 2" @click.stop="shanchu(it.jdUuid,index)">
						删除订单
					</view>
					<view @click.stop="cancel_Detail(it.jdUuid,it.type)" v-if="it.payState == 1">取消详情</view>
					<view @click.stop="task_ok(it.jdUuid)" v-if="it.cancelState ==  1">申请完成</view>
				</view>
			</view>
			<!-- //弹出 -->
			
		</view>
		<u-popup v-model="delOrder"  mode="center" width="60%">
			<view style="width: 100%;line-height: 100rpx;margin-left: 20rpx;"  @click.stop="del(1)">
				删除订单
			</view>
		</u-popup>
		<!-- 弹出 -->
		<u-popup v-model="show" mode="bottom" border-radius="30">
			<!-- 帮客 -->
			<view class="tanchu" v-if="pageType == 2">
				<view class="tanchu_title">选择取消原因<text class="guiz" @click="qxguiz">查看《取消规则》</text></view>
				<view class="tanchu_item" v-for="(it, ind) in list" :key="ind" @click="radioGroupChange(it.tit,ind)">
					<view class="tanchu_item_left">{{ it.tit }}</view>
					<view class="tanchu_item_right">
						<u-checkbox-group >
							<u-checkbox 
								v-model="it.disabled" 
								:name="it.tit"
							></u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
				<view class="buttons">
					<view class="buttons_l" @click.stop="show = false">暂不取消</view>
					<view class="buttons_r" @click="quxiao">取消帮助</view>
				</view>
			</view>
			<!-- 帮主 -->
			<view class="tanchu" v-if="pageType == 3">
				<view class="tanchu_title">选择取消原因<text class="guiz" @click="qxguiz">查看《取消规则》</text></view>
				<view class="tanchu_item" v-for="(it, ind) in list_bz" :key="ind" @click="radioGroupChange(it.tit,ind)">
					<view class="tanchu_item_left">{{ it.tit }}</view>
					<view class="tanchu_item_right">
						<u-checkbox-group >
							<u-checkbox 
								v-model="it.disabled" 
								:name="it.tit"
							></u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
				<view class="buttons">
					<view class="buttons_l" @click.stop="show = false">暂不取消</view>
					<view class="buttons_r" @click="quxiao">取消帮助</view>
				</view>
			</view>
		</u-popup>
		<!-- 删除订单 -->
		
		<!-- 得瑟 -->
		<u-popup v-model="xuanyType" mode="bottom" border-radius="30" >
			<view class="dese" @click="go_brag(1)">
				图片
			</view>
			<!-- <view class="dese" @click="go_brag(2)">
				视频
			</view> -->
			<view class="dese" @click="xuanyType = false">
				取消
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			list: [
				{ tit: '不再需要帮助',disabled:false }, 
				{ tit: '帮主联系不上',disabled:false }, 
				{ tit: '帮主能力不足，不能完成任务事项',disabled:false }, 
				{ tit: '帮主没有按照约定要求完成任务',disabled:false }, 
				{ tit: '帮主提供帮助过程中存在违法违规行为',disabled:false },
				{ tit: '帮主态度恶劣',disabled:false }],
			list_bz:[
				{ tit: '临时有事，无法按时完成',disabled:false },
				{ tit: '帮客实际求助超出能力范围',disabled:false }, 
				{ tit: '帮客实际求助超出发布内容',disabled:false }, 
				{ tit: '帮客实际求助存在违法违规问题',disabled:false }, 
				{ tit: '帮客态度恶劣',disabled:false },
				{ tit: '帮客联系不上',disabled:false }
			],
			value: '', 
			orderid:'',//取消id
			cancellation:'',//取消原因
			delOrder:false,
			xuanyType:false,//选择得瑟类型
			indexOrd:0,
		};
	},
	props: {
		pageType: {
			default: 1 //1我的发布 2响应我的 3我的任务
		},
		datas: {}
	},
	methods: {
		//取消规则
		qxguiz(){
			this.com.navto('../../login/agreement_page?type='+7)
		},
		//去聊天
		gochat(e){
			this.$emit("gochat",e)
		},
		radioGroupChange(e,ind){
			console.log(e)
			if(this.pageType == 2){
				this.list.forEach((i,index)=>{
					i.disabled = false
				})
				this.list[ind].disabled = true
			}else{
				this.list_bz.forEach((i,index)=>{
					i.disabled = false
				})
				this.list_bz[ind].disabled = true
			}
			
			this.cancellation = e
		},
		//详情
		items(e) {
			this.$emit('items', e);
		},
		//调整赏金
		adjust_sj(it) {
			this.$emit('adjust_sj', it);
		},
		//去评价
		go_pjia(e){
			this.$emit('go_pjia',e)
			
		},
		//编辑
		compile_data(e) {
			// console.log(e)

			uni.navigateTo({
				url: '/pages/publish/publish?id=' + e
			});
		},
		//取消订单
		Deselect(e) {
			this.show = true
			this.orderid = e
		},
		//弹出框的取消
		quxiao(){
			if(this.cancellation == ''){
				this.com.msg('请选择原因')
			}else{
				this.show = false
				let arr = {
					"cancelCause":this.cancellation,
					"jdUuid": this.orderid,
				}
				this.$emit('Deselect', arr);
			}
			
		},
		
		//同意
		good_task(e, type) {
			this.$emit('good_task', e, type);
		},
		//删除订单
		shanchu(e,index){
			this.$emit("shanchu",e,index)
		},
		//得瑟
		xuany(e){
			this.$emit('goBarg',1,e)
			// this.xuanyType = true
		},
		// 到发布得瑟
		go_brag(e){
			// this.$emit('goBarg',e,this.orderid)
			this.xuanyType = false
		},
		// 任务完成
		task_ok(e){
			let arr = {
				"jdUuid": e,
				"jdState":2
			}
			this.$emit('task_ok', arr);
		},
		// 申诉
		shensu(e,userid){
			console.log(e,userid)
			this.com.navto('../../../pages/my/list/appeal?id='+e+'&type='+1+'&userid='+userid)
		},
		// 拒绝完成
		no_acccom(e,type){
			let arr = {
			    "jdUuid": e,
			    "jdState": type
			}
			let that = this
			if(type == 3){ //确认完成
				uni.showModal({
					content:'您确定帮助已经完成了吗？',
					confirmText:'确认完成',
					cancelText:'未完成',
					success(a) {
						if(a.confirm){
							that.$emit('no_acccom', arr);
						}
					}
				})
			}else{
				that.$emit('no_acccom', arr);
			}
			
		},
		//取消详情
		cancel_Detail(e,type){
			this.com.navto('../../../pages/my/disqualification?id='+e+'&type='+type)
		},
		//去支付
		go_pay(e){
			this.com.navto('../../../pages/index/pay_detail?id='+e)
		},
		//三个点
		moreDot(e,ind){
			this.delOrder = true
			this.orderid = e
			this.indexOrd = ind
		},
		//弹框删除
		del(e){
			this.delOrder = false
			if(e == 1){//删除
				this.shanchu(this.orderid,this.indexOrd)
			}
		},
		// 我的发布更多
		genduo(e,index){
			this.$emit('genduo',e,index)
		},
		//我的发布重新上架
		reshelf(e,index){
			this.$emit('reshelf',e,index)
		}
	}
};
</script>

<style lang="scss" scoped>
	.guiz{
		font-weight: 100;color: red;font-size: 28rpx;
		margin-left: 26rpx;
	}
// 得瑟
.dese{
	width: 100%;padding: 30rpx 0;text-align: center;
}
//弹出层
.tanchu {
	width: 100%;
	padding: 20rpx 40rpx;
	.tanchu_title {
		margin: 30rpx 0;
		font-size: 34rpx;
		font-weight: bold;
		text-align: center;
	}
	.tanchu_item {
		display: flex;
		justify-content: space-between;
		line-height: 100rpx;
		border-bottom: 1rpx solid #eee;
	}
	.buttons {
		width: 100%;
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
		view {
			width: 45%;
			border: 1rpx solid #0493fb;
			color: #0493fb;
			padding: 15rpx 0;
			text-align: center;
			border-radius: 50rpx;
		}
		.buttons_r {
			background-color: #0493fb;
			color: white;
		}
	}
}
.items {
	width: 100%;
	padding: 3%;
	margin: 15rpx 0;
	border-radius: 20rpx;
	background-color: #fff;
	.top_type {
		display: flex;
		justify-content: space-between;
		.top_type_l {
			display: flex;
			image {
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
			}
			text {
				line-height: 50rpx;
				margin-left: 20rpx;
			}
		}
		.top_type_rig {
			color: #ff946b;
		}
	}
	.items_top {
		display: flex;
		align-items: center;
		image {
			width: 200rpx;
			height: 140rpx;
			border-radius: 20rpx;
			margin-right: 15rpx;
		}
		.items_top_cont {
			width: 68%;
			.top_cont_text {
				height: 120rpx;
				line-height: 40rpx;
				overflow: hidden;
			}
			.cont_name {
				// font-size: 34rpx;
				color: #999999;
				text {
					color: #ff1111;
					line-height: 50rpx;
				}
			}
		}
		.items_top_right {
			text-align: center;
			margin: 20rpx;
			padding: 10rpx 20rpx;
			border-radius: 50rpx;
			color: white;
			border: 2rpx solid #999999;
			color: #999999;
		}
		.items_top_right_active {
			text-align: center;
			padding: 10rpx 20rpx;
			background-color: #2292fb;
			border-radius: 50rpx;
			color: white;
			margin: 20rpx;
		}
	}
	.items_bottom {
		display: flex;
		justify-content: space-between;
		color: #999999;
		margin-top: 25rpx;
		.items_bottom_l {
			width: 180rpx;
			margin-top: 10rpx;
			display: flex;
			text {
				color: #ff1111;
			}
		}
		.items_bottom_r {
			display: flex;
			justify-content: space-around;
			view {
				padding: 8rpx 18rpx;
				border-radius: 50rpx;
				border: 1rpx solid #f30a06;
				color: #f30a06;
				font-weight: bold;
				margin: 0 10rpx;
			}
		}
	}
}
</style>
