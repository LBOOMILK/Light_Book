import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Vant from 'vant'
import ElementPlus from 'element-plus'
import 'vant/lib/index.css'
import 'element-plus/dist/index.css'
import './styles/theme.css'

const app = createApp(App)
const pinia = createPinia()

app.use(Vant)
app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.mount('#app')
