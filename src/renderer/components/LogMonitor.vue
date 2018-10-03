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
        lines: []
      }
    },
    mounted () {
      this.getLogs()
    },
    methods: {
      async getLogs () {
        const kc = new K8s.KubeConfig()
        kc.loadFromDefault()
        let api = kc.makeApiClient(K8s.Core_v1Api)
        const logs = await api.readNamespacedPodLog('keycloak-57dd4ddd95-lxg24', 'default-testing', 'keycloak', true)
        logs.response.on('data', (e) => {
          console.log(e)
        }).catch((err) => console.error(err))
      }
    }
  }
</script>

<style scoped>

</style>
