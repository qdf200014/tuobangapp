<template>
	<view class="wrap">
		<view class="head">
			<view class="head_tab">
				<u-tabs :list="list" :is-scroll="false" :current="current" 
				bgColor="rgba(0,0,0,0)" @change="change" font-size="36"
				inactiveColor="#fff" activeColor="#fff" item-width="150" 
				bar-width="30" bar-height="10" :bar-style="{'background-color':'#ffd800'}"
				></u-tabs>
			</view>
		</view>
		<view style="position: fixed;top: 200rpx;left: 0;width: 100%;">
			<tb-pulldown bgcolor="#fff" textcolor="#000" :pullshow="false" :scrollY="false" @onRefresh="onRefresh">
				<view slot="waib">
					<swiper  class="swiper_zi" :current="current" @change="swiperchange">
						<!-- 商圈 -->
						<swiper-item class="swiper_item" >
							<scroll-view  scroll-y="true" class="scroll-Y">
								<tb-list-tabA :lista="lista" :shangp="shangp"></tb-list-tabA>
							</scroll-view>
						</swiper-item>
						<!-- 社区 -->
						<!-- <swiper-item class="swiper_item" >
							<scroll-view  scroll-y="true" class="scroll-Y">
								<tb-list-tabB :listb="listb" :bangzhu="bangzhu"></tb-list-tabB>
							</scroll-view>
						</swiper-item> -->
						<!-- 公益 -->
						<swiper-item class="swiper_item" >
							<scroll-view  scroll-y="true" class="scroll-Y">
								<tb-list-tabC :listb="listb" :bangzhu="bangzhu"></tb-list-tabC>
							</scroll-view>
						</swiper-item>
					</swiper>
				</view>
			</tb-pulldown>
		</view>
	</view>
</template>

<script>
	import json from './list.js'
	export default {
		data() {
			return {
				list:[
					{name:'商圈'},
					// {name: '社区'}, 
					{name: '公益',}
				],
				current:0,
				scroll:'scroll',
				//九宫格
				lista:json.data,
				shangp:json.shangp,
				listb:json.listb,
				bangzhu:json.bangzhu
			}
		},
		onLoad(op) {
			
		},
		methods: {
			onRefresh(){
			},
			//滑动页面
			swiperchange(e){
				// console.log(e)
				this.current = e.detail.current
			},
			//点击导航
			change(e){
				console.log(e)
				this.current = e
			},
			//滚动触底
			pulldown(){
			},
			// 滚动到顶部
			scrolltoupper(){
				console.log('顶部')
			}
		}
	}
</script>


<style scoped lang="scss">
	
</style>
<style src="./list.css">
	
</style>
