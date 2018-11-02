const K8s = require('@kubernetes/client-node')
const kc = new K8s.KubeConfig()
kc.loadFromDefault()
const api = kc.makeApiClient(K8s.Core_v1Api)

export default {
  getAll () {
    return api.listNamespace()
  },
  getWatcher (params, cb, doneCb) {
    return new K8s.Watch(kc).watch(
      `/api/v1/namespaces/`,
      params, cb, doneCb)
  }
}
