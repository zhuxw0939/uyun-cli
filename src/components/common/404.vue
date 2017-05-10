<template>

	<div class="my_404">
		<p>404！</p>
	</div>

</template>

<script>
export default {
	created() {
	}
}

</script>
<style>
	.my_404 {
		position: fixed;
		width: 100%;
		height: 100%;
		background: #eaedf1;
		z-index: 100;
		top: 0;
		left: 0;
	}
	.my_404 p {
		line-height: 60px;
		width: 100%;
		text-align: center;
		position: absolute;
		top: 50%;
		left: 0;
		margin-top: -30px;
	}
</style>
