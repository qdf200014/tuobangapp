<template>
	<view>
		<citySelect :district="district" :xians="xuans" :cityList="cityList" @back_city="back_city" @disCli="disCli"></citySelect>
	</view>
</template>

<script>
	import citySelect from '@/components/linzq-citySelect/linzq-citySelect.vue';
	export default {
		data() {
			return {
				district:'',
				cityList:'',
				cityName:'',
				xuans:'选择区县',
				indexCity:''
			}
		},
		onLoad(e) {
			console.log(e)
			this.indexCity = e.city
			if(uni.getStorageSync("address")){
				this.xuans = '切换区县'
				this.dist(uni.getStorageSync("address").name)
				if(uni.getStorageSync("address").dist != ''){
					this.district = uni.getStorageSync("address").name + uni.getStorageSync("address").dist
				}else{
					this.district = uni.getStorageSync("address").name
				}
				
			}else{
				this.xuans = '选择区县'
				this.district = e.city + e.dis
				this.dist(e.city)
			}
		},

		components:{
		    citySelect,
		},
		methods: {
		
			// 市级
			back_city(e){
				console.log(e)
				
				this.cityName = e.name
				let arr = {
					name:e.name,
					dist:''
				}
				uni.setStorageSync("address",arr)
				this.dist(this.cityName)
				uni.navigateBack()
			},
			// 区级
			dist(e){
				console.log(e)
				this.api.get('city/city',{city:e}).then(res=>{
					console.log(res)
					this.cityList = res.data
					
				})
			},
			// 区级
			disCli(e){
				console.log(e)
				let arr = {
					name:this.indexCity,
					dist:e.name
				}
				uni.setStorageSync("address",arr)
				uni.navigateBack()
			},
		}
	}
</script>

<style>

</style>
