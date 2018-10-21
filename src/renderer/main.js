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
Vue.config.keyCodes.F2 = 113
Vue.config.keyCodes.F3 = 114
Vue.config.keyCodes.F4 = 115
Vue.config.keyCodes.F5 = 116
Vue.config.keyCodes.F6 = 117
Vue.config.keyCodes.F7 = 118
Vue.config.keyCodes.F8 = 119
Vue.config.keyCodes.F9 = 120
Vue.config.keyCodes.F10 = 121
Vue.config.keyCodes.F11 = 122
Vue.config.keyCodes.F12 = 123

/* eslint-disable no-new */
new Vue({
  render: h => h(App),
  router,
  store,
  template: '<App/>'
}).$mount('#app')
