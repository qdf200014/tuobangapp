<template>
	<view class="page">
		
		<tb-my-attention :type="1"  @go_master="go_master" @quguan="quguan" :datas="list"></tb-my-attention>
		<view v-show="pagekun" style="padding-top: 200rpx;">
			<u-empty text="暂无数据" mode="list"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:''	,
				pagekun:false,
				id:''
			}
		},
		onLoad(e) {
			this.id = e.id
			this.pages()
		},
		methods: {
			pages(){
				this.api.post('hsFansInfo/getFans',{uid:this.id,fid:uni.getStorageSync('userinfo_Data').id}).then(res=>{
					console.log(res.data.hsFansVoList)
					if(res.flag){
						this.list = res.data.hsFansVoList
						if(res.data.hsFansVoList.length ==0){
							this.pagekun = true
						}
					}
				})
			},
			
			//个人主页
			go_master(e){
				this.com.navto('../master_page?id='+e)
			},	
			quguan(e){
				this.api.post('hsFansInfo/addGuanZhu',{uid:e,fid:uni.getStorageSync("userinfo_Data").id}).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.msg(res.message)
						this.pages()
					}
				})
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
.page{
	padding: 0 3%;
}
</style>
