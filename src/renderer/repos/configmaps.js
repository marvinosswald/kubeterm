const K8s = require('@kubernetes/client-node')
const kc = new K8s.KubeConfig()
kc.loadFromDefault()
const api = kc.makeApiClient(K8s.Core_v1Api)

export default {
  getAll (namespace = null) {
    if (namespace) {
      return api.listNamespacedConfigMap(namespace)
    }
    return api.listConfigMapForAllNamespaces()
  }
}
