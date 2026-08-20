import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Men from '../views/Men.vue';
import About from '../views/About.vue';
import OffensesList from '../views/OffensesList.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/men', name: 'Men', component: Men },
    { path: '/history', name: 'OffensesList', component: OffensesList },
    { path: '/about', name: 'About', component: About },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;