<template>
	<div>
	  	<div class="shopcart" >
	  		<div class="content" @click="toggleList">
	  			<div class="content-left">
	  				<div class="logo-wrapper">
	  					<div class="logo" :class="{highlight:totalCount>0}">
	  						<i class="icon-shopping_cart" :class="{highlight:totalCount>0}"></i>
	  					</div>
	  					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
	  				</div>
	  				<div class="price" :class="{highlight:totalPrice>0}">¥{{totalPrice}}</div>
	  				<div class="desc">另需配送费¥：{{deliveryPrice}}元</div>
	  			</div>
	  			<transition name="fade">
		  			<div class="content-right" @click.stop.prevent='pay'>
		  				<div class="pay" :class="payClass">
		  					{{payDesc}}
		  				</div>
		  			</div>  				
	  			</transition>
	  		</div>
	  		<div class="ball-container">
		  		<transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" >
		  			<div v-show="ball.show" class="ball" v-for="ball in balls" :key="ball">
						<div class="inner inner-hook"></div>
					</div>
		  		</transition-group>
	  		</div>
	  		<transition name="fold">
		  		<div class="shopcart-list" v-show="listShow">
		  			<div class="list-header">
		  				<h1 class="title">购物车</h1>
		  				<span class="empty" @click="empty">清空</span>
		  			</div>
		  			<div class="list-content" ref="listContent">
		  				<ul>
		  					<li class="food" v-for="food in selectFoods">
		  						<span class="name">{{food.name}}</span>
		  						<div class="price">
		  							<span>¥{{food.price*food.count}}</span>
		  						</div>
		  						<div class="cartcontrol-wrapper">
		  							<cartcontrol :food="food" @add="addFood"></cartcontrol>
		  						</div>
		  					</li>
		  				</ul>
		  			</div>
		  		</div>
		  	</transition>
	  	</div>
	  	<transition name="fade-drop">
	  		<div class="list-mask" v-show="listShow" @click="hideList"></div>
	  	</transition>
	</div>
