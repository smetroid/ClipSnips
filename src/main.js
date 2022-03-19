import Vue from 'vue'
import '@/assets/css/style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { FocusTrap } from 'focus-trap-vue'
Vue.component('FocusTrap', FocusTrap)
Vue.config.productionTip = false
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')