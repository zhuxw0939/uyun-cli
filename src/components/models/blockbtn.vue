<template>
	<a :href="url" class="el-button el-button--primary block_button"><img v-if="image=='create'" src="./ico_addexam_index.png"><img v-else-if="image" :src="image">{{text}}</a>
</template>

<script type="text/ecmascript-6">
export default {
	props: {
		url: {
			type: String,
			default: "#"
		},
		text: {
			type: String,
			default: "点击"
		},
		image: {
			type: String,
			default: ""
		}
	}
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
a.block_button
	display: block
	width: 100%
	font-size: 18px
	padding: 14px 0 20px
	border-radius: 6px
	margin-bottom: 20px
	img
		position: relative
		top: 5px
		margin-right: 10px

</style>
