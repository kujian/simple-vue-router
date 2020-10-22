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
      { path: 'a', name: 'AboutA', component: { render: (h) => <div>This is about/a</div> } },
      { path: 'b', name: 'AboutB', component: { render: (h) => <div>This is about/b</div> } }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
