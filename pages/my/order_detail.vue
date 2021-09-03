<template>
	<view style="padding-bottom: 60rpx;">
		<view style="width: 750rpx;height: 460rpx;position: relative;" v-if="shows == 0">
			<view class="backcoloor" >
				<uni-steps :options="lists" :active="stepsType" deactiveColor="#fff"></uni-steps>
			</view>
			<view class="gotoconfirmed">
				<view class="confirmed_duotype">{{title}}</view>
				<text class="request_confired">{{tips}}</text>
			</view>
		</view>
		
		<view class="header" v-if="shows == 3">
			<text class="header_text">已取消</text>
		</view>
		
		<view class="header" v-if="shows == 2"> 
			<text class="header_text" v-if="pagedata.state == 5"> 帮客已取消</text>
			<text class="header_text" v-if="pagedata.state == 6"> 帮主已取消</text>
		</view>
		
		<view class="header" v-if="shows == 1">
			<text class="header_text">付款超时，系统关闭了响应</text>
		</view>
		<view class="task_detail">
			<view class="task_detail_top" @click="go_detail(pagedata,pagedata.type,pagedata.bzState)">
				<image class="top_img" :src="pagedata.photo" mode="aspectFill"></image>
				<text class="top_text">{{pagedata.jianjie}}</text>
			</view>
			<view class="task_user">
				<image class="task_user_image" :src="pagedata.bkImg" mode="aspectFill"></image>
				<text class="task_user_Text">{{pagedata.bkName}}</text>
			</view>
		
			<view class="datas_li">
				<view class="li_child">
					<text class="datas_li_bo" v-if="pagedata.price != 0"> 酬金</text>
					<text class="tips" v-if="pagedata.payState == 1 && pagedata.cancelState == 0">(赏金已退回)</text>
					<text class="tips"  v-if="pagedata.payState == 1 && pagedata.price != 0 && pagedata.cancelState === null || pagedata.cancelState == 1">(已付款)</text>
					<text class="tips"  v-if="pagedata.payState == 0 || pagedata.payState === null && pagedata.price != 0">(未付款)</text>
				</view>
				<text class="datas_li_red"> {{pagedata.price == 0 ? '无偿帮助' : '￥'+ pagedata.price}}</text>
			</view>	
			<view class="datas_botton">
				<text class="texts"  v-if="pagedata.payState == 1 && pagedata.cancelState == 0">剩余赏金{{pagedata.price}}元，已原路返还</text>
			</view>	
		</view>
		<view class="map">
			<view class="map_top">
				<text class="map_text" style="font-weight: bold;">服务地点：</text>
				<view class="user_copy" style="display: flex;" @click="copy" >
					<image src="../../static/index/taskDetail/fuzhi.png" mode="">复制
				</view>
			</view>
			<view class="page-section">
				<view>
					{{pagedata.bkName}}  {{photoC(pagedata.phone)}}
					<view style="margin-top: 10rpx;color: #666;width: 500rpx;">
						{{pagedata.address}} 
					</view>
				</view>
				<view class="page-section_r" @click="gochat">
					<image src="../../static/index/taskDetail/dibiao.png" mode=""></image>导航
				</view>
			</view>
		</view>
		<!-- 响应信息 -->
		<view class="response_message">
			<view class="message_top">
				<view class="message_top_left">
					<text>响应信息：</text>
				</view>
				<view class="message_top_rig" @click="go_chat(pagedata)">
					<text style="color: #f30a06;font-size: 30rpx;">{{shengf == 2 ? '联系帮主' : '联系帮客'}}</text>
				</view>
			</view>
			<view class="message_item" v-if="pagedata.myself">
				<text class="message_item_text">帮客昵称：{{pagedata.bkName}}</text>
			</view>
			<view class="message_item" v-else>
				<text class="message_item_text">帮主昵称：{{pagedata.bzName}}</text>
			</view>
			<view class="message_item">
				<text class="message_item_text">响应编号：{{pagedata.jduuid}}</text>
			</view>
			<view class="message_item">
				<text class="message_item_text">支付编号：</text>
			</view>
			<view class="message_item">
				<text class="message_item_text">帮助时间：{{pagedata.createtime}}</text>
			</view>
		</view>
		<view class="posi">
			<!-- //响应我的 -->
			<view class="items_bottom" v-if="pageType == 1">
				<view class="items_bottom_l" style="color: #2292fb;">
					
				</view>
				
				<view class="items_bottom_r" v-if="pagedata.state == 0">
					<text class="texts" @click="Deselect">取消帮助</text>
					<text class="texts bgcol" @click="good_task(pagedata.jduuid,pagedata.price)" v-if="pagedata.type ==  0">同意帮助</text>
				</view>
				
				<view class="items_bottom_r" v-if="pagedata.state == 1">
					<text class="texts" @click="Deselect" >取消帮助</text>
					<text class="texts bgcol" @click="go_pay(pagedata.jduuid)" v-if="pagedata.payState ==  0">我要付款</text>
					<text class="texts bgcol" v-if="pagedata.payState ==  1" @click="no_acccom(pagedata.jduuid,3)">确认完成</text>
				</view>
				
				<view class="items_bottom_r" v-if="pagedata.state == 2">
					<text class="texts" @click="no_acccom(pagedata.jduuid,4)">拒绝申请</text> 
					<text class="texts bgcol" @click="no_acccom(pagedata.jduuid,3)">确认完成</text>
				</view>
				
				<view class="items_bottom_r" v-if="pagedata.state == 3">
					<text class="texts bgcol" v-if="pagedata.appraiseState == 0" @click="go_pjia(pagedata.jduuid)">去评价</text> 
					<text class="texts" @click="shanchu(pagedata.jduuid)">删除订单</text>
				</view>
				
				<view class="items_bottom_r" v-if="pagedata.state == 4">
					<!-- <text class="texts">查看钱款</text> -->
					<text class="texts" v-if="pagedata.appealState == 0 || pagedata.appealState === null" @click="shensu(pagedata.jduuid,0)">申诉</text>
					<text class="texts " v-if="pagedata.payState ==  1" @click="no_acccom(pagedata.jduuid,3)">确认完成</text>
					<text class="texts" v-if="pagedata.appealState != 0 && pagedata.appealState !== null" @click="ssDetail(pagedata.jduuid,pagedata.ryUuid)">申诉详情</text>
					<!-- <view @click="delOrder = true">更多</view> -->
				</view>
				<!-- 接单待同意 -->
			
				<view class="items_bottom_r" v-if="pagedata.state == 5 || pagedata.state == 6">
					<text class="texts" v-if="pagedata.cancelState == 0 || pagedata.cancelState == 2" @click="shanchu(pagedata.jduuid)">删除订单</text>
					<text class="texts" @click="cancel_Detail(pagedata.jduuid,0)" v-if="pagedata.payState == 1">取消详情</text>
					<text class="texts" @click="no_acccom(pagedata.jduuid,3)"  v-if="pagedata.cancelState ==  1">确认完成</text>
				</view>
			</view>
			
			<!-- 我的任务 -->
			<view class="items_bottom"  v-else-if="pageType == 2">
				<view class="items_bottom_l" style="color: #2292fb;">
					
				</view>
				<!-- 未接单取消 -->
				<view class="items_bottom_r" v-if="pagedata.state == 0">
					<text class="texts" @click="Deselect" >取消帮助</text>
					<text class="texts" @click="good_task(pagedata.jduuid,pagedata.price)" v-if="pagedata.type ==  1">同意邀请</text>
				</view>
				
				<view class="items_bottom_r" v-if="pagedata.state == 1">
					<text class="texts" @click="Deselect" >取消帮助</text>
					<text class="texts" @click="task_ok(pagedata.jduuid)" v-if="pagedata.payState ==  1">申请完成</text>
				</view>
				
				<view class="items_bottom_r" v-if="pagedata.state == 2 || pagedata.state == 4">
					<text class="texts" v-if="pagedata.appealState ==  0 || pagedata.appealState === null" 
					@click="shensu(pagedata.jduuid,1)">申诉</text>
					<text class="texts" v-if="pagedata.appealState != 0 && pagedata.appealState !== null" 
					@click="ssDetail(pagedata.jduuid,pagedata.ryUuid)">申诉详情</text>
					<text class="texts" @click="task_ok(pagedata.jduuid)">再次申请</text>
				</view>
				<!-- 接单后 -->
				<view class="items_bottom_r" v-if="pagedata.state == 3">
					<text class="texts" v-if="pagedata.isShowContent == 0" @click="xuanyType = true">分享一下</text>
					<text class="texts">查看钱款</text>
				</view>
				
				<!-- 提交任务失败 -->
				<view class="items_bottom_r" v-if="pagedata.state == 5 || pagedata.state == 6">
					<text class="texts" v-if="pagedata.cancelState == 0 || pagedata.cancelState == 2" @click="shanchu(pagedata.jduuid)">删除订单</text>
					<text class="texts" @click="cancel_Detail(pagedata.jduuid,1)" v-if="pagedata.payState == 1">取消详情</text>
					<text class="texts" @click="task_ok(pagedata.jduuid)" v-if="pagedata.cancelState ==  1">申请完成</text>
				</view>
			</view>
		</view>
		<u-popup v-model="showdel" mode="bottom" border-radius="30">
			<view class="tanchu" v-if="shengf == 2">
				<view class="tanchu_title">选择取消原因 <text class="guiz" @click="qxguiz">查看《取消规则》</text></view>
				<view class="tanchu_item" v-for="(it, ind) in list" :key="ind" @click="radioGroupChange(it.tit,ind)">
					<view class="tanchu_item_left">{{ it.tit }}</view>
					<view class="tanchu_item_right">
						<u-checkbox-group >
							<u-checkbox 
								v-model="it.disabled" 
								:name="it.tit"
							></u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
				<view class="buttons">
					<view class="buttons_l" @click.stop="showdel = false">暂不取消</view>
					<view class="buttons_r" @click="quxiao">取消帮助</view>
				</view>
			</view>
			<view class="tanchu" v-else>
				<view class="tanchu_title">选择取消原因 <text class="guiz" @click="qxguiz">查看《取消规则》</text></view>
				<view class="tanchu_item" v-for="(it, ind) in list_bz" :key="ind" @click="radioGroupChange(it.tit,ind)">
					<view class="tanchu_item_left">{{ it.tit }}</view>
					<view class="tanchu_item_right">
						<u-checkbox-group >
							<u-checkbox 
								v-model="it.disabled" 
								:name="it.tit"
							></u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
				<view class="buttons">
					<view class="buttons_l" @click.stop="showdel = false">暂不取消</view>
					<view class="buttons_r" @click="quxiao">取消帮助</view>
				</view>
			</view>
		</u-popup>
		<!-- 得瑟 -->
		<u-popup v-model="xuanyType" mode="bottom" border-radius="30" >
			<view class="dese" @click="go_brag(1)">图片</view>
			<!-- <text class="dese" @click="go_brag(2)">视频</text> -->
			<view class="dese" @click="xuanyType = false">取消</view>
		</u-popup>
	</view>
