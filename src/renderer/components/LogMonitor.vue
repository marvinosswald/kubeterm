<template>
    <ol>
        <li v-for="line in lines">
            {{line}}
        </li>
    </ol>
</template>

<script>
  const K8s = require('@kubernetes/client-node')
  export default {
    name: 'LogMonitor',
    data () {
      return {
        lines: [],
        pod: {}
      }
    },
    mounted () {
      const uid = this.$route.query.uid
      const jsonString = localStorage.getItem(uid)
      this.pod = JSON.parse(jsonString)
      localStorage.removeItem(uid)
      this.getLogs(this.pod)
    },
    methods: {
      async getLogs (pod) {
        const kc = new K8s.KubeConfig()
        kc.loadFromDefault()
        let api = kc.makeApiClient(K8s.Core_v1Api)
        setInterval(() => this.getContainerLog(api, pod, pod.spec.containers[0].name), 5000)
      },
      async getContainerLog (api, pod, containerName) {
        const logs = await api.readNamespacedPodLog(pod.metadata.name, pod.metadata.namespace, containerName, false, 1024, null, false, 5)
        if (logs.body !== undefined) {
          this.lines = [...this.lines, ...(logs.body.split('\n'))]
        }
      }
    }
  }
</script>

<style scoped>

</style>
