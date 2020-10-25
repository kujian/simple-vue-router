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
    // 当用户手动调用next时，会执行下一个beforeEach钩子，在所有的钩子执行完毕后，会更新当前路由信息
    const next = (index) => {
      const { beforeEachs } = this.router;
      if (index === beforeEachs.length) {
        //update route after executed all beforeEach hook
        this.router.app.$route = this.current = route;
        return;
      }
      const hook = beforeEachs[index];
      hook(route, this.current, () => next(index + 1));
    };
    next(0);
  }
}

export default HashHistory;
