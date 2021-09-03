<template>
	<view style="width: 100%;">
		<view >
			<view class="waiceng" @click="xuanzexingbie">
				<text class="title">性别</text>
				<text class="neirong" v-if="!form.xingbie">不限制(如有请选择)</text>
				<text class="neirong" v-else>{{form.xingbie}}</text>
			</view>
			<view class="waiceng" @click="xuanzenianling">
				<text class="title">年龄</text>
				<text class="neirong" v-if="!form.nianling">不限制(如有请选择)</text>
				<text class="neirong" v-else>{{form.nianling}}</text>
			</view>
			<view class="waiceng" @click="xuanzexueli">
				<text class="title">学历</text>
				<text class="neirong" v-if="!form.xueli">不限制(如有请选择)</text>
				<text class="neirong" v-else>{{form.xueli}}</text>
			</view>
			<view class="waiceng" @click="xuanzezhiye">
				<text class="title">职业</text>
				<text class="neirong" v-if="!form.zhiye">不限制(如有请选择)</text>
				<text class="neirong" v-else>{{form.zhiye}}</text>
			</view>
			<view class="waiceng">
				<text class="title">其它</text>
				<u-input type="textarea" v-model="form.qita" maxlength="2000" :clearable="false" placeholder="如有其它限制,可填写" />
			</view>
			<button @click="queding">确定</button>
			<u-select v-model="selectShow1" cancel-text="不限制" :list="list1" @confirm="confirm1" @cancel="cancelCli(1)"></u-select>
			<u-select v-model="selectShow2" cancel-text="不限制" :list="list2" mode="mutil-column" @confirm="confirm2" @cancel="cancelCli(2)"></u-select>
			<u-select v-model="selectShow3" cancel-text="不限制" :list="list3" @confirm="confirm3" @cancel="cancelCli(3)"></u-select>
			<u-select v-model="selectShow4" cancel-text="不限制" :list="list4" @confirm="confirm4" @cancel="cancelCli(4)"></u-select>
		</view>
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				selectShow1: false,
				list1: [],
				selectShow2: false,
				list2: [],
				selectShow3: false,
				list3: [],
				selectShow4: false,
				list4: [],
				form:{
					xingbie:"",
					nianling:"",
					xueli:"",
					zhiye:"",
					qita:''
				}
			}
		},
		onLoad(e) {
			this.form = JSON.parse(e.data)
		},
		methods: {
			xuanzexingbie() {
				this.list1 = [{
					value: '1',
					label: '男'
				}, {
					value: '2',
					label: '女'
				}];
				this.selectShow1 = true;
			},
			xuanzenianling() {
				let list = [];
				for (let i = 18; i < 60; i++) {
					let obj = {};
					obj.value = i;
					obj.label = i + '岁';
					list.push(obj)
				}
				this.list2 = [list, list];
				this.selectShow2 = true;
			},
			xuanzexueli() {
				this.list3 = [{
					value: '1',
					label: '初中'
				}, {
					value: '2',
					label: '高中'
				}, {
					value: '2',
					label: '大专'
				}, {
					value: '2',
					label: '本科'
				}, {
					value: '2',
					label: '硕士'
				}, {
					value: '2',
					label: '博士'
				}];
				this.selectShow3 = true;
			},
			xuanzezhiye() {
				this.list4 = [{
					value: '1',
					label: '公司员工'
				}, {
					value: '1',
					label: '教师'
				}, {
					value: '1',
					label: '司机'
				}, {
					value: '1',
					label: '政府人员'
				}, ];
				this.selectShow4 = true;
			},
			//取消按钮
			cancelCli(e){
				if(e == 1){//性别
					this.form.xingbie = ''
				}else if(e == 2){ //年龄
					this.form.nianling = ''
				}else if(e == 3){ //年龄
						this.form.xueli = ''
				}else if(e == 4){ //年龄
					this.form.zhiye = ''
				}
			},
			confirm1(e) {
				this.form.xingbie = e[0].label;
			},
			confirm2(e) {
				if (e[0].value > e[1].value) {
					this.$refs.uTips.show({
						title: '开始年龄不能大于结束年龄！',
						type: 'error',
						duration: '2000'
					})
					return;
				}
				this.form.nianling = `${e[0].label}至${e[1].label}`;
			},
			confirm3(e) {
				this.form.xueli = e[0].label;
			},
			confirm4(e) {
				this.form.zhiye = e[0].label;
			},
			queding() {
				uni.setStorageSync("form",this.form)
				uni.navigateBack()
			}
		}
	}
</script>

<style scoped lang="scss">
	.waiceng {
		border-bottom: 1px solid #E4E7ED;
		padding: 30rpx 40rpx;

		.title {
			color: #333436;
		}

		.neirong {
			color: #808080;
			padding-left: 60rpx;
		}
	}

	button {
		background-color: #1282F2;
		color: #FFFFFF;
		margin-top: 20rpx;
		line-height: 80rpx;
		width: 95%;
	}
</style>