</template>

<script>
	import {ip,post,get} from '../../api.js'
	import com from '../../utils/common.js' 
	export default {
		data() {
			return {
				api:{
					post: post,
					get: get,
				},
				com:com,
				latitude:'',
				longitude:'',
				order_id:'',
				covers:[],
				lists:[{title:  '已响应'}, {title: '已同意'}, 
					{title: '帮助中'}, {title: '已完成'},{title: '已评价'}],
				pagedata:'',//页面页面数据
				stepsType:-1,//状态
				title:'',
				tips:'',
				pageType:0,//打哪来
				xitshou:false,//系统提示
				usershow:false,//帮客帮主提示的展示
				quxiaoshow:false,//已取消展示
				liuc:false,
				shows:0,
				cancellation:'',//取消原因
				showdel:false, 
				xuanyType:false,
				value: '', 
				list: [
					{ tit: '不再需要帮助',disabled:false }, 
					{ tit: '帮主联系不上',disabled:false }, 
					{ tit: '帮主能力不足，不能完成任务事项',disabled:false }, 
					{ tit: '帮主没有按照约定要求完成任务',disabled:false }, 
					{ tit: '帮主提供帮助过程中存在违法违规行为',disabled:false },
					{ tit: '帮主态度恶劣',disabled:false }],
				list_bz:[
					{ tit: '临时有事，无法按时完成',disabled:false },
					{ tit: '帮客实际求助超出能力范围',disabled:false }, 
					{ tit: '帮客实际求助超出发布内容',disabled:false }, 
					{ tit: '帮客实际求助存在违法违规问题',disabled:false }, 
					{ tit: '帮客态度恶劣',disabled:false },
					{ tit: '帮客联系不上',disabled:false }
				],
				shengf:1
			}
		},
		onLoad(e) {
			console.log(e.show)
			this.order_id = e.id
			this.pageType = e.type // 1响应我的 2 我的响应
			
			this.shengf = e.shengf //1帮主 2帮客)
		},
		onShow() {
			this.pageApi()
		},
		methods: {
			
			//取消规则
			qxguiz(){
				this.com.navto('../login/agreement_page?type='+7)
			},
			//去聊天
			go_chat(e){
				console.log(e)
				if(this.shengf == 2){//1帮主 2帮客
					this.api.get('chat/add/'+e.bzId+'/'+e.bzUuid+'/'+ e.type).then(res=>{
						console.log(res)
						if(res.flag){
							//id发布人 bzuuid是任务或服务id
							this.com.navto('../chat/chat?name='+e.bzName+'&id='+e.bzId+'&bzuuid='+e.bzUuid+'&type='+ e.type +'&chatId='+res.data)
						}
					})
				}else{
					this.api.get('chat/add/'+e.bkId+'/'+e.bzUuid+'/'+ e.type).then(res=>{
						console.log(res)
						if(res.flag){
							//id发布人 bzuuid是任务或服务id
							this.com.navto('../chat/chat?name='+e.bkName+'&id='+e.bkId+'&bzuuid='+e.bzUuid+'&type='+ e.type +'&chatId='+res.data)
						}
					})
				}
			},
			photoC(e){
				let arr = ''
				if(e){
					arr =  e.replace(/(\d{3})(\d{4})(\d{4})/,'$1****$2')
				}
				return arr
			},
			pageApi(){
				let that = this
				uni.request({
					url: ip + 'response/processHelp/' +that.order_id,
					header: { 'content-type': 'application/json','token':uni.getStorageSync('token')},
					method: 'GET',
					success(res) {
						console.log(res)
						if(res.data.flag){
							that.pagedata = res.data.data
							that.latitude =  res.data.data.latitude
							that.longitude = res.data.data.longitude
							that.covers = [
								{
									latitude:res.data.data.latitude,
									longitude: res.data.data.longitude,
									iconPath: '../../static/location_daibang.png',
								}
							]
							//步骤条状态
							if(res.data.data.payState == 0){
								that.stepsType = 1
							}else if(res.data.data.state == 3 ){
								that.stepsType = 3
								if(res.data.data.appraiseState == 1){
									that.stepsType = 4
								}
							}else if(res.data.data.state == 4 || res.data.data.state == 2 || res.data.data.payState == 1){
								that.stepsType = 2
							}else{
								that.stepsType = 0
							}
							
							
							if(res.data.data.state == 0){
								if(res.data.data.type == 0){//需求
									that.lists[0].title = '已响应'
									if(that.shengf == 1){//帮主
										that.title = '待帮客同意'
										that.tips = '您已响应，待帮客同意'
									}else{
										that.title = '待同意'
										that.tips = '有帮主响应，请确认是否同意'
									}
								}else{
									that.lists[0].title = '已邀请'
									// 服务
									if(that.shengf == 1){//帮主
										that.title = '待同意'
										that.tips = '有帮客邀请，请及时处理'
									}else{
										that.title = '待帮主同意'
										that.tips = '您已邀请，待帮主响应'
									}
								}
							}else if(res.data.data.state == 1){
								if(res.data.data.payState == 1){
									that.title = '帮助中'
									if(that.shengf == 1){//帮主
										that.tips = '帮客已同意，请尽快提供帮助，帮助完成后可申请完成'
									}else{
										that.tips = '帮助已开始，帮助完成后请确认'
									}
								}else{
									that.title = '待支付'
									if(that.shengf == 1){//帮主
										that.tips = '待帮客支付'
									}else{
										that.tips = '请在30分钟内完成支付，否则将视为取消求助'
									}
								}
							}else if(res.data.data.state == 2){
								if(that.shengf == 1){
									that.title = '已申请完成'
									that.tips = '您已申请完成，待帮客确认，三小时后帮客未确认可再次申请'
								}else{
									that.title = '帮主已申请完成'
									that.tips = '已及时确认'
								}
							}else if(res.data.data.state == 4){
								if(that.shengf == 1){//帮主
									that.title = '帮客已拒绝完成'
									that.tips = '帮客拒绝完成，请继续帮助或与帮客协商，也可以申诉'
								}else{
									that.title = '您已拒绝完成'
									that.tips = '拒绝完成，帮助继续，您可以与帮主协商或申诉'
								}
							}else if(res.data.data.state == 3 ){
								if(that.shengf == 2){
									that.title = '已完成'
									that.tips = '帮助已完成，可以对本次帮助进行评价了！'
								}else{
									that.title = '帮客已确认完成'
									that.tips = '您可以分享本次帮助！'
								}
								if(res.data.data.appraiseState == 1){
									if(that.shengf == 2){
										that.title = '已评价完成'
										that.tips = ''
									}else{
										that.title = '帮客已评价'
										that.tips = ''
									}
								}
							}else if(res.data.data.cancelState === null){
								that.title = '帮助中'
								if(res.data.data.state == 5){ //帮客取消
									if(that.shengf == 1){ //帮主
										that.tips = '帮客已取消，请及时处理，三分钟无操作，将视为同意帮客取消，请点击取消详情进行处理'
									}else{
										that.tips = '您已申请取消，等待帮主处理'
									}
								}else if(res.data.data.state == 6){ //帮主取消
									if(that.shengf == 1){ //帮主
										that.tips = '您已申请取消，等待帮客处理'
									}else{
										that.tips = '帮主已取消，请及时处理，三分钟无操作，将视为同意帮主取消，请点击取消详情进行处理'
									}
								}
							}else if(res.data.data.cancelState === 1){
								that.title = '帮助中'
								if(res.data.data.state == 6){ //帮主取消
									if(that.shengf == 1){ //帮主
										that.tips = '帮客不同意取消，请与帮客协商或申诉'
									}else{
										that.tips = '您已拒绝取消，帮助继续'
									}
								}else if(res.data.data.state == 5){ //帮客取消
									if(that.shengf == 1){ //帮主
										that.tips = '您已拒绝取消，帮助继续'
									}else{
										that.tips = '帮主不同意取消，请与帮主协商或申诉'
									}
								}
							}
							
							if(res.data.data.payState == 2 && res.data.data.cancelState == 2){
								that.shows = 1 //
							}else if(res.data.data.cancelState == 0  && res.data.data.payState != 1){// 当paystate 0 cancelstate0 state 5时为帮客已取消
								if(res.data.data.state == 5 ){
									that.shows = 2 //
								}else if(res.data.data.state == 6){
									that.shows = 2 //
								}
							}else if(res.data.data.payState == 1 && res.data.data.cancelState == 0){// paystate 1 cancelstate0 为已取消
								that.shows = 3 
								
							}	
						}
					}
				})
			},
			//到地图导航
			gochat(){
				let data = {
					position:this.pagedata.address, 
					latitude:this.pagedata.latitude,
					longitude:this.pagedata.longitude,
				}
				this.com.navto('../map/map?data='+JSON.stringify(data))
			},
			//需求流程
			go_myHelpdetail(e,type){
				console.log(e,type)
				
			},
			go_detail(e,type,bztype){
				if(type == 0){
					if(bztype == 0 || bztype == 2){
						this.com.navto('../index/task_detail?id='+e.bzUuid) 
					}else{
						this.com.navto('./details?data=' + JSON.stringify(e));
					}
				}else{
					if(bztype == 0 || bztype == 2){
						this.com.navto('../serve_detail/serve_detail?id='+e.bzUuid) 
					}else{
						this.com.navto('./details?data=' + JSON.stringify(e));
					}
				}
			},
			// 复制
			copy(){
				let er = this.pagedata.bkName + ' '+ this.pagedata.phone +'\n'+ this.pagedata.address
				uni.setClipboardData({
				    data: er,
				    success: function () {
						
				    }
				});
			},
			// 取消原因
			radioGroupChange(e,ind){
				console.log(e)
				if(this.shengf == 2){
					this.list.forEach((i,index)=>{
						i.disabled = false
					})
					this.list[ind].disabled = true
				}else{
					this.list_bz.forEach((i,index)=>{
						i.disabled = false
					})
					this.list_bz[ind].disabled = true
				}
				
				this.cancellation = e
			},
			//取消订单
			Deselect(){
				this.showdel = true
				
			},
			//弹出框的取消
			quxiao(){
				if(this.cancellation == ''){
					this.com.msg('请选择原因')
				}else{
					let arr = {
						"cancelCause":this.cancellation,
						"jdUuid": this.pagedata.jduuid,
					}
					let that = this
					this.showdel = false
					uni.showModal({
						title:"确定要取消帮助吗？",
						success(res) {
							if(res.confirm){
								that.list = []
								that.api.post('response/cancelHelp',arr).then(res=>{
									// console.log(res)
									if(res.flag){
										that.pageApi()
									}
								})
							}
						}
					})
				}
			},
			//同意帮助
			good_task(e,type){
				let arr = {
					"jdUuid":e,"jdState":1,
				}
				
				this.api.post('response/processHelpState',arr).then(res=>{
					console.log(e)
					if(res.flag){
						this.list = []
						this.pageApi()
						if(type != 0 && this.pagedata.type == 0){
							this.com.navto('../index/pay_detail?id='+e)
						}
					}
				})
			},
			//支付
			go_pay(e){
				this.com.redto('../index/pay_detail?id='+e)
			},
			// 拒绝完成/任务完成
			no_acccom(e,type){
				let arr = {
				    "jdUuid": e,
				    "jdState": type
				}
				
				if(type == 3){ //确认完成
					let that = this
					uni.showModal({
						content:'您确定帮助已经完成了吗？',
						confirmText:'确认完成',
						cancelText:'未完成',
						success(a) {
							if(a.confirm){
								that.api.post('response/processHelpState',arr).then(res=>{
									if(res.flag){
										that.pageApi()
									}else{
										that.com.msg(res.message)
									}
								})
							}
						}
					})
				}else{
					this.api.post('response/processHelpState',arr).then(res=>{
						if(res.flag){
							this.pageApi()
						}else{
							this.com.msg(res.message)
						}
					})
				}
			},
			// 去评价
			go_pjia(e){
				this.com.navto('./list/addpingjia?id='+e)
			},
			// 删除订单、
			shanchu(e){
				console.log(e)
				this.api.get('response/deleteResponse/'+e).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.msg('删除成功')
						this.com.two_back()
					}else{
						this.com.msg('删除失败')
					}
				})
			},
			// 申诉
			shensu(e,userid,type){
				console.log(e,userid)
				this.com.navto('./list/appeal?jdid='+e+'&type='+type+'&userid='+userid)
			},
			// 申请任务完成
			task_ok(e){
				let arr = {
					"jdUuid": e,
					"jdState":2
				}
				let that = this
				uni.showModal({
					title:"确定帮助完成了吗？",
					confirmText:'确定申请',
					cancelText:'取消申请',
					success(res) {
						if(res.confirm){
							
							that.api.post('response/processHelpState',arr).then(res=>{
								console.log(e)
								if(res.flag){
									that.pageApi()
								}else{
									that.com.msg(res.message)
								}
							})
						}
					}
				})
			},
			//取消详情
			cancel_Detail(e,type){
				this.com.navto('./disqualification?id='+e+'&type='+type)
			},
			// 到发布得瑟
			go_brag(e){
				this.xuanyType = false
				this.com.navto('../brag/issue_brag?type='+e+'&id='+this.pagedata.jduuid)
			},
			
		}
	}
