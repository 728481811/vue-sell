<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>
<script>
	import {saveFoodCount} from '../../common/js/store.js'
	import Vue from 'vue'
	export default{
		props:['food'],
		methods:{
			loadFoodCount(id){
				let foods = window.localStorage._foods_
				if(!foods){
					return
				}
				foods =  JSON.parse(foods)[id]
				if(!foods){
					return
				}
				let ret = foods["quantity"]
				this.food.count = ret
				return this.food.count			
			},
			addCart(event){
				if(!event._constructed){
					return;
				}
				if(!this.food.count){
					Vue.set(this.food,'count',1)
				}else if(this.food.count<10){
					this.food.count++
				}else{
					alert("订购数量已达上限")
				}
				saveFoodCount(this.food.id,this.food.count,this.food.name)
				this.$emit('add',event.target)
			},
			decreaseCart(event){
				if(!event._constructed){
					return;
				}
				if(this.food.count){
					this.food.count--
					saveFoodCount(this.food.id,this.food.count,this.food.name)
				}
			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
	.cartcontrol
		font-size:0
		.cart-decrease
			display:inline-block
			padding:6px
			transition:all 0.4s ease-out
			.inner
				display:inline-block
				line-height:24px
				font-size:24px
				color:rgb(0,160,220)
				transition:all 0.4s ease-out
			&.move-transition
				opacity: 1
				transform:rotate(0)	
				transform:translate3d(0,0,0)
			&.move-enter, &.move-leave-active
				opacity:0
				transform:translate3d(24px,0,0)
				.inner
					transform:rotate(180deg)
		.cart-count
			display:inline-block
			vertical-align:top
			width:12px
			padding-top:6px
			line-height:24px
			text-align:center
			font-size:10px
			color:rgb(147,153,159)
		.cart-add
			display:inline-block
			font-size:24px
			line-height:24px
			padding:6px
			color:rgb(0,160,220)

</style>