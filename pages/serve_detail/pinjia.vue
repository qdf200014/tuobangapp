<template>
	<view ref="pinjia">
		<view class="pinj">
			<view class="score">
				<view>
					综合评分 <text style="color: #fe552e;"> {{averageScore}}</text>
					<u-rate :current="averageScore" :disabled="true"></u-rate>
				</view>
				<view>
					<text style="margin-left: 50rpx;color: #fe552e;" v-if="types[0]">{{types[0].num}}</text>条评论
				</view>
			</view>
			<view class="xuan">
				<view class="xuanitem" :class="{active:typeIndex == it.type}" v-for="(it,ind) in types" :key="ind" @click="typeCli(it.type)">
					{{it.name + it.num}}
				</view>
			</view>
		</view>
		<view v-if="detailComment!=''">
			<view class="comment" v-for="(it,index) in detailComment" :key="index">
				<!-- 用户 -->
				<view class="commentuser">
					<view class="userimg" @click="go_master(it.ryUuid)">
						<image :src="it.img" mode="aspectFill"></image>
						<view>
							{{it.petName}}
							<view class="">
								<u-rate :current="it.score" :disabled="true" gutter="0"></u-rate>
							</view>
						</view>
					</view>
					<view class="userTime">
						{{it.time}}
					</view>
				</view>
				<view class="textcontent" @click="go_Detail(it.id)">
					{{it.proposal}}
				</view>
				<view class="imgswiper" @click="go_Detail(it.id)">
					<image v-for="(it,ind) in it.photo" :key="ind" :src="it" mode="aspectFill"></image>

				</view>
				<view class="thumbs" @click="pj_dian(it.id,index)">
					<u-icon name="thumb-up" v-if="it.ishelpAppraiseParse == 0"></u-icon>
					<u-icon name="thumb-up-fill" v-else color="#0493fd"></u-icon>{{it.parseCount}}

				</view>
			</view>
		</view>
		<view v-else style="padding-top: 100rpx;">
			<u-empty text="暂无相关评论" mode="message"></u-empty>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				serveId: 0,
				typeIndex: 0,
				appraiseCount: '', //评分
				heightA: '',
			}
		},
		props: {
			//列表
			detailComment: {},
			types: {},
			averageScore: {},
			// height:{}
		},
		mounted() {
			this.getHeight()
		},
		watch: {

			heightA(newValue, oldValue) {
				this.$emit('update:height', this.heightA)
			}
		},
		methods: {
			getHeight(){
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.pinj').boundingClientRect(data => {
						console.log(data)
						if(data.height){
							// console.log("得到布局位置信息" + JSON.stringify(data));
							this.heightA = Math.floor(data.height) + 230 * this.detailComment.length
						}else{
							this.getHeight()
						}
					}).exec();
				})
			},
			go_master(e) {
				this.com.navto('../my/master_page?id=' + e)
			},
			//类型
			typeCli(type) {
				this.typeIndex = type
				this.$emit("typeCli", type)
			},
			pj_dian(e, ind) {
				this.$emit('pj_dian', e, ind)
			},
			// 评价详情
			go_Detail(e) {
				this.$emit('goDetail', e)
			}
		}
	}
</script>

<style scoped lang="scss">
	.pinj {
		padding: 3%;

		.score {
			display: flex;
			justify-content: space-between;
			padding: 30rpx 0;
		}

		.xuan {
			display: flex;
			flex-wrap: wrap;
			border-bottom: 1rpx solid #eee;
			padding-bottom: 20rpx;

			.xuanitem {
				padding: 10rpx 20rpx;
				border-radius: 10rpx;
				border: 1rpx solid #C0C0C0;
				margin: 10rpx;

				&.active {
					color: #0493fd;
					border: 1rpx solid #0493fd;
				}
			}
		}
	}

	.comment {
		padding: 0 3%;

		.commentuser {
			display: flex;
			justify-content: space-between;

			.userimg {
				display: flex;

				image {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
					margin-right: 14rpx;
				}
			}
		}

		.textcontent {
			line-height: 50rpx;
		}

		.imgswiper {
			display: flex;
			flex-wrap: wrap;

			image {
				width: 210rpx;
				height: 210rpx;
				border-radius: 10rpx;
				margin: 10rpx;
			}
		}

		.thumbs {
			padding: 3%;
			border-bottom: 1rpx solid #eee;
			text-align: right;
			margin-bottom: 20rpx;
		}

	}
</style>