</script>

<style>
	page{
		background-color: #eef3f6;
	}
</style>
<style scoped lang="scss">
	// 得瑟
	.dese{
		width: 100%;padding: 30rpx 0;text-align: center;
	}
	//弹出层
	.tanchu {
		width: 750rpx;
		padding: 20rpx 40rpx;
		.tanchu_title {
			margin: 30rpx 0;
			font-size: 34rpx;
			font-weight: bold;
			text-align: center;
		}
		.guiz{
			font-weight: 100;color: red;font-size: 28rpx;
			margin-left: 26rpx;
		}
		.tanchu_item {
			display: flex;flex-direction: row;
			justify-content: space-between;
			line-height: 100rpx;
			border-bottom: 1rpx solid #eee;
		}
		.buttons {
			width: 680rpx;
			display: flex;flex-direction: row;
			justify-content: space-between;
			margin-top: 30rpx;
			.buttons_l {
				width: 300rpx;
				border: 1rpx solid #f30a06;
				color: #f30a06;
				padding: 15rpx 0;
				text-align: center;
				border-radius: 50rpx;
				
			}
			.buttons_r {
				background-color: #f30a06;
				color: white;
				width: 300rpx;
				border: 1rpx solid #f30a06;
				padding: 15rpx 0;
				text-align: center;
				border-radius: 50rpx;
			}
		}
	}
.posi{
	width: 750rpx;
	background-color: #fff;padding: 10rpx 0;
	position: fixed;left: 0;bottom: -4rpx;
	.items_bottom {
		display: flex;flex-direction: row;
		justify-content: space-between;
		color: #999999;
		.items_bottom_l {
			width: 180rpx;
			margin-top: 10rpx;
			display: flex;
			text {
				color: #ff1111;
			}
		}
		.items_bottom_r {
			width: 400rpx;
			display: flex;flex-direction: row;
			justify-content: space-around;
			.texts {
				padding: 8rpx 18rpx;
				border-radius: 50rpx;
				border: 1rpx solid #f30a06;
				color: #f30a06;
				font-weight: bold;
				margin: 10rpx;font-size: 32rpx;
			}
			.bgcol{
				background-color: #f30a06;
				color: #fff;
			}
		}
	}
}

.header{
	width: 750rpx;height: 260rpx;background-color: #fd3b41;padding: 0 50rpx;
	display: flex;justify-content: space-around;align-items: center;flex-direction: row;
	.header_text{
		font-size: 46rpx;color: white;
	}
}
.backcoloor{
	width: 750rpx;height: 300rpx;
	background-color: #fd3b41;
	// position: relative;
	
}
.gotoconfirmed{
		width: 700rpx;height: 250rpx;background-color: #FFFFFF;border-radius: 15rpx;
		position: absolute;left: 25rpx;bottom: 30rpx;z-index:200;
		padding: 50rpx 30rpx;
		.confirmed_duotype{
			font-size: 36rpx;font-weight: bold;line-height: 80rpx;
		}
		.request_confired{
			font-size: 30rpx;line-height: 50rpx;color: #999;
		}
	}
