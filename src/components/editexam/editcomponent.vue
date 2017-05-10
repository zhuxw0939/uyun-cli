<template>
	<div class="_center">
		<tabexam></tabexam>
		<router-view></router-view>
	</div>
</template>

<script>
import Tabexam from '../models/tab_exam'
export default {
	components: { Tabexam },
	beforeRouteEnter (to, from, next) {
		if(!backExamInfo || backExamInfo.id!=to.params.id) {
			console.info("!backExamInfo");
			$.ajax({
				url: "/api/servers/getExamDetail",
				type: "POST",
				dataType: "json",
				data: {
					examId: to.params.id
				},
				success: function (data) {
					if(data.code==200){
						// todo 考试信息错误
						if(data.data){
							data = data.data;
							data.id = data.examInfo.id;
							backExamInfo = data;
							next()
						} else {
							next(false)
							vm.$store.commit("err_500", {
								error: "获取考试信息错误！",
								toPath: to.path
							});
						}
					} else {
						next(false)
						vm.$store.commit("err_500", {
							error: "获取考试信息错误！",
							toPath: to.path
						});
					}
				},
				complete: function(XMLHttpRequest, textStatus){
				},
				error: function(xhr){
					next(false)
					vm.$store.commit("err_500", {
						error: "获取考试信息错误！",
						toPath: to.path
					});
				}
			});
		} else {
			next()
		}
	}
}
</script>


