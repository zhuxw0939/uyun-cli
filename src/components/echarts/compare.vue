<template>

	<div class="compare_fs" v-if="compareData.length>0">
        <h4><span>{{compareData[0].data1Title}}</span><span>{{compareData[0].data2Title}}</span></h4>
        <div class="fs_box cf">
	        <div class="fs_left" id="js_fs_left">
		        <ul>
			        <li v-for="item in compareData" :class="{no_1:item.data1>=item.data2}">
				        <span class="fx_num">{{item.data1}}</span>
				        <span class="fs_bar"><b :style="'width: '+item.data1Width+'%'"><em v-if="item.data1>item.data2">{{item.dataAbs}}<i class="iconfont">&#xe63c;</i></em></b></span>
			        </li>
		        </ul>
	        </div>
	        <div class="fs_middle" id="js_fs_middle">
		        <ul>
					<li v-for="item in compareData">
						<span class="fx_num">{{item.dataName}}</span>
					</li>
		        </ul>
	        </div>
	        <div class="fs_right" id="js_fs_right">
		        <ul>
			        <li v-for="item in compareData" :class="{no_1:item.data2>=item.data1}">
				        <span class="fx_num">{{item.data2}}</span>
				        <span class="fs_bar"><b :style="'width: '+item.data2Width+'%'"><em v-if="item.data2>item.data1"><i class="iconfont">&#xe63c;</i>{{item.dataAbs}}</em></b></span>
			        </li>
		        </ul>
	        </div>
        </div>
    </div>
	<loadingtable v-else></loadingtable>


</template>



<script type="text/ecmascript-6">

import Loadingtable from '../analysis/loadingtable'

export default {
	components: {Loadingtable},
	props: {
		compareData: {
			type: Array,
			default: []
		}
	}
};
</script>


<style>
/*分数对比*/
.compare_fs {
}
.compare_fs h4 span {
	font-size: 16px;
	display: inline-block;
	line-height: 37px;
	width: 50%;
	text-align: center;
}

.compare_fs .fs_box {
}

.fs_box .fs_left,
.fs_box .fs_middle,
.fs_box .fs_right {
	float: left;
	font-size: 13px;
}
.fs_box .fs_left {
	width: 42%;
	text-align: right;
	color: #9a9a9a;
}
.fs_box .fs_middle {
	width: 12%;
	text-align: center;
	color: #111;
}
.fs_box .fs_right {
	width: 42%;
	text-align: left;
	color: #9a9a9a;
}

.fs_box .fs_left ul li,
.fs_box .fs_middle ul li,
.fs_box .fs_right ul li {
	line-height: 35px;
	height: 35px;
	position: relative;
	overflow: hidden;
}
.fs_box .fs_left ul li {
}
.fs_box .fs_right ul li {
}
.fs_box .fs_left ul li span,
.fs_box .fs_middle ul li span,
.fs_box .fs_right ul li span {
}
.fs_box .fs_left ul li span.fx_num,
.fs_box .fs_right ul li span.fx_num {
}
.fs_box .fs_left ul li span.fs_bar,
.fs_box .fs_right ul li span.fs_bar {
	width: 76%;
	height: 35px;
	display: inline-block;
	position: absolute;
	top: 0;
}
.fs_box .fs_left ul li span.fs_bar {
	right: 18%;
}
.fs_box .fs_right ul li span.fs_bar {
	left: 18%;
}
.fs_box .fs_left ul li span.fs_bar b,
.fs_box .fs_right ul li span.fs_bar b {
	position: absolute;
	top: 10px;
	background: #f0f2f5;
	height: 18px;
	min-width: 45px;
}
.fs_box .fs_left ul li span.fs_bar b {
	right: 0;
}
.fs_box .fs_right ul li span.fs_bar b {
	left: 0;
}


.fs_box .fs_left ul li.no_1 span.fs_bar b,
.fs_box .fs_right ul li.no_1 span.fs_bar b {
	background: #5da2e2;
}
.fs_box .fs_left ul li.no_1 span.fx_num,
.fs_box .fs_right ul li.no_1 span.fx_num {
	color: #5da2e2;
}

.fs_box .fs_left ul li span.fs_bar b em,
.fs_box .fs_right ul li span.fs_bar b em {
	display: inline-block;
	position: absolute;
	color: #fff;
	line-height: 18px;
	font-size: 12px;
	top: 0;
}
.fs_box .fs_left ul li span.fs_bar b em i.iconfont,
.fs_box .fs_right ul li span.fs_bar b em i.iconfont {
	font-size: 12px;
	position: relative;
	top: 1px;
}
.fs_box .fs_left ul li span.fs_bar b em {
	left: 8px;
	/*padding-left: 5px;*/
	/*background: url(../img/no_1.png) no-repeat left center;*/
}
.fs_box .fs_right ul li span.fs_bar b em {
	right: 8px;
	/*padding-right: 5px;*/
	/*background: url(../img/no_1.png) no-repeat right center;*/
	/*background-size: 10px 10px;*/
}
.fs_box .fs_left ul li span.fs_bar b em i.iconfont {
	margin-left: 3px;
}
.fs_box .fs_right ul li span.fs_bar b em i.iconfont {
	margin-right: 3px;
}
</style>
