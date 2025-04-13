import { createRouter, createWebHistory } from 'vue-router';

// Import the components for each route
import LandingPage from '../components/LandingPage.vue'; 
import LoginPage from '../components/LoginPage.vue'; 

// Define routes

const routes = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage,  
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,  
  },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, 
});

export default router;
