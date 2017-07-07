<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name">{{seller.name}}</span>
				</div>
				<div class="description">
					{{seller.description}}/{{seller.deliveryTime}}分钟送达
				</div>
				<div class="support" v-if="seller.supports">
					<span class="icon" :class="classMap[seller.supports[3].type]"></span>
					<div class="text">{{seller.supports[3].description}}</div>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" style="width:100%;height:100%">
		</div>
		<transition name="fade">
			<div class="detail" v-show="detailShow">
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<h1 class="name">
							{{seller.name}}
						</h1>
						<div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="(item,index) in seller.supports">
								<span class="icon" :class="classMap[seller.supports[index].type]"></span>
								<span class="text">{{seller.supports[index].description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							{{seller.bulletin}}
						</div>
					</div>
				</div>
				<div class="detail-close" @click="hideDetail">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
	import star from '../star/star.vue'
	export default{
		props:['seller'],
		data(){
			return{
				detailShow:false
			}
		},
		components:{
			star
		},
		methods:{
			showDetail(){
				this.detailShow = true
			},
			hideDetail(){
				this.detailShow = false
			}
		},
		created(){
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	@import "../../common/stylus/mixin"
	
	.header
		position:relative
		color: #fff
		background:rgba(7,17,27,.3)
		overflow:hidden
		.content-wrapper
			position: relative
			padding: 24px 12px 18px 24px
			font-size: 0
			.avatar
				display: inline-block
				vertical-align: top
				border-radius:4px
				overflow:hidden
			.content
				margin-top:2px
				margin-left: 16px
				display: inline-block
				font-size: 14px;
				.title
					font-size:16px
					font-weight:bold
					line-height:18px
					padding-bottom:8px
					.brand
						width:30px
						height:18px
						vertical-align:top
						display: inline-block
						bg-image:('brand')
						background-size:30px 18px
						background-repeat:no-repeat
					.name
						font-size:16px
						font-weight:bold
						margin-left:6px
						line-height:18px
						padding-bottom:8px						
				.description
					font-size:12px
					font-weight:300
					line-height:12px
					padding-bottom:10px
				.support 
					.text
						font-size:10px
						font-weight:300
						vertical-align:top
						display:inline-block
						line-height:12px
					.icon
						width:12px
						vertical-align:top
						height:12px
						display:inline-block
						background-size:12px 12px
						background-repeat:no-repeat
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.invoice
							bg-image('invoice_1')
						&.special
							bg-image('special_1')
			.support-count
				position: absolute
				right:12px
				bottom:14px
				padding:0 10px
				height:24px
				line-height:24px
				border-radius:14px
				background:rgba(0,0,0,0.2)
				text-align: content
				.count
					vertical-align:top
					font-size:10px
				.icon-keyboard_arrow_right
					font-size:10px
					margin-left:2px
					line-height:24px
		.bulletin-wrapper
			height:28px
			line-height:28px
			padding:0 22px 0 22px
			white-space:nowrap
			overflow:hidden
			text-overflow:ellipsis
			position:relative
			background:rgba(7,17,27,.2)
			.bulletin-title
				display:inline-block
				width:22px
				vertical-align:top
				height:12px
				margin-top:7px
				bg-image:('bulletin')
				background-size:22px 12px
				background-repeat:no-repeat
			.bulletin-text
				font-size:10px
				vertical-align:top
				margin:0 4px
			.icon-keyboard_arrow_right
				position:absolute
				font-size:10px
				right:12px
				top:9px
		.background 
			position:absolute
			top:0
			left:0
			width:100%
			height:100%
			z-index:-1
			filter:blur(10px)
		.detail
			position:fixed
			z-index:100
			width:100%
			height:100%
			overflow:auto
			transition:all .3s
			background:rgba(7,17,27,.8)
			top:0 
			left:0
			backdrop-filter:blur(5px)
			&.fade-transition
				opacity:1
				background:rgba(7,17,27,.8)
			&.fade-enter, &.fade-leave-active
				opacity:0
				background:rgba(7,17,27,0)
			.detail-wrapper
				min-height:100%
				width:100%
				.detail-main
					margin-top:64px 
					padding-bottom:64px
					.name
						line-height:16px
						text-align:center
						font-size:16px
						font-weight:700
					.star-wrapper
						margin-top:18px
						padding:2px 0
						text-align:center
					.title
						display:flex
						width:80%
						margin:30px auto 24px auto
						.line
							flex:1
							position:relative
							top:-6px
							border-bottom:1px solid rgba(255,255,255,0.2)
						.text
							padding:0 12px
							font-weight:700
							font-size:14px
					.supports
						width:80%
						font-size:0px
						padding-left:26px
						margin:0 auto
						li
							padding-top:12px
							.icon
								display:inline-block
								width:16px
								
								vertical-align:top
								height:16px
								background-size:16px 16px
								background-repeat:no-repeat
								&.decrease
									bg-image('decrease_2')
								&.discount
									bg-image('discount_2')
								&.special
									bg-image('special_2')
								&.invoice
									bg-image('invoice_2')
								&.guarantee
									bg-image('guarantee_2')
							.text
								line-height:16px
								font-size:12px
								padding-left:6px
					.bulletin
						width:72%
						padding-top:10px
						margin:0 auto
						font-size:12px
						line-height:24px
			.detail-close
				position:relative
				width:32px
				height:32px
				margin:-64px auto 0 auto
				clear:both
				font-size:32px










				



</style>