<template>
	<view>
		<!-- 帮主排行 -->
		<view class="paihang">
			<view class="title_line">
				<view class="sheq">
					您附件的社区
				</view>
				<view class="title_line_r">
					<view></view>
					<view @click="go_list" >我加入的社区 <u-icon name="arrow-right"></u-icon></view>
				</view>
			</view>
			<scroll-view :scroll-x="true" >
				<view class="scrollSty" :style="{'padding-top': '40rpx',width:2 < 3 ? '840rpx' : '1220rpx','padding-right':5 >= 5 ? '26rpx' : '0rpx'}">
					<view class="rankingItem" v-for="(it,ind) in bangzhu" :key="ind" @click="go_master(item.ryUuid)">
						<view class="userimg ">
							<image  :src="it.img" mode=""></image>
						</view>
						<view class="dzan">500m</view>
						<view class="sex">
							<view class="right_name rowTwo">
								{{it.name}}
							</view>
						</view>
						<view style="color: #666;line-height: 40rpx;font-size: 26rpx;">
							成员：211
						</view>
						<view style="color: #666;line-height: 40rpx;font-size: 26rpx;">
							活动：110
						</view>
					</view>
					<view class="scrollX_gend" @click="go_master_gen">
						<view class="text">更多 <u-icon name="arrow-right" color="#999"></u-icon></view>
						<view class="textpy">GENGDUO</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="title_line">
			<view >
				<tb-title style="width: 300rpx;" title="社区跳蚤市场" ></tb-title>
			</view>
			<view class="title_line_r">
				<view></view>
				<view @click="go_list" >更多</view>
			</view>
		</view>
		<view class="tiaozao">
			<scroll-view :scroll-x="true" >
				<view class="tiaozaofor" :style="{width:2 < 3 ? '840rpx' : '1220rpx','padding-right':5 >= 5 ? '26rpx' : '0rpx'}">
					<view class="tiaozaoItem" v-for="(it,ind) in listb" :key="ind">
						<image :src="it.img" mode="aspectFill"></image>
						<view class="itemtext rowTwo">{{it.name}}</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 在聊 -->
		<view class="zailiao">
			<view class="title_line">
				<tb-title style="width: 220rpx;" title="社区在聊" ></tb-title>
			</view>
			<view class="page_item" v-for="(item,index) in 2" :key="index">
				<!-- //用户信息 -->
				<view class="item_tops"  >
					<view class="item_top_img" @click="gotopage('../my/master_page?id='+item.ryUuid)">
						<image class="imga" src="../../static/shouy_34.png" mode="aspectFill"></image>
					
					</view>
					<!-- 名字 -->
					<view class="item_right">
						<view class="item_right_left"  @click="gotopage('../my/master_page?id='+item.ryUuid)">
							<view class="views"> 狗子加萌站 </view>
							<view style="color: #666;font-size: 24rpx;width: 300rpx;" class="norow">来自：狮子城海棠园社区</view>
						</view>
						<view class="item_right_right">
							<view class="plus_attention"  @click="guanzhu(item.ryUuid)">+关注</view>
							<view class="plus_attention_s" v-if="item.isGuanZhu == 2" @click="guanzhu(item.ryUuid)">已关注</view>
							<view class="plus_attention_s" v-if="item.isGuanZhu == 3" @click="guanzhu(item.ryUuid)">互相关注</view>
							<view  v-if="item.isGuanZhu == 0"></view> 
							<u-icon name="more-dot-fill" color="#999" size="54" @click="popupshow(item)"></u-icon>
						</view>
					</view>
				</view>
				
				<!-- 文字 -->
				<view class="detail_text">
					的哈技术复核很骄傲赎回的哈技术复核很骄傲赎回的哈技术复核很骄傲赎回
				</view>
				<view class="imgs"  >
					<image class="daimg" src="../../static/shouy_36.png" mode="aspectFill"></image>
					<view class="imgRig">
						<image v-for="(it,ind) in 2" :key="ind" src="../../static/daibangtupian2.png"
						class="xiaoimg"	mode="aspectFill"></image>
					</view>
				</view>
				
				<!-- //评论 -->
				<view class="comment" @click="pl_cli(pagePl,item.showId)">
					<view class="comment_item" >
						<view class="item_name" v-for="(itp,ind) in 2" :key="ind">
							<text>大王巡山 ：</text>感谢老铁送的狗粮
						</view>
					</view>
				</view>
				<!-- //外部 -->
				<view class="inputs">
					<input class="inp" type="text" adjust-position="false" placeholder="觉得好玩说两句" :disabled="true" @click="pl(item.showId)">
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
						<view class="icon_l" @click="pl_cli(pagePl,item.showId)"> 
							<u-icon name="chat" size="36"></u-icon><text>25</text>
						</view>
						<!-- 点赞 -->
						<view class="icon_l" @click="thumbUpCli(item.showId,index)">
							<view  :animation="animationData[index]" >
								<!-- <u-icon name="thumb-up" size="36" color="#999" v-if="item.isParse == 1"></u-icon> -->
								<u-icon name="thumb-up-fill" size="36" color="#0493fd" ></u-icon>
							</view>
							<text>98</text>
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
										全部评论· 100
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
											<view :style="it.repliesContent.length >= 4 ? it.height :''" style="width: 100%;overflow: hidden;" v-if="it.repliesContent.length !=0">
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
											<view class="ckan" v-if="it.repliesContent.length > 3 && it.repliesContent.length !=0 && it.height == 'height:400rpx'"
											@click="viewall(ind)">
												<view v-if="pl_show" >
													查看全部{{it.repliesContent.length}}条 <u-icon name="arrow_right"></u-icon>
												</view>
											</view>
										</view>
										<!-- <uni-load-more :status="status"></uni-load-more> -->
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
		</view>
	</view>
