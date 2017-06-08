<template>
  <div id="app">
    <header-box></header-box>
    <crumb></crumb>
    <div class="outWidth">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import HeaderBox from './components/common/header'
import Crumb from './components/common/crumbs'
export default {
  name: 'app',
  components: { HeaderBox, Crumb },
  data() {
    return {
       transitionName: 'slide-left'
    }
  }
}
</script>

<style lang="stylus">


</style>
