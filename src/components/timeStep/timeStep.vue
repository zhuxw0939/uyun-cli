<template>
  <div class="box">
    <div class="timeInfo hiddens">
      <div class="inblock">
        <p><span>* </span>设置了时间段的空格代表在校时段，其余时间为非在校时段，可以针对两类时段设置不同的策略;</p>
        <p>启用寒暑假模式则执行非在校时段策略。</p>
      </div>
      <el-checkbox v-model="hasWinner" class="fr">启用寒暑假模式</el-checkbox>
    </div>
    <ul class="timeList">
      <li class="hiddens">
        <div class="time-left fl">
          <div class="time-forenoon">
            <h4 class="textc">上午</h4>
            <el-time-select
              placeholder="起始时间"
              v-model="startTime"
              :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '21:00'
            }">
            </el-time-select>
            <i class="iconfont">&#xe600;</i>
            <el-time-select
              placeholder="结束时间"
              v-model="endTime"
              :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '21:00',
                minTime: startTime
              }">
            </el-time-select>
          </div>
          <div class="time-afternoon">
            <h4 class="textc">下午</h4>
            <el-time-select
              placeholder="起始时间"
              v-model="startTime"
              :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '21:00'
            }">
            </el-time-select>
            <i class="iconfont">&#xe600;</i>
            <el-time-select
              placeholder="结束时间"
              v-model="endTime"
              :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '21:00',
                minTime: startTime
              }">
            </el-time-select>
          </div>
          <div class="time-night">
            <h4 class="textc">晚上</h4>
            <el-time-select
              placeholder="起始时间"
              v-model="startTime"
              :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '21:00'
            }">
            </el-time-select>
            <i class="iconfont">&#xe600;</i>
            <el-time-select
              placeholder="结束时间"
              v-model="endTime"
              :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '21:00',
                minTime: startTime
              }">
            </el-time-select>
          </div>
        </div>
        <div class="time-right fr">
          <el-checkbox v-model="checked">周一</el-checkbox>
          <el-checkbox v-model="checked">周二</el-checkbox>
          <el-checkbox v-model="checked">周三</el-checkbox>
          <el-checkbox v-model="checked">周四</el-checkbox>
          <el-checkbox v-model="checked">周五</el-checkbox>
          <el-checkbox v-model="checked">周六</el-checkbox>
          <el-checkbox v-model="checked">周日</el-checkbox>
		  <el-button type="primary" icon="delete"></el-button>
        </div>
      </li>
    </ul>
    <button class="addTime">
      + 增加时段
    </button>
    <el-button type="primary"  class="redius50 button-long confirm">确认生效</el-button>
  </div>
</template>

<script>
    export default{
        data(){
            return{
                list: [],
                hasWinner: false,
                startTime: '',
                endTime: '',
                checked: false
            }
        },
        created(){

        }
    }


</script>

<style lang="stylus" scoped>
  .inblock
    width 70%
    color #888
    p:last-child
      padding-top 0.2rem
      text-indent 0.5rem
  .timeList
    margin-top 3rem
    li
      margin 0.8rem 0
      position relative
      .time-left
        background #e4f1f4
        padding 1.3rem 0 1.3rem 1.3rem
        width 69%
        overflow hidden
        >div
          float left
          width 33.3%
          .el-date-editor.el-input
            width 39.5%
          h4
            font-weight 500
            padding-bottom 1.6rem
        .iconfont
          color #666
          margin 0 0.1rem
      .time-right
        background #f2f2f2
        padding 0.8rem 1.3rem
        width 23%
        .el-checkbox
          width 32%
          padding-bottom 0.8rem
		li .el-button
		  position absolute
		  bottom 0.4rem
		  right 0.4rem
		  display none
		li:hover .el-button
		  display block
  .addTime
    width 100%
    line-height 2.2rem
    background #ececec
    border none
    cursor pointer
    color #1e95e4
    font-size 0.8rem
    outline none
  .confirm
    display block
    margin 3.6rem auto 0

</style>
