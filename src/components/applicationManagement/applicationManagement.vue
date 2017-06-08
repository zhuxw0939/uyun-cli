<template>
  <div class="contains">
    <div class="box">
      <el-select v-model="appState" placeholder="请选择">
        <el-option v-for="item in appTypeList" :label="item.label" :value="item.value" :key="item.value">
        </el-option>
      </el-select>
      <el-input
        placeholder="输入应用名称、上传人查询"
        icon="search"
        v-model="search"
        class="search"
        :on-icon-click="searches">
      </el-input>

      <el-button type="primary"  class="redius50 button-long fr" @click="onShop">
        上架应用
      </el-button>
    </div>
    <ul class="appListBox">
      <li>
        <div class="b-img"></div>
        <div class="appInfo">
          <h3>应用名称 : 晓我课堂</h3>
          <p>
          应用类型 : <span>教学软件</span>
          上传人 : <span>系统管理员</span>
        </p>
          <p>
            应用包名 : <span>com.student</span>
            版本号 : <span>2.3.1023</span>
            大小 : <span>17.5M</span>
            上架时间 : <span>2017-2-2</span>
          </p>
        </div>
        <div class="b-btn">
          <el-button type="primary"  class="redius50 button-long" @click="openDialog">
            编辑
          </el-button>
          <el-button type="primary" class="redius50 button-long">
            删除
          </el-button>
        </div>
      </li>
      <li>
        <div class="b-img"></div>
        <div class="appInfo">
          <h3>应用名称 : 晓我课堂</h3>
          <p>
            应用类型 : <span>教学软件</span>
            上传人 : <span>系统管理员</span>
          </p>
          <p>
            应用包名 : <span>com.student</span>
            版本号 : <span>2.3.1023</span>
            大小 : <span>17.5M</span>
            上架时间 : <span>2017-2-2</span>
          </p>
        </div>
        <div class="b-btn">
          <el-button type="primary"  class="redius50 button-long" @click="openDialog">
            编辑
          </el-button>
          <el-button type="primary" class="redius50 button-long">
            删除
          </el-button>
        </div>
      </li>
    </ul>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="this.$store.state.listSize"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>
    <el-dialog title="编辑" v-model="dialogVisible" size="tiny">
      <div class="setRow">应用名称 :
        <el-input v-model="appName"></el-input>
      </div>
      <div class="setRow">应用类型 :
        <el-input v-model="appType"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeSet">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
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
      search: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
     page: {				//分页
          currentPage: 1,
          size: 0,
          total: 200
      },
      dialogVisible: false,
      sendMark: false,
      appName: '',
      appType: ''
    }
  },
  created(){

  },
  methods: {
    searches() {
      console.log(1);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      console.log(`当前页: ${val}`);
    },
    openDialog(){
      this.dialogVisible = true;
    },
    closeSet() {
      this.dialogVisible = false;
    },
    onShop() {
      this.$router.push({path: 'onApplication'});
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .el-select
    margin-right 1rem
    width 8rem
  .appListBox
    li
      background: #fff
      padding: 1rem 1.6rem
      border-radius 0.2rem
      margin-bottom 0.7rem
      border 0.01rem solid #ddd
      overflow hidden
      div
        float left
      .b-img
        margin 0.2rem 1.3rem 0 0
        width 4.4rem
        height 4.4rem
        background #d0d0d0
        border-radius 0.1rem
      .appInfo
        width 75%
        h3
          margin 0.2rem 0 1rem
          color #333
        p
          margin-top 0.4rem
          span
            margin-right 1rem
      .b-btn
        width 14%
        .el-button
          display block
          margin 0 auto
        .el-button:first-child
          margin-bottom 0.7rem
  .setRow
    padding 1rem 0 0.2rem 2rem
    .el-input
      width 80%
</style>
