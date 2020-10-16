<script>
import Home from '@/views/Home';
import About from '@/views/About';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
];
const pathMap = routes.reduce((accumulator, route) => {
  accumulator[route.path] = route;
  return accumulator;
}, {});
export default {
  mounted () {
    this.getCurrentView();
    this.listenHash();
  },
  data () {
    return {
      component: null
    };
  },
  methods: {
    getHash () {
      return location.hash.slice(1);
    },
    listenHash () {
      // Vue帮我们把事件绑定的this指向改为了vue instance
      window.addEventListener('hashchange', this.onHashchange);
    },
    onHashchange () {
      // hash 更改后根据hash 来匹配对应的组件
      this.getCurrentView();
      // 通过h方法可以将组件渲染到页面，这里需要使用render函数
    },
    getCurrentView () {
      this.component = pathMap[this.getHash()].component;
    }
  },
  render (h) {
    if (this.component) {
      return h(this.component);
    }
    return null;
  }
};
</script>
