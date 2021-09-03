<template>
	<view>
		<view class="content">
			<view class="items" v-for="(it,index) in list" :key="index" >	
				<view>{{it.reportReason}}</view>
				<u-radio-group v-model="value" @change="go_tian">
					<u-radio 
						:name="it.id"
					>
					</u-radio>
				</u-radio-group>
			</view>
			<view class="but">
				<tb-button buttitle="确定" @but_cli="but_cli" ></tb-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{
						name:'存在违反国家法律法规等内容'
					},
					{
						name:'疑似欺诈' /////////
					},
					{
						name:'引流广告'
					},
					{
						name:'存在淫秽、低俗等服务内容'
					},
					{
						name:'其他类型（非以上类型但影响体验）'
					}
				],
				value:0,
				page_reply:'',
				reportId:0,//举报id
				types:0
			}
		},
		onLoad(op) {
			// op.type 1评论 2嘚瑟
			console.log(JSON.parse(op.cont))
			this.types = op.type
			this.page_reply = JSON.parse(op.cont)
			this.api.get('report/showReportReason/'+2).then(res=>{
				console.log(res)
				if(res.flag){
					this.list = res.data
				}
			})
		},
		methods: {
			go_tian(e){
				// console.log(e)
				this.reportId = e
			},
			but_cli(){
				if(this.types == 2){
					this.api.post('report/reportShow',{
						showId:this.page_reply.showId,
						informantId:uni.getStorageSync('userinfo_Data').id,
						reportId:this.reportId
					}).then(res=>{
						console.log(res)
						this.com.msg(res.message)
					})
				}else{
					this.api.post('report/reportComment',{
						commentId:this.page_reply.id,
						commentUser:this.page_reply.commentRyUuid,
						informantId:uni.getStorageSync('userinfo_Data').id,
						reportId:this.reportId
					}).then(res=>{
						console.log(res)
						this.com.msg(res.message)
					})
				}
				
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
.content{
	background-color: #FFFFFF;
	.items{
		
		padding:30rpx 3%;width: 100%;
		display: flex;justify-content: space-between;
		border-bottom: 1rpx solid #eee;
	}
	.items:last-child{
		border-bottom: none;
	}
}
.but{
	width: 100%;
	position: fixed;left: 0;bottom: 100rpx;
}

</style>
