<template>
	<view style="padding:0 3%;">
		<view class="items">
			<view class="items_top">
				帮助标题
			</view>
			<input type="text" placeholder="请填写服务标题" v-model="serverinfo" maxlength="30"/>
		</view>
		<view >{{ serverinfo.length+'/' + 30 }}
			<text style="color: red;" v-if="serverinfo.length < 4">标题不能小于四个字</text>
		 </view>
		<u-upload :action="action" ref="uUpload" max-count="5" :file-list="imgs" @on-remove="removeImg"></u-upload>
		<view style="height: 30rpx;"></view>
		
		<view class="items" >
			<view style="margin-bottom: 20rpx;">
				<input type="text" v-model="val" @input="keywordcon" @focus="focus" @blur="blur" placeholder="填写帮助类型">
			</view>
			<view class="keywordsty" >
				<view class="keywordstyitems" v-for="(it,index) in keyword" :key="index">
					#{{it.name}} <text @click.stop="delkey(index)"><u-icon name="close"></u-icon></text>
				</view>
			</view>
		
			<!-- 搜索 -->
			<view v-if="val != ''">
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
			</view>
			
		</view>
		<view  v-show="xxtype">
			<view class="items">
				<view class="items_top">
					帮助区域
				</view>
				<view style="display: flex;" v-if="areaserve" @click="go_address">
					<view v-for="(it,ind) in areaserve" :key="ind">
						<text>{{areaserve.length > 1 && ind == 0 ? it.name + ',' : it.name }} </text>
					</view>
				</view>
				<view v-else style="color: inherit;font-size: 32rpx;" @click="go_address">
					请选择
				</view>
			</view>
			<view class="items">
				<view class="items_top">
					详细地址
				</view>
				<view class="dizhi" @click="xuanzedizhi">
					<u-icon name="map"></u-icon>
					<text>地址：</text>
					<text v-if="address">{{address}}</text>
					<text v-else>请选择地址</text>
				</view>
			</view>
			<view class="items">
				<view class="items_top">
					帮助时间
				</view>
				<view class="timeview">
					<view class="time" @click="timeSelect(1)">{{lowprice}}</view> 
					<text style="line-height: 60rpx;margin: 0 10rpx;">—</text>
					<view class="time" @click="timeSelect(2)">{{tallprice}}</view>
				</view>
			</view>
			<!-- <view class="items">
				<view class="items_top">
					参考酬金
				</view>
				<input type="number" placeholder="请填写" v-model="referencePrice"/>
			</view> -->
			<view class="items">
				<view class="items_top">
					详情描述
				</view>
				<textarea placeholder="让帮客更快了解您~" maxlength="230" v-model="detailText"/>
			</view>
			
			<!-- 按钮 -->
			<view class="but_botton">
				 <!-- <view class="danx">
					 <u-checkbox size="45" shape="circle" v-model="radio_type"  active-color="#f30a06"  @change="radios">
					 	我已阅读并同意 <text style="color: #f30a06;" @click="go_guiz">《发布规则》</text>
					 </u-checkbox>
				 </view> -->
				<tb-button :buttitle="buttitle" bgcolor="#f30a06" @but_cli="but_cli" v-if="butshow"></tb-button>
				<tb-button :buttitle="buttitle" bgcolor="#f30a06" v-else></tb-button>
			</view>
		</view>
		<view class="jianp" :style="{'height':jianpanH * 2 + 'rpx'}"></view>
		
		<u-picker mode="time" v-model="show" :params="params" @confirm="selectT" @cancel="notime" cancel-text="重置"></u-picker>
	</view>
</template>

