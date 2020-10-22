<template>
  <div class="about">
    This is an about page
    <ul>
      <li>
        <router-link to="/about/a">to a</router-link>
      </li>
      <li>
        <router-link to="/about/b">to b</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {};
  },
};
</script>

<style scoped>
.about {

}
</style>
