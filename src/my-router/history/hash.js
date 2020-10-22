import { getHash } from '@/my-router/util';

class HashHistory {
  constructor (router) {
    // pass instance of VueRoute class, can call methods and properties of instance directly
    this.router = router;
    this.onHashchange = this.onHashchange.bind(this);
  }

  listenEvent () {
    window.addEventListener('hashchange', this.onHashchange);
  }

  onHashchange () {
    const path = getHash();
    const route = this.router.match(path);
    console.log('route', route);
  }
}

export default HashHistory;
