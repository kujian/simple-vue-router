export default {
  props: {
    to: {
      type: String,
    },
    tag: {
      type: String,
      default: () => 'a'
    }
  },
  computed: {
    active () {
      const matchedPaths = this.$route.matched.map(item => {
        return item.path;
      });
      const index = matchedPaths.indexOf(this.$route.path);
      return matchedPaths.slice(0, index + 1).includes(this.to);
    }
  },
  methods: {
    onClick () {
      this.$router.push(this.to);
    }
  },
  render () {
    return (
      <this.tag
        onClick={this.onClick}
        href="javascript:;"
        class={{ 'router-link-active': this.active }}
      >
        {this.$slots.default}
      </this.tag>
    );
  }
};