</template>
<script>
	import cartcontrol from '../cartcontrol/cartcontrol.vue'
	import BScroll from 'better-scroll'

  	export default{
  		props:['deliveryPrice','minPrice','selectFoods'],
  		components:{
  			cartcontrol
  		},
  		data(){
  			return{
  				balls:[{
  					show:false
  				},
  				{
  					show:false
  				},
  				{
  					show:false
  				},
  				{
  					show:false
  				},
  				{
  					show:false
  				}
  				],
  				dropBalls:[

  				],
  				fold:true
  			}
  		},
  		methods:{
  			addFood(target){
  				this.$nextTick(()=>{this.drop(target)})
  				
  			},
  			pay(){
  				if(this.totalPrice<this.minPrice){
  					return;
  				}
  				window.alert(`支付${this.totalPrice}元`)
  			},
  			hideList(){
  				this.fold = true
  			},
  			drop(el){
  				for(let i = 0;i < this.balls.length; i++){
  					let ball = this.balls[i];
  					if(!ball.show){
  						ball.show = true;
  						ball.el = el;
  						this.dropBalls.push(ball);
  						return;
  					}
  				}
  			},
  			empty(){
  				this.selectFoods.forEach((food)=>{
  					food.count = 0
  				})
  			},
  			beforeEnter(el){
  				let count = this.balls.length;
  				while(count--){
  					let ball = this.balls[count];
  					if(ball.show){
  						let rect = ball.el.getBoundingClientRect();
  						let x = rect.left-32;
  						let y = -(window.innerHeight-rect.top-22);
  						el.style.display = '';
  						el.style.webKitTransform = `translate3d(0,${y}px,0)`;
  						el.style.transform = `translate3d(0,${y}px,0)`;
  						let inner = el.getElementsByClassName('inner-hook')[0];
  						inner.style.webKitTransform = `translate3d(${x}px,0,0)`;
  						inner.style.transform = `translate3d(${x}px,0,0)`;
  						
  					}
  				}
  			},
  			enter(el){
  				/* eslint-disable no-unseed-vars */
  				let rf = el.offsetHeight;
  				this.$nextTick(()=>{
					el.style.webKitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webKitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';
  				})
  			},
  			afterEnter(el){
  				let ball = this.dropBalls.shift();
  				if(ball){
  					ball.show = false;
  					el.style.display = 'none';
  				}
  			},
  			toggleList(){
  				if(!this.totalCount){
  					return;
  				}
  				this.fold = !this.fold;
  			}
  		},
  		computed:{
  			totalPrice(){
  				let total = 0
  				this.selectFoods.forEach((food)=>{
  					total += food.price * food.count;
  				});
  				return total
  			},
  			totalCount(){
  				let count = 0;
  				this.selectFoods.forEach((food)=>{
  					count += food.count
  				})
  				return count
  			},
  			payDesc(){
  				if(this.totalPrice === 0){
  					return `¥${this.minPrice}元起送`
  				}else if(this.totalPrice < this.minPrice){
  					let diff = this.minPrice - this.totalPrice
  					return `还差¥${diff}元起送`
  				}else{
  					return `去结算`
  				}
  			},
  			payClass(){
  				if(this.totalPrice<this.minPrice){
  					return 'not-enough'
  				}else{
  					return 'enough'
  				}
  			},
  			listShow(){
  				if(!this.totalCount){
  					this.fold = true;
  					return false
  				}
  				if(!this.fold){
  					this.$nextTick(()=>{
  						if(!this.scroll){
  							this.scroll = new BScroll(this.$refs.listContent,{
  								click:true
  							})
  						}else{
  							this.scroll.refresh();
  						}
  					})
  				}
  				return !this.fold;
  			}
  		}
  	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

	.shopcart
		position:fixed
		left:0
		bottom:0
		z-index:50
		width:100%
		height:48px
		.content
			font-size:0
			display:flex
			background:#141d27
			.content-left
				flex:1
				.logo-wrapper
					display:inline-block
					position:relative
					top:-10px
					margin:0 12px 
					padding:6px
					width:56px
					height:56px;
					box-sizing:border-box
					vertical-algin:top
					border-radius:50%
					background:#141d27
					.logo
						width:100%
						text-align:center
						height:100%
						border-radius:50%
						background:#2b343c
						&.highlight
							background: rgb(0,160,220)
						.icon-shopping_cart
							font-size:24px
							color:#80858a
							line-height:44px
							&.highlight
								color:#fff			
					.num
						position:absolute
						top:-4px
						min-width:16px
						right:0
						padding:4px
						height:12px
						line-height:12px
						font-weight:bold
						text-align:center
						border-radius:60%
						font-size:9px
						font-weight:700
						color:#fff
						background:rgb(240,20,20)
						box-shadow:0 4px 8px 0 rgba(0,0,0,.4)
						
				.price
					display:inline-block
					vertical-align:top
					line-height:24px;
					margin-top:12px
					box-sizing:border-box
					padding-right:12px
					border-right:1px solid rgba(255,255,255,.1)
					font-size:16px
					font-weight:700
					color:rgba(255,255,255,.4)
					&.highlight
						color:#fff
						
				.desc
					display:inline-block
					vertical-align:top
					line-height:24px
					margin:12px 0  0 12px
					line-height:24px
					font-size:10px
					color:rgba(255,255,255,.4)
					
			.content-right
				flex:0 0 105px
				width:105px
				
				.pay
					font-size:12px
					height:48px
					line-height:48px
					font-weight:700
					background:#2b333b
					text-align:center
					color:rgba(255,255,255,.4)
					&.not-enough
						transition:all 0.2s linear	
						background:#2b333b
					&.enough
						transition:all 0.2s linear	
						background:#00b43c
						color:#fff
		.ball-container
			.ball
				position:fixed
				left:32px
				bottom:22px
				z-index:200
				&.drop-enter, &.drop-enter-active
					transition:all 0.4s cubic-bezier(0.4,0.03,0.9,.43)
					.inner
						width:16px
						height:16px
						border-radius:50%
						background:rgb(0,160,220)
						transition:all 0.4s
		.shopcart-list
			position:absolute
			top:0 
			left:0
			z-index:-1
			width:100%
			transform: translate3d(0,-100%,0)
			&.fold-enter-active, &.fold-leave-active
				transition: all .3s ease-out
			&.fold-enter, &.fold-leave-active
				transform:translate3d(0,0,0)
			.list-header
				height:40px
				line-height:40px
				padding:0 18px
				background:#f3f5f7
				border-bottom:1px solid rgba(7,17,27,0.1)
				.title
					float:left
					font-size:14px
					color:rgb(7,17,27)
				.empty
					float:right
					font-size:12px
					color:rgb(0,160,220)
			.list-content
				padding:0 18px
				max-height:196px
				overflow:hidden
				background:#fff
				.food
					position:relative
					padding:12px 0
					box-sizing:border-box
					border-1px(rgba(7,17,27,0.1))
					.name
						line-height:24px
						font-size:14px
						color:rgb(7,17,27)
					.price
						position:absolute
						right:90px
						bottom:12px
						line-height:24px
						font-size:14px
						font-weight:700
						color:rgb(240,20,20)
						span
							font-weight:700
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:6px
	.list-mask
		position:fixed
		top:0
		left:0
		width:100%
		height:100%
		z-index:40
		backdrop-filter:blur(10px)
		background:rgba(7,17,27,0.6)
		&.fade-drop-enter-active, &.fade-drop-leave-active
			transition:opacity 0.5
		&.fade-drop-enter, &.fade-drop-leave-active
			opacity:0
		








</style>