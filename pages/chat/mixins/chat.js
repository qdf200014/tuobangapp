const recorderManager = uni.getRecorderManager(); //录音
import {
	sizeDeal
} from "../../../common/util.js"
import emoji from './emoji.js'
import jiuaiDebounce from '@/js_sdk/jiuai-debounce/jiuai-debounce.js'
import api from '../../../api.js'
import com from '../../../utils/common.js'
export default {
	data() {
		return {
			isIos:false,
			isVoice: false,
			voiceText: '按住 说话',
			voiceTis: "手指上滑 取消发送",
			voiceFlg: false,
			voiceStop: false,
			voiceTimer: null,
			voiceLength: 0,
			voicePageY: 0,
			textareaVal: '',
			keyboardHeight: 80,
			chatInputBoxHeight: 0,
			keyboardHeightFlg: false,
			textareaFocusFlg: false,
			windowHeight: 0,
			rows: [],
			emojiList: [],
			clickEvent: '',
			lineCount: 1,
			currentFun: 0,
			deviceBottom:0,
			socketOpen:false,//socket链接
			newsId:0,
			bzUuid:'',
			bzType:0,
			uploadAction:api.ip + 'upload/uploadChatImg',//图片
			uploadVideo:api.ip + 'upload/uploadChatAudio',//音频
			// yinpAction:api.ip +
			page:1,
			shopDetail: '' ,//商品信息
			userinfoId:uni.getStorageSync("userinfo_Data").id,
			chatId:0,
		}
	},
	computed: {},
	
	onLoad(info) {
		console.log(info)
		this.rows = []
		this.bzUuid = info.bzuuid
		this.bzType = info.type //0需求 1服务
		this.newsId = info.id
		this.chatId = info.chatId
		// console.log(info.id)
		// 修改导航栏
		uni.setNavigationBarTitle({
		　　title:info.name
		})
		let iosObj = plus.navigator.getSafeAreaInsets()
		// 获取底部安全区域高度 兼容苹果X 以上机型 
		this.deviceBottom = iosObj.deviceBottom || 0
		
		this.page = 1
		this.pageData(this.page)
		
		this.$nextTick(() => {
			this.$refs.chatList.scrollerBottom()
			if (plus.os.name.toLowerCase() !== 'android') {
				this.isIos = true
			}
		})
		this.chatInputBoxHeight = sizeDeal("108rpx")[0]
		uni.getSystemInfo({
			success: (res) => {
				this.windowHeight = res.windowHeight
			}
		});
		this.keyboardHeightChange()
		this.onRecorderManager()
	},
	onBackPress(){
		uni.closeSocket();
		uni.onSocketClose(function (res) {
		  console.log('WebSocket 已关闭！');
		});
	},
	onShow() {
		this.socket() //websocket
	},
	onHide(){
		console.log(22)
		uni.closeSocket();
		uni.onSocketClose(function (res) {
		  console.log('WebSocket 已关闭！');
		});
	},
	methods: {
		jiedan(e){
			console.log(e)
			if(e.type == 0){
				api.post('response/acceptHelp',{bzUuid:e.id,type:0}).then(res=>{
					if(res.flag){
						// that.pageData()
						com.navto('../my/order_detail?id='+res.data+'&type='+ 2 +'&shengf='+ 1) //1帮主 2帮客
					}else{
						uni.showToast({
							title:res.message,icon:'none'
						})
					}
				})
			}else{
				com.navto('../serve_detail/order_receiving?id='+e.id)
			}
		},
		//跳详情
		go_detail(e,type){
			console.log(e)
			if(type == 0){ //0需求 1服务
				if(e.bzState == 0){
					com.navto('../index/task_detail?id='+e.id)
				}else{
					com.navto('../my/details?data=' + JSON.stringify(e));
				}
			}else{
				if(e.bzState == 0){
					com.navto('../serve_detail/serve_detail?id='+e.id)
				}else{
					com.navto('../my/details?data=' + JSON.stringify(e)+'&type='+2);
				}
			}
		},
		//上拉加载
		loadmore(){
			this.page ++
			this.pageData(this.page)
		},
		 pageData(e){
			 // console.log('chat/queryDetails/'+this.bzUuid +'/'+ this.chatId +'/'+ this.bzType)
			api.get('chat/queryDetails/'+this.bzUuid +'/'+ this.chatId +'/'+ this.bzType ,{page:e,size:10}).then(res=>{
				console.log(res)
				if(res.flag){
					this.shopDetail = res.data.helpInfo
					var timestamp = Date.parse(new Date());//获取时间戳
					// console.log(timestamp)
					if(res.data.chatList){
						res.data.chatList.forEach((i,index)=>{
							// console.log(i.time)
							if(timestamp - i.time > 86400000){ //大于一天
								if(timestamp -i.time  < 172800000){ //小于两天
									i.timeout = '昨天' + this.DateTime(i.time)
								}else{                 //大于两天
									if(timestamp -i.time  < 31104000000){ //小于一年
										i.timeout = this.getYMDHMS(i.time,1)
									}else{
										i.timeout = this.getYMDHMS(i.time,2)
									}
								}
							}else{
								i.timeout = this.DateTime(i.time)
							}
							
						})
						this.rows =this.rows.concat(res.data.chatList)
					}
				}
			})
		},
		//时分秒
		DateTime(data){
			var s;
			var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = (data % (1000 * 60)) / 1000;
			s = (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
			return s;
		},
		// 年月日时分秒
		getYMDHMS(timestamp,type) {
			  let time = new Date(timestamp)
			  let year = time.getFullYear()
			  let month = time.getMonth() + 1
			  let date = time.getDate()
			  let hours = time.getHours()
			  let minute = time.getMinutes()
			  let second = time.getSeconds()
		
			  if (month < 10) { month = '0' + month }
			  if (date < 10) { date = '0' + date }
			  if (hours < 10) { hours = '0' + hours }
			  if (minute < 10) { minute = '0' + minute }
			  if (second < 10) { second = '0' + second }
			 
			  if(type == 1){ //小于一年
				  return month + '月' + date + '日'+' ' + hours + ':' + minute + ':' + second
			  }else{
				  return year + '年' + month + '月' + date + '日' + ' ' + hours + ':' + minute + ':' + second
			  }
		},
		socket(){
			let that = this
			uni.connectSocket({
				url: api.ip+'websocket/'+ this.userinfoId + '/'+ 1, 
				success(a){
					console.log(a)
					that.socketOpen = true;
				}
			});
			uni.onSocketOpen(function (res) {
				console.log('WebSocket连接已打开！')
				that.socketOpen = true;
			});
			
			uni.onSocketError(function (res) {
				console.log('WebSocket连接打开失败，请检查')
			});
			
			uni.onSocketMessage(function (res) {
				console.log('收到服务器内容：' + res.data)
				if(JSON.parse(res.data).bzUuid == that.bzUuid){
					that.rows.unshift(JSON.parse(res.data))
				}
				if(JSON.parse(res.data).type == 1){
					that.keyboardHeightFlg = false
				}
				
			});
		},
		// 录音监听
		onRecorderManager() {
			// #ifdef APP-NVUE
			//录音开始
			recorderManager.onStart((e) => {
				console.log('录音开始')
			})
			// 录音报错
			recorderManager.onError((e) => {
				console.log(e)
				console.log('录音报错')
			})
			//录音结束
			recorderManager.onStop((e) => {
				console.log('录音结束')
				if (this.voiceStop) {
					uni.showToast({
						icon: "none",
						title: "取消发送"
					})
				} else {
					if (this.voiceLength < 1) {
						uni.showToast({
							icon: "none",
							title: "发送时间过短"
						})
					} else {
						console.log('发送语音')
						console.log(e)
		
						uni.uploadFile({
							url: this.uploadVideo,
							filePath: e.tempFilePath,
							name: 'file',
							formData: {
								'user': 'test'
							},
							// header:{
							// 	'token':uni.getStorageSync('token')
							// },
							success: (up) => {
								console.log(up)
								let luj = JSON.parse(up.data)
								// console.log(luj)
								this.addMsg('', 2, luj.data, this.voiceLength)
							}
						});
						
						
					}
				}
			})
			// #endif
		},
		// 键盘监听
		async keyboardHeightChange() {
			let keyHeight = uni.getStorageSync('keyboardHeight')
			let keyFlg = (!keyHeight || keyHeight == 0)
			this.keyboardHeight = keyHeight
			if (keyFlg) {
				// 主动弹出键盘 获取 键盘高度
				await this.$nextTick(() => {
					setTimeout(() => {
						this.$refs.textareaRef.focus()
					}, 60)
				})
			}
			await this.$nextTick(() => {
				uni.onKeyboardHeightChange(res => {
					console.log(res)
					if (res.height !== 0) {
						if (keyFlg && (keyHeight !== res.height)) {
							console.log(res.height)
							uni.setStorageSync('keyboardHeight', res.height)
							this.keyboardHeight = res.height
							this.$nextTick(() => {
								keyFlg = false
							})
						}
						this.$nextTick(() => {
							console.log('谈起键盘')
							this.textareaFocus()
						})
					} else {
						//  键盘隐藏 清除焦点 因为textarea 组件使用了双向绑定后 一旦绑定数据发生变化 焦点就不会消失了 暂时只能通过监听键盘高度去控制焦点了 o(╥﹏╥)o
						console.log(this.$refs.chatList)
						if (this.$refs.chatList) {
							this.$refs.chatList.scrollerBottom()
						}
						console.log('键盘隐藏')
						
						this.$nextTick(() => {
							if (plus.os.name.toLowerCase() === 'android') { 
								if (this.$refs.textareaRef) {
									this.$refs.textareaRef.blur()
								}
							}
						})
					}
				})
			})
		},
		// 检测语音时间
		isVoiceTime() {
			if (this.voiceLength < 1) {
				uni.showToast({
					icon: "none",
					title: "发送时间过短"
				})
			} else {
				this.voiceLength = 0
			}
		},
		// 按下触发
		touchstartVoice(e) {

			this.voicePageY = (e.changedTouches[0].pageY).toFixed(2)
			this.voiceText = '松开 结束'
			this.voiceFlg = true
			recorderManager.start({
				format: "mp3"
			}); //录音开始,
			this.voiceTimer = setInterval(() => {
				this.voiceLength ++
				console.log(this.voiceLength)
			}, 1000)
			console.log('touchstartVoice', this.voicePageY)
		},
		// 滑动触发
		touchmoveVoice(e) {
			let numTemp = this.voicePageY - ((e.changedTouches[0].pageY).toFixed(2))
			if (numTemp >= 60) {
				// console.log('取消发送')
				this.voiceStop = true
				this.voiceTis = "松开手指 取消发送"
			} else {
				// console.log('继续发送')
				this.voiceStop = false
				this.voiceTis = "手指上滑 取消发送"
			}
		},
		// 松开触发
		touchendVoice() {
			this.voiceFlg = false
			this.voiceText = '按住 说话'
			this.voiceTis = "手指上滑 取消发送"
			console.log('touchendVoice')
			console.log(this.voiceStop)
			clearInterval(this.voiceTimer);
			this.voiceTimer = null

			recorderManager.stop(); //录音结束
		},
		// 打断触发
		touchcancelVoice() {
			clearInterval(this.voiceTimer);
			this.voiceTimer = null
			this.voiceFlg = false
			this.voiceText = '按住 说话'
			this.voiceTis = "手指上滑 取消发送"
			console.log('touchcancelVoice')
			recorderManager.stop(); //录音结束
		},
		// 点击工具
		toolItem(item, index) {
			switch (item.type) {
				case 0:
					console.log('相册')
					this.getChooseImage(['album'])
					break;
				case 1:
					console.log('拍摄')
					this.getChooseImage(['camera'])
					break;
				default:

			}
		},
		//吊起相册或拍摄
		getChooseImage(type) {
			let _this = this
			uni.chooseImage({
				sourceType: type,
				count: 1,
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: (res) => {
					console.log(res)
					let b = (1000 * 1000) * 3
					if (res.tempFiles[0].size >= b) {
						uni.showToast({
							icon: "none",
							title: '图片过大无法上传'
						})
						return
					}
					let srcImg = res.tempFilePaths[0]
					let name = srcImg.substr(srcImg.lastIndexOf('/') + 1); //截取文件名
					// 压缩图片
					plus.zip.compressImage({
							src: srcImg,
							dst: '_doc/jggTempData/' + name, //把图片重新保存到该目录下  
							overwrite: true, //如果同名则覆盖文件  
							quality: 25 //压缩比率，越大质量越好,不要用100出来比原文件还大一倍  
						},
						function(data) {
							console.log(data)
							console.log(data.target)
							uni.uploadFile({
								url: _this.uploadAction,
								filePath: data.target,
								name: 'file',
								formData: {
									'user': 'test'
								},
								// header:{
								// 	'token':uni.getStorageSync('token')
								// },
								success: (up) => {
									let luj = JSON.parse(up.data)
									_this.addMsg('', 1, luj.data)
								}
							});
							
						},
						function(error) {
							console.log("Compress error!");
						});
				},
				fail(err) {
					console.log(err)
				}
			});
		},
		// 添加表情
		setEmoj(item, index) {
			console.log(item, index)
			this.textareaVal += item
		},
		// 点击发送按钮
		clickMsg() {
			jiuaiDebounce.canDoFunction({
				key: "clickMsg", //基于此值判断是否可以操作，如两个方法传入了同样的key，则会混淆，建议传入调用此事件的方法名，简单好梳理
				time: 1000, //如果传入time字段，则为定时器后，自动解除锁定状态，单位（毫秒）
				success: () => { //成功中调用应该操作的方法，被锁定状态不会执行此代码块内的方法
					console.log('发送信息')
					let val = this.textareaVal
					if (val.trim() == '') {
						uni.showToast({
							icon: 'none',
							title: "消息不能为空"
						})
					} else {
						this.addMsg(val)
						this.textareaVal = ''
					}

				}
			})

		},
		// 添加消息
		addMsg(msg, type, url, time) {
			// console.log(time)
			this.$refs.chatList.hideTips()
			let data = {
				name: msg,
				id: this.newsId,
				url: url,
				time: time,
				type: type ? type : 0,
				bzUuid:this.bzUuid,
				bzType:this.bzType,
				chatId:this.chatId
			}
			console.log(this.socketOpen)
			 if (this.socketOpen) {
			    uni.sendSocketMessage({
			      data: JSON.stringify(data),
				  success(ar) {
				  	console.log(ar)
					//时间归零
					this.$nextTick(() => {
						this.voiceLength = 0
					})
				  }
			    });
			  } 
			  this.$nextTick(() => {
			  	this.$refs.chatList.scrollerBottom()
				this.$refs.chatList.isScroller()
			  })
			  
			// return
			// let i = this.rows.length - 1
			// i++
			// this.rows.unshift({
			// 	name: msg,
			// 	id: 1,
			// 	url: url,
			// 	time: time,
			// 	type: type ? type : 0
			// })
			// this.$nextTick(() => {
			// 	this.$refs.chatList.scrollerBottom()
			// })
		},
		//点击语音
		clickVoice() {
			jiuaiDebounce.canDoFunction({
				key: "clickVoice", //基于此值判断是否可以操作，如两个方法传入了同样的key，则会混淆，建议传入调用此事件的方法名，简单好梳理
				time: 300, //如果传入time字段，则为定时器后，自动解除锁定状态，单位（毫秒）
				success: () => { //成功中调用应该操作的方法，被锁定状态不会执行此代码块内的方法
					console.log('点击语音')
					this.clickEvent = ''
					if (this.textareaFocusFlg) {
						console.log('正在打字')
						this.$refs.textareaRef.blur()
						this.textareaFocusFlg = false
						this.$nextTick(() => {
							setTimeout(() => {
								console.log('打开语音')
								this.isVoice = true
							}, 60)
						})
					} else {
						console.log('没有焦点')
						if (this.keyboardHeightFlg) {
							console.log('抽屉打开中')
							this.keyboardHeightFlg = false
							this.$nextTick(() => {
								console.log('打开语音')
								this.isVoice = true
							})
						} else {
							if (this.isVoice) {
								console.log('切换到打字')
								this.isVoice = false
									setTimeout(() => {
										console.log('弹出键盘')
										this.$refs.textareaRef.focus()
									}, 60)
							} else {
								this.isVoice = true
								console.log('打开语音')
							}
						}
					}
				}
			})
		},
		clickEmoj(val, i) {
			console.log('点击' + val)
			this.clickEvent = val
			if (this.textareaFocusFlg) {
				// 有焦点的话只用让输入框失去焦点 不隐藏功能栏
				this.$refs.textareaRef.blur()
				this.currentFun = i
			} else {
				if (i !== this.currentFun) {
					this.currentFun = i
					// 没有焦点 点击切换功能栏 的显示和隐藏
					this.keyboardHeightFlg = true
				} else {
					// 没有焦点 点击切换功能栏 的显示和隐藏
					this.keyboardHeightFlg = !this.keyboardHeightFlg

				}
			}
			this.$nextTick(() => {
				// 触发滚动到页面底部
				if (this.emojiList.length == 0) {
					// 获取表情数据
					this.emojiList = emoji
				}
				if (this.keyboardHeightFlg) {
					this.isVoice = false
				}
				this.$refs.chatList.scrollerBottom()
			})
		},
		texTlinechange(e) {
			// 获取行高
			this.lineCount = e.detail.lineCount
		},
		textareaFocus() {
			console.log('00000')
			// 修改 输入框聚焦状态
			this.textareaFocusFlg = true
			// 弹起输入框
			this.keyboardHeightFlg = true
			// 触发滚动到页面底部
			this.$refs.chatList.scrollerBottom()
		},
		keyboardInput() {
			console.log(222)
		},
		// 失去焦点触发
		textareaBlur() {
			if (this.clickEvent !== '') {
				// 点击 功能键 不触发 功能栏的收起
			} else {
				// 焦点消失 修改输入框位置
				this.keyboardHeightFlg = false
			}
			this.$nextTick(() => {
				this.clickEvent = ''
				// 修改 输入框聚焦状态
				this.textareaFocusFlg = false
			})
		},
		
	}
};
