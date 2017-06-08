<template>
  <div class="contains hiddens">
    <div class="box fl s-tree-box">
		<div class="schoolStragegy">
			<h3>校级策略</h3>
		</div>
		<div class="classStragegy">
			<h3>班级策略</h3>
			<ul>
				<li>
					<span  v-for="(items,index) in classList" @click="changeClass(index)"
						:class="{activeClass:index==inds}">
						{{ items.name }}
					</span>
				</li>
			</ul>
		</div>
    </div>
    <div class="box fr sList">
		<div class="l-percent inblock">1</div>
		<div class="l-info inblock">2</div>
		<div class="l-editBtn inblock">3</div>
    </div>
  </div>
</template>

<script>
    export default{
        data(){
            return{
            	classList: [{
            		name: '高2014级5班'
            	},{
            		name: '高2014级6班'
            	}],
                inds: 0
            }
        },
        created(){

        },
        methods: {
        	changeClass(ind) {
        		this.inds = ind;
        	}
        }
    }

</script>

<style lang="stylus" scoped>
  .s-tree-box
    width 15.2%
    padding 0
    .schoolStragegy
      padding 1.1rem 0
      border-bottom 0.01rem solid #ddd
    .classStragegy
      padding 1.1rem 0
	  ul
	   li
	    margin-top 1rem
	  span
	    cursor pointer
	    text-indent 2rem
	    display block
	    line-height 2.2rem
	    transition 0.3s
	  .activeClass
	    background #1e95e4
	    color #fff
  h3
    color #333
    text-indent 1.5rem
    border-left 2px solid #1e95e4
  .sList
    width 77.6%
	.l-percent
		border 0.4rem solid #1e95e4
		line-height 3.2rem
		width 3.2rem
		text-align center
		border-radius 50%

</style>
