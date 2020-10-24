import RouterView from '@/my-router/components/view';
import RouterLink from '@/my-router/components/link';

const install = (Vue) => {
  Vue.mixin({
    beforeCreate () {
      const { router } = this.$options;
      // mount $router property for all components
      if (router) {
        this._rootRouter = this;
        this.$router = router;
        Vue.util.defineReactive(this, '$route', this.$router.history.current);
        router.init(this);
      } else {
        this._rootRouter = this.$parent && this.$parent._rootRouter;
        if (this._rootRouter) {
          this.$router = this._rootRouter.$router;
          // this.$route = this._rootRouter.$route
          // why this will has reactive ?
          Object.defineProperty(this, '$route', {
            get () {
              return this._rootRouter.$route;
            }
          });
        }
      }
    }
  });
  Vue.component('RouterView', RouterView);
  Vue.component('RouterLink', RouterLink);
};

export default install;
