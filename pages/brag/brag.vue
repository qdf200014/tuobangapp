<template>
	<view>
		<tb-pulldown bgcolor="#f5f5f5" textcolor="#000" :scrollY="true" @onRefresh="onRefresh" @pulldown="pulldown"
		:status="status">
			<view slot="detail">
				<view class="page_item" v-for="(item,index) in datas" :key="index">
					<!-- //用户信息 -->
					<view class="item_tops"  >
						<view class="item_top_img" @click="gotopage('../my/master_page?id='+item.ryUuid)">
							<image class="imga" :src="item.ryHeadimg" mode="aspectFill"></image>
							<image class="imgb" v-if="item.rySex=='男'" src="../../static/nan.png" mode=""></image>
							<image class="imgb" v-else src="../../static/nu.png" mode=""></image>
						</view>
						<!-- 名字 -->
						<view class="item_right">
							<view class="item_right_left"  @click="gotopage('../my/master_page?id='+item.ryUuid)">
								<view>{{item.bzName}}</view>
								<text style="color: #999;">勋章</text>
							</view>
							<view class="item_right_right">
								<view class="plus_attention" v-if="item.isGuanZhu == 1" @click="guanzhu(item.ryUuid,index)">+关注</view>
								<view class="plus_attention_s" v-if="item.isGuanZhu == 2" @click="guanzhu(item.ryUuid,index)">已关注</view>
								<view class="plus_attention_s" v-if="item.isGuanZhu == 3" @click="guanzhu(item.ryUuid,index)">互相关注</view>
								<view  v-if="item.isGuanZhu == 0"></view> 
								<u-icon name="more-dot-fill" color="#999" size="54" @click="popupshow(item)"></u-icon>
							</view>
						</view>
					</view>
					<!--  -->
					<view class="item_user">
						<text @click="gotopage('../my/master_page?id='+item.ryUuid)">{{item.bzName}}</text>完成了对
						 <text @click="gotopage('../my/master_page?id='+item.bkId)">{{item.bkName}}</text>的帮助
					</view>
					<!-- 视频 -->
					<!-- <video class="videoSty" id="myVideo" src="http://ry-showimg.oss-cn-beijing.aliyuncs.com/43c920210725172838.mp4"
					    @error="videoErrorCallback" :danmu-list="danmuList" enable-danmu  controls></video> -->
					<!-- 轮播图 -->
					<swiper class="swiper" :indicator-dots="true"  :circular="true">
						<swiper-item v-for="(it,ind) in item.showImg" :key="ind" @click="img_prev(item.showImg,ind)"  class="swiper-item">
							<image :src="it" mode="aspectFill"></image>
						</swiper-item>
					</swiper>
					<!-- 文字 -->
					<view class="detail_text">
						{{item.showContent}}
					</view>
					<!-- 关键字 -->
					<view class="keyword">
						<view class="keyword_item" v-for="(its,ind) in item.bzKeyWord" :key="ind">
							<view>#</view>	
							<text>{{its}}</text>
						</view>
					</view>
					<!-- //评论 -->
					<view class="comment" @click="pl_cli(pagePl,item.showId,index)">
						<view class="comment_item" >
							<view class="item_name" v-for="(itp,ind) in item.hsShowCommentVoList" :key="ind">
								<text>{{itp.commentRyPetName}} ：</text>{{itp.commentContent}}
							</view>
						</view>
					</view>
					<!-- //外部 -->
					<view class="inputs">
						<input class="inp" type="text" adjust-position="false" placeholder="表扬一下帮主" :disabled="true" @click="pl(item.showId,index)">
						<u-popup  v-model="inpshow" mode="bottom" :mask-custom-style="{background: 'rgba(0, 0, 0, 0.2)'}">
							<view class="pop_bottom">
								<textarea v-model="texrval"  :focus="true" placeholder="内容这么棒,评论安排上" maxlength="500"
								cursor-spacing="4"/>
								<view @click="send_comment(item,1)">
									发送
								</view>
							</view>
						</u-popup>
						<view class="inp_icon">
							<!-- <view class="icon_l" @click="starCli()">
								<u-icon :name="star" size="36"></u-icon><text>{{item.showStoreCount}}</text>
							</view> -->
							<!-- 评论 -->
							<view class="icon_l" @click="pl_cli(pagePl,item.showId,index)"> 
								<u-icon name="chat" size="36"></u-icon><text>{{item.showCommentCount}}</text>
							</view>
							<!-- 点赞 -->
							<view class="icon_l" @click="thumbUpCli(item.showId,index)">
								<view  :animation="animationData[index]" >
									<u-icon name="thumb-up" size="36" color="#999" v-if="item.isParse == 1"></u-icon>
									<u-icon name="thumb-up-fill" size="36" color="#0493fd" v-else></u-icon>
								</view>
								<text>{{item.showParseCount}}</text>
							</view>
						</view>
					</view>
					
					<u-popup v-model="show" mode="bottom" border-radius="14" :closeable="true" 
					:mask-custom-style="{background: 'rgba(0, 0, 0, 0.2)'}">
						<view class="popups" >
							<!-- 评论 -->
								<view class="pop_title">
									评论
								</view>
								<scroll-view class="u-drawer__scroll-view" scroll-y="true"  @scrolltolower="scrollBut">
									<view class="swiper_view">
										<view class="qunb">
											全部评论· {{commontNum}}
										</view>
										<view v-if="commontList == ''">
											<u-empty text="暂无评论" mode="message"></u-empty>
										</view>
										<view v-else>
											<view class="swiper_items" v-for="(it,ind) in commontList" :key="ind">
												<!-- 一级 -->
												<view class="item_stair">
													<image class="item_imga" :src="it.commentRyHeadImg" @click="gotopage('../my/master_page?id='+it.commentRyUuid)" mode="aspectFill"></image>
													<view class="item_userinfo">
														<view style="width: 90%;">
															<view class="item_userinfo_name" @click="gotopage('../my/master_page?id='+it.commentRyUuid)">
																{{it.commentRyPetName}} · <text>{{it.accessTime}}</text>
															</view>
															<view class="item_userinfo_text" @click="two_commont(it,2,ind)" 
															@longpress="logoTime(it,it.commentRyUuid)">
																{{it.commentContent}}
															</view>
														</view>
														<!-- 点赞 -->
														<view style="text-align: center;"  @click="commont_zan(it.id,ind,1)">
															<u-icon name="thumb-up" size="34" v-if="it.commentIsParse == 1"></u-icon>
															<u-icon name="thumb-up-fill" size="34" color="#0493fd" v-else></u-icon>
															<view>{{it.parseCount}}</view>
														</view>
													</view>
												</view>
												<!--  :style="it.repliesContent.length >= 4 ? it.height :''" -->
												<view style="width: 100%;overflow: hidden;" v-if="it.repliesContent.length !=0">
													<view class="items_child" v-for="(its,indexs) in it.repliesContent" :key="indexs">
														<!-- 2级 -->
														<view class="stair_child">
															<image class="imga_child" :src="its.commentRyHeadImg"  mode="aspectFill"
															@click="gotopage('../my/master_page?id='+its.commentRyUuid)"></image>
															<view class="userinfo_child">
																<view class="child_l">
																	<view class="userinfo_name_child" @click="gotopage('../my/master_page?id='+its.commentRyUuid)">
																		{{its.commentRyPetName}} · <text>{{its.accessTime}}</text>
																	</view>
																	<view style="word-break:break-all;word-wrap:break-word;" @click="two_commont(its,3,ind)"
																	@longpress="logoTime(its,its.commentRyUuid)">
																		<text v-if="its.commentType == 3">回复  {{its.replyRyPetName}}： </text>
																		{{its.commentContent}}
																	</view>
																</view>
																<!-- 点赞 -->
																<view class="child_r" @click="commont_zan(its.id,indexs,2,ind)">
																	
																	<u-icon name="thumb-up" size="34" v-if="its.isParse == 1"></u-icon>
																	<u-icon name="thumb-up-fill" size="34" color="#0493fd" v-else></u-icon>
																	
																	<view>{{its.parseCount}}</view>
																</view>
															</view>
														</view>
													</view>
												</view>
												<!-- //查看全部 -->
												<!-- <view class="ckan" v-if="it.repliesContent.length > 3 && it.repliesContent.length !=0 && it.height == 'height:400rpx'"
												@click="viewall(ind)">
													<view v-if="pl_show" >
														查看全部{{it.repliesContent.length}}条 <u-icon name="arrow_right"></u-icon>
													</view>
												</view> -->
											</view>
										</view>
									</view>
								</scroll-view>
							<view class="pop_bottom" :style="{bottom: inputOffsetBottom > 0 ? inputOffsetBottom + 'px' : '4rpx'}">
								<textarea v-model="texrval" :focus="two_focus" :fixed="true"
								:placeholder="answer" maxlength="500" @touchmove.stop.prevent cursor-spacing="4"
									
								  :adjust-position="false"/>
								<view @click="send_comment(item,2)">
									发送
								</view>
							</view>
						 </view>
					</u-popup>
				</view>
				<!-- 评论举报 -->
				<u-popup v-model="commont_delShow" mode="bottom" border-radius="20">
					<view class="del_item" @click="delcommontCli(1)" style="color: red;border-bottom: 1rpx solid #eee;" v-if="delbut">
						删除
					</view>
					<view class="del_item" @click="delcommontCli(2)" style="color: red;border-bottom: 1rpx solid #eee;" v-else>
						举报
					</view>
					<view class="del_item" @click="commont_delShow = false">
						取消
					</view>
				</u-popup>
				
				<!-- 评论举报 -->
				<u-popup v-model="bragpopup" mode="bottom" border-radius="20">
					<!-- <view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(1)">
						分享
					</view> -->
					<!-- <view class="del_item" style="border-bottom: 1rpx solid #eee;" @click="bargClick(2)" 
					v-if="barg_jubCont.isGuanZhu != 0">
						不感兴趣
					</view> -->
					<view class="del_item"  style="color: red;border-bottom: 1rpx solid #eee;" @click="bargClick(3)"
					v-if="barg_jubCont.isGuanZhu != 0">
						举报
					</view>
					<view class="del_item" @click="bragpopup = false">
						取消
					</view>
				</u-popup>
				<tb-share ref="share" :page_content_two="barg_jubCont" :contentHeight="450" type="3"></tb-share>
			</view>
		</tb-pulldown>
	</view>
