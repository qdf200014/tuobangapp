<template>
	<view>
		<view class="head">
			<view class="system" style="margin-bottom: 20rpx;"  @click="gotop('./information')">
				<view class="imgLeft">
					<image src="../../static/tongzhi.png" mode=""></image>
					<view class="tips" v-if="xitun.unread && xitun.unread != 0">{{xitun.unread}}</view>
				</view>
				<view class="textRig" >
					<view class="textRigTitle">
						通知消息
					</view>
					<view class="TitleTips norow">
						{{xitun.text}} 
					</view>
				</view>
			</view>
			<view class="system"  @click="gotop('./hudun')">
				<view class="imgLeft">
					<image src="../../static/hudun.png" mode=""></image>
					<view class="tips" v-if="hud.unread && hud.unread != 0">{{hud.unread}}</view>
				</view>
				<view class="textRig">
					<view class="textRigTitle">
						互动消息
					</view>
					<view class="TitleTips norow">
						{{hud.text}}
					</view>
				</view>
			</view>
		</view>
		<!-- 聊天 -->
		<view class="chatPart">
			<view class="kun" v-if="list == ''">
				<tb-kunNews></tb-kunNews>
			</view>
			<view class="chatItem" v-for="(it,ind) in list" :key="ind" @click="go_chat(it)" @longpress="logoTime(it.chatId)">
				<view class="left">
					<image :src="it.img" mode="aspectFill"></image>
					<view class="reddian" v-if="it.countUnread > 0">
						{{it.countUnread}}
					</view>
				</view>
				<view class="content">
					<view class="name">
						{{ it.name }}
					</view>
					<view class="chatnews">
						{{ it.sendContent }}
					</view>
					<view class="time">
						{{ it.time }}
					</view>
				</view>
				<view class="right" @click.stop="go_detail(it.bzUuid,it.bzType)">
					<image :src="it.photo" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<u-popup v-model="delshow" mode="center" width="60%" borderRadius="16">
			<view class="delpop" @click="delNow">
				删除
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {ip} from '../../api.js'
	export default {
		data() {
			return {
				list:[],
				delshow:false,
				chatId:'',
				xitun:'',
				hud:''
			}
		},
		onHide(){
			console.log(22)
			uni.closeSocket();
			uni.onSocketClose(function (res) {
			  console.log('WebSocket 已关闭！');
			});
		},
		onLoad() {
		},
		onShow() {
			if(!uni.getStorageSync('token')){
				this.pageNums ++
				if(this.pageNums <= 1){
					this.com.navto('../login/login?type='+1)
				}else{
					this.pageNums = 0
					uni.switchTab({
						url:'../index/index' 
					})
				}
			}else{
				this.pageData()
			}
			this.socket()
		},
		methods: {
			socket(){
				let that = this
				console.log( ip +'websocket/'+uni.getStorageSync("userinfo_Data").id+'/'+ 0)
				uni.connectSocket({
					url: ip +'websocket/'+uni.getStorageSync("userinfo_Data").id+'/'+ 0,
					success(a){
						console.log(a)
					}
				});
				uni.onSocketOpen(function (res) {
					console.log('WebSocket连接已打开！')
				});
				
				uni.onSocketError(function (res) {
					console.log('WebSocket连接打开失败，请检查')
				});
				
				uni.onSocketMessage(function (res) {
					console.log('收到服务器内容：' + res.data)
					that.pageData()
				});
			},
			pageData(){
				this.api.get('chat/query').then(res=>{
					console.log(res)
					if(res.flag){
						this.list = res.data.chat
						this.xitun = res.data.systemNewMessage
						this.hud = res.data.userInteractionNewMessage
					}
				})
			},
			// 到聊天
			go_chat(e){
				this.com.navto('../chat/chat?name='+e.name+'&id='+e.id+'&bzuuid='+e.bzUuid+'&type='+e.bzType+'&chatId='+e.chatId)
				
			},
			//跳详情
			go_detail(e,type){
				if(type == 0){ //0需求 1服务
					this.com.navto('../index/task_detail?id='+e)
				}else{
					this.com.navto('../serve_detail/serve_detail?id='+e)
				}
			},
			// 长按
			logoTime(e){
				this.delshow = true
				this.chatId = e
			},
			//删除
			delNow(){
				this.api.get('chat/deleteChat/'+this.chatId).then(res=>{
					if(res.flag){
						this.pageData()
						this.delshow = false
					}
				})
			},
			//到通知消息
			gotop(e){
				this.com.navto(e)
			}
		}
	}
</script>

<style scoped lang="scss">
	.delpop{
		line-height: 96rpx;padding-left: 26rpx;
	}
.head{
	padding: 4%;border-bottom: 20rpx solid #F6F6F6;
	.system{
		display: flex;justify-content: space-between;
		.imgLeft{
			width: 20%;
			position: relative;
			image{
				width: 110rpx;height: 110rpx;
			}
			.tips{
				position: absolute;right: 10rpx;top: 10rpx;
				line-height: 30rpx;color: white;font-size: 22rpx;text-align: center;
				width: 30rpx;height: 30rpx;border-radius: 50%;background-color: red;
			}
		}
		.textRig{
			width: 80%;
			.textRigTitle{
				line-height: 60rpx;font-size: 34rpx;font-weight: bold;
			}
			.TitleTips{
				color: #999;
				white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
			}
		}
	}
}
.chatPart{
	width: 100%;padding: 0 4%;
	.chatItem{
		display: flex;justify-content: space-between;margin: 20rpx 0;
		.left{
			width: 20%;
			position: relative;
			image{
				width: 110rpx;height: 110rpx;border-radius: 50%;
			}
			.reddian{
				position: absolute;top: 10rpx;right: 16rpx;text-align: center;
				line-height: 30rpx;color: white;font-size: 22rpx;
				width: 30rpx;height: 30rpx;border-radius: 50%;background-color: red;
			}
		}
		.content{
			width: 60%;
			.name{
				line-height: 60rpx;font-size: 34rpx;font-weight: bold;
			}
			.chatnews{
				font-size: 30rpx;color: #999;
				white-space: nowrap;text-overflow: ellipsis;overflow: hidden;
			}
			.time{
				margin-top: 18rpx;font-size: 24rpx;color: #999;
			}
		}
		.right{
			width: 20%;
			image{
				width: 120rpx;height: 120rpx;border-radius: 15rpx; 
				background-color: #f6f6f6;
			}
		}
	}
}
</style>
