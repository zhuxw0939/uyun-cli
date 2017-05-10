<template>
	<div class="box examInfo">
			<h6>创建考试</h6>
			<el-form label-width="100px" class="demo-ruleForm">
				<el-form-item label="考试名称 :" required>
					<el-input v-model="ruleForm.name" :disabled="isEdit"></el-input>
				</el-form-item>
				<el-form-item label="考试时间 :" required >
					<el-date-picker type="date" :editable="false" placeholder="选择考试时间" v-model="ruleForm.startTime" :disabled="isEdit"></el-date-picker>
				</el-form-item>
				<el-form-item label="选择班级 :" required>
					<el-input v-model="classLen" placeholder="选择考试班级"  @focus="choiceSchools" @blur="changeClassInput" :disabled="isEdit"></el-input>
				</el-form-item>
				<el-form-item label="科目 :" required>
					<table class="mytable">
						<thead>
						<tr>
							<th>选择</th>
							<th>科目</th>
							<th>满分</th>
						</tr>
						</thead>
						<tbody>
						<tr v-for="items in ruleForm.courses">
							<td><el-checkbox checked disabled></el-checkbox></td>
							<td>{{items.courseName}}</td>
							<td>
								<el-input v-model="items.totalScore" placeholder="输入科目总分" disabled></el-input>
							</td>
						</tr>
						</tbody>
					</table>
					<el-form-item>
						<el-button size="large" @click="deleteExamTip" :disabled="isEdit">删除</el-button>
						<el-button type="primary" @click="submitForm" size="large" class="btn-sure" :disabled="isEdit">保存</el-button>
					</el-form-item>
			</el-form>
			<el-dialog title="选择班级" v-model="dialogVisible">
				<section class="schoolsBox fl classBox">
					<div class="s-top">
						<el-checkbox v-model="isAll" disabled>全选</el-checkbox>
						<label class="cgray">共选择 ${ ruleForm.classList.length } 个班级</label>
					</div>
					<div class="shoolList hiddens">
						<el-checkbox v-for="item in ruleForm.classList" checked disabled>${item.className}</el-checkbox>
					</div>
				</section>
				<span slot="footer" class="dialog-footer">
					<el-button @click="closeDialog" size="large">取 消</el-button>
					<el-button type="primary" @click="closeDialog" size="large" class="btn-sure">确 定</el-button>
				  </span>
			</el-dialog>
		</div>
</template>

<script>

    export default{
        data() {
            return {
                leftbar: {},
                ruleForm: {
                    name:'',
                    startTime: '',
                    classList:[],
                    courses: []
                },
                isAll: true,
                classLen: '',
                dialogVisible: false,
                isEdit: true,
                examId:this.$route.params.id
            };
        },
	    created() {
		    vm.currentRouter = "/examlist";
	    },
        mounted() {
            if(backUser.type == 'schoolTeacher'){
                this.isEdit = false;
            }
            this.getExamDetail();
        },
        methods: {

            getExamDetail() {
                // 考试详情查询 (陈显官) #2017-03-13#
                this.$http.post("/api/servers/getExamDetail", {
                    examId: this.examId
                }).then(function(data){
                    data = data.body;
                    if(data.code==200){
                        data = data.data;
                        this.ruleForm.startTime = data.examInfo.startTime;
                        this.ruleForm.name = data.examInfo.name;
                        this.ruleForm.classList = data.classes;
                        this.ruleForm.courses = data.courses;
                        this.classLen = '共选择了'+data.classes.length+'个班级';
                        this.examData = data;
                    } else {
                        console.info("返回错误");
                    }
                }, function(error){
                    console.info("返回失败："+error);
                });
            },
            choiceSchools() {
                this.dialogVisible = true;
            },
            changeClassInput() {
                this.classLen = '共选择了'+this.examData.classes.length+'个班级';
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            submitForm() {
                var name = this.ruleForm.name;
                var nameLen = name.length;
                if(nameLen < 1 || nameLen >30){
                 	return this.$message({
					  message: '考试名字长度在 1 到 30 个字符',
					  type: 'warning'
					});
                };
                var time = new Date(this.ruleForm.startTime).getTime();
                var param = {
                    id: this.examData.examInfo.id,
                    name: name,
                    remark: "",
                    releaseTime: time,
                    startTime: time
                };
                // 修改考试 (陈显官) #2017-03-13#
                this.$http.post("/api/servers/modifyExam", {
                    body: param
                }).then(function(data){log(data);
                    data = data.body;
                    if(data.code == 200){
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                    } else {
                        this.$message.error('保存失败');
                    }
                }, function(error){
                    log(error);
                });
            },
            deleteExamTip() {
                var $this = this;
                this.$confirm('是否删除本次考试?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function() {
                    $this.deleteExam();
                 }).catch(function() {
                    $this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
              });
            },
            deleteExam() {
                // 删除考试 (陈显官) #2017-03-15#
                this.$http.post("/api/servers/deleteExam", {
                    examId: this.examId
                }).then(function(data){
                        if(data.status==200 && data.body.code==200){
	                        location.href = "/home/examlist";
                        } else {
                            this.$message({
                                type: 'info',
                                message: '返回错误'
                            });
                        }
                }, function(error){
                    this.$message({
                        type: 'info',
                        message: '返回失败:'+error
                    });
                });
            }
        }
    }
</script>
<style scoped>

</style>
