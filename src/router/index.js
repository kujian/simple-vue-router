import Vue from 'vue';
import VueRouter from 'vue-router';
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
    component: About,
    children: [
      { path: 'a', name: 'AboutA', component: { name: 'AboutA', render: (h) => <div>This is about/a</div> } },
      { path: 'b', name: 'AboutB', component: { name: 'AboutB', render: (h) => <div>This is about/b</div> } }
    ]
  }
];

const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  console.log(1);
  setTimeout(() => {
    next();
  }, 1000);
});
router.beforeEach((to, from, next) => {
  console.log(2);
  next();
});

export default router;
