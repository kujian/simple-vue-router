const install = (Vue) => {
  Vue.mixin({
    beforeCreate () {
      const { router } = this.$options;
      // mount $router property for all components
      if (router) {
        router.init();
        this.$router = router;
      } else {
        this.$router = this.$parent && this.$parent.$router;
      }
    }
  });

};

export default install;