<script>
	import {ip} from '../../../api.js'
	export default {
		data() {
			return {
				show:false,
				params: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: false
				},
				action: ip + 'upload/uploadServImg',
				radio_type:false,
				lists:[],    //图
				areaserve:'',
				lowprice:'请选择',//开始时间
				tallprice:'请选择', //结束时间
				timeType:0,//1开始2结束
				keyword:[],//
				values:'',
				detailText:'',//详情描述
				imgs:[],//图组
				serverinfo:'',//服务标题
				referencePrice:'',//价格
				compileId:0,// 编辑id
				buttitle:'发布',
				isget:true,
				butshow:true,//按钮
				latitude:'',
				longitude:'',
				address:'',
				val:'',
				keywordlist:[],
				jianpanH:0,//键盘高度
				xxtype:true,
			}
		},
		onBackPress() {
		// (没值的时候也可以判断一下，就不写了，可以留言评论哦)
			//如果有值
			console.log(this.isget)
			if(this.isget == false){
				uni.showModal({
					content:"是否要保存为草稿？",
					cancelText:"不保存",
					confirmText:"保存",
					success: res => {
						if(res.confirm){
							console.log("保存")
						
							let data = {
								imgs:this.$refs.uUpload.lists,
								areaserve:this.areaserve,
								lowprice:this.lowprice,
								tallprice:this.tallprice,
								referencePrice:this.referencePrice,//价格
								detailText:this.detailText,
								serverinfo:this.serverinfo,// 标题
								values:this.values,	//类型
								address:this.address,
								latitude:this.latitude,
								longitude:this.longitude,
								keyword:this.keyword
							}
							console.log(data)
							
							// 需求草稿
							 // this.$store.dispatch('changeDataAct',data)  //此时组件1和组件2中data都是10啦
							uni.setStorageSync("addservice",JSON.stringify(data))
						}else{
							// console.log("不保存")
							// this.$store.commit('changeDatas',{})
							uni.removeStorageSync('addservice')
							
							uni.removeStorageSync('areaserve') //删除区域
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
			serverinfo(a,b){
				// console.log(a,b)
				if(a != ''){
					this.isget = false
				}
			},
			keyword(a,b){
				if(a != ''){
					this.isget = false
				}
			},
			areaserve(a,b){
				if(a != ''){
					this.isget = false
				}
			},
		},
		// onUnload() {
		// 	uni.removeStorageSync('keyword') //删除关键字
		// 	uni.removeStorageSync('areaserve') //删除区域
		// },
		onShow() {
			this.areaserve = uni.getStorageSync('areaserve') //区域
		
		},
		onLoad(op) {
			//获取
			if(uni.getStorageSync('addservice')){
				uni.showModal({
					content:'是否要用草稿',
					success:function(a) {
						if(a.confirm){
							let data = JSON.parse(uni.getStorageSync('addservice'))
							console.log(data)
							// this.$store.state.xqdraft 仓库
							this.imgs = data.imgs
							this.areaserve = data.areaserve
							this.lowprice = data.lowprice,
							this.tallprice = data.tallprice
							this.referencePrice = data.referencePrice//价格
							this.detailText = data.detailText
							this.serverinfo = data.serverinfo// 标题
							this.values = data.values	//类型
							this.address = data.address
							this.latitude = data.latitude
							this.longitude = data.longitude
							this.keyword = data.keyword
						}else{
							uni.removeStorageSync('addservice')
							uni.removeStorageSync('areaserve') //删除区域
						}
					}.bind(this)
				})
			}
			this.compileId = op.id
			if(!this.compileId || this.compileId == 0){ //发布
				this.buttitle = '发布'
				const that = this
				uni.getLocation({
				    type: 'wgs84',
					geocode:true, 
					success(res){
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						if(res.address){
							that.address = res.address.province + res.address.city+res.address.district + res.address.street +res.address.streetNum
						}
					}
				});
			}else{
				this.buttitle = '保存'
				this.isget = true
				this.api.get('serve/queryServe/'+op.id).then(res=>{
				
					uni.setStorageSync('areaserve',res.data.scope)
					res.data.photo.forEach(i=>{
						this.imgs.push({
							url:i
						})
					})
					this.areaserve = res.data.scope//区域
					this.lowprice = res.data.stateTime
					this.tallprice = res.data.endTime
					//价格
					this.referencePrice = res.data.price
					this.detailText = res.data.describe //描述
					// 标题
					this.serverinfo = res.data.serveTitle
					//类型
					this.values = res.data.serve
					this.keyword = res.data.serve
					this.address = res.data.address					this.latitude = res.data.latitude					this.longitude = res.data.longitude
					
				})
			}
			this.imgs = []
		
		},
		methods: {
			//获取焦点
			focus(e){
				this.xxtype = false
				this.jianpanH = e.detail.height 
			},
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
			xuanzedizhi() {
				let that = this
				uni.chooseLocation({
					success: (res) => {
						console.log(res)
						that.address = res.address+res.name;
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						var point = new plus.maps.Point(res.longitude, res.latitude);
						    plus.maps.Map.reverseGeocode(
						    point,
						    {},
						    function(event) {
						       that.address =event.address; // 转换后的地理位置
						       console.log(that.address, event);
						    },
						   function(e) {} );
					}
				});
			},
			//删除关键字
			delkey(e){
				this.keyword.splice(e,1)
				console.log(this.keyword)
				
			},
			gotopage(e){
				this.com.navto(e)
			},
			radios(e){
				console.log(e)
				this.radio_type = e.value
			},
			// 区域服务
			go_address(){
				this.com.navto('./areaServe')
			},
			// 时间选择
			timeSelect(e){
				this.show = true
				this.timeType = e
			},
			//确定时间
			selectT(e){
				console.log(e)
				if(this.timeType == 1){ // 开始
					this.lowprice = e.hour + ':'+e.minute
				}else{
					this.tallprice = e.hour + ':'+e.minute
				}
			},
			notime(){
				if(this.timeType == 1){ // 开始
					this.lowprice = ''
				}else{
					this.tallprice = ''
				}
			},
			// 点击发布
			but_cli(){
				if(this.serverinfo.length < 4){
					this.com.msg('标题少于四个字')
					return
				}else if(this.detailText == ''){
					this.com.msg('请填写详情描述')
					return
				}
				let arrimg = this.$refs.uUpload.lists
				console.log(arrimg)
				this.imgs = ''
				if(arrimg.length > 0){
					let b = []
					arrimg.forEach(i=>{
						
						b += i.url+','
					})
					
					this.imgs = b.substr(0,b.length -1)
					console.log(this.imgs)
				}
				if(this.keyword){
					let akey = ''
					this.keyword.forEach(i=>{
						akey += i.id+','
					})
					this.values =akey.substr(0,akey.length -1 )
				}
				
				let address = ''
				this.areaserve.forEach(i=>{
					address +=i.id+','
				})
				 //发布
				if(!this.compileId || this.compileId == 0){
					this.api.post('serve/addServe',{
						ryUuid:uni.getStorageSync('userinfo_Data').id,  		// 用户ID
						serve:this.values ,        // 服务类型  
						serveTitle:this.serverinfo,	//服务标题  
						serveDescribe:this.detailText,	// 服务详情  
						photo:this.imgs,	// 服务图片   
						scope:address.substr(0,address.length -1),		//服务范围  
						// price:this.referencePrice,		//服务价格   
						startTime:this.lowprice,		//开始时间   
						endTime:this.tallprice   	,//结束时间
						address:this.address,
						latitude:this.latitude,
						longitude :this.longitude,
					}).then(res=>{
						console.log(res)
						if(res.flag){
							this.isget = true
							this.butshow = false
							this.com.two_back()
							uni.removeStorageSync('areaserve') //删除区域
							this.com.msg('发布成功')
						}
					})
				}else{//编辑
					this.api.post('serve/update',{
						serveUuid:this.compileId,
						ryUuid:uni.getStorageSync('userinfo_Data').id,  		// 用户ID
						serve:this.values ,        // 服务类型  
						serveTitle:this.serverinfo,	//服务标题  
						serveDescribe:this.detailText,	// 服务详情  
						photo:this.imgs,	// 服务图片   
						scope:address.substr(0,address.length -1),		//服务范围  
						// price:this.referencePrice,		//服务价格   
						startTime:this.lowprice,		//开始时间   
						endTime:this.tallprice   	,//结束时间
						address:this.address,
						latitude:this.latitude,
						longitude :this.longitude,
					}).then(res=>{
						console.log(res)
						if(res.flag){
							this.isget = true
							this.com.two_back()
							
							uni.removeStorageSync('areaserve') //删除区域
							this.com.msg('保存成功')
						}
					})
				}
				
				
			},
			go_guiz(){
				this.com.navto('../../login/agreement_page?type='+4)
			},
			// 删图
			removeImg(e){
				this.imgs.splice(e, 1)
			 // console.log( this.fileList)
				
			},
		}
	}
</script>

<style lang="scss" scoped>
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
		line-height: 100rpx;
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
		line-height: 100rpx;
		font-weight: bold;
	}
}
.timeview{
	display: flex;
	.time{
		width: 200rpx;color: #777;font-size: 30rpx;line-height: 60rpx;
		background-color: #f4f5f6;padding: 2rpx 20rpx;border-radius: 50rpx;
	}
}
.but_botton{
	width: 100%;height: 200rpx;
	text-align: center;
	.danx{
		padding: 20rpx;color: #999;
	}
}
.items{
	width: 100%;margin:0 0 35rpx 0;
	.items_top{
		font-size: 34rpx;font-weight: bold;
		margin: 10rpx 0;
	}
	.dizhi {
		display: inline-block;
		background-color: #F8F8F8;
		border-radius: 100rpx;
		color: #9D9D9D;
		padding: 2rpx 26rpx;
		
	}
	.keywordsty{
		display: flex;
		.keywordstyitems{
			padding: 4rpx 26rpx 0 4rpx;background-color: #fff2ec;margin: 10rpx;border-radius: 4rpx;
		}
	}
	textarea{
		width: 96%;height: 240rpx;
		padding: 2%;border-top: 0.5rpx solid #f4f5f6;
	}
}
</style>
