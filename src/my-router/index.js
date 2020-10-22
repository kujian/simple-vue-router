import install from '@/my-router/install';
import HashHistory from '@/my-router/history/hash';
import createMatcher from '@/my-router/create-matcher';

class VueRouter {
  constructor (options) {
    this.matcher = createMatcher(options.routes);
    this.hashHistory = new HashHistory(this);
  }

  init () {
    this.hashHistory.listenEvent();
  }

  match (path) {
    return this.matcher.match(path);
  }
}

VueRouter.install = install;
export default VueRouter;
