import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Money3Directive } from 'v-money3'

import ui from '@nuxt/ui/vue-plugin'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ui)

app.directive('money3', Money3Directive)

app.mount('#app')
