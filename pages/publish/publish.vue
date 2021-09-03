<template>
	<view class="fabangzhu">
		<view class="content">
			<u-form :model="form" ref="form">
				<u-form-item :border-bottom="false">
					<u-input type="textarea" v-model="form.jianjie" maxlength="25" :clearable="false" placeholder="请概括填写求助信息标题，例如:帮忙取快递(4~25)" />
				</u-form-item>
				<view style="color: #999;">
					{{form.jianjie.length +'/'+25}}<text v-if="form.jianjie.length < 4" style="color: red;">标题不能小于四个字</text>
				</view>
				<u-form-item :border-bottom="false">
					<u-upload :action="uploadAction"  :custom-btn="true" :max-count="5" :name="'file'" ref="uUpload" 
					:file-list="fileList" @on-remove="removeImg">
						<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
							<u-icon name="plus" size="60" :color="$u.color['lightColor']"></u-icon>
						</view>
					</u-upload>
				</u-form-item>
				<u-form-item>
					<view class="dizhi" @click="xuanzedizhi">
						<u-icon name="map"></u-icon>
						<text>地址：</text>
						<text v-if="form.positionName">{{form.positionName}}</text>
						<text v-else>请选择地址</text>
					</view>
				</u-form-item>
				<u-form-item>
					<u-input type="textarea" v-model="jutimiaoshu" maxlength="300" :clearable="false" 
					placeholder="请尽量清晰描述求助详情（如帮助地址、时间、资质等），这有助于您尽快得到帮助。" :auto-height="false" />

				</u-form-item>
				<view style="color: #999;">
					{{jutimiaoshu.length +'/'+300}}
				</view>
				<!-- 添加话题 -->
				<u-form-item>
					<!-- @click="gotopage('./addtopic?type='+1)" -->
					<view class="addTopic">  
						<!-- <text>#添加关键字</text>
						<u-icon name="arrow-right"></u-icon> -->
						<input type="text" v-model="val" @input="keywordcon" @focus="focus" @blur="blur" placeholder="添加关键字">
					</view>
				</u-form-item>
				<u-form-item style="overflow-x: scroll;">
					<view class="gjzi" style="background-color: #fff2ec;">#关键字</view>
					<view class="gjzi" style="background-color: #fff2ec;" v-for="(it,index) in keyword" :key="index">
						#{{it.name}} <text @click="delkey(index)"><u-icon name="close"></u-icon></text>
					</view>
				</u-form-item>
				<!-- 搜索 -->
				<u-form-item v-if="val != ''">
					<view class="inputK" >
						<view class="" v-if="keywordlist == ''">
							<view class="addkeyword" @click="addKword(val)">
								<text style="margin-right: 20rpx;"><u-icon name="plus" size="30"></u-icon></text>{{val}}
								<view class="tips">添加标签</view>
							</view>
						</view>
						<view class="content_right"  v-else>
							<!-- <view class="title" >
								热门推荐
							</view> -->
							<view class="right_item" v-for="(item,ind) in keywordlist" :key="ind" @click="rightCli(item)">
								<text style="color: #ffe946;margin-right: 20rpx;">#</text>
								{{item.name}} 
								<text class="re">热{{item.usageNumber}}</text>
							</view>
						</view>
						
					</view>
				</u-form-item>
				<view v-show="xxtype">
					<u-form-item >
						<view class="jiage" >
							<view class="left norow">
								<u-icon name="red-packet-fill" color="#BFBFBF" size="40rpx"></u-icon>
								<text class="title ">酬金</text>
							</view>
							<view class="right">
								<input type="number" v-model="form.jiage" placeholder="0" maxlength="6"/>
							</view>
						</view>
					</u-form-item>
					<u-form-item >
						<view class="jiage" @click="selectShow1 = true">
							<view class="left">
								<u-icon name="more-circle-fill" color="#BFBFBF" size="40rpx"></u-icon>
								<text class="title">求助方式</text>
							</view>
							<view class="right">
								<text class="xuanze" >{{bzTyTit}}</text>
								<u-icon name="arrow-right" color="#BFBFBF" size="40rpx"></u-icon>
							</view>
						</view>
					</u-form-item>
					<u-form-item >
						<view class="jiage" @click="xianzhixuanze">
							<view class="left">
								<u-icon name="more-circle-fill" color="#BFBFBF" size="40rpx"></u-icon>
								<text class="title">帮主选择和限制</text>
							</view>
							<view class="right">
								<text class="xuanze" > {{chuan.xingbie || chuan.nianling || chuan.xueli || chuan.zhiye || chuan.qita ? "查看" : "不限制"}}</text>
								<u-icon name="arrow-right" color="#BFBFBF" size="40rpx"></u-icon>
							</view>
						</view>
					</u-form-item>
					<u-form-item >
						<view class="jiage"  @click="timeshow = true">
							<view class="left" >
								<u-icon name="clock-fill" color="#BFBFBF" size="40rpx"></u-icon>
								<text class="title">帮助过期时间</text>
							</view>
							<view class="right">
								<text class="xuanze">{{helpexpTime || "不限制"}}</text>
								<u-icon name="arrow-right" color="#BFBFBF" size="40rpx"></u-icon>
							</view>
						</view>
					</u-form-item>
					<u-form-item >
						<view class="jiage"  >
							<view class="left" >
								<u-icon name="clock-fill" color="#BFBFBF" size="40rpx"></u-icon>
								<text class="title">是否加急 <text style="color: red;font-size: 26rpx;">(每日上限一条)</text></text>
							</view>
							<view class="right">
								<u-switch v-model="checked" active-color="#f30a06" @change="switchCli"></u-switch>
							</view>
						</view>
					</u-form-item>
				</view>
			</u-form>
			<view style="width: 100%;margin: 40rpx 0;" v-show="xxtype">
				<tb-button :buttitle="buttitle" bgcolor="#f30a06" @but_cli="submit" v-if="butshow"></tb-button>
				<tb-button :buttitle="buttitle" bgcolor="#f30a06"  v-else></tb-button>
			</view>
			<view class="guanjzi">
				<view class="guanjzi_item">
					
				</view>
			</view>
			<u-top-tips ref="uTips"></u-top-tips>
		</view>
		<view class="jianp" :style="{'height':jianpanH * 2 + 'rpx'}"></view>
		
		<u-select v-model="selectShow1" :list="list1" @confirm="confirm1" ></u-select>
		<u-picker mode="time" v-model="timeshow" :params="params" :start-year="stertTime" cancel-text="不限制"
		 @confirm="helpexpTimeCli" @cancel="buxian"></u-picker>
	</view>