</template>

<script>
	import uniLoadMore from '../../components/uni-load-more/uni-load-more.vue'
	export default {
		data() {
			return {
				swiperHeight:'900rpx',
				current:0,
				star:'star',//收藏
				show:false,//评论弹出层
				texrval:'',
				inpshow:false,//输入框
				datas:[],
				commontNum:0,//评论数
				commontList:[],//列表
				pl_show:true,//显示
				deseId:0,//嘚瑟id
				two_focus:false,//点二级获取焦点
				two_cont:'',//二级内容
				two_type:0,//状态 二级 2   三级 3
				answer:'内容这么棒,评论安排上',
				commont_delShow:false,//删除显示
				commont_delId:0,//删除的id
				animationData: {},
				delbut:false,//删除按钮显示
				showIdbarg:0,//嘚瑟id
				bragpopup:false,//得瑟举报
				barg_jubCont:'',//要举报的内容
				pages:1,//得瑟分页，
				pagePl:1,//得瑟评论分页
				status: 'more',
				oneIndex:-1,//一级评论下班
				inputOffsetBottom:0,
				pl_cliIndex:-1
			}
		},
		components:{
			uniLoadMore
		},
		onLoad(op) {
			this.showIdbarg = op.id
			let arr = {
				detail:{
					current:0
				}
			}
			this.pageData(this.pages)
		},
		watch:{
			show(a){
				console.log(a)
				if(a == false){
					this.pl_show = true
				}
			}
		},
		onReady() {
		  // 监听键盘高度变化，以便设置输入框的高度
		  uni.onKeyboardHeightChange(res => {
		    this.inputOffsetBottom = res.height
		    
		  })
		},
		methods: {
			//外部评论显示
			pl(e,index){
				this.deseId = e
				this.inpshow = true
				this.pl_cliIndex = index
			},
			//关注
			guanzhu(e,ind){
				this.api.post('hsFansInfo/addGuanZhu',{uid:e,fid:uni.getStorageSync("userinfo_Data").id}).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.msg(res.message)
						if(this.datas[ind].isGuanZhu == 1){
							this.datas[ind].isGuanZhu = 2
						}else{
							this.datas[ind].isGuanZhu = 1
						}
					}
				})
			},
			//查看全部
			viewall(e){
				this.commontList[e].height = 'padding:0'
				this.pl_show = false
			},
			// 页面跳转
			gotopage(e){
				this.com.navto(e)
				
			},
			pageData(e){
				let data = {
					showId:this.showIdbarg,        //得瑟id
					ryUuid:uni.getStorageSync("userinfo_Data").id, //用户id（非必传）
					pageNo:e,  //页码（非必传）
					pageSize:4    //每页显示的条数（非必传）
				}
				this.api.post('show/selAllShowContent',data).then(res=>{
					console.log(res)
					if(res.flag){
						this.datas =this.datas.concat(res.data)
						 // commentIsParse 0 点赞 1没
						 if(e != 1){
						 	if(res.data && res.data.length < 4){
						 		this.status = 'noMore'
						 	}
						 }
					}
				})
			},
			// 评论弹出
			pl_cli(e,id,index){
				// console.log(e)
				this.deseId = id
				this.pl_cliIndex = index
				this.show = true
				this.pagePl = 1
				this.commontList = []
				this.pl_api(this.pagePl)
				
			},
			pl_api(e){
				this.api.post('comment/showComment',{
					showId:this.deseId,        //得瑟id
					ryUuid:uni.getStorageSync("userinfo_Data").id, //用户id（非必传）
					pageNo:e,  //页码（非必传）
					pageSize:10   //每页显示的条数（非必传）
				
				}).then(res=>{
					console.log(res)
					if(res.flag){
						this.commontNum = res.data.commentCount //评论数
						res.data.hsShowCommentVoList.forEach(i=>{
							i.height = "height:400rpx"
						})
						this.commontList = this.commontList.concat(res.data.hsShowCommentVoList)
						
					}
				})
			},
			// 预览图
			img_prev(e,ind){

				uni.previewImage({
					urls: e,
					current:ind
				});
			},
			getElementHeight(element) {
				
				setTimeout(()=>{
					let query = uni.createSelectorQuery().in(this);
					query.select(element).boundingClientRect();
					query.exec((res) => {
						console.log(res)
						if (!res) {//如果没获取到，再调一次
							this.getElementHeight();
						}else {
							this.swiperHeight = res[0].height * 2 +'rpx';
						}
					})
				},20)
			},
			//长按删除
			logoTime(e,typeid){
				if(typeid != uni.getStorageSync("userinfo_Data").id){
					this.delbut = false
				}else{
					this.delbut = true
				}
				this.commont_delShow = true
				this.commont_delId = e
			},
			//收藏
			// starCli(){
			// 	if(this.star == 'star-fill'){
			// 		this.star = 'star'
			// 	}else{
			// 		this.star = 'star-fill'
			// 	}
			// },
			commont_zan(e,ind,type,find){
				this.api.post('showCommentParse/addShowCommentParse',{
					commentId:e,
					parseRyUuid:uni.getStorageSync("userinfo_Data").id
				}).then(res=>{
					console.log(res)
					if(type == 1){  //一级
						this.commontList[ind].commentIsParse = this.commontList[ind].commentIsParse == 1 ? 0 : 1
						this.commontList[ind].parseCount = this.commontList[ind].commentIsParse == 1 ? this.commontList[ind].parseCount -1 : this.commontList[ind].parseCount +1
					}else{
						if(this.commontList[find].repliesContent){
							this.commontList[find].repliesContent[ind].isParse = this.commontList[find].repliesContent[ind].isParse == 1 ? 0 : 1
							this.commontList[find].repliesContent[ind].parseCount = this.commontList[find].repliesContent[ind].isParse == 0 ? this.commontList[find].repliesContent[ind].parseCount +1 : this.commontList[find].repliesContent[ind].parseCount -1 
						}
						
					}
					
				})
			},
			//点赞
			thumbUpCli(e,index){
				
				for (var i = 0; i < this.datas.length; i++) {
					let a = {}
					a[i] = {}
					this.animationData = { ...this.animationData,
						...a
					}
				}
				var animation = uni.createAnimation({
					duration: 2000,
					timingFunction: 'ease',
				})
				this.animation = animation
				//  // 同时进行
				this.animation.scale(1.25,1.25).step();
				this.animationData[index] = animation.export()
				 setTimeout(()=>{
					 this.animation.scale(1,1).step();
					this.animationData[index] = animation.export();
				 },400)
				
				// return
				this.api.post('showContentParse/addShowContentParse',{
					parseShowId:e,
					parseRyUuid:uni.getStorageSync("userinfo_Data").id
				}).then(res=>{
					console.log(res)
					if(res.flag){ 
						this.datas[index].isParse = this.datas[index].isParse == 1 ? 0 : 1
						this.datas[index].showParseCount = this.datas[index].isParse == 1 ? this.datas[index].showParseCount -1  : this.datas[index].showParseCount + 1
						this.pageData(this.pages)
					}
					this.com.msg(res.message)
				})
			},
			
			//发布评论
			send_comment(e,type){
				// console.log(e)
				if(this.texrval == ''){
					this.com.msg('不能为空')
					return
				}
				// 一级评论为空是一级。否则2级
				if(!this.two_cont){
					this.api.post('comment/addShowComment',{
						showId:this.deseId || e.showId,
						showComment:this.texrval,
						commentRyUuid:uni.getStorageSync("userinfo_Data").id
					}).then(res=>{
						if(res.flag){
							this.texrval = ''
							if(type == 2){
								// 评论弹框的上面显示数量
								this.commontNum ++
								//前端添加到页面，避免重复刷新
								this.commontList.unshift(res.data)
								this.commontList = this.commontList
								//评论数量加
								this.datas[this.pl_cliIndex].showCommentCount = this.datas[this.pl_cliIndex].showCommentCount += 1
								// this.commontList = []
								this.$forceUpdate()
							}else{
								this.inpshow = false
								//评论数量加
								this.datas[this.pl_cliIndex].showCommentCount = this.datas[this.pl_cliIndex].showCommentCount += 1
								// this.commontList = []
								console.log(this.datas[this.pl_cliIndex].showCommentCount)
							}
						}
						this.com.msg(res.message)
					})
				}else{  //二级
					this.api.post('comment/addShowReply',{
						showId:this.deseId,
						commentId:this.two_cont.commentId,
						commentType:this.two_type,
						commentRyUuid:uni.getStorageSync("userinfo_Data").id,
						showComment:this.texrval,
						delId:this.two_cont.delId,
						replyRyUuid:this.two_cont.commentRyUuid,
					}).then(res=>{
						// console.log(res)
						this.com.msg(res.message)
						if(res.flag){
							//加数量
							this.commontNum ++
							//添加到当前的一级评论下
							if(this.commontList[this.oneIndex].repliesContent){
								this.commontList[this.oneIndex].repliesContent.push(res.data)
								
								this.commontList = this.commontList
								this.$forceUpdate()
							}
							//评论数量加
							this.datas[this.pl_cliIndex].showCommentCount = this.datas[this.pl_cliIndex].showCommentCount += 1
							//评论数量加
							this.two_cont = ''
							this.texrval = ''
							this.answer = '内容这么棒,评论安排上'
						}
					})
				}
				
			},
			// 二级及以下评论
			two_commont(e,type,ind){
				console.log(e)
				// console.log(ind)
				this.two_cont = e
				this.two_type = type
				this.answer = '回复：'+e.commentRyPetName //输入框展示
				this.texrval = '' 
				this.two_focus = true //输入框焦点
				this.oneIndex = ind //一级评论的下标
			},
			// 评论删除/举报
			delcommontCli(e){
				if(e == 1){ //删除
					this.api.get('comment/delShowComment/'+this.commont_delId.id).then(res=>{
						// console.log(res)
						this.com.msg(res.message)
						this.commont_delShow = false
						if(res.flag){
							this.pagePl = 1
							this.commontList = []
							this.pl_api(this.pagePl)
							this.pages = 1 
							this.datas = []
							this.pageData(this.pages)
							
							this.datas[this.pl_cliIndex].showCommentCount = this.datas[this.pl_cliIndex].showCommentCount += 1
						}
					})
				}else{ //举报
					this.com.navto('./bargReport?cont='+JSON.stringify(this.commont_delId)+'&type='+1)
				}
				
			},
			// 举报
			popupshow(e){
				console.log(e)
				this.bragpopup = true
				this.barg_jubCont = e
			},
			// 得瑟举报
			bargClick(e){
				//1分享 2不感兴趣 3举报
				if(e == 1){
					this.$refs.share.toggleMask();
				}else if(e == 2){
					
				}else if(e == 3){
					this.com.navto('./bargReport?cont='+JSON.stringify(this.barg_jubCont)+'&type='+2)
				}
				this.bragpopup = false
			},
			//加载更多
			pulldown(){
				this.status = 'loading'
				this.pages++
				this.pageData(this.pages)
			},
			//刷新
			onRefresh(){
				this.datas = []
				this.pages = 1
				this.pageData(this.pages)
			},
			// 评论滑动
			scrollBut(e){
				// console.log(e)
				this.pagePl ++
				this.pl_api(this.pagePl)
			}
		}
	}
