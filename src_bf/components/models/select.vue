<template>
	<div class="myselect" :style="{width:selectData.width+'px'}" v-if="selectData.list.length>0">
		<div class="_sinput" @mouseenter="sboxShow=true; rotateType=false" @mouseleave="sboxShow=false; rotateType=true">
			<img class="_ico" v-if="selectData.ico=='user'" src="./ico_user.png">
			<span v-if="selectData.defaultData">{{selectData.defaultData.name}}</span>
			<img class="_up rotate" src="./ico_up.png" :class="{rotate1:rotateType}">
		</div>
		<transition name="slide-fade">
			<div class="_sbox" v-show="sboxShow" @mouseenter="sboxShow=true; rotateType=false" @mouseleave="sboxShow=false; rotateType=true">
				<a href="javascript:void(0)" @click="onClick(index)" v-for="(item, index) in selectData.list" :class="{current:selectData.defaultData.value==item.value}">{{item.name}}</a>
			</div>
		</transition>
	</div>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		selectData: {
			type: Object
		}
	},

	data() {
		return {
			rotateType: true,
			sboxShow: false
		}
	},
	methods: {
		onClick(index) {
			this.selectData.defaultData = this.selectData.list[index];
			this.sboxShow=false;
			try{
				if(this.selectData.selectedBack&&typeof(this.selectData.selectedBack)=="function"){
					this.selectData.selectedBack(this.selectData.defaultData);
				}
			}catch(error){
				console.warn(error);
			}
		}
	},
	created() {
		/** 设置默认选项*/
		if(!this.selectData.defaultData){
			if(this.selectData.defaultValue!=undefined){
				// 优先判断defaultValue是否设置
				this.selectData.defaultData = this.selectData.list.find(item => this.selectData.defaultValue==item.value);
			} else if(this.selectData.defaultIndex!=undefined) {
				// 再判断defaultIndex
				this.selectData.defaultData = this.selectData.list[Number(this.selectData.defaultIndex)];
			} else {
				// 都没有时默认取第一个
				this.selectData.defaultData = this.selectData.list[0];
			}
		}
	},
	mounted() {
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.myselect
	min-width 180px
	display inline-block
	position relative
	text-align right
	margin: -5px 10px 0 0
	._sinput
		padding 5px 25px 10px
		line-height 20px
		height 20px
		overflow hidden
		img._up
			position absolute
			top 10px
			right 9px
		img._ico
			display inline-block
			vertical-align middle
			position relative
			margin-right 7px
			top -2px
	._sbox
		border 1px solid #3a95e1
		background #fff
		position absolute
		top 32px
		right 0
		z-index 101
		box-shadow 0 0 6px #bbb;
		text-align left
		a
			display: block
			padding 8px 20px
			color #666
			&.current, &:hover
				background #e5f3ff

	/* 旋转效果 */
	.rotate
		transform-origin:center center
		transform: rotate(180deg)
		transition: transform 0.2s
	.rotate1
		transform-origin:center center
		transform: rotate(0deg)
		transition: transform 0.2s

	/* 下拉菜单进入和离开动画效果 */
	.slide-fade-enter-active
		transition: all .2s ease
	.slide-fade-leave-active
		transition: all .2s ease
	.slide-fade-enter, .slide-fade-leave-active
		transform: translateY(-4px)
		opacity: 0


</style>
