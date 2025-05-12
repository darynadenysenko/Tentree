import { createRouter, createWebHistory } from 'vue-router';

// Import the components for each route
import LandingPage from '../components/LandingPage.vue'; 
import LoginPage from '../components/LoginPage.vue'; 
import RegistrationPage from '@/components/RegistrationPage.vue';
import HomePage from '@/components/HomePage.vue';
import ProfilePage from '@/components/ProfilePage.vue';
import AddSpotPage from '@/components/AddSpotPage.vue';
import EditProfilePage from '@/components/EditProfilePage.vue';
import SpotInfoPage from '@/components/SpotInfoPage.vue';
import PhotosPage from '@/components/PhotosPage.vue';
import AvailabilityPage from '@/components/AvailabilityPage.vue';
import ReviewPage from '@/components/ReviewPage.vue';
import SetAvailabilityPage from '@/components/SetAvailabilityPage.vue';
import EditSpotPage from '@/components/EditSpotPage.vue';

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
  },
  {
    path: '/addspot',
    name: 'AddSpotPage',
    component: AddSpotPage,
  },
  {
    path: '/editprofile',
    name: 'EditProfile',
    component: EditProfilePage,
  },
  {
    path: '/spotinfo/:id',
    name: 'SpotInfoPage',
    component: SpotInfoPage,
    props: true,
  },
  {
    path: '/photos/:id',
    name: 'PhotosPage', 
    component: PhotosPage,
    props: true,
    
  },
  {
    path: '/availability/:id',
    name: 'AvailabilityPage',
    component: AvailabilityPage,
    props: true,
  },
  {
    path: '/review/:id',
    name: 'ReviewPage',
    component: ReviewPage,
    props: true,
  },
  {
  path: '/setavailability/:id',
  name: 'SetAvailabilityPage',
  component: SetAvailabilityPage,
  props: true,
  },
  {
    path: '/editspot/:spotId',
    name: 'EditSpotPage',
    component: EditSpotPage,
    props: true,
  }
  

];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes, 
});

export default router;
