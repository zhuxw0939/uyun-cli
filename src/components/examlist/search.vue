<template>
    <div class="searchform">
		<div class="term">
			<el-select v-model="searchoption.termId" style="width: 100%;" @change="handleIconClick">
				<el-option
						v-for="item in termsdata"
						:label="item.termname"
						:value="item.id">
				</el-option>
			</el-select>
		</div>
		<div class="exam">
			<el-select v-model="searchoption.examLevel"  style="width: 100%;" @change="handleIconClick">
				<el-option
						v-for="item in examlevelist"
						:label="item.name"
						:value="item.level">
				</el-option>
			</el-select>
		</div>
		<div class="grade">
			<el-select v-model="searchoption.gradeId"  style="width: 100%;" @change="handleIconClick">
				<el-option
						v-for="item in gradesdata"
						:label="item.name"
						:value="item.id">
				</el-option>
			</el-select>
		</div>
		<div class="chodate">
			<el-date-picker v-model="searchoption.startDate" type="date" :editable="false" placeholder="选择开始时间" @change="dateChange"></el-date-picker>
			<span class="separator">—</span>
			<el-date-picker v-model="searchoption.endDate" type="date" :editable="false" placeholder="选择截止时间" @change="dateChange"></el-date-picker>
		</div>

		<div class="examname">
			<el-input v-model="searchoption.examName" placeholder="请输入考试名称" icon="search" @click="handleIconClick" style="width: 100%;"></el-input>
		</div>
		<b class="clear"></b>
    </div>
</template>
<style>
	.searchform .term{
		width: 24%;
	}
	.searchform .exam, .searchform .grade{
		width: 12%;
	}
	.searchform .examname {
		float: left;
		width: 30.5%;
	}
	@media screen and (max-width: 1383px) {
		.searchform .term{
			width: 230px;
		}
		.searchform .exam, .searchform .grade{
			width: 110px;
		}
		.searchform .examname {
			float: left;
			width: 240px;
		}
	}
	@media screen and (min-width:1384px) and (max-width:1440px){
		.searchform .term{
			width: 23%;
		}
		.searchform .exam, .searchform .grade{
			width: 11%;
		}
		.searchform .examname {
			float: left;
			width: 22.5%;
		}
	}
	@media screen and (min-width:1441px) and (max-width:1600px){
		.searchform .term{
			width: 24%;
		}
		.searchform .exam, .searchform .grade{
			width: 12%;
		}
		.searchform .examname {
			float: left;
			width: 24.5%;
		}
	}
	@media screen and (min-width:1601px) and (max-width:1680px){
		.searchform .term{
			width: 24%;
		}
		.searchform .exam, .searchform .grade{
			width: 12%;
		}
		.searchform .examname {
			float: left;
			width: 26%;
		}
	}

    .searchform{
        background: #f9fafc;
        padding: 15px 15px 0 15px;
        border-radius: 6px;
		min-width: 1000px;
    }

	.searchform .el-date-editor.el-input {
		width: 130px;
	}
	.searchform .chodate{
		width: 280px;
	}
	.searchform .term, .searchform .exam, .searchform .grade,
	.searchform .chodate{
		float: left;
		margin: 0 15px 12px 0;
	}
	.el-date-editor{
		float: left;
	}
	.separator{
		color: #dfe1e5;
		display: inline-block;
		float: left;
		margin: 6px 3px 0 3px;
	}
	.examname .el-input__icon{
		background: #019ce7;
		color: #fff;
		cursor: pointer;
	}
	examname .el-input__icon:hover{
		color: #fff;
	}
	.el-icon-search::before:hover{
		color: #fff;
	}

	.clear{clear:both;display:block;width:0;height:0}
</style>

<script type="text/ecmascript-6">
    export default {
        props: ['searchoption', 'termsdata', 'examlevelist', 'gradesdata'],
        data() {
            return {}
        },
        methods: {
            handleIconClick(ev) {
				this.$emit('loadlist');
            },
            dateChange(value){
               // var obj = examlist.searchoption;
				var obj = this.searchoption;
                if((obj.startDate == "" || obj.startDate == undefined) && (obj.endDate == "" || obj.endDate == undefined)){
					this.$emit('loadlist');
				}else if((obj.startDate!= "" && obj.startDate != undefined) && (obj.endDate != undefined && obj.endDate != "")){
					this.$emit('loadlist');
				}
			}
        }
    }
</script>
