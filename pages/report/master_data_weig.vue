<template>
	<view>
		<view class="title">选择违规类型</view>
		<view class="radios"  >
			<u-radio-group @change="radioGroupChange">
				<u-radio 
					v-for="(item, index) in list" :key="index" 
					:name="item.name">
					{{item.name}}
				</u-radio>
			</u-radio-group>
		</view>
		
		<view class="title" style="margin-top: 20rpx;">请选择涉及违规的内容（可多选）</view>
		<view class="checkstyle" v-for="(item, index) in checkList" :key="index" >
			<u-checkbox-group >
				<u-checkbox 
					v-model="item.type" 
					@change="checkboxGroupChange(item,index)"
					:name="item.name"
				>{{item.name}}</u-checkbox>
			</u-checkbox-group>
		</view>
		<view class="button">
			<tb-button buttitle="提交" @but_cli="but_cli"></tb-button>
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
						name:'存在色情、淫秽、低俗等不适内容' /////////
					},
					{
						name:'存在辱骂、中伤、诽谤他人的内容'
					},
					{
						name:'存在广告、营销、站外联系方法等内容'
					}
				],
				checkList:[
					{
						name:'头像',
						type:false
					},
					{
						name:'昵称',
						type:false
					},
					{
						name:'简介',
						type:false
					},
					{
						name:'店铺介绍',
						type:false
					},
					
				],
				radioData:'',//单选
				checkData:'',
				userid:''
			}
		},
		onLoad(e) {
			this.userid = e.cont
		},
		methods: {
			// 单选
			radioGroupChange(e){
				console.log(e)
				this.radioData = e
			},
			// 复选
			checkboxGroupChange(e,index){
				console.log(e)
				this.checkList[index].type = this.checkList[index].type == true ? false : true
			},
			but_cli(){
				let arr = []
				this.checkList.forEach(i=>{
					if(i.type){
						arr += i.name + ','
					}
				})
				this.checkData = arr.substr(0,arr.length -1)
				this.api.post('report/reportPerson',{
					ryUuid:this.userid,
					informantId:uni.getStorageSync('userinfo_Data').id,
					reportReason:'个人主页资料违规',
					reportType:this.radioData,
					reportContent:this.checkData
				}).then(res=>{
					console.log(res)
					this.com.msg(res.message)
					this.com.two_back()
				})
			}
		}
	}
</script>

<style>
	page{
		background-color: #F5F5F5;
	}
</style>
<style lang="scss" scoped>
.title{
	line-height: 100rpx;background-color: #fff;padding: 0 3%;margin: 10rpx 0;
}
.radios{
	padding: 3%;border-bottom: 2rpx solid #F5F5F5;
	background-color: #fff;

}
.checkstyle{
	padding: 3%;border-bottom: 2rpx solid #F5F5F5;
	background-color: #fff;
	
}
.button{
	width: 100%;
	position: fixed;left: 0;bottom: 50rpx;
}
</style>
