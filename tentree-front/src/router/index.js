import { createRouter, createWebHistory } from 'vue-router';

// Import the components for each route
import LandingPage from '../components/LandingPage.vue'; 
import LoginPage from '../components/LoginPage.vue'; 
import RegistrationPage from '@/components/RegistrationPage.vue';
import HomePage from '@/components/HomePage.vue';
import ProfilePage from '@/components/ProfilePage.vue';

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
  {
    path: '/registration',
    name: 'RegistrationPage',
    component: RegistrationPage,
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/profile',
    name: 'ProfilePage',
    component: ProfilePage,
  }
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, 
});

export default router;
