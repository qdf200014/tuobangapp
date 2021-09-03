<template>
	<view style="padding: 3%;">
		<u-steps :list="numList" mode="number" :current="current" direction="column"></u-steps>
		<view class="but" v-if="current == 4">
			<view class="butLeft" @click="appealType(0)">
				拒绝
			</view>
			<view class="butRig" @click="appealType(1)">
				同意
			</view>
		</view>
		<view class="jianyi" v-if="numList[3].state == 3 && numList[3].isUpload == 0">
			<u-upload :action="action" ref="uUpload" max-count="5" ></u-upload>
			<tb-button buttitle="上传" @but_cli="butcli"></tb-button>
		</view>
	</view>
</template>

<script>
	import {ip} from '../../../api.js'
	export default {
		data() {
			return {
				action: ip + 'upload/uploadAppealFile',
				numList: [{
					title:'申诉内容',
					name: '2021年3月12日在安河桥附近寻求帮助,\n答复法师的\n \n由于帮主个人原因无法完成帮助'
				}, {
					title:'选定裁判',
					name: '等待裁判给出处理意见'
				}, {
					title:'裁判处理意见',
					name: '2021年3月12日在安河桥附近寻求帮助,\n答复法师的\n'
				}, {
					title:'是否同意处理意见',
					name: ''
				}, {
					title:'申诉处理完成',
					name: '申诉已处理完成'
				}],
				id:0,
				current:0,
				lists:''
			}
		},
		onLoad(op) {
			this.id = op.id
			this.pagedata()
		},
		methods: {
			pagedata(){
				this.api.get('hsAppeal/viewAppealDetails/'+this.id).then(res=>{
					console.log(res)
					this.numList = res.data.appealInfo
					this.current = res.data.state -1
					this.id = res.data.appealId
				})
			},
			appealType(e){
				this.api.get('hsAppea/doYouAgreeComplaintHandlingOpinion/'+e+'/'+this.id).then(res=>{
					console.log(res)
					this.com.msg(res.message)
				})
			},
			butcli(){
				let arrimg = this.$refs.uUpload.lists
				this.lists = ''
				if(arrimg.length>0){
					let b = []
					arrimg.forEach(i=>{
						
						b += i.url+','
					})
					
					this.lists = b.substr(0,b.length -1)
					console.log(this.lists)
				}
				let arr = {
				    "id":this.id,
				    "content":this.lists,
				    "type":1
				}
				this.api.post('hsAppeal/proofOfInformationSubmitted',arr).then(res=>{
					console.log(res)
					if(res.flag){
						this.pagedata()
					}
					this.com.msg(res.message)
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.but{
	margin-top: 50rpx;font-size: 30rpx;
	width: 100%;display: flex;justify-content: space-around;
	.butLeft{
		border: 1rpx solid #fd3b41;color: #fd3b41;
		padding: 8rpx 56rpx;border-radius: 50rpx;
	}
	.butRig{
		color: #fff;background-color: #fd3b41;
		padding: 8rpx 56rpx;border-radius: 50rpx;
	}
}
</style>
