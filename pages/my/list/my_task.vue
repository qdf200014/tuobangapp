<template>
	<view style="padding: 3%;">
		<tb-pulldown bgcolor="#f5f5f5" textcolor="#000" :scrollY="true" @onRefresh="onRefresh"  @pulldown="pulldown"
		:status="status">
			<view slot="detail">
				<tb-list-li :pageType="3" :datas="list" @items="items" @Deselect="Deselect" @good_order="good_order" 
				@good_task="good_task" @shanchu="shanchu" @goBarg="goBarg" @task_ok="task_ok" @gochat="go_chat"></tb-list-li>
			</view>
		</tb-pulldown>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				page:1,
				status: 'more',
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
				this.api.get('chat/add/'+e.ryUuid+'/'+e.bzUuid+'/'+ e.type).then(res=>{
					console.log(res)
					if(res.flag){
						//id发布人 bzuuid是任务或服务id
						this.com.navto('../../chat/chat?name='+e.bkName+'&id='+e.ryUuid+'&bzuuid='+e.bzUuid+'&type='+ e.type +'&chatId='+res.data)
					}
				})
			},
			pagedata(e){
				this.api.get('response/myResponse',{page:e,size:6}).then(res=>{
					console.log(res)
					if(res.flag){
						res.data.forEach(res=>{
							if(res.jdState == 0){
								if(res.type == 0){
									res.responseMy = '待帮客同意'
								}else{
									res.responseMy = '待同意'
								}
							}else if(res.jdState == 1){
								if(res.payState == 0){
									res.responseMy = '待帮客支付'
								}else{
									res.responseMy = '帮助中'
								}
							}else if(res.jdState == 2){
								res.responseMy = '待帮客确认完成'
							}else if(res.jdState == 3){
								res.responseMy = '帮助完成'
							}else if(res.jdState == 4){
								res.responseMy = '帮客不同意完成'
							}else if(res.jdState == 5){
								if(res.cancelState === null){
									res.responseMy = '帮客取消帮助，需处理'
								}else if(res.cancelState == 0){
									res.responseMy = '已取消'
								}else if(res.cancelState == 1){
									res.responseMy = '不同意取消'
								}else if(res.cancelState == 2){
									res.responseMy = '系统已取消'
								}
							}else if(res.jdState == 6){
								if(res.cancelState === null){
									res.responseMy = '取消帮助，待帮客处理'
								}else if(res.cancelState == 0){
									res.responseMy = '已取消'
								}else if(res.cancelState == 1){
									res.responseMy = '帮客不同意取消'
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
			pulldown(){
				this.status = 'loading'
				this.page++
				
				this.pagedata(this.page)
			},
			//订单流程
			items(e){
				this.com.navto('../order_detail?id='+e.jdUuid+'&type='+ 2 +'&shengf='+ 1) //1帮主 2帮客
			},
			//刷新
			onRefresh(){
				this.list = []
				this.pages = 1
				this.pagedata(this.pages)
			},
			// 删除订单、
			shanchu(e,index){
				let that = this
				uni.showModal({
					title:"确定要删除帮助吗？",
					success(res) {
						if(res.confirm){
							that.api.get('response/deleteResponse/'+e).then(res=>{
								console.log(res)
								if(res.flag){
									that.list.splice(index,1)
									
								}else{
									that.com.msg(res.message)
								}
							})
						}
					}
				})
			
			},
			//取消订单
			Deselect(e){
				let that = this
				uni.showModal({
					title:"确定要取消帮助吗？",
					success(res) {
						if(res.confirm){
							
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
			good_task(e,type){
				let that = this
				let arr = {
					"jdUuid":e,"jdState":1,
				}
				this.api.post('response/processHelpState',arr,'application/json;charset=UTF-8').then(res=>{
					console.log(res)
					if(res.flag){
						this.list = []
						this.pages = 1
						this.pagedata(this.pages)
					}
				})
			},
			// 到得瑟发布
			goBarg(e,id){
				uni.navigateTo({
					url:'../../brag/issue_brag?type='+e+'&id='+id,
					animationType:'slide-in-right'
				})
			},
			// 申请任务完成
			task_ok(e){
				let that = this
				uni.showModal({
					title:"确定帮助完成了吗？",
					confirmText:'确定申请',
					cancelText:'取消申请',
					success(res) {
						if(res.confirm){
							
							that.api.post('response/processHelpState',e).then(res=>{
								console.log(e)
								if(res.flag){
									that.list = []
									that.pages = 1
									that.pagedata(this.pages)
								}else{
									that.com.msg(res.message)
								}
							})
						}
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
