import { getHash } from '@/my-router/util';
import { createRoute } from '@/my-router/create-matcher';

class HashHistory {
  constructor (router) {
    // pass instance of VueRoute class, can call methods and properties of instance directly
    this.router = router;
    // 当前的路由记录
    this.current = createRoute(null, '/');
    this.onHashchange = this.onHashchange.bind(this);
  }

  listenEvent () {
    window.addEventListener('hashchange', this.onHashchange);
  }

  onHashchange () {
    const path = getHash();
    const route = this.router.match(path);
    this.current = route;
  }
}

export default HashHistory;
