<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import RouterView from '@/myRouter/components/view';

export default {
  components: { RouterView },
  data () {
    return {};
  },
  mounted () {
  },
  methods: {}
};
</script>
<style scoped>
#app {
}
</style>
