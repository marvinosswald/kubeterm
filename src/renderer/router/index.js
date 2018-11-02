import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main-view',
      component: require('@/components/Main').default
    },
    {
      path: '/log-monitor',
      name: 'LogMonitor',
      component: require('@/components/LogMonitor').default
    },
    {
      path: '/json-tree-view',
      name: 'JsonTreeView',
      component: require('@/components/JsonTreeView').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
