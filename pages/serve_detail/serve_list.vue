<template>
	<view>
		<view class="pinj">
			<view class="score">
				<view>
					综合评分 <text style="color: #fe552e;"> {{dataHead.averageScore}}</text>
					<u-rate :current="dataHead.averageScore" :disabled="true"></u-rate>
				</view>
				<view>
					<text style="margin-left: 50rpx;color: #fe552e;" v-if="dataHead.appraiseCount">
						{{dataHead.appraiseCount.appraiseCount}}
					</text>条评论
				</view>
			</view>
			<view class="xuan">
				<view class="xuanitem" :class="{active:typeIndex == it.type}" v-for="(it,ind) in types" :key="ind" 
				@click="typeCli(it.type)" >
					{{it.name + it.num}}
				</view>
			</view>
		</view>
		<view  v-if="detailComment!=''">
			<view class="comment" v-for="(it,index) in detailComment" :key="index">
				<!-- 用户 -->
				<view class="commentuser">
					<view class="userimg" @click="go_master(it.ryUuid)">
						<image :src="it.img" mode="aspectFill"></image>
						<view>
							{{it.petName}}
							<view class="">
								<u-rate :current="it.score" :disabled="true" gutter="0"></u-rate>
							</view>
						</view>
					</view>
					<view class="userTime">
						{{it.time}}
					</view>
				</view>
				<view class="textcontent" @click="go_Detail(it.id)">
					{{it.proposal}}
				</view>
				<view class="imgswiper" @click="go_Detail(it.id)">
					<image v-for="(it,ind) in it.photo" :key="ind" :src="it" mode="aspectFill"></image>
					
				</view>
				<view class="thumbs" @click="pj_dian(it.id,index)">
					<u-icon name="thumb-up" v-if="it.ishelpAppraiseParse == 0"></u-icon>
					<u-icon name="thumb-up-fill" v-else color="#0493fd"></u-icon>{{it.parseCount}}
					
				</view>
			</view>
		</view>
		<view v-else class="kun" >
			<tb-kunNews></tb-kunNews>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serveId:0,
				types:[
					// 0 -查看评价 1-好评 2-差评 3-帮助及时 4-服务周到 5-专业熟练 6-安全可靠 6-收费合理
					{name:'全部',type:0},
					{name:'好评',type:1},
					{name:'差评',type:2},
					{name:'帮助及时',type:3},
					{name:'服务周到',type:4},
					{name:'专业熟练',type:5},
					{name:'安全可靠',type:6},
					{name:'收费合理',type:7}
				],
				typeIndex:0,
				detailComment:[],
				appraiseCount:'',//评分
				dataHead:'',//综合评分
			}
		},
		onLoad(op) {
			this.serveId = op.id
			if(op.type){
				this.typeIndex = op.type
				this.pageData(this.typeIndex)
			}else{
				this.pageData(this.typeIndex)
			}
			
		},
		methods: {
			pageData(e){
					this.api.get('appraise/queryAppraise/'+e,{
						serveUuid:this.serveId,
						fid:uni.getStorageSync('userinfo_Data').id,
						
						}).then(res=>{
						if(res.flag){
							this.dataHead = res.data //
							this.detailComment = res.data.appraise
							let add = res.data.appraiseCount
 							this.types = [
								// 0 -查看评价 1-好评 2-差评 3-帮助及时 4-服务周到 5-专业熟练 6-安全可靠 6-收费合理
								{name:'全部',type:0,num:add.appraiseCount},
								{name:'好评',type:1,num:add.praiseCount },
								{name:'差评',type:2,num:add.negativeCount},
								{name:'帮助及时',type:3,num:add.timelyServiceCount},
								{name:'服务周到',type:4,num:add.serveScoreCount},
								{name:'专业熟练',type:5,num:add.professionalCount},
								{name:'安全可靠',type:6,num:add.reliabilityScore},
								{name:'收费合理',type:7,num:add.qualityCount}
							]
						}
					})
			},
			go_master(e){
				this.com.navto('../my/master_page?id='+e)
			},
			//类型
			typeCli(type){
				this.typeIndex = type
				this.pageData(type)
			},
			pj_dian(e,ind){
				this.api.get('helpAppraiseParse/addShowCommentParse/'+e).then(res=>{
					if(res.flag){
						this.detailComment[ind].ishelpAppraiseParse = this.detailComment[ind].ishelpAppraiseParse == 0 ? 1 : 0
						this.detailComment[ind].parseCount = this.detailComment[ind].ishelpAppraiseParse == 1 ? this.detailComment[ind].parseCount +1 : this.detailComment[ind].parseCount -1 
					}
					this.com.msg(res.message)
				})
				
			},
			// 评价详情
			 go_Detail(e){
				this.com.navto('./evaluate_detail/evaluate_detail?id='+e)
			}
		}
	}
</script>

<style scoped lang="scss">
.pinj{
	padding: 3%;
	.score{
		display: flex;justify-content: space-between;
		padding: 30rpx 0;
	}
	.xuan{
		display: flex;flex-wrap: wrap;border-bottom: 1rpx solid #eee;padding-bottom: 20rpx;
		.xuanitem{
			padding: 10rpx 20rpx;border-radius: 10rpx;border: 1rpx solid #C0C0C0;margin: 10rpx ;
			&.active{
				color: #0493fd;border: 1rpx solid #0493fd;
			}
		}
	}
}
.comment{
	padding: 0 3%;
	.commentuser{
		display: flex;justify-content: space-between;
		.userimg{
			display: flex;
			image{
				width: 80rpx;height: 80rpx;border-radius: 50%;margin-right: 14rpx;
			}
		}
	}
	.textcontent{
		line-height: 50rpx;
	}
	.imgswiper{
		display: flex;flex-wrap: wrap;
		image{
			width: 210rpx;height: 210rpx;border-radius: 10rpx;
			margin: 10rpx;
		}
	}
	.thumbs{
		padding: 3%;border-bottom: 1rpx solid #eee;text-align: right;margin-bottom: 20rpx;
	}
	
}
</style>
