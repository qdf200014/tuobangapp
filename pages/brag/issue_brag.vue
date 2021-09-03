<template>
	<view style="padding: 3%;">
		
		<view v-if="type == 1">
			<u-upload :action="action" ref="uUpload" max-count="5" ></u-upload>
		</view>
		<view v-else>
			<view class="vid_f_child" v-if="ship_list" >
				<video  :src="ship_list" controls ></video>
				<view class="del_b" @click="del_vid(ind)">
					<u-icon class="u-icon" name="close" size="20" color="#fff"></u-icon>
				</view>
			</view>
			<view class="videos_list" v-if="ship_list.length < 2" @click="videos">
				<view class="vid_icon">
					<u-icon name="camera" size="50" color="#666"></u-icon>
				</view>
				<view class="vid_tit">
					选择视频
				</view>
			</view>
		</view>
		
		<view style="margin-top: 30rpx;">
			<u-input type="textarea" v-model="texrval" maxlength="300" :clearable="false" placeholder="分享内容" />
		</view>
		
		<view class="bottom">
			<tb-button buttitle="发布"  @but_cli="but_cli"></tb-button>
		</view>
	</view>
</template>

<script>
	import {ip} from '../../api.js'
	export default {
		data() {
			return {
				action: ip + 'upload/uploadShowImg',
				texrval:'',  //内容
				lists:[],    //图
				ship_list:'',//视频
				type:1 ,// 1图片 2视频
				taskId:''
			}
		},
		onLoad(op) {
			this.type = op.type // || 1图片 2视频
			this.taskId = op.id  
		},
		methods: {
			//上传视频
			videos(){
				let that = this
				 uni.chooseVideo({ 
					maxDuration:15,
					count: 1,
					sourceType: ['camera', 'album'],
					success: function (res) {
						console.log(res)
						
						let src = res.tempFilePath;
						that.com.msg("正在上传")
						// return
						uni.uploadFile({
							url: that.action, //仅为示例，非真实的接口地址
							filePath: src,
							name: 'file',
							
							formData: {
								'user': 'test'
							},
							header:that.token,
							success: (red) => { 
								let arr =JSON.parse(red.data) 
								console.log(arr);
								uni.hideToast()
								that.com.msg('上传成功')
								that.ship_list = arr.data
							}
						});
					}
				});
			},
			
			//发布
			but_cli(){
				let arr = ''
				let img = ''
				// console.log(this.lists)
				//图片处理
				if(	this.type == 1){
					this.lists = this.$refs.uUpload.lists;
					
					this.lists.forEach(a=>{
						console.log(a)
						arr += a.url+','
						img = arr.substr(0,arr.length -1)
					})
					console.log(img)
				}
				let data = {
					jdUuid:this.taskId, //任务id
					ryUuid: uni.getStorageSync('userinfo_Data').id, //发布人id
					showImg:img,  // 图片
					showVideo:this.ship_list, // 视频
					showContent:this.texrval // 评论内容
				}
				
				if(this.texrval != ''){
					this.api.post('show/addShowContent',data).then(res=>{
						console.log(res)
						this.com.msg(res.message)
						this.com.two_back()
					})
				}else{
					this.com.msg("请输入内容")
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
.bottom{
	width: 100%;
	position: fixed;left: 0;bottom: 80rpx;
}
.vid_f_child{
	width: 96%;
	margin: 10rpx;width: 96%;height: 400rpx;border-radius: 10rpx;overflow: hidden;
	position: relative;
	.del_b{
		position: absolute;right: 10rpx;top: 10rpx;background-color: red;border-radius: 50%;
		z-index: 20;width: 40rpx;height: 40rpx;text-align: center;
	}
	video{
		width: 100%;height: 400rpx;
		
	}
}
.videos_list{
	width: 96%;height: 400rpx;background-color: #f4f5f6;border-radius: 10rpx;margin: 10rpx;
	text-align: center;padding-top: 150rpx;
	.vid_tit{
		color: #666;line-height: 60rpx;
	}
}
</style>
