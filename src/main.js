import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { Icon } from '@iconify/vue'
import Vue3SocialSharingPlugin  from 'vue3-social-sharing';
const app = createApp(App)

const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(Vue3SocialSharingPlugin)
app.component('Icon', Icon)
app.mount('#app')
