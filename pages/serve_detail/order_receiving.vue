<template>
	<view class="pages">
		<textarea v-model="form.textarea" placeholder="请填写您的需求备注" />
		<view>
			<u-upload :action="uploadAction"  :custom-btn="true" :max-count="5" :name="'file'" ref="uUpload">
				<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
					<u-icon name="plus" size="60" :color="$u.color['lightColor']"></u-icon>
				</view>
			</u-upload>
		</view>
		<view class="dizhi" @click="xuanzedizhi">
			<u-icon name="map"></u-icon>
			<text>地址：</text>
			<text v-if="form.positionName">{{form.address+form.positionName}}</text>
			<text v-else>请选择地址</text>
		</view>
		<view class="jiage" >
			<view class="left">
				<u-icon name="red-packet-fill" color="#BFBFBF" size="40rpx"></u-icon>
				<text class="title">酬金</text>
			</view>
			<view class="right">
				<input type="number" v-model="form.jiage" placeholder="0" maxlength="6"/>
			</view>
		</view>
		 <view class="but_place">
			 <tb-button buttitle="提交需求备注" @but_cli="but_cli"></tb-button>
		 </view>
		 <u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	import {ip} from '../../api.js';
	export default {
		data() {
			return {
				uploadAction: ip + '/upload/uploadHelpImg',
				form: {
					textarea:'',
					jiage:'',
					address: '',
					positionName: '',
					latitude: '',
					longitude: ''
				},
				lists:[],//图组
				detailId:0,//服务id
			};
		},
		onLoad(op) {
			this.detailId = op.id
		},
		methods: {
			//地址
			xuanzedizhi() {
				uni.chooseLocation({
					success: (res) => {
						console.log(res)
						this.form.address = res.address;
						this.form.positionName = res.name;
						this.form.latitude = res.latitude;
						this.form.longitude = res.longitude;
					}
				});
			},

			//提交
			but_cli(){
				const {address,positionName,latitude,longitude} = this.form;
				if(!address && !positionName && !latitude && !longitude){
					this.$refs.uTips.show({
						title: '请选择地址！',
						type: 'error',
						duration: '2000'
					})
					return;
				}
				let arrimg = this.$refs.uUpload.lists
				this.lists = []
				if(arrimg){
					let b = []
					arrimg.forEach(i=>{
						
						b += i.url+','
					})
					this.lists = b.substr(0,b.length -1)
					console.log(this.lists)
				}
				let arr = {
				    bzUuid:this.detailId,
				    jdTitle:this.form.textarea,
				    photo:this.lists,
				    address:this.form.address+this.form.positionName,
				    latitude:this.form.latitude,
				   	longitude:this.form.longitude,
				    type: 1,
					transactprice:this.form.jiage
					
				}
				console.log(arr)
				this.api.post('response/acceptHelp',arr).then(res=>{ 
					console.log(res)
					if(res.flag){
						this.com.redto('../my/order_detail?id='+res.data+'&type='+ 1 +'&shengf='+ 2) //1帮主 2帮客)
					}else{
						this.com.msg(res.message)
					}
				})
			}
		}
	};
</script>

<style scoped lang="scss">
.pages{
	padding: 3% 4%;
	textarea{
		height: 240rpx;width: 100%;color: #888;
	}
	.slot-btn {
		width: 200rpx;
		height: 200rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgb(244, 245, 246);
		border-radius: 10rpx;
	}
	.dizhi {
		margin-top: 30rpx;
		font-size: 24rpx;
		background-color: #F8F8F8;
		border-radius: 100rpx;
		color: #9D9D9D;
		padding: 6rpx 30rpx;
		display: inline-block;
	}
	.jiage {
		margin-top: 100rpx;
		font-size: 32rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex: 1;
	
		.title {
			color: #373737;
			padding-left: 30rpx;
		}
	
		.qian {
			padding-left: 100rpx;
			color: #ED4639;
			padding-right: 10rpx;
		}
	
		.xuanze {
			color: #ADADAD;
		}
		input{
			width: 200rpx;
			text-align: right;color: red;
		}
	}
	.but_place{
		width: 100%;
		position: fixed;left: 0;bottom: 90rpx;
	}
}
</style>
