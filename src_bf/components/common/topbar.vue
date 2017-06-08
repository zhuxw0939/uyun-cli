<template>
    <div class="_top">
        <span>欢迎回来： {{topData.name}}！</span>
        <div class="fr">
            <myselect :select-data="selectData"></myselect>
            <a class="exit fr" href="/user/logout">
                <img src="./ico_out.png" />退出
            </a>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">

    import Myselect from '../models/select.vue'

    export default {
        data(){
            return {
                topData: backTopData
            };
        },
        created() {
            this.selectData = {
                list: this.topData.options,
                ico: "user",
                defaultValue: this.topData.defaultValue,
                selectedBack: (selectedData) => {
                    window.location.href="/home?type="+selectedData.value;
                }
            };
        },
        methods:{
            exits:function(){
                console.log(111);
                window.location.href="/logout";
            }
        },
        components: { Myselect }
    };
</script>

<style>

	.wrapper_right ._top{
		background: #f9fafc;
		padding: 18px 26px;
	 }

	._top img{
		vertical-align: middle;
	}
	._top select{
		margin-right:20px;
		border:none;
		height:30px;
	}
	.exit{
		color:#333;
	}
	.exit img{
		margin-right:10px;
	}
</style>



