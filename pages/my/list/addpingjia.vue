<template>
	<view class="pingjia">
		
		<view class="kapian">
			<view class="pingjianeirong">
				<view class="xingxing">
					<view>
						<text class="xingx_pf" style="font-weight: bold;">
							评分
						</text>
						<u-rate :count="5" v-model="form.value" active-color="#feaf19" :size="40"></u-rate>
					</view>
					<text v-if="form.value == 1">很不满意</text>
					<text v-else-if="form.value == 2">不满意</text>
					<text v-else-if="form.value == 3">一般</text>
					<text v-else-if="form.value == 4">满意</text>
					<text v-else-if="form.value == 5">很满意</text>
				</view>
				<view class="xingxing">
					<view>
						<text class="xingx_pf">
							帮助及时
						</text>
						<u-rate :count="5" v-model="form.value2" active-color="#feaf19" :size="40"></u-rate>
					</view>
					<text v-if="form.value2 == 1">很不满意</text>
					<text v-else-if="form.value2 == 2">不满意</text>
					<text v-else-if="form.value2 == 3">一般</text>
					<text v-else-if="form.value2 == 4">满意</text>
					<text v-else-if="form.value2 == 5">很满意</text>
				</view>
				<view class="xingxing">
					<view>
						<text class="xingx_pf">
							热情周到
						</text>
						<u-rate :count="5" v-model="form.value3" active-color="#feaf19" :size="40"></u-rate>
					</view>
					<text v-if="form.value3 == 1">很不满意</text>
					<text v-else-if="form.value3 == 2">不满意</text>
					<text v-else-if="form.value3 == 3">一般</text>
					<text v-else-if="form.value3 == 4">满意</text>
					<text v-else-if="form.value3 == 5">很满意</text>
				</view>
				<view class="xingxing">
					<view>
						<text class="xingx_pf">
							专业熟练
						</text>
						<u-rate :count="5" v-model="form.value4" active-color="#feaf19" :size="40"></u-rate>
					</view>
					<text v-if="form.value4 == 1">很不满意</text>
					<text v-else-if="form.value4 == 2">不满意</text>
					<text v-else-if="form.value4 == 3">一般</text>
					<text v-else-if="form.value4 == 4">满意</text>
					<text v-else-if="form.value4 == 5">很满意</text>
				</view>
				<view class="xingxing">
					<view>
						<text class="xingx_pf">
							安全可靠
						</text>
						<u-rate :count="5" v-model="form.value5" active-color="#feaf19" :size="40"></u-rate>
					</view>
					<text v-if="form.value5 == 1">很不满意</text>
					<text v-else-if="form.value5 == 2">不满意</text>
					<text v-else-if="form.value5 == 3">一般</text>
					<text v-else-if="form.value5 == 4">满意</text>
					<text v-else-if="form.value5 == 5">很满意</text>
				</view>
				<view class="xingxing">
					<view>
						<text class="xingx_pf">
							收费合理
						</text>
						<u-rate :count="5" v-model="form.value6" active-color="#feaf19" :size="40"></u-rate>
					</view>
					<text v-if="form.value6 == 1">很不满意</text>
					<text v-else-if="form.value6 == 2">不满意</text>
					<text v-else-if="form.value6 == 3">一般</text>
					<text v-else-if="form.value6 == 4">满意</text>
					<text v-else-if="form.value6 == 5">很满意</text>
				</view>
				
				<view class="jianyi">
					<u-input type="textarea" v-model="form.jianyi" maxlength="500" :clearable="false" placeholder="您的宝贵建议" />
				</view>
			</view>
			<view v-if="form.jianyi">
				再评论 {{15 - form.jianyi.length < 0 ? 0 : 15 - form.jianyi.length}}字
			</view>
			<u-upload :action="action" ref="uUpload" max-count="3" upload-text="上传图片"></u-upload>
		</view>
		<tb-button buttitle="提交" @but_cli="submit"></tb-button>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {ip} from '../../../api.js'
	export default {
		data() {
			return {
				action: ip + 'upload/uploadEvalImg',
				lists:[],
				bz_uuid: '',
				info: {},
				tupianURL: '',
				form: {
					value: 0,
					value2: 0,
					value3: 0,
					value4: 0,
					value5: 0,
					value6: 0,
					jianyi: ''
				}
			}
		},
		onLoad(option) {
			console.log(option)
			this.bz_uuid = option.id;
		},
		created() {
		},
		methods: {
			
			submit() {
				let arrimg = this.$refs.uUpload.lists
				this.lists = ''
				if(arrimg.length > 0){
					let b = []
					arrimg.forEach(i=>{
						
						b += i.url+','
					})
					this.lists = b.substr(0,b.length -1)
				}
				if(this.form.value == 0 || this.form.value2 == 0 || this.form.value3 == 0 || this.form.value4 == 0 ||this.form.value5 == 0 || this.form.value6 == 0){
					this.com.msg('请选择星级')
					return
				}
				let datas = {
				    "jdUuid":this.bz_uuid,
				    "proposal":this.form.jianyi,
				    "photo":this.lists,
				    "satisfactionScore":this.form.value,
				    "timelinessScore":this.form.value2,
				    "serveScore":this.form.value3,
				    "professionalScore":this.form.value4,
				    "qualityScore":this.form.value5,
				    "reliabilityScore":this.form.value6
				}
				this.api.post('response/addComments',datas).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.msg('评价成功')
						this.com.two_back()
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
				padding-top: 20rpx;

				.xingxing {
					display: flex;justify-content: space-between;
					margin-bottom: 30rpx;
					.u-rate {
						flex: 50%;
					}
					.xingx_pf{
						display: inline-block;
						width: 130rpx;
					}
				}

				.jianyi {
					background-color: #FAFAFA;
					margin-top: 20rpx;
					border-radius: 20rpx;
					padding: 20rpx;
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
