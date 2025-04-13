import { createApp } from 'vue';
import App from './App.vue';
import './assets/tailwind.css';
import './main.css';
import router from './router';

createApp(App)
    .use(router)
    .mount('#app')
