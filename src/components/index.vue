<template>
  <div class="box">
    <ul class="typeInfo hiddens">
      <li class="fl textc">
        <h3>终端总数</h3>
        <h2>{{countA}}</h2>
      </li>
      <li class="fl textc">
        <h3>预警终端数</h3>
        <h2>{{countB}}</h2>
      </li>
    </ul>
    <el-button type="primary" size="large" class="redius50" @click="controlManage">
      终端管理 &gt;
    </el-button>
  </div>
</template>

<script>
export default {
	name: 'index',
	data () {
		return {
      countA: 440,
			countB: 240
		}
	},
	created(){
    this.ajaxCounts();
	},
	methods: {
		controlManage(){
			this.$router.push({path: '/studentManagement'});
		},
    ajaxCounts() {
      setTimeout(() => {
        this.countA = 213
      this.countB = 123123
    }, 2000)
    }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style type="text/css" lang="stylus" rel="stylesheet/stylus" scoped>
  .typeInfo
    margin 4.2rem 2rem
    li
      width 13rem
      border 0.2rem solid #1c96e5
      height 13rem
      border-radius 50%
      &:nth-child(1)
        margin-left 24.6%
      &:nth-child(2)
        margin-left 13%
      h3
        padding 4rem 0 1.3rem
        font-size 1.1rem
      h2
        font-size 2rem
        color#1e95e4
  .el-button
    display block
    margin 2rem auto
</style>
