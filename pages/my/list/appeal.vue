<template>
	<view class="pingjia">
		<view class="kapian">
			<view>上传六张(非必传)</view>
			<u-upload :action="action" ref="uUpload" max-count="5" ></u-upload>
			<view class="pingjianeirong">
	
				<view class="jianyi">
					<u-input type="textarea" v-model="jianyi" maxlength="2000" :clearable="false" placeholder="请填写您的申诉原因" />
				</view>
			</view>
		</view>
		<button @click="submit">提交</button>
	</view>
</template>

<script>
	import {ip} from '../../../api.js'
	export default {
		data() {
			return {
				action: ip + 'upload/uploadAppealImg',
				detaild: '',
				info: {},
				tupianURL: '',
				jianyi:'',
				type:0,//1个人中心 
				jdid:'',
				lists:[],
				texts:''
			}
		},
		onLoad(option) {
			console.log(option)
			if(option.id !== undefined){ 
				this.detaild = option.id;
			}
			this.type = option.type //0帮客 1帮主
			this.jdid = option.id //二级原因
			this.texts = option.reasonText //一级原因
		},
		created() {
		},
		methods: {
			
			submit() {
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
				    "jdUuid":this.jdid,
				    "appealType":this.type,
				    "appealReason":this.jianyi,
				    "appealPhoto":this.lists
				}
				this.api.post('hsAppeal/addAppeal',arr).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.msg('申诉成功')
						this.com.two_back()
					}else{
						this.com.msg(res.message)
					}
				
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pingjia {
		background-color: #FAFAFA;
		min-height: calc(100vh - 80rpx);

		.kapian {
			width: 95%;
			margin: auto;
			margin-top: 20rpx;
			border-radius: 20rpx;
			background-color: #FFFFFF;
			padding: 20rpx;

			.bangzhuinfo {
				display: flex;
				align-items: center;
				border-bottom: 1rpx solid #ccc;
				padding-bottom: 10rpx;

				.u-avatar {
					width: 70rpx !important;
					height: 70rpx !important;
					flex: 0 0 70rpx !important;
				}

				text {
					padding-left: 30rpx;
				}
			}

			.pingjianeirong {

				.xingxing {
					display: flex;
					justify-content: space-around;

					.u-rate {
						flex: 50%;
					}
				}

				.jianyi {
					background-color: #FAFAFA;
					margin-top: 20rpx;
					border-radius: 20rpx;
				}
			}
		}

		button {
			background-color: #1282F2;
			color: #FFFFFF;
			margin-top: 20rpx;
			line-height: 80rpx;
			width: 95%;
		}
	}
</style>
