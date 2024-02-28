import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVfm } from 'vue-final-modal';
import Vue3Toasity from 'vue3-toastify';
import './assets/index.less';
import 'vue-final-modal/style.css';
import 'vue3-toastify/dist/index.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(createVfm());
app.use(Vue3Toasity, { autoClose: 1000 });

app.mount('#app');
