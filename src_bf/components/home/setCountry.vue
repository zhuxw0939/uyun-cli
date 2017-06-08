<template>
	<div class="_center">
		<top curtitle="乡镇管理" :other="false" :editwin="editwin"></top>
		<div class="table">
			<el-table :data="tableData" border style="width: 100%" :max-height="maxHeight">
				<el-table-column prop="name" label="乡镇" width="150"></el-table-column>
				<el-table-column prop="schoolNames" label="包含学校"></el-table-column>
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
		<countrywin curmodel="country" :editwin="editwin" @loadlist="listData"></countrywin>
	</div>
</template>

<script type="text/ecmascript-6">

	import '../set/set.css'
	import Top from '../set/top'
	import Countrywin from '../set/countrywin'

    export default{
		components: {Top, Countrywin},
		data(){
			return {
				editwin: {
					curtitle: '新增乡镇分类',
					isshow: false,
					id: "",
					name: "",
					regionId: "",
					schoolNames: [],
					orgId: backUser.orgId
				},
				tableData: [],
				maxHeight: 800,
				currentPage: 1,
				pageSize: 50,
				totalCount: 0,
				totalPage: 0
			};
		},
		mounted(){
			this.listData();
		},
		methods: {
			listData(){
				var obj = this;
				// 查询当前区县乡镇列表
				this.$http.post("/api/servers/ExamTownApi_page", {
					body: {
						"page": obj.currentPage,
						"size": obj.pageSize
					}
				}).then(function(data){
					data = data.body;
					console.info("乡镇列表"+JSON.stringify(data));
					if(data.code == 200 && data.success == true){
						if(data.data){
							var list = [], baseinfo = {}, schools = [], dlist = data.data.dataList;
							for(var i=0; i<dlist.length; i++){
								schools = [];
								baseinfo = {
									id: dlist[i].id,
									name: dlist[i].name,
									regionId: dlist[i].regionId
								};
								for(var j=0; j<dlist[i].schools.length; j++){
									schools.push(dlist[i].schools[j].schoolName);
								}
								baseinfo.schoolNames = schools.join(", ");
								list.push(baseinfo);
							}
							this.tableData = list;
						}
						this.currentPage = data.data.currentPage;
						this.totalCount = data.data.totalCount;
						this.totalPage = data.data.totalPage;
						console.log("整理后的数据："+JSON.stringify(list));
					}else {
						this.$message.error('乡镇列表接口查询失败!');
					}
				}, function(error){
					console.info("返回失败"+error);
					this.$message.error('乡镇列表接口错误!');
				});
			},
			handleEdit(index, row) {
				this.editwin.schoolNames = row.schoolNames.split(", ");
				this.editwin.id = row.id;
				this.editwin.name = row.name;
				this.editwin.regionId = row.regionId;
				this.editwin.isshow = true;
			},
			deleteRow(index, rows) {
				console.log("删除乡镇："+rows[index].id);
				if(rows[index].id){
					this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// 删除乡镇
						this.$http.post("/api/servers/deleteCountry", {
							id: rows[index].id
						}).then(function(data){
							data = data.body;
							console.info(data);
							if(data.code == 200 && data.success == true){
								rows.splice(index, 1);
							}else {
								this.$message.error('删除乡镇接口返回失败!');
							}
						}, function(error){
							console.info("返回失败："+error);
							this.$message.error('删除乡镇接口错误!');
						});
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
