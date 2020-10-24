export default {
  name: 'RouterView',
  render (h) {
    let depth = 0;
    const route = this.$parent.$route;
    let parent = this.$parent;
    while (parent) {
      if (parent.$options.name === 'RouterView') {
        depth++;
      }
      parent = parent.$parent;
    }
    const record = route.matched[depth];
    if (record) {
      return h(record.component);
    } else {
      return h();
    }
  }
};
