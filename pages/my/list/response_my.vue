<template>
	<view style="padding: 3%;">
		<tb-pulldown bgcolor="#f5f5f5" textcolor="#000" :scrollY="true" @onRefresh="onRefresh" @pulldown="pulldown"
		:status="status">
			<view slot="detail">
				<tb-list-li :pageType="2" :datas="list" @items="items" @Deselect="Deselect" @good_task="good_task"  
				@shanchu="shanchu" @go_pjia="go_pjia" @no_acccom="no_acccom" @gochat="go_chat"
				></tb-list-li>
			</view>
		</tb-pulldown>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				status: 'more',
				pages:1
			}
		},
		onShow() {
			this.page = 1
			this.list = []
			this.pagedata(this.page)
		},
		methods: {
			//去聊天
			go_chat(e){
				// console.log('chat/add/'+e.ryUuid+'/'+e.bzUuid+'/'+ e.type)
				this.api.get('chat/add/'+e.ryUuid+'/'+e.bzUuid+'/'+ e.type).then(res=>{
					console.log(res)
					if(res.flag){
						//id发布人 bzuuid是任务或服务id
						this.com.navto('../../chat/chat?name='+e.bzName+'&id='+e.ryUuid+'&bzuuid='+e.bzUuid+'&type='+ e.type +'&chatId='+res.data)
					}
				})
			},
			
			pulldown(){
				this.status = 'loading'
				this.pages++
				this.pagedata(this.pages)
			},
			pagedata(e){
				this.api.get('response/responseMyHelp',{page:e,size:6}).then(res=>{
					console.log(res)
					if(res.flag){
						res.data.forEach(res=>{
							// jdState 订单状态 0-待同意 1-已同意 2-帮主确认完成 3-帮客确认完成 4-帮客不确认完成 5-帮客取消 6-帮主取消
							// type 订单类型 0-是帮助 1-是服务
							// appealState 申诉状态 0-可申诉 1-平台处理中 2-平台处理完成 3-取消申诉
							// appraiseState 评价状态 0-待评价 1-已评价
							// payState 支付状态 0-未支付 1-已支付
							// cancelState 取消状态 0-取消成功 1-取消失败 2-平台取消
							if(res.jdState == 0){
								if(res.type == 0){
									res.responseMy = '待同意'
								}else{
									res.responseMy = '待帮主同意'
								}
							}else if(res.jdState == 1){
								if(res.payState == 0){
									res.responseMy = '待支付'
								}else{
									res.responseMy = '帮助中'
								}
							}else if(res.jdState == 2){
								res.responseMy = '请确认完成'
							}else if(res.jdState == 3){
								res.responseMy = '帮助完成'
							}else if(res.jdState == 4){
								res.responseMy = '拒绝完成'
							}else if(res.jdState == 5){
								if(res.cancelState === null){
									res.responseMy = '取消帮助，待帮主处理'
								}else if(res.cancelState == 0){
									res.responseMy = '已取消'
								}else if(res.cancelState == 1){
									res.responseMy = '帮主不同意取消'
								}else if(res.cancelState == 2){
									res.responseMy = '系统已取消'
								}
							}else if(res.jdState == 6){
								if(res.cancelState === null){
									res.responseMy = '取消帮助，待处理'
								}else if(res.cancelState == 0){
									res.responseMy = '已取消'
								}else if(res.cancelState == 1){
									res.responseMy = '不同意取消'
								}else if(res.cancelState == 2){
									res.responseMy = '系统已取消'
								}
							}
							
						})
						this.list = this.list.concat(res.data) 
						
						if(res.data && res.data.length < 10){
							this.status = 'noMore'
						}
					}
				})
			},
			//刷新
			onRefresh(){
				this.list = []
				this.pages = 1
				this.pagedata(this.pages)
			},
			// 去评价
			go_pjia(e){
				this.com.navto('./addpingjia?id='+e)
			},
			//订单流程
			items(e){
				
				this.com.navto('../order_detail?id='+e.jdUuid+'&type='+1+'&shengf='+2) //1帮主 2帮客
			},
			//取消订单
			Deselect(e){
				let that = this
				uni.showModal({
					title:"确定要取消帮助吗？",
					success(res) {
						if(res.confirm){
							that.list = []
							that.api.post('response/cancelHelp',e).then(res=>{
								console.log(e)
								if(res.flag){
									that.list = []
									that.pages = 1
									that.pagedata(this.pages)
									
								}
							})
						}
					}
				})
				
			},
			//同意按钮
			good_task(e,type){
				let arr = {
					"jdUuid":e,"jdState":1,
				}
				
				this.api.post('response/processHelpState',arr,'application/json;charset=UTF-8').then(res=>{
					console.log(e)
					if(res.flag){
						this.list = []
						this.pages = 1
						this.pagedata(this.pages)
						if(type != 0){
							this.com.navto('../../index/pay_detail?id='+e)
						}
					}
				})
				
			},
			// 删除订单、
			shanchu(e){
				console.log(e)
				this.api.get('response/deleteResponse/'+e).then(res=>{
					console.log(res)
					if(res.flag){
						this.list = []
						this.pages = 1
						this.pagedata(this.pages)
						this.com.msg('删除成功')
					}else{
						this.com.msg('删除失败')
					}
				})
			},
			//同意，拒绝
			no_acccom(e){
				this.api.post('response/processHelpState',e).then(res=>{
					console.log(res)
					if(res.flag){
						this.list = []
						this.pages = 1
						this.pagedata(this.pages)
						
					}else{
						this.com.msg(res.message)
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

</style>
