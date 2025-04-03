import { createApp } from 'vue';
import App from '@app/App.vue';
import router from '@infrastructure/router';
import { pinia } from '@infrastructure/stores';
import "@app/style.css";
import i18n from '@infrastructure/i18n';

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(i18n);
app.mount('#app');

