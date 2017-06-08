<template>
  <div class="crumbs outWidth">
    <router-link to="/">{{ msg }}</router-link>
  </div>
</template>

<script>
    export default{
        data(){
            return{
                msg:'首页',
                id: 10,
                list: []
            }
        },
        created(){


        }
    }


</script>

<style type="text/css" lang="stylus" rel="stylesheet/stylus"  scoped>
  .crumbs
    line-height:3.6rem
    font-size:0.8rem
    a
      color:#1c96e6
</style>
