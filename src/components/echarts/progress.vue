<template>

	<div class="myprogress">
		<div class="progress_box" :class="{nolink:link==''}" @click="onClick" @mouseenter="mouseHover" @mouseleave="mouseLeave">
			<canvas :id="canvasId" width=180 height=180></canvas>
			<span :id="'span_'+canvasId"><b :id="'b_'+canvasId">{{value}}</b>次</span>
		</div>
		<div class="progress_title">
			<span>{{title}}</span>
		</div>
	</div>

</template>



<script type="text/ecmascript-6">
export default {
	props: {
		value: {
			type: Number,
			default: 0
		},
		values: {
			type: Number,
			default: 100
		},
		title: {
			type: String,
			default: "考试统计"
		},
		color: {
			type: String,
			default: "#4babe8"
		},
		link: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			mouseEvents: false,
			canvasId: "canvas_"+Math.floor(Math.random()*100000)
		}
	},
	watch: {
		'value': 'valueChange'
	},
	methods: {
		onClick() {
			// 链接点击事件
			if(this.link!=""){
				// 目前都不允许点击
				// window.location.href=this.link;
			}
		},
		mouseHover() {
			if(!this.mouseEvents||this.link=="") return;
			// 放大图表
			circleProgress(this.value, this.values, 30, this.color, this.canvasId, 1);
		},
		mouseLeave() {
			if(!this.mouseEvents||this.link=="") return;
			// 还原图表
			circleProgress(this.value, this.values, 20, this.color, this.canvasId, 1);
		},
		valueChange() {
			circleProgress(this.value, this.values, 20, this.color, this.canvasId, 0.01, this);
		}
	},
	mounted() {
		circleProgress(this.value, this.values, 20, this.color, this.canvasId, 0.01, this);
		var _this = this;
		setTimeout(function(){
			_this.mouseEvents = true;
		}, 1000)
	}
};

function circleProgress(value, values, wWidth, color, id, wSpeed, _this){

	value = Number(value);
	values = Number(values);

	var c_width = 180;
	var c_height = 180;

	var canvas = document.getElementById(id);
	var context = canvas.getContext('2d');

	// 清空画布
	context.clearRect(0, 0, c_width, c_height);
	// 画初始圆
	context.beginPath();
	// 将起始点移到canvas中心
	context.moveTo(c_width/2, c_height/2);
	// 绘制一个中心点为（c_width/2, c_height/2），半径为c_height/2，起始点0，终止点为Math.PI * 2的 整圆
	context.arc(c_width/2, c_height/2, c_height/2-10, 0, Math.PI * 2, false);
	context.closePath();
	context.fillStyle = '#eaf1f8'; //填充颜色
	context.fill();
	// 绘制内圆
	context.beginPath();
	context.strokeStyle = color;
	context.lineCap = 'square';
	context.closePath();
	context.fill();
	context.lineWidth = wWidth;//绘制内圆的线宽度

	function draw(cur){
		// 画内部空白
		context.beginPath();
		context.moveTo(20, 20);
		context.arc(c_width/2, c_height/2, c_height/2-20-10, 0, Math.PI * 2, true);
		context.closePath();
		context.fillStyle = 'rgba(255,255,255,1)';  // 填充内部颜色
		context.fill();
		// 画内圆
		context.beginPath();
		// 绘制一个中心点为（c_width/2, c_height/2），半径为c_height/2-5不与外圆重叠，
		// 起始点-(Math.PI/2)，终止点为((Math.PI*2)*cur)-Math.PI/2的 整圆cur为每一次绘制的距离
		if(value>0){
			if(wWidth==30){
				context.arc(c_width/2, c_height/2, c_height/2-wWidth/2, -(Math.PI/2), ((Math.PI*2)*cur ) - Math.PI / 2, false);
			} else {
				context.arc(c_width/2, c_height/2, c_height/2-wWidth/2-10, -(Math.PI/2), ((Math.PI*2)*cur ) - Math.PI / 2, false);
			}
		}
		context.stroke();
	}
	// 调用定时器实现动态效果
	var timer=null,n=0;
	function loadCanvas(nowT){
		if(nowT>0.8) nowT = nowT-0.035;
		if(wSpeed==1){
			draw(nowT)
		} else {
			timer = setInterval(function(){
				if(n>nowT){
					clearInterval(timer);
				}else{
					draw(n);
					n += wSpeed;
				}
			}, 15);
		}
	}
	loadCanvas(value/values);
	timer=null;
};

</script>


<style lang="stylus" rel="stylesheet/stylus">
.myprogress
	width 180px
	margin 0 auto
	.progress_box
		width 180px
		height 180px
		position relative
		/*cursor pointer*/
		&.nolink
			/*cursor not-allowed*/
		span
			display inline-block
			width 90px
			height 40px
			text-align center
			line-height 40px
			position absolute
			top 50%
			left 50%
			margin-top -20px
			margin-left -45px
			z-index 10
			color #999
			font-size 12px
			b
				display inline-block
				padding-right 5px
				color #323a55
				font-size 36px
				font-weight 600
		&:hover span
			font-size 14px
		&:hover span b
			font-size 38px
		&.nolink span
			font-size 12px
		&.nolink span b
			font-size 36px

	.progress_title
		width 180px
		text-align center
		padding 30px 0 10px
		span
			display inline-block
			padding 0 20px
			background #eaf1f8
			color #666
			font-size 14px
			line-height 30px
			border-radius 15px

</style>
