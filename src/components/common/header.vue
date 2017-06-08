<template>
    <header class="bcmain">
      <div class="outWidth hiddens">
        <div class="h-left fl">
          <img class="fl" src="../../static/image/logo.png" width="52" height="50" />
          <div class="headerinfo">
            <h2>晓我课堂</h2>
            <h4>学生终端控制中心</h4>
          </div>
        </div>
        <div class="h-right fl hiddens">
          <a href="#" v-for="(item,index) in navList" @click="checkPath(item,index)" :class="{'nav-active':inds==index}">{{ item.name }}</a>
        </div>
        <div class="h-info fr textr">
          欢迎您！<span>育才学校 </span><span>王老师</span>
        </div>
      </div>
    </header>
</template>

<script>
    export default{
        data(){
            return{
                inds:0,
                navList:[{
                  name: '首页',path: '/'
                },{
                  name: '学生终端管理',path: 'studentManagement'
                },{
                  name: '应用管理',path: 'applicationManagement'
                },{
                  name: '策略管理',path: 'strategyManagement'
                },{
                  name: '时段管理',path: 'timeStep'
                }]
            }
        },
        methods: {
          checkPath(item,index){
            this.inds = index;
            this.$router.push({path: item.path});
          }
        }
    }
</script>
<style lang="stylus" scoped>

    .outWidth
      .h-left
        width 18%
        color #fff
        text-align left
        padding-top 1rem
        .headerinfo
          border-right: 0.01rem solid #fff
        img
          margin-right: 1rem
        h2
          font-size: 0.9rem
          margin-bottom:0.15rem
        h4
          font-size: 0.8rem
          font-weight: 500
      .h-right
        padding:0 1.5rem
        a
          line-height:2.5rem
          font-size: 0.9rem
          float:left
          padding:1rem 1.8rem
        .nav-active
           background: #236cc3
      .h-info
        line-height: 4.5rem
        color:#fff
        span
          margin-left:0.2rem
    a
      color:#fff
</style>
