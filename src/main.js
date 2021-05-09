import Vue from 'vue'
import App from './App'
// import pageHead from './components/page-head.vue'

Vue.config.productionTip = false
// Vue.component('page-head',pageHead)

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