</script>

<style scoped lang="scss">
//删除
.del_item{
	width: 100%;text-align: center;line-height: 100rpx;
}
.page_item{
	width: 100%;
	border-bottom: 26rpx solid #eee;
	.item_tops{
		padding: 25rpx;
		display: flex;
		.item_top_img{
			width: 20%;
			position: relative;
			.imgb{
				position: absolute;
				right: 6rpx;bottom: 4rpx;
				width: 44rpx;height: 44rpx;
			}
			.imga{
				width: 130rpx;height: 130rpx;border-radius: 50%;
			}
			
		}
	}
	.item_right{
		width: 80%;padding-left: 20rpx;
		display: flex;
		.item_right_left{
			width: 60%;
			view{
				font-size: 34rpx; 
				line-height: 78rpx;
				text-overflow: ellipsis;overflow: hidden;white-space: nowrap;
			}
		}
		.item_right_right{
			width: 40%;
			display: flex;justify-content: space-between;
			align-items: center;
			view{
				padding: 10rpx 20rpx;white-space: nowrap;
			}
			.plus_attention{
				border: 1rpx solid #eee;
				border-radius: 50rpx;
			}
			.plus_attention_s{
				border: 1rpx solid #eee;
				border-radius: 50rpx;background-color: #eee;
			}
		}
	}
}
.item_user{
	padding: 15rpx 30rpx;color: #a9cd87;
	background-color: #f6ffd2;
	text{
		color: #ff5a00;text-decoration: underline;
		margin: 0 8rpx;
		margin-bottom: 15rpx;
	}
}
.videoSty{
	width: 100%;
	height: 900rpx;
}
.swiper{
	width: 100%;
	height: 700rpx;
	background-color: #fff;
	margin-top: 20rpx;
	.swiper-item{
		display: flex;align-items: center;
		image{
			width: 100%;height: 100%;
			
		}
	}
	
}
.detail_text{
	padding: 3% 4%;
}
.keyword{
	display: flex;flex-wrap: wrap;
	.keyword_item{
		display: flex;
		border: 1rpx solid #eee;
		width: 30%;padding:16rpx 20rpx ;white-space: nowrap;border-radius: 50rpx;
		margin: 1%;
		view{
			background-color: #333;color: #fff;border-radius: 50rpx;
			width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;
			margin-right: 14rpx;
		}
		text{
			width: 60%;
			overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
		}
	}
}
.comment{
	padding: 3%;
	.comment_item{
		line-height: 50rpx;
		.item_name{
			text{font-weight: bold;}
		}
	}
}
.inputs{
	display: flex;color: #9fa19c;margin-bottom: 20rpx;
	padding-left: 3%;
	input{
		width: 50%;font-size: 30rpx;background-color: #eee;padding: 10rpx 0 10rpx 20rpx;border-radius: 50rpx;
	}
	.inp_icon{
		width: 50%;
		display: flex;justify-content: space-around;
		font-size: 34rpx;
		.icon_l{
			line-height: 60rpx;display: flex;
			text{margin: 0 10rpx;}
		}
	}
	.pop_bottom{
		position: fixed;left: 0;bottom: 0;
		background-color: #fff;
		width: 100%;box-shadow: 1rpx 0rpx 10rpx 0rpx #999;padding:10rpx 30rpx;
		display: flex;justify-content: space-between;
		textarea{
			width: 80%;height: 50rpx;border-radius: 10rpx;padding: 10rpx;
			border: 1rpx solid #999;
		}
		view{
			text-align: center;
			width: 20%;line-height: 70rpx;
			font-size: 34rpx;color: #999;
		}
	}
}
.popups{
	width: 100%;padding-bottom: 100rpx;
	.pop_title{
		position: flex;left: 0;top: 0;
		line-height: 90rpx;text-align: center;width: 100%;font-size: 34rpx;
		background-color: #fff;
	}
	.pop_bottom{
		position: fixed;left: 0;
		// transition: all 0.01s;
		background-color: #fff; 
		width: 100%;padding: 10rpx 30rpx;
		display: flex;justify-content: space-between;
		textarea{
			width: 80%;height: 50rpx;border-radius: 10rpx;padding: 10rpx;
			border: 1rpx solid #999;
		}
		view{
			text-align: center;
			width: 20%;line-height: 70rpx;
			font-size: 34rpx;color: #999;
		}
	}
	.swiper_view{
		height: 900rpx;
		.qunb{
			font-weight: bold;padding: 3%;
		}
		.swiper_items{
			width: 100%;padding:0 3%;
			margin-bottom: 30rpx;
			.item_stair{
				display: flex;
				.item_imga{
					width: 90rpx;height: 90rpx;border-radius: 50%;
				}
				.item_userinfo{
					margin-left: 2%;
					width: 85%;
					display: flex;justify-content: space-between;
					.item_userinfo_name{
						margin: 10rpx 0;
						font-size: 32rpx;
						color: #999;
						text{
							margin-left: 15rpx;
							font-size: 26rpx;
						}
					} 
					.item_userinfo_text{
						width: 92%;
						word-break:break-all;
						word-wrap:break-word;
					}
				}
			}
			.ckan{
				width: 100%;text-align: center;color: #999;
				
			}
			.items_child{
				width: 100%;padding:0 0 0 15%; 
				margin-bottom: 30rpx;
				.stair_child{
					display: flex;
					width: 100%;
					.imga_child{
						width: 60rpx;height: 60rpx;border-radius: 50%;
					}
					.userinfo_child{
						margin-left: 2%;
						width: 88%;
						display: flex;justify-content: space-between;
						.child_l{
							width: 82%;
							.userinfo_name_child{
								
								margin: 10rpx 0;
								font-size: 32rpx;
								color: #999;
								text{
									margin-left: 15rpx;
									font-size: 26rpx;
								}
							}
							
						}
						
					}
				}
			}
			.items_child:nth-child(1){
				margin-top: 30rpx;
			}
		}
	}
}

</style>
