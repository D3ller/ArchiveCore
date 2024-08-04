import {createApp} from 'vue'
import App from './App.vue'
import './assets/css/main.css';
import './demos/ipc'
import router from './router/index.js'
import {createPinia} from "pinia";

createApp(App)
    .use(router)
    .use(createPinia())
    .mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    })
