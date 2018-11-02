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
        pods: {}
      }
    },
    mounted () {
      const jsonString = localStorage.getItem('LogsOfPodsToWatch')
      this.pods = JSON.parse(jsonString)
      localStorage.removeItem('LogsOfPodsToWatch')
      this.getLogs(this.pods[0])
    },
    methods: {
      async getLogs (pod) {
        const kc = new K8s.KubeConfig()
        kc.loadFromDefault()
        let api = kc.makeApiClient(K8s.Core_v1Api)
        for (let c of pod.spec.containers) {
          setInterval(() => this.getContainerLog(api, pod, c.name), 5000)
        }
        for (let c of pod.spec.initContainers) {
          setInterval(() => this.getContainerLog(api, pod, c.name), 5000)
        }
      },
      async getContainerLog (api, pod, containerName) {
        const logs = await api.readNamespacedPodLog(pod.metadata.name, pod.metadata.namespace, containerName, false, 1024, null, false, 120)
        if (logs.body !== undefined) {
          this.lines = [...this.lines, ...(logs.body.split('\n'))]
        }
      }
    }
  }
</script>

<style scoped>

</style>
