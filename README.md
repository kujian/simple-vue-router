## 手写简易版`vue-router`
`vue-router`是开发`vue`项目中必不可少的依赖，为了能更好的理解其实现原理，而源码阅读起来又过于复杂和枯燥，笔者这里实现一个简易版本的`vue-rouer`，帮助自己来更好的理解源码。

其功能如下：
* 通过`Vue`插件形式使用  
* 支持`hash`模式
* 支持嵌套路由
* `router-view`组件
* `router-link`组件
* 路由守卫

### 基本使用
> 基础`demo`单独新建了一个[分支](https://github.com/wangkaiwd/simple-vue-router/tree/basic-demo) ，方便学习和查看

在实现自己的`router`之前，我们先使用官方的包来书写一个基础`demo`，之后我们会以这个`demo`为需求，一步步实现我们自己的`vue-router`。

`demo`的代码逻辑如下：
* `App`页面中拥有`Home`和`About`俩个链接
* 点击`Home`会跳转到`Home`页面
* 点击`About`会跳转到`About`页面
* 而`About`又有`to a`和`to b`俩个链接，分别跳转到`a`和`b`页面

![](https://raw.githubusercontent.com/wangkaiwd/drawing-bed/master/Oct-25-2020%2018-13-27.gif)

下面开始使用我们自己写的`vue-router`来实现上边展示的功能。

### `intall`方法
`vue-router`使用方式如下：  
```javascript
import Vue from 'vue';
import VueRouter from '../my-router';
import Home from '../views/Home.vue';
import About from '@/views/About';
Vue.use(VueRouter);
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
const router = new VueRouter({
  routes
});
export default router;
```

之后会在`main.js`中将`router`作为配置项传入：  
```javascript
import Vue from 'vue';
import App from './App.vue';
import router from './router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
```

由用法我们可以知道`vue-router`是一个类，并且它有一个静态方法`install`: 
```javascript
import install from '@/my-router/install';

class VueRouter {
  constructor (options) {
  
  }
  init(app) {
  
  }
}

VueRouter.install = install;
export default VueRouter;
```

`install`方法中会为所有组件添加`$router`以及`$route`属性，并且会全局注册`router-view`以及`router-link`组件。我们在`install.js`中来单独书写`install`的逻辑：
```javascript
import RouterView from '@/my-router/components/view';
import RouterLink from '@/my-router/components/link';

const install = (Vue) => {
  Vue.mixin({
    beforeCreate () {
      const { router } = this.$options;
      // mount $router property for all components
      if (router) {
        // 用_rootRouter来存储根实例
        this._rootRouter = this;
        // 为根实例添加$router属性
        this.$router = router;
        // 在实例上定义响应式属性，但是这个API可能会发生变化，所以Vue并没有在文档中提供
        Vue.util.defineReactive(this, '$route', this.$router.history.current);
        // 初始化路由
        router.init(this);
      } else {
        this._rootRouter = this.$parent && this.$parent._rootRouter;
        if (this._rootRouter) {
          this.$router = this._rootRouter.$router;
          // 在为$route赋值时，会重新指向新的地址，导致子组件的$route不再更新
          // this.$route = this._rootRouter.$route;
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
```
在`install`方法中做了如下几件事：  
* 为所有组件的实例添加`_rootRouter`，值为根实例，方便获取根实例上的属性和方法
* 在根实例执行`beforeCreate`钩子时执行`VueRouter`实例的`init`方法
* 为所有组件的实例添加`$router`属性

### `hashchange`事件
`vue-router`在`hash`模式下可以不刷新页面进行页面切换，原理其实是利用页面地址`hash`值发生改变不会刷新页面，并且会触发`hashchange`事件。

在`history`目录下，新建`hash.js`来存放`hash`值变化，组件进行切换的逻辑： 
```javascript
import { getHash } from '@/my-router/util';
import { createRoute } from '@/my-router/create-matcher';

const ensureSlash = () => {
  if (!location.hash) {
    location.hash = '/';
  }
};

class HashHistory {
  constructor (router) {
    // pass instance of VueRoute class, can call methods and properties of instance directly
    this.router = router;
    // 当前的路由记录,在current更新后，由于其不具有响应性，所以尽管值更新了，但是不会触发页面渲染
    // 需要将其定义为响应式的数据
    this.onHashchange = this.onHashchange.bind(this);
    // 默认hash值为'/'
    ensureSlash();
  }

  listenEvent () {
    window.addEventListener('hashchange', this.onHashchange);
  }
  
  onHashchange () {
  }
}
export default HashHistory;
```

在`VueRouter`实例执行`init`方法时，进行事件监听： 
```javascript
class VueRouter {
  constructor (options) {
    this.history = new HashHistory(this);
  }

  init (app) {
    // 第一次渲染时也需要手动执行一次onHashchange方法
    this.history.onHashchange();
    this.history.listenEvent();
  }
}
```

在`onHashchange`方法中，需要根据当前页面地址的`hash`值来找到其对应的路由记录：
```javascript
class HashHistory {
  // ...
  onHashchange () {
    const path = getHash();
    const route = this.router.match(path);
  }
}
```

### 匹配路由记录
为了找到当前的路由记录，调用了`VueRouter`的`match`方法，而`match`方法放到了`create-matcher`中来实现: 
```javascript
// create-matcher.js
export const createRoute = (route, path) => {
  const matched = [];
  // 递归route的所有父路由，生成matched数组，并和path一起返回，作为当前的路由记录
  while (route) {
    matched.unshift(route);
    route = route.parent;
  }
  return {
    path,
    matched
  };
};

function createMatcher (routes) {
  const pathMap = createRouteMap(routes);
  // need to get all matched route, then find current routes by matched and router-view
  const match = (path) => {
    const route = pathMap[path];
    return createRoute(route, path);
  };
  return {
    match
  };
}
```
```javascript
// create-route-map.js
function addRouteRecord (routes, pathMap, parent) {
  routes.forEach(route => {
    const { path, children, ...rest } = route;
    // 拼接子路由path
    const normalizedPath = parent ? parent.path + '/' + path : path;
    // 将parent也放入到属性中，方便之后生成matched数组
    pathMap[normalizedPath] = { ...rest, path: normalizedPath, parent };
    if (children) {
      // 继续遍历子路由
      addRouteRecord(children, pathMap, route);
    }
  });
}

const createRouteMap = (routes, pathMap = {}) => {
  addRouteRecord(routes, pathMap);
  return pathMap;
};
```

`createMatcher`会通过`createRouteMap`生成`hash`值和路由的映射关系：
```javascript
const pathMap = {
  '/about': {
    path: '/about',
    name: 'About',
    children: [
      // ...  
    ],
    parent: undefined
  }
  // ...  
} 
```
这样我们可以很方便的通过`hash`值来获取路由信息。

最终我们调用`match`方法得到的路由记录结构如下：
```javascript
{
  "path": "/about/a",
  "matched": [
    {
      "path": "/about",
      "name": "About",
      "component": About,
      "children": [
        {
          "path": "a",
          "name": "AboutA",
          "component": A
        },
        {
          "path": "b",
          "name": "AboutB",
          "component": B
        }
      ]
    },
    // ...  
  ]
}
```

需要注意的是对象中的`matched`方法，它是为了支持嵌套路由而构造的数组。由于嵌套路由会本质上是`router-view`组件的嵌套，所以可以根据`router-view`在组件中的深度在`matched`中找到对应的匹配项。

现在我们回到`hashHistory`的`onHashchange`方法，它会调用`VueRouter`实例的`match`方法，代码如下：
```javascript
class VueRouter {
  constructor (options) {
    this.matcher = createMatcher(options.routes);
    this.history = new HashHistory(this);
  }

  init (app) {
    this.history.onHashchange();
    this.history.listenEvent();
  }

  match (path) {
    return this.matcher.match(path);
  }
}
```
在`hashHistory`中将其赋值给实例中的`current`属性： 
```javascript
class HashHistory {
  constructor (router) {
    // pass instance of VueRoute class, can call methods and properties of instance directly
    this.router = router;
    // 当前的路由记录,在current更新后，由于其不具有响应性，所以尽管值更新了，但是不会触发页面渲染
    // 需要将其定义为响应式的数据
    this.current = createRoute(null, '/');
    this.onHashchange = this.onHashchange.bind(this);
    ensureSlash();
  }

  listenEvent () {
    window.addEventListener('hashchange', this.onHashchange);
  }

  onHashchange () {
    const path = getHash();
    const route = this.router.match(path);
    this.current = route
  }
}
```

为了方便用户访问当前路由信息，并且让其具有响应性，会通过`Vue.util.defineReactive`来为`vue`的根实例提供响应性的`$route`属性，并在每次页面初始化以及路径更新时更新`$route`: 
```javascript
class HashHistory {
  constructor (router) {
    // pass instance of VueRoute class, can call methods and properties of instance directly
    this.router = router;
    // 当前的路由记录,在current更新后，由于其不具有响应性，所以尽管值更新了，但是不会触发页面渲染
    // 需要将其定义为响应式的数据
    this.current = createRoute(null, '/');
    this.onHashchange = this.onHashchange.bind(this);
  }
  // some code ...
  onHashchange () {
    const path = getHash();
    const route = this.router.match(path);
    // 将当前路由赋值给根实例，app会在router.init方法中进行初始化
    this.router.app.$route = this.current = route
  }
}
```
在`install`方法中为根实例定义`$route`属性，并将所有子组件实例的`$route`属性赋值为根实例的`$route`属性：  
```javascript
const install = (Vue) => {
  Vue.mixin({
    beforeCreate () {
      const { router } = this.$options;
      // mount $router property for all components
      if (router) {
        this._rootRouter = this;
        this.$router = router;
        // 定义响应性$route属性
        Vue.util.defineReactive(this, '$route', this.$router.history.current);
        router.init(this);
      } else {
        this._rootRouter = this.$parent && this.$parent._rootRouter;
        if (this._rootRouter) {
          this.$router = this._rootRouter.$router;
          // 这样直接赋值会导致引用刷新而无法改变$route
          // this.$route = this._rootRouter.$route;
          // 获取根组件实例的$route属性，其具有响应性
          Object.defineProperty(this, '$route', {
            get () {
              return this._rootRouter.$route;
            }
          });
        }
      }
    }
  });
};
```

到这里，我们已经可以在地址切换时获取到对应的路由信息，接下来我们实现`router-view`来展示对应的组件。

### 实现`router-view`组件