</template> 

<script>
	export default {
		data() {
			return {
				inpshow:false,
				texrval:'',
				animationData: {},
				show:false,
				commontList:[],
				inputOffsetBottom:0,
				two_focus:false,
				answer:'内容这么棒,评论安排上',
			}
		},
		props:{
			listb:{},
			bangzhu:{}
		},
		methods: {
			gotopage(e){
				this.com.navto(e)
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
			//关注
			guanzhu(e){
				this.api.post('hsFansInfo/addGuanZhu',{uid:e,fid:uni.getStorageSync("userinfo_Data").id}).then(res=>{
					console.log(res)
					if(res.flag){
						this.com.msg(res.message)
						this.pageData(this.pages)
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
.page_item{
	width: 100%;padding-left: 10rpx;
	border-bottom: 1rpx solid #eee;margin-bottom: 20rpx;
	.item_tops{
		padding:10rpx 25rpx;
		display: flex;
		.item_top_img{
			width: 15%;
			position: relative;
			
			.imga{
				width: 100rpx;height: 100rpx;border-radius: 16rpx;
			}
			
		}
	}
	.item_right{
		width: 85%;padding-left: 20rpx;
		display: flex;
		.item_right_left{
			width: 60%;
			.views{
				font-size: 32rpx; 
				line-height: 60rpx;
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
	.detail_text{
		padding: 10rpx 20rpx;line-height: 50rpx;
	}
	.imgs{
		width: 95%;border-radius: 26rpx;overflow: hidden;
		display: flex;margin: 0 2%;
		.daimg{
			width: 500rpx;height: 500rpx;
				
		}
		.imgRig{
			width: 250rpx;
			display: flex;flex-direction: column;
			.xiaoimg{
				width: 250rpx;height: 250rpx;
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
			width: 50%;font-size: 30rpx;background-color: #f5f5f5;padding: 10rpx 0 10rpx 20rpx;border-radius: 50rpx;
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
}
.paihang{
	
	background-color: white;border-radius: 26rpx;
	padding: 10rpx;
}
.scrollSty{
	display: flex;padding-left: 20rpx;
}
.rankingItem{
	border: 0.5px solid #ddd;
	width: 234rpx;height: 280rpx;margin-right: 26rpx;
	border-radius: 26rpx;
	position: relative;padding: 100rpx 20rpx 20rpx 20rpx;
	.userimg{
		position: absolute;left: 18rpx;top: -30rpx;
		width: 100rpx;height: 100rpx;
		background-color: white;
		image{
			width: 100rpx;height: 100rpx;border-radius: 20rpx;
		}
	}
	.dzan{
		width: 60rpx;height: 60rpx;
		position: absolute;right: 10rpx;top: 20rpx;
		color: red;font-size: 24rpx;
	}
	.sex{
		display: flex;line-height: 40rpx;
		.right_name{
			width: 150rpx;font-size: 30rpx;margin-bottom: 10rpx;
		}
	}
	.renzheng{
		width: 150rpx;height: 40rpx;
	}
}	
.scrollX_gend{
	width: 180rpx;height: 280rpx;border: 0.5px solid #ddd;
	border-radius: 26rpx;text-align: center;color: #999;
	padding: 85rpx 20rpx 20rpx 20rpx;margin-right: 30rpx;
	.text{
		font-size: 36rpx;
		line-height: 60rpx;
	}
	.textpy{
		font-size: 28rpx;
	}
}
.title_line{
	display: flex;padding: 0 10rpx;
	.sheq{
		font-size: 30rpx;width: 200rpx;line-height: 88rpx;font-weight: bold; 
	}
	.title_line_r{
		width: 75%;line-height: 90rpx;font-weight: bold; 
		display: flex;justify-content: space-between;
	}
}
.tiaozao{
	padding: 10rpx;
	.tiaozaofor{
		display: flex;padding-left: 20rpx;
		.tiaozaoItem{
			width: 204rpx;height: 300rpx;margin-right: 26rpx;
			border-radius: 26rpx;
			image{
				width: 200rpx;height: 200rpx;border-radius: 26rpx;
			}
		}
	}
}
.zailiao{
	margin-bottom: 40rpx;
}
</style>
