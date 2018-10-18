const K8s = require('@kubernetes/client-node')
const kc = new K8s.KubeConfig()
kc.loadFromDefault()
const api = kc.makeApiClient(K8s.Core_v1Api)

export default {
  deletePod (pod) {
    api.deleteNamespacedPod(pod.metadata.name, pod.metadata.namespace, K8s.V1DeleteOptions)
  },
  getEvents (pod) {
    return api.listNamespacedEvent(pod.metadata.namespace, false, false, `involvedObject.uid=${pod.metadata.uid}`)
  }
}
