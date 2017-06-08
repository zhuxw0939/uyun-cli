<template>
  <div class="box">
    <ul class="setApplication">
      <li>
        <span>应用名称 : </span>
        <el-input v-model="appName" placeholder="请输入应用名称"></el-input>
      </li>
      <li>
        <span>应用类型 :</span>
        <el-select v-model="appState" placeholder="请选择">
          <el-option v-for="item in appTypeList" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
      </li>
      <li>
        <span>上传 : </span>
        <el-button type="primary"  class="redius50 button-long" @click="selectApk">
          选择APK上传
        </el-button>
      </li>
      <li>
        <span>应用包名 :</span>
        <el-input v-model="appPackageName" placeholder="请输入应用包名"></el-input>
      </li>
      <li>
        <span>版本号 :</span>
        <el-input v-model="versionNumber" placeholder="请输入版本号"></el-input>
      </li>
    </ul>
  </div>
</template>

<script>
    export default{
        data(){
            return{
                appName: '',
                appPackageName: '',
                versionNumber: '',
                appTypeList: [{
                  value: '0',
                  label: '全部应用类型'
                }, {
                  value: '1',
                  label: '学习工具'
                },{
                  value: '2',
                  label: '查询工具'
                }],
                appState: '0',
            }
        },
        created(){

        },
        methods:{
          selectApk() {
            console.log(111);
          }
        }
    }


</script>

<style lang="stylus" scoped>
  .setApplication
    width 60%
    margin 0 auto
    li
      padding 1rem 0
      .el-input
        width 80%
      .el-select
        width 80%
      span
        display inline-block
        width 12%
        text-align right
        margin-right 1rem
</style>
