<template>
	<view class="wrap">
		<view class="tips">温馨提示：最多只能选择两个服务区域</view>
		<view class="content">
			<scroll-view class="content_left"  scroll-y scroll-with-animation>
				<view class="left_item" :class="{active:leftIndex == it.id}" v-for="(it,index) in cityList" :key="index"
					@click="leftCli(it,index)"> 
					{{it.name}}
				 </view>
			</scroll-view>
			<scroll-view class="content_right"  scroll-y scroll-with-animation v-if="leftIndex != -1" >
				<view class="left_items" v-for="(it,index) in rowlist" :key="index" @click="checkboxGroupChange(index,it)">
					<view>
						{{it.name}}
					</view>
					<u-checkbox-group >
						<u-checkbox 
							v-model="it.check" 
							:name="it.name"
							:disabled="checkedtype"
							active-color="#F25834"
						></u-checkbox>
					</u-checkbox-group>
				</view>
			</scroll-view>
		</view>
		<!-- 底部 -->
		<view class="buttonc" v-if="buttype">
			<view class="button_top">
				<view style="border-right: 1rpx solid #C8C7CC;padding-right: 30rpx;">
					已选({{rowAdd.length}})
				</view>
				<view class="topItem">
					<view class="items" v-for="(it,index) in rowAdd" :key="index">
						{{it.name}} <text style="margin-left: 15rpx;" @click="del(it,index)"><u-icon name="close"></u-icon></text>
					</view>
				</view>
			</view>
			<view class="button_bot">
				<tb-button buttitle="确定" bgcolor="#F25834" @but_cli="but_cli"></tb-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				leftIndex:-1,
				cityList:[],//区
				rowlist:'' ,//街道
				rowAdd:[],
				checkedtype:false,//shif
				leftname:'',//左侧名字
				buttype:false,//底部展示
				addressList:[]// 地区
			}
		},
		onLoad() {
			if(uni.getStorageSync("areaserve")){
				this.rowAdd = uni.getStorageSync("areaserve")
			}
			this.dist(uni.getStorageSync("address").name)
			// let arr=['a','b','c','d']
			// arr.splice(2,1); //结果arr=['a','d']
			// console.log(arr)
		},
		watch:{
			rowAdd(a,b){
				if(a.length == 0){
					this.buttype = false
				}else{
					this.buttype = true
				}
			}
		},
		methods: {
			// 区级
			dist(e){
				console.log(e)
				this.api.get('city/city',{city:e}).then(res=>{
					console.log(res)
					this.cityList = res.data
					
				})
			},
			//左侧
			leftCli(e,index){
				// console.log(e)
				this.leftIndex = e.id
				this.leftname = e.name
				if(!this.cityList[index].data){
					this.api.get('city/city',{cid:e.id}).then(res=>{
						// console.log(res)
						res.data.unshift({name:'全'+ e.name,id:e.id})
						res.data.forEach(el=>{ 
							el.check = false
						})
						this.cityList[index].data =  res.data
						// console.log(this.cityList)
						this.rowlist = this.cityList[index].data
						this.rowlist.forEach(i=>{
							this.rowAdd.forEach(o=>{
								if(i.id == o.id){
									i.check = true
								}
							})
						})
					})
				}else{
					this.rowlist = this.cityList[index].data
					this.rowlist.forEach(i=>{
						this.rowAdd.forEach(o=>{
							if(i.id == o.id){
								i.check = true
							}
						})
					})
				}
				
			},
			//获取下标
			rigInd(arr,obj){
				var i = arr.length;
				while (i--) {
					if (arr[i] === obj) {
						return i;
					}
				}
				return -1
			},
			// 右侧
			checkboxGroupChange(ind,item){
				console.log(item)
					let flag = false;
					let ina = 0;
					item.qu = this.leftname
					this.rowlist[ind].check = this.rowlist[ind].check == true ? false : true
					// 是否有第一个 全**
					if(ind == 0){
						this.rowlist.forEach(el=>{
							el.check = false
						})
						this.rowlist[ind].check = true
						for (let i = 0; i < this.rowAdd.length; i++) {
							if(this.rowAdd[i].pid == this.leftIndex){
								this.rowAdd.splice(i,1)
								for (let i = 0; i < this.rowAdd.length; i++) {
									if(this.rowAdd[i].pid == this.leftIndex){
										this.rowAdd.splice(i,1)
									}
								}
							}
						}
					}else{
						this.rowlist[0].check = false
						this.rowlist[ind].check = true
						//是否第一个 全***
						for (let i = 0; i < this.rowAdd.length; i++) {
							if(this.rowAdd[i].id == this.leftIndex){
								this.rowAdd.splice(i,1)
							}
						}
					}
					for (let i = 0; i < this.rowAdd.length; i++) {
						if(this.rowAdd[i].id == item.id){
							flag = false;
							ina = i;
							break;
						}else{
							flag = true;
						}
					}
					//等于0时候不能循环所以直接加
					if(this.rowAdd.length == 0){
						this.rowAdd.push(item)
					}else{
						if(this.rowAdd.length <= 2) {
							if(flag){
								this.rowAdd.push(item)
							}else{
								this.rowlist[ind].check =  false
								this.rowAdd.splice(ina,1)
							}
							if(this.rowAdd.length === 3) {
								this.rowlist[ind].check =  false
								this.com.msg('只能选择两个')
								this.rowAdd.splice(2,1)
							}
						}
					}
			},
			// 删
			del(e,index){
				this.cityList.forEach(it=>{
					if(it.data){
						it.data.forEach(i=>{
							if(i.id == e.id){
								i.check = false
							}
						})
					}
				})
				
				this.rowAdd.splice(index,1)
			},
			// 点确定
			but_cli(){
				
				uni.setStorageSync('areaserve',this.rowAdd)
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
.buttonc{
	box-shadow: 0rpx 0rpx 1rpx 3rpx rgba(0,0,0,0.1);
	padding-bottom: 3%;
	.button_top{
		padding: 3%;
		display: flex;
		.topItem{
			width: 75%;
			display: flex;
			.items{
				background-color: #FFEEEA;color: #F25834;padding: 5rpx 25rpx;margin: 0 10rpx;border-radius: 50rpx;
			}
		}
	}
}
.wrap{
	height: calc(100vh);
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
	display: flex;
	flex-direction: column;
}
.tips{
	width: 100%;padding: 20rpx 3%;background-color: #FFEEEA;color: #F25834;
}
.content{
	padding: 3%;width: 100%;
	display: flex;flex: 1;overflow: hidden;

	.content_left{
		width: 50%;
		height: 100%;
		.left_item{
			padding: 20rpx;margin-bottom: 10rpx;
			&.active{
				color: #FE552E;
			}
		}
		
	}
	.content_right{
		width: 50%;
		height: 100%;
		border-left: 1rpx solid #eee;
		.left_items{
			width: 100%;
			padding: 20rpx;margin-bottom: 10rpx;
			display: flex;justify-content: space-between;
			&.active{
				color: #FE552E;
			}
		}
	}
}
</style>
