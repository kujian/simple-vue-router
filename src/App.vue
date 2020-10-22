<template>
  <div id="app">
    <div class="content">
      <ul>
        <li>
          <router-link to="/home">Home</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
      </ul>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  mounted () {
  },
  methods: {}
};
</script>
<style>
#app {
  display: flex;
  justify-content: center;
}
.router-link-active {
  color: #ea4335;
}
</style>
