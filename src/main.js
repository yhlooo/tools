// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'

// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faList, faTags, faUndo, faTrash, faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App'

Vue.config.productionTip = false
Vue.use(ElementUI)

library.add(faList, faTags, faUndo, faTrash, faBars)
Vue.component('fa-icon', FontAwesomeIcon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
