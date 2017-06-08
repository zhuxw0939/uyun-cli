<template>
  <div class="contains">
    <div class="box hiddens tops">
      今日新增8台设备预警，累计达13台设备预警 。
      <el-button type="primary" size="large" class="redius50 fr" @click="openSet">终端管理</el-button>
    </div>
    <div class="box">
      <el-select v-model="bingSate" placeholder="请选择">
        <el-option v-for="item in bingList" :label="item.label" :value="item.value" :key="item.value">
        </el-option>
      </el-select>
      <el-select v-model="quipmentState" placeholder="请选择">
        <el-option v-for="item in equipmentArr" :label="item.label" :value="item.value" :key="item.value">
        </el-option>
      </el-select>
      <span>设备脱离控制天数范围 : </span>
      <el-input-number v-model="num1" :min="0" :max="10" :controls="false"></el-input-number>天 -
      <el-input-number v-model="num1" :min="0" :max="10" :controls="false"></el-input-number>天
      <el-input
        placeholder="输入学生姓名、身份证号、MAC地址查询"
        icon="search"
        v-model="search"
        class="search"
        :on-icon-click="searches">
      </el-input>
    </div>
    <div class="c-main hiddens">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" class="fl"></el-tree>
      <div class="fr tableBox">
        <el-table
          :data="tableData" :max-height="this.$store.state.maxHeight" v-loading.body="tableLoading"
          border>
          <el-table-column
            prop="date"
            label="日期"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="address"
            label="地址">
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="this.$store.state.listSize"
          :page-size="page.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="设置" v-model="dialogVisible" size="tiny">
      <div class="setRow">预警阀值：大于等于
        <el-input-number v-model="num1" :min="0" :max="10" :controls="false"></el-input-number>
        天
      </div>
      <div class="setRow">
        <el-checkbox v-model="sendMark">预警以短信形式发送给我</el-checkbox>
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
      bingList: [{
          value: '0',
          label: '全部绑定状态'
        }, {
          value: '1',
          label: '已绑定'
        },{
          value: '2',
          label: '未绑定'
        },{
          value: '3',
          label: '未开通'
        }],
      bingSate: '0',
      equipmentArr:[{
        label:' 设备全部状态',
        value: 0,
      },{
        label:'在线',
        value: 1,
      },{
        label:'离线',
        value: 2,
      }],
      quipmentState: 0,
      num1: '',
      num2: '',
      search: '',
      data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
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
        tableLoading: false,
        page: {				//分页
            currentPage: 1,
            size: 0,
            total: 200
        },
        dialogVisible: false,
        sendMark: false
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
    openSet(){
      this.dialogVisible = true;
    },
    closeSet() {
      this.dialogVisible = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  .el-select
    margin-right 1rem
    width 8rem
  .tops
    line-height 2rem
  .el-input-number
    width 4rem
    vertical-align top
    margin 0 0.4rem
  .el-tree
    width 20%
    min-height 12rem
  .tableBox
    width 75%
  .setRow
    line-height 2rem
    padding 0 0 0 2rem
</style>