.task_detail{
	width: 700rpx;border-radius: 20rpx;
	padding: 30rpx;margin-left: 25rpx;margin-top: 30rpx;
	background-color: #FFFFFF;
	.task_detail_top{
		display: flex;justify-content: space-between;flex-direction: row;
		.top_img{
			width: 210rpx;height: 160rpx;border-radius: 20rpx;
			background-color: #F8F8F8;
		}
		.top_text{
			width: 400rpx;lines: 3;text-overflow: ellipsis;
		}
	}
	.task_user{
		display: flex;flex-direction: row;
		padding: 20rpx 0;border-bottom:2rpx solid #f5f5f5;
		.task_user_image{
			width: 60rpx;height: 60rpx;margin-right: 20rpx;
			border-radius: 999rpx;
		}
		.task_user_Text{
			line-height: 60rpx;color: #999;
			font-size: 30rpx;
		}
	}
	.datas_li{
		display: flex;justify-content: space-between;flex-direction: row;
		padding-top: 10rpx;
		.li_child{
			display: flex;flex-direction: row;
			.tips{
				font-size: 28rpx;margin-top: 6rpx;
			}
		}
		.datas_li_l{
			color: #999;margin: 20rpx 0;
		}
		.tips{
			margin-left: 25rpx;
		}
		.datas_li_bo{
			font-size: 34rpx;font-weight: bold;
		}
		.datas_li_red{
			color: red;font-size: 34rpx;font-weight: bold;
		}
	}
	.datas_botton{
		margin-top: 15rpx;
		display: flex;flex-direction: row;
		.texts{
			color: #999;font-size: 28rpx;
		}
	}
	
}
.map{
	width: 700rpx;background-color: #FFFFFF;padding: 30rpx;
	margin-left: 25rpx;margin-top: 30rpx;border-radius: 20rpx;
	.map_top{
		display: flex;justify-content: space-between;margin-bottom: 22rpx;
		.user_copy{
			display: flex;
			image{
				width: 32rpx;height: 36rpx;margin: 0 10rpx;
			}
		}
		
	}
	.page-section{
		display: flex;justify-content: space-between;
		.page-section_r{
			display: flex;margin-top: 20rpx;
			image{
				width: 32rpx;height: 42rpx;margin: 0 10rpx;
			}
		}
		
	}

}
.response_message{
	width: 700rpx;background-color: #FFFFFF;padding: 20rpx;margin-top: 30rpx;margin-left: 25rpx;
	border-radius: 20rpx;margin-bottom: 80rpx;
	.message_top{
		display: flex;flex-direction: row;justify-content: space-between;
		.message_top_left{
			font-weight: bold;line-height: 60rpx;
		}
		.message_top_rig{
			border: 1rpx solid #f30a06;padding: 6rpx 20rpx;border-radius: 50rpx;
		}
	}
	.message_item{
		.message_item_text{
			
			color: #666;font-size: 30rpx;
		}
	}
}
</style>
