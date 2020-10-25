### 手写基础版`Vue Router`
`Vue Router`的核心功能：  
* 不刷新页面切换路径(history/hash)
* 根据地址展示对应`path`的路由组件

实现功能：
* 根据使用来建立代码结构
* 嵌套路由(`Nest Route`)
* 格式化路由参数，方便直接通过路径来匹配
* 动态添加路由功能`addRoutes`
* 监听`hash`值变化，并重新匹配对应的组件
* `router-view`组件
* `router-link`组件
  * 添加激活路由`class`
* `$router.push`方法
* 路由守卫(`Navigation Guards`)


#### 问题记录
为什么通过`defineProperty`可以使属性具有响应性？
```javascript
Object.defineProperty(this, '$route', {
  get () {
    return this._rootRouter.$route;
  }
});
```
