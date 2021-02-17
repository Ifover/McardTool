import Vue from 'vue'
import App from './App.vue'
import axios from './utils/axios'

import './utils/lazyUse'
// import ViewUI from 'view-design';
// Vue.use(ViewUI);

import 'view-design/dist/styles/iview.css'

import './assets/reset.less'
Vue.prototype.$axios = axios


const root = document.createElement('div')
root.id = 'app'
document.body.appendChild(root)

Vue.config.productionTip = false;
new Vue({
    el: '#app',
    render: h => h(App)
})