</template>

<script>
	import {
		ip
	} from '../../api.js';

	export default {
		data() {
			return {
				form: {
					jianjie: '',
					jiage: '', 
					address: '',
					positionName: '',
					uploadURL: [],
					latitude: '',
					longitude: ''
				},
				chuan:{
					xingbie: '',
					nianling: '',
					xueli: '',
					zhiye: '',
					qita: '',
				},
				fileList:[],//图片组
				jutimiaoshu: '',
				popupShow: false,
				uploadAction: ip + '/upload/uploadHelpImg',
				imgs:[],//图片地址组
				xxtype:true,
				timeshow:false,//时间
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: false
				},
				helpexpTime:'',
				task_id:'',// 任务id
				taskData:'',//任务内容
				checked: false,//是否加急
				keyword:[],//关键字
				keyUPload:'',
				isget:true,  //标识 
				butshow:true,
				buttitle:'发布',
				stertTime:new Date().toISOString().slice(0,4),
				list1:[
					{label:'线上',value:0},
					{label:'线下',value:1},
					{label:'不限',value:2}
				],
				bzTyTit:'不限',
				bzTypeNum:2,
				selectShow1:false,
				val:'',
				keywordlist:[],
				jianpanH:0,//键盘高度
			}
		},
		onBackPress() {
		// (没值的时候也可以判断一下，就不写了，可以留言评论哦)
			//如果有值
			uni.offKeyboardHeightChange(callback)
			if(this.isget == false){
				uni.showModal({
					content:"是否要保存为草稿？",
					cancelText:"不保存",
					confirmText:"保存",
					success: res => {
						if(res.confirm){
							console.log("保存")
						
							let data = {
								positionName:this.form.positionName, //位置
								jiage:this.form.jiage,
								jutimiaoshu:this.jutimiaoshu,
								xingbie:this.chuan.xingbie,
								nianling:this.chuan.nianling,
								xueli:this.chuan.xueli,
								zhiye:this.chuan.zhiye,
								qita:this.chuan.qita,
								// this.checked = res.data.isRelease
								//时间
								helpexpTime:this.helpexpTime,
								address:this.form.address,
								latitude:this.form.latitude,
								longitude:this.form.longitude,
								imgs:this.$refs.uUpload.lists,
								jianjie:this.form.jianjie,
								bzType:this.bzTypeNum,
								keyword:this.keyword
							}
							console.log(data)
							
							// 需求草稿
							 // this.$store.dispatch('changeDataAct',data)  //此时组件1和组件2中data都是10啦
							uni.setStorageSync("changeDataAct",JSON.stringify(data))
						}else{
							console.log("不保存")
							// this.$store.commit('changeDatas',{})
							uni.removeStorageSync("form")
							uni.removeStorageSync('changeDataAct')
						}
						this.isget=true;
						uni.navigateBack({
							delta:1
						});
					},
				});
				return true;
			}
		},
		watch:{
			form:{
				handler(a,b){
					console.log(a,b)
					if(!this.task_id){
						console.log(this.task_id)
						this.isget = false
					}else{
						this.isget = true
					}
				},
				deep: true // 可以深度检测到 person 对象的属性值的变化
			},
		},
		onShow() {
			// console.log(this.$store.state.xqdraft)
			this.keyWordText()
		},
		onLoad(e){
			
			console.log(this.stertTime)
			// this.pages()
			this.task_id = e.id //任务id
			if(e.id){
				this.buttitle = '提交'
				//草稿箱显示
				this.isget = true 
				console.log(this.isget)
				this.fileList = []
				this.api.get('help/gethelp/'+e.id).then(res=>{
					// console.log(res)
					if(res.flag){
						this.form.jianjie = res.data.bzJianjie//标题
						res.data.bzPhoto.forEach(i=>{ //图
							this.fileList.push({
								url:i
							})
						})
						this.form.positionName = res.data.bzPositionname //位置
						this.form.jiage = res.data.bzPrice
						this.jutimiaoshu = res.data.bzDemand
						this.chuan.xingbie= res.data.bzRequirement.xingbie
						this.chuan.nianling = res.data.bzRequirement.nianling
						this.chuan.xueli = res.data.bzRequirement.xueli
						this.chuan.zhiye = res.data.bzRequirement.zhiye
						this.chuan.qita = res.data.bzRequirement.qita
						// this.checked = res.data.isRelease
						//时间
						this.helpexpTime = res.data.bzJieshutime //时间
						this.form.address = res.data.bzAddress //地址
						this.form.latitude = res.data.bzLatitude;
						this.form.longitude = res.data.bzLongitude;
						this.taskData = res.data
						this.bzTypeNum = res.data.bzType
						this.bzTyTit = res.data.bzType == 0 ? '线上' : res.data.bzType == 1 ? '线下' : '不限'
						this.keyword = res.data.bzKeyWord
						
						this.keyWordText()
					}
				})
			}else if(uni.getStorageSync('changeDataAct')){
				uni.showModal({
					content:'是否要用草稿',
					success:function(a) {
						if(a.confirm){
							let data = JSON.parse(uni.getStorageSync('changeDataAct'))
							// console.log(data)
							// this.$store.state.xqdraft 仓库
							this.form.positionName = data.positionName //位置
							this.form.jiage = data.jiage
							this.jutimiaoshu = data.jutimiaoshu
							this.chuan.xingbie = data.xingbie
							this.chuan.nianling = data.nianling
							this.chuan.xueli = data.xueli
							this.chuan.zhiye = data.zhiye
							this.chuan.qita = data.qita
							// this.checked = res.data.isRelease
							//时间
							this.helpexpTime = data.helpexpTime
							this.form.address = data.address
							this.form.latitude = data.latitude
							this.form.longitude = data.longitude
							this.fileList = data.imgs
							this.form.jianjie = data.jianjie
							this.bzTypeNum = data.bzType
							this.bzTyTit = data.bzType == 0 ? '线上' : res.data.bzType == 1 ? '线下' : '不限'
							this.keyword = data.keyword
						}else{
							uni.removeStorageSync('changeDataAct')
						}
					}.bind(this)
				})
			}
		},
		methods: {
			//获取焦点
			focus(e){
				this.xxtype = false
				this.jianpanH = e.detail.height 
			},
			//失去焦点
			blur(e){
				this.jianpanH = 0
				this.xxtype = true
			},
			//关键字
			keywordcon(e){
				console.log(this.val)
				this.api.get('keyword/getkeyword?keyword='+this.val).then(res=>{
					console.log(res)
					if(res.flag){
						this.keywordlist = res.data
						// 页面滑动
						setTimeout(()=>{
							const query = uni.createSelectorQuery().in(this);
							query.select('.jianp').boundingClientRect(data => {
								console.log("得到布局位置信息" + JSON.stringify(data));
								if(data.top){
									uni.pageScrollTo({
										scrollTop: data.top,
										duration: 100,
									});
								}
							}).exec();
						},200)
					}
				})
			},
			// 添加关键字
			addKword(e){
				this.api.get('keyword/insert/'+e).then(res=>{
					console.log(res)
					if(res.flag){
						this.val = ''
						if(this.keyword.indexOf(e) == -1){
							this.keyword.unshift(res.data)  //unshift:跟push性质一样 区别就是将新添加的数据放在第一位
						}
						if(this.keyword.length > 3){
							this.keyword.pop()
						}
					}else{
						this.com.msg(res.message)
					}
				})
			},
			// 右边点击 关键字
			rightCli(e){
				this.val = ''
				console.log(e)
				let flag = false;
				let ina = 0;
				for (let i = 0; i < this.keyword.length; i++) {
					if(this.keyword[i].id == e.id){
						flag = false;
						ina = i;
						break;
					}else{
						flag = true;
					}
				}
				//等于0时候不能循环所以直接加
				if(this.keyword.length == 0){
					this.keyword.unshift(e)
				}else{
					if(flag){
						this.keyword.unshift(e)
					}
				}
				if(this.keyword.length > 3){
					this.keyword.pop()
				}
				
			},
			//线上线下 类型
			confirm1(e){
				this.bzTyTit = e[0].label
				this.bzTypeNum = e[0].value
			},
			//关键字
			keyWordText(){
				// console.log(uni.getStorageSync('form'))
				if(uni.getStorageSync('form')){
					this.chuan = uni.getStorageSync('form')
					
				}
			},
			//删除关键字
			delkey(e){
				console.log(e)
				this.keyword.splice(e,1)
				// console.log(this.keyword)
				
			},
			gotopage(e){
				this.com.navto(e)
			},
			onEditorReady() {
				uni.createSelectorQuery().select('#editor').context((res) => {
					console.log(res)
					this.editorCtx =res.context;
				}).exec()
			},
			// 过期时间
			helpexpTimeCli(e){
				this.helpexpTime = e.year+'-'+e.month+'-'+e.day+' '+e.hour+':'+e.minute
				console.log(this.helpexpTime)
			},
			//不限
			buxian(){
				this.helpexpTime = ''
			},
			
			//是否加急
			switchCli(e){
				console.log(e)
			},
			// 删图
			removeImg(e){
				this.fileList.splice(e, 1)
			 // console.log( this.fileList)
				
			},
			//提交
			submit() {
				const {address,positionName,latitude,longitude} = this.form;
				if(this.form.jianjie.length < 4){
					this.$refs.uTips.show({
						title: '标题低于4个字！',
						type: 'error',
						duration: '2000'
					})
					return
				}else if(!address && !positionName && !latitude && !longitude){
					this.$refs.uTips.show({
						title: '请选择地址！',
						type: 'error',
						duration: '2000'
					})
					return;
				}else if (this.jutimiaoshu == ''){
					this.$refs.uTips.show({
						title: '请填写详细描述！',
						type: 'error',
						duration: '2000'
					})
					return;
				}
				let arrimg = this.$refs.uUpload.lists
				this.imgs = ''
				if(arrimg.length > 0){
					let b = []
					arrimg.forEach(i=>{
						
						b += i.url+','
					})
					this.imgs = b.substr(0,b.length -1)
				}
				console.log(this.imgs)
				//用户信息
				let userdata = this.chuan
				// {
				// 	'xingbie':this.form.xingbie,
				// 	'nianling':this.form.nianling,
				// 	'xueli':this.form.xueli,
				// 	'zhiye':this.form.zhiye,
				// 	'qita':this.form.qita
				// }
					
			
				this.keyUPload = ''
				// 关键字
				if(this.keyword){
					let akey = ''
					this.keyword.forEach(i=>{
						akey += i.id+','
					})
					this.keyUPload =akey.substr(0,akey.length -1 )
				}
				
				console.log(this.keyUPload)
				//判断当前状态
				if(this.task_id){
					// 编辑
					let publish = {
						bzUuid: this.taskData.bzUuid,			//帮助id
						bzJianjie:this.form.jianjie,  			//简介
						bzDemand:this.jutimiaoshu,				//具体描述
						bzAddress:this.form.address,			//地址
						bzPositionname:this.form.positionName,	//位置名
						bzLongitude:this.form.longitude,		//经度
						bzLatitude:this.form.latitude,			//纬度
						bzPhoto: this.imgs,						//图片组
						bzPrice:this.form.jiage || 0,				//价格
						bzRequirement:JSON.stringify(userdata),
						bzKeyword:this.keyUPload,            
						bzJieshutime:this.helpexpTime,
						isUrgent:this.checked == true ? 1 : 0,
						bzType:this.bzTypeNum
					}
					console.log(publish)
					this.api.post('help/change',publish,'application/json').then(res=>{
						console.log(res)
						if(res.flag){
							this.isget = true
							uni.navigateBack()
							uni.removeStorageSync("form")
							uni.offKeyboardHeightChange(callback)//取消监听键盘
						}
						this.com.msg(res.message)
					})
				}else{
					//发布
					let publish = {
						bzType:this.bzTypeNum,
						ryId: uni.getStorageSync('userinfo_Data').id,							//发布人id
						bzJianjie:this.form.jianjie,  			//简介
						bzDemand:this.jutimiaoshu,				//具体描述
						bzAddress:this.form.address,			//地址
						bzPositionname:this.form.positionName,	//位置名
						bzLongitude:this.form.longitude,		//经度
						bzLatitude:this.form.latitude,			//纬度
						bzPhoto: this.imgs,						//图片组
						bzPrice:this.form.jiage || 0,				//价格
						bzRequirement:JSON.stringify(userdata),
						bzKeyword:this.keyUPload,
						bzJieshutime:this.helpexpTime,
						isUrgent:this.checked == true ? 1 : 0
					}
					console.log(publish)
					this.api.post('help/release',publish,'application/json').then(res=>{
						console.log(res)
						if(res.flag){
							this.butshow = false
							let arr = 2
							let time = setInterval(()=>{
								if(arr <= 0){
									uni.switchTab({
										url:'../index/index'
									})
									clearInterval(time)
								}else{
									arr -=1
								}
							},400)
							
							uni.removeStorageSync("form")
							uni.removeStorageSync('changeDataAct')
							uni.offKeyboardHeightChange(callback)//取消监听键盘
						}
						this.com.msg(res.message)
					})
				}
			
			},
			xianzhixuanze() {
				this.com.navto('./select_restrict?data='+JSON.stringify(this.chuan))
			},
			//点击获取地区
			xuanzedizhi() {
				let that = this
				uni.chooseLocation({
					success: (res) => {
						console.log(res)
						that.form.positionName = res.name;
						that.form.latitude = res.latitude;
						that.form.longitude = res.longitude;
						 var point = new plus.maps.Point(res.longitude, res.latitude);
						    plus.maps.Map.reverseGeocode(
						    point,
						    {},
						    function(event) {
						       that.form.address = event.address; // 转换后的地理位置
						        var point = event.coord; // 转换后的坐标信息
						        var coordType = event.coordType; // 转换后的坐标系类型
						       console.log(that.form.address, 'address');
						    },
						   function(e) {} );
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.jianp{
		width: 100%;
		transition: all 0.5s;
	}
	// 搜索框
	.inputK{
		width: 100%;
		padding-left: 30rpx;
		.right_item{
			width: 100%;
			line-height: 80rpx;
			font-weight: bold;
			.re{
				color: #999;font-size: 22rpx;margin-left: 20rpx;
			}
		}
	}
	.content_right{
		width: 70%;
		height: 480rpx;overflow-y: scroll;
		.right_item{
			line-height: 80rpx;
			font-weight: bold;
		}
	}
   .container {
		padding: 10px;
	}

	#editor {
		width: 680rpx;
		height: 200px;
		background-color: #f5f5f5;
	}

	.guanjzi{
		max-height: 400rpx;
		
	}
	.gjzi{
		padding:0 10rpx;background-color: #d6eafd;
		border-radius: 10rpx;margin-right: 20rpx;
		display: flex;white-space: nowrap;
	}
	.addTopic{
		width: 100%;
		display: flex;justify-content: space-between;
	}
	.fabangzhu {
		.content {
			width: 90%;
			margin: auto;

			.slot-btn {
				width: 200rpx;
				height: 200rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: rgb(244, 245, 246);
				border-radius: 10rpx;
			}

			.slot-btn__hover {
				background-color: rgb(235, 236, 238);
			}

			.dizhi {
				font-size: 24rpx;
				background-color: #F8F8F8;
				border-radius: 100rpx;
				color: #9D9D9D;
				padding: 2rpx 30rpx;
				
			}

			.jiage {
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex: 1;

				.title {
					color: #373737;
					padding-left: 30rpx;
					width: 120rpx;
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

			button {
				background-color: #1282F2;
				color: #FFFFFF;
				margin-top: 20rpx;
				line-height: 80rpx;
				width: 95%;
			}
		}
	}
</style>
