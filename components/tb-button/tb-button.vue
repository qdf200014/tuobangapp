<template>
	<view>
		<button class="go_buts" v-if="but_type" @click="but_no"
		 :style="{'background-color':'#ff8c8c','border-radius': radius,'height':height+'rpx','line-height':height-4+'rpx'}">
			{{buttitle}}
		</button>
		<button class="go_buts" v-else @click="but_cli" :disabled="dis" 
		:style="{'background-color':bgcolor,'border-radius': radius,'height':height+'rpx','line-height':height-4+'rpx'}">
			{{buttitle}}
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dis:false
			};
		},
		props:{
			buttitle:{
				default:"保存"
			},
			//背景色
			bgcolor:{
				default:"#f30a06"
			},
			//按钮状态
			but_type:{
				default:false
			},
			//按钮颜色
			radius:{
				default:'50rpx'
			},
			// 按钮高度
			height:{
				default:'80'
			}
		},
		methods:{
			//不能为空
			but_no(){
				this.com.msg('不能为空')
			},
			but_cli(){
				this.$emit('but_cli',1)
				if(this.dis == false){
					this.dis = true
					if(this.dis == true){
						setTimeout(()=>{
							this.dis = false
							// console.log(111)
						},1000)
					}
				}
				
			}
		}
	}
</script>

<style lang="scss" scoped>
.go_buts{
		width: 90%;color: #fff;padding: 5rpx;text-align: center;margin-left: 5%;
		font-size: 32rpx;
		border: 0;
	}
</style>
