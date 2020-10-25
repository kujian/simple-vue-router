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
