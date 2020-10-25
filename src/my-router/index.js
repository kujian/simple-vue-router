import install from '@/my-router/install';
import HashHistory from '@/my-router/history/hash';
import createMatcher from '@/my-router/create-matcher';

class VueRouter {
  constructor (options) {
    this.matcher = createMatcher(options.routes);
    this.history = new HashHistory(this);
    this.app = undefined;
    this.beforeEachs = [];
  }

  init (app) {
    this.app = app;
    this.history.onHashchange();
    this.history.listenEvent();
  }

  push (path) {
    location.hash = path;
  }

  // cache in global, execute before get matched route record
  beforeEach (fn) {
    this.beforeEachs.push(fn);
  }

  match (path) {
    return this.matcher.match(path);
  }
}

VueRouter.install = install;
export default VueRouter;
