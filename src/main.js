import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'


loadFonts()
const app = createApp(App)
  app.provide("API_URL", "https://devweb.iutmetz.univ-lorraine.fr/~begel38u/SAE/api/main.php")
  app.use(router)
  app.use(vuetify)
  app.mount('#app')

