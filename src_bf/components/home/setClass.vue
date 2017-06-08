<template>
	<div class="_center">
		<top curtitle="班级层次管理" :other="false" :editwin="editwin"></top>
		<div class="table">
			<el-table :data="tableData" border style="width: 100%" :max-height="maxHeight">
				<el-table-column prop="gradeName" label="年级" width="100"></el-table-column>
				<el-table-column prop="name" label="班级层次" width="150"></el-table-column>
				<el-table-column prop="branch" label="班级类型" width="150"></el-table-column>
				<el-table-column prop="classes" label="包含班级"></el-table-column>
				<el-table-column label="操作" width="150">
					<template scope="scope">
						<el-button
								icon="edit"
								@click="handleEdit(scope.$index, scope.row)"></el-button>
						<el-button
								icon="delete"
								@click.native.prevent="deleteRow(scope.$index, tableData)">
						</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[50, 100]"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next"
				:total="totalCount">
		</el-pagination>

		<window curmodel="classes"
				:editwin="editwin"
				:classinfo="classInfo"
				@loadlist="listData"></window>
	</div>
</template>

<script type="text/ecmascript-6">

	import '../set/set.css'
	import Top from '../set/top'
	import Window from '../set/window'

    export default{
		components: {Top, Window},
		data() {
			return {
				editwin: {
					curtitle: '新增班级层次',
					isshow: false,
					id: "",
					name: "",
					gradeId: "",
					checkedClassNames: [],
					tenantId: backUser.info.tenantid,
					orgId: backUser.orgId,
					editInit: false,
					gradeList: []
				},
				classInfo:{
					list: [],
					names: []
				},
				tableData: [],
				maxHeight: 800,
				currentPage: 1,
				pageSize: 50,
				totalCount: 0,
				totalPage: 0
			};
		},
		mounted() {
			this.listData();
		},
		methods: {
			listData(){
				var obj = this;

				// 分页查询
				this.$http.post("/api/servers/classList", {
					body: {
						"page": obj.currentPage,
						"size": obj.pageSize
					}
				}).then(function(data){
					data = data.body;
					console.info("班级层次管理列表："+JSON.stringify(data));
					if(data.code == 200 && data.success == true){
						if(data.data.dataList){
							var list = [], baseinfo = {}, classes = [], dataList = data.data.dataList, del = "", branch = "";
							for(var i=0; i<dataList.length; i++){
								classes = [];
								del = dataList[i].classGroup;
								switch (del.branch){
									case 0:
										branch = "未分文理";
										break;
									case 1:
										branch = "文科";
										break;
									case 2:
										branch = "理科";
										break;
								}
								baseinfo = {
									id: del.id,
									gradeName: del.gradeName,
									name: del.name,
									branch: branch
								};
								for(var j=0; j<dataList[i].classGroupDetails.length; j++){
									classes.push(dataList[i].classGroupDetails[j].className);
								}
								baseinfo.classes = classes.join(", ");
								list.push(baseinfo);
							}
							this.tableData = list;
							console.log("整理数据："+JSON.stringify(this.tableData));
						}
						this.currentPage = data.data.currentPage;
						this.totalCount = data.data.totalCount;
						this.totalPage = data.data.totalPage;
					}else {
						this.$message.error('班级层次管理列表接口返回失败!');
					}
				}, function(error){
					console.info("返回失败"+error);
					this.$message.error('班级层次管理列表接口错误!');
				});
			},
			handleEdit(index, row) {
				this.editwin.id = row.id;
				this.editwin.name = row.name;
				var gradeName = row.gradeName, list = this.editwin.gradeList;
				for(var i=0; i<list.length; i++){
					if(gradeName == list[i].name){
						this.editwin.gradeId = list[i].cityGradeId;
						break;
					}
				}
				this.editwin.checkedClassNames = row.classes.split(", ");
				this.editwin.curtitle = '编辑班级层次';
				this.editwin.isshow = true;
				this.editwin.editInit = true;
			},
			deleteRow(index, rows) {
				if(rows[0].id){
					this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 根据班级层次ID删除班级层次数据 (郑强) #2017-03-01#
						this.$http.post("/api/servers/deleteClass", {
							classLevelId: rows[0].id
						}).then(function(data){
							data = data.body;
							console.info(data);
							if(data.code == 200 && data.success == true){
								rows.splice(index, 1);
							}else {
								this.$message.error('删除班级层次接口返回失败!');
							}
						}, function(error){
							console.info("返回失败："+error);
							this.$message.error('删除班级层次接口错误!');
						});
						/*this.$message({
						 type: 'success',
						 message: '删除成功!'
						 });*/
					}).catch(() => {
						/* this.$message({
						 type: 'info',
						 message: '已取消删除'
						 });*/
					});
				}else {
					this.$alert('数据id不存在', '提示', {
						confirmButtonText: '确定'
					});
				}
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.listData();
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.listData();
				console.log(`当前页: ${val}`);
			}
		}
    }
</script>
