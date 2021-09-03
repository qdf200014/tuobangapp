<template>
	<view class="page">
		
		<tb-my-attention :type="2" @go_master="go_master" @quguan="quguan" :datas="list"></tb-my-attention>
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
		onLoad(op) {
			this.id = op.id
			
			this.pages()
		},
		onShow() {
			if(this.id != uni.getStorageSync('userinfo_Data').id){
				uni.setNavigationBarTitle({
				title: '他的关注' //这是修改后的导航栏文字
				})
			}
		},
		methods: {
			pages(){
				this.api.post('hsFansInfo/getGuanZhu',{uid:this.id,fid:uni.getStorageSync('userinfo_Data').id}).then(res=>{
					console.log(res.data.hsFansVoList)
					if(res.flag){
					
						this.list = res.data.hsFansVoList
						if(res.data.hsFansVoList.length ==0){
							this.pagekun = true
						}
					}
				})
			},
			// 取关关注
			quguan(e,ind){
				this.api.post('hsFansInfo/addGuanZhu',{uid:e,fid:uni.getStorageSync("userinfo_Data").id}).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.msg(res.message)
						if(this.list[ind].state == 1){
							this.pages()
						}else{
							this.list[ind].state = 1
						}
					}
				})
			},
			//个人主页
			go_master(e){
				
				this.com.navto('../master_page?id='+e)
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
