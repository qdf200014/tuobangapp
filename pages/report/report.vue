<template>
	<view>
		<view class="content">
			<view class="items" v-for="(it,index) in list" :key="index" @click="go_tian(index,it.name)">	
					<view>{{it.name}}</view>
					<u-icon name="arrow-right" color="#999"></u-icon>
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
				type:-1,
				bzuuid:'',
				userid:''
			}
		},
		onLoad(e) {
			this.type = e.type
			this.bzuuid = e.bzUuid
			this.userid = e.id
		},
		methods: {
			go_tian(e,text){
				if (e == 1){
					this.com.navto('./pricelose?type='+this.type+'&cont='+this.userid+'&reasonText='+text+'&id='+this.bzuuid)
				}else{
					this.com.navto('./reportLoad?type='+this.type+'&id='+this.bzuuid+'&userid='+this.userid+'&reasonText='+text)
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
	

</style>
