import Vue from 'vue'
import App from './App.vue'
import Analyse from './components/Analyse.vue'
import Notes from './components/Notes.vue'
import WriteText from './components/WriteText.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

Vue.config.productionTip = false

const routes = [
  {
    path: '/',
    name: 'App',
    component: App
  },
  {
    path: '/write',
    name: 'WriteText',
    component: WriteText
  },
  {
    path: '/notes',
    name: 'Notes',
    component: Notes
  },
  {
    path: '/analyse',
    name: 'Analyse',
    component: Analyse,
    props: {
      header: true,
      content: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
