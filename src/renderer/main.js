import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import GlobalEvents from 'vue-global-events'
import VModal from 'vue-js-modal'
import * as ModalDialogs from 'vue-modal-dialogs'
import TreeView from 'vue-json-tree-view'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('GlobalEvents', GlobalEvents)
Vue.use(VModal)
Vue.use(require('vue-moment'))
Vue.use(ModalDialogs)
Vue.use(TreeView)

Vue.config.keyCodes.F1 = 112
Vue.config.keyCodes.F8 = 119

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  store,
  template: '<App/>'
}).$mount('#app')
