c<template>
	<div>
		<div class="goods">
			<div class="menu-wrapper" ref="menuWrapper">
				<ul>
					<li v-for="(item,index) in goods" class="menu-item" :class="{current:currentIndex===index}" @click="selectMenu(index,$event)"> 
						<span :class="{num:selectGoods(index)>0}">{{selectGoods(index)}}</span>
						<span class="text border-1px">
							<span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref="foodsWrapper">
				<ul>
					<li v-for="item in goods" class="food-list food-list-hook">
						<h1 class="title">{{item.name}}</h1>
						<ul>
							<li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
								<div class="icon">
									<img :src="food.icon" width="57" height="57">
								</div>
								<div class="content">
									<h2 class="name">{{food.name}}</h2>
									<p class="desc">{{food.description}}</p>
									<div class="extra">
										<span>月售{{food.sellCount}}份</span>
										<span>好评率{{food.rating}}%</span>
									</div>
									<div class="price">
										<span class="now">¥{{food.price}}</span><span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
									</div>
									<div class="cartcontrol-wrapper">
										<cartcontrol :food="food" @add="addFood">
											
										</cartcontrol>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<shopcart ref="shopcart" :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
		</div>
		<food :food="selectedFood" ref="food" @addFood="addFood"></food>
	</div>
</template>
<script>
  import food from "../food/food.vue"
  import shopcart from "../shorcart/shopcart.vue"
  import BScroll from 'better-scroll'
  import cartcontrol from "../cartcontrol/cartcontrol.vue"
  export default{
  	components:{
  		shopcart,cartcontrol,food
  	},
  	props:['seller'],
  	data(){
  		return{
  			
  			goods:[],
  			listHeight:[],
  			scrollY:0,
  			selectedFood:{}
  		};
  	},
  	created(){
  		this.classMap = ['decrease','discount','special','invoice','guarantee'];
  		this.$http.get('/api/goods').then((response)=>{
  			this.goods = response.data.data;
  			this.$nextTick(()=>{
  				this._initScroll();
  				this._calculateHeight();
  			})
  		});
  	},
  	methods:{
  		selectFood(food,event){
  			if(!event._constructed){
  				return;
  			}
  			this.selectedFood = food
  			this.$refs.food.show();
  		},
  		addFood(target){
  			this.$nextTick(()=>{
  				this._drop(target);
  			})
  		},
  		_drop(target){
  			this.$refs.shopcart.drop(target);
  		},
  		_initScroll(){
  			this.menuScroll = new BScroll(this.$refs.menuWrapper,{
  				click:true
  			})
  			this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
  				probeType:3,click:true
  			})
  			this.foodsScroll.on('scroll',(pos)=>{
  				this.scrollY = Math.abs(Math.round(pos.y));
  			})
  		},
  		_calculateHeight(){
  			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
  			let height = 0;
  			this.listHeight.push(height);
  			for(let i=0;i<foodList.length;i++){
  				let item = foodList[i];
  				height += item.clientHeight;
  				this.listHeight.push(height);
  			}
  		},
  		selectMenu(index,event){
  			if(!event._constructed){
  				return;
  			}
  			let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
  			let el = foodList[index]
  			this.foodsScroll.scrollToElement(el,400)
  		},
 	  	selectGoods(index){
	  		let good = 0;
	  		this.goods[index].foods.forEach((food)=>{
	  			if(food.count){
	  				good += food.count
	  			}
	  		})
	  		if(good != 0){return good}
	  	} 		
  	},
  	computed:{
  		currentIndex(){
  			for(let i=0 ;i < this.listHeight.length ; i++){
  				let height1 = this.listHeight[i];
  				let height2 = this.listHeight[i+1];
  				if(!height2  || (this.scrollY >= height1 && this.scrollY < height2)){
  					return i;
  				}
  			}
  			return 0
  		},
	   	selectFoods(){
	  		let foods = [];
	  		this.goods.forEach((good)=>{
	  			good.foods.forEach((food)=>{
	  				if(food.count){
	  					foods.push(food);
	  				}
	  			})
	  		});
	  		return foods
	  	}
  	},  		
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
	.goods
		position:absolute
		display:flex
		top:174px
		bottom:46px
		width:100%
		overflow:hidden
		.menu-wrapper
			flex: 0 0 80px
			width:80px
			background:#f3f5f7
			.menu-item
				position:relative
				display:table
				width:56px
				padding:0 12px
				height:54px
				line-height:14px
				.num
					display:inline-block
					position:absolute
					background:#f01414
					text-align:center
					padding:1px 6px;
					font-size:10px
					font-weight:600
					color:#fff
					border-radius:50%
					top:4px
					right:4px
					z-index:10
				&.current
					position:relative
					z-index:10
					border-left:2px solid #059ef5
					margin-top:-1px
					background:#fff
					.text
						color:#059ef5
						font-weight:700
						border-none()
				.icon
					width:12px
					vertical-align:top
					height:12px
					margin-right:2px
					display:inline-block
					background-size:12px 12px
					background-repeat:no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text
					display:table-cell
					width:56px
					font-size:12px
					vertical-align:middle
					border-1px(rgba(7,17,27,0.1))
			
		.foods-wrapper
			flex: 1
			.title
				padding-left:14px
				height:26px
				line-height:26px
				border-left:2px solid #d9dde1
				font-size:12px
				color:rgb(147,153,159)
				background:#f3f5f7
			.food-item
				display:flex
				margin:18px
				padding-bottom:18px
				border-1px:(rgba(7,17,27,.1))
				&:last-child
					display-none()
					margin-bottom:0
				.icon
					flex:0 0 57px
					margin-right:10px
				.content
					flex:1
					.name
						margin:2px 0 8px 0
						height:14px
						line-height:14px
						font-size:14px
						color:rgb(7,17,27)
					.desc
						margin-bottom:8px
						line-height:10px
						line-height:12px
						font-size:10px
						color:rgb(147,153,159)
					.extra
						line-height:10px
						font-size:10px
						color:rgb(147,153,159)
						.count
							margin-right:12px
					.price
						font-weight:700
						line-height:24px
						.now
							margin-right:8px
							font-size:14px
							color:rgb(240,20,20)
							font-weight:700
						.old
							text-decoration:line-through
							font-size:10px
							color:rgb(147,153,159)
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:12px	










</style>