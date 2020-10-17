<script>
import Home from '@/views/Home';
import About from '@/views/About';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/home/a',
        name: 'A',
        component: 'A',
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
];
const pathMap = routes.reduce((accumulator, route) => {
  const key = route.path;
  accumulator[key] = { route };
  return accumulator;
}, {});
const getPathMap = (routes, pathMap = {}, parent = undefined) => {
  routes.forEach(route => {
    const key = route.path;
    pathMap[key] = route;
    pathMap[key].parent = parent;
    const matched = [route.path];
    let _parent = pathMap[key].parent;
    while (_parent) {
      matched.unshift(_parent.path);
      _parent = _parent.parent;
    }
    pathMap[key].matched = matched;
    if (route.children) {
      getPathMap(route.children, pathMap, route);
    }
  });
  return pathMap;
};
console.log(getPathMap(routes));
// 如果有子路由该如何处理？
// /home/a: {path: '/home/a',name:'A', matched: ['/home','/home/a']}
// App -> router-view -> Home -> router-view -> A
// 大概思路，递归查找RouterView组件，
// 来计录其深度，默认为0，没找到一个深度加1，最后根据深度从matched中进行匹配
export default {
  name: 'RouterView',
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
      this.component = pathMap[this.getHash()]?.component;
    }
  },
  render (h) {
    if (this.component) {
      // 可以传入一个Vue组件来将其渲染到页面
      // 如构造根实例时的render: (h) => h(App)
      return h(this.component);
    }
    return null;
  }
};
</script>
