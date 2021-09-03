<template>
	<view style="padding: 3%;">
		<view class="title">
			基本信息
		</view>
		<view class="items">
			<view class="items_left">
				头像
			</view>
			<view class="items_right" @click="photograph">
				<image :src="images_ava" mode="aspectFill"></image>
			</view>
		</view>
		<view class="items" @click="gotoPage('./user_set_child/user_set_child?name='+ username+'&label='+biaoqian)">
			<view class="items_left">
				昵称
			</view>
			<view class="items_right">
				{{username}}<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="items" @click="sex_show = true">
			<view class="items_left">
				性别
			</view>
			<view class="items_right">
				{{sex_name}}<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="items" @click="show=true">
			<view class="items_left">
				生日
			</view>
			<view class="items_right">
				{{nametime}}<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="items" @click="education_show = true">
			<view class="items_left">
				学历
			</view>
			<view class="items_right">
				{{education_name}}<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="items"  @click="gotoPage('./user_set_child/set_jobname')">
			<view class="items_left">
				职业
			</view>
			<view class="items_right">
				{{profession}}<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="items"  @click="gotoPage('../publish/addtopic?type='+ 3)">
			<view class="items_left">
				标签
			</view>
			<view class="items_right">
				<view class="loabl" v-for="(it,index) in loabls">{{it.name}}</view>
			</view>
		</view>
		<view class="items"  @click="gotoPage('./user_set_child/user_signature?name='+intro+'&label='+biaoqian)">
			<view class="items_left">
				个性签名
			</view>
			<view class="items_right">
				<view class="items_right_content">{{intro}}</view>
				<u-icon name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="title">
			认证信息
		</view>
		<view class="items">
			<view class="items_left">
				实名认证
			</view>
			<view class="items_right_but" v-if="autonym == 1" @click="gotoPage('./user_set_child/identity')">
				去认证
			</view>
			<view class="items_right_but" v-else>
				已完成
			</view>
		</view>
		<!-- 性别 -->
		<u-select v-model="sex_show" :list="list_sex" @confirm="confirm_sex"></u-select>
		<!-- 生日 -->
		<u-picker mode="time" v-model="show" @confirm="confirm" :default-time="morenTime" :end-year="endyeat"></u-picker>
		<!-- 学历 -->
		<u-select v-model="education_show" :list="list3" @confirm="confirm_edu"></u-select>
	</view>
</template>

<script>
	import {
		ip
	} from '../../api.js';
	export default {
		data() {
			return {
				morenTime:new Date().toISOString().slice(0,10),
				endyeat:new Date().toISOString().slice(0,4),
				uploadAction: ip + 'upload/uploadHeadImg',
				image:[],
				images_ava:'',//头像
				username:'',//用户名
				id:'',
				show:false,//生日状态
				nametime:'',//生日日期
				education_show:false,//学历
				education_name:'',//学历显示
				list3 : [{
					value: '1',
					label: '初中'
				}, {
					value: '2',
					label: '高中'
				}, {
					value: '2',
					label: '大专'
				}, {
					value: '2',
					label: '本科'
				}, {
					value: '2',
					label: '硕士'
				}, {
					value: '2',
					label: '博士'
				}],
				sex_show:false,//性别
				sex_name:'',//性别展示
				list_sex:[
					{value:1,
					label:'男'},
					{value:2,
					label:'女'}
				],
				intro:'',//简介
				profession:'',//职业
				autonym:1,//0：已完成实名认证  1：未完成
				loabls:'',
				biaoqian:''
			}
		},
		onLoad() {

			this.id = uni.getStorageSync("userinfo_Data")
			this.api.get('education/getAll').then(res=>{
				console.log(res)
				if(res.flag){
					this.list3 = res.data
				}
			})
			
		},
		onShow() {
			this.api.get('person/getPersonByRyUuid').then(res=>{
				console.log(res)
				if(res.flag){
					// 实名
					this.autonym = res.data.isAuthentication
					this.username = res.data.ryPetName
					this.sex_name = res.data.rySex
					this.nametime = res.data.ryBirthday
					this.education_name = res.data.educationName
					this.images_ava = res.data.ryHeadImg
					this.intro  = res.data.ryIntro
					this.profession = res.data.jobName
					this.loabls = res.data.ryLabel
					let idzu = ''
					res.data.ryLabel.forEach(i=>{
						idzu +=i.id+','
					})
					this.biaoqian = idzu.substr(0,idzu.length - 1)
					uni.setStorage({
						key: 'keywordc',
						data: JSON.stringify(res.data.ryLabel)//转换为字符串形式
					})
					console.log(this.loabls)
					if(res.data.ryBirthday){
						this.morenTime = res.data.ryBirthday
					}
				}
			})
		},
		methods: {
			gotoPage(e){
				this.com.navto(e)
			},
			//头像
			photograph(){
				let that = this
				uni.chooseImage({
					count:1, 
					sourceType: ['camera '], //从相册选择
					success: (chooseImageRes) => {
						console.log(chooseImageRes)
						const tempFilePaths = chooseImageRes.tempFilePaths[0]
						// console.log(chooseImageRes.tempFilePaths[0])
						uni.uploadFile({
							url: that.uploadAction,
							filePath: tempFilePaths,
							name: 'file',
							formData: {
								'user': 'test'
							},
							// header:{
							// 	'token':uni.getStorageSync('token')
							// },
							success: (up) => {
								
								that.image = JSON.parse(up.data).data
								console.log(JSON.parse(up.data))
								that.images_ava = that.image
								that.api.post('person/comInfo',{
									ryHeadImg:that.image,
									ryUuid:that.id.id,
									ryLabel:that.biaoqian
								}).then(res=>{
									console.log(res)
									if(res.flag){
										that.com.msg('修改成功')
									}
								})
							}
						});
						
					}
				});
			},
			//确定日期
			confirm(e){
				console.log(e)
				this.nametime = e.year+'-'+e.month +'-'+e.day
				this.api.post('person/comInfo',{
					ryBirthday:this.nametime,
					ryUuid:this.id.id,
					ryLabel:this.biaoqian}).then(res=>{
					if(res.flag){
						this.com.msg('成功')
					}
				})
			},
			// 学历确定
			confirm_edu(e){
				this.education_name = e[0].label
				this.api.post('person/comInfo',{
					ryEducation:e[0].value,
					ryUuid:this.id.id,
					ryLabel:this.biaoqian}).then(res=>{
					if(res.flag){
						this.com.msg('成功')
					}
				})
			},
			// 性别
			confirm_sex(e){
				this.sex_name = e[0].label
				this.api.post('person/comInfo',{
					rySex:this.sex_name,
					ryUuid:this.id.id,
					ryLabel:this.biaoqian}).then(res=>{
					if(res.flag){
						this.com.msg('成功')
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.title{
	color: #999999;margin: 25rpx 0;
}
.items{
	padding: 20rpx 0;
	font-size: 30rpx;
	display: flex;justify-content: space-between; align-items: center;  
	.items_left{
		
	}
	.items_right{
		color: #999;
		image{
			width: 140rpx ;height: 140rpx;border-radius: 50%;
			border: 1rpx solid #999;
		}
		display: flex;
		.items_right_content{
			width: 400rpx;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;
		}
		.loabl{
			background-color: #fff2ec;padding: 0 20rpx;border-radius: 4rpx;margin: 0 10rpx;
		}
	}
	.items_right_but{
		background-color: #eaeaea;padding: 6rpx 25rpx;border-radius: 50rpx;
	}
}
</style>
