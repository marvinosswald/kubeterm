<template>
    <status-indicator :active="isTerminated" :positive="isPositive" :intermediary="isIntermediary" :negative="isNegative" :pulse="isTerminated || isNegative || isIntermediary" ></status-indicator>
</template>

<script>
  import {StatusIndicator} from 'vue-status-indicator'
  export default {
    name: 'Status',
    props: ['pod'],
    components: {
      StatusIndicator
    },
    computed: {
      isNegative () {
        const state = this.pod.status.phase
        return !this.isTerminated && (state === 'Failed' || state === 'CrashLoopBackOff' || state === 'Error')
      },
      isPositive () {
        const state = this.pod.status.phase
        return !this.isTerminated && ((state === 'Running' || state === 'Completed' || state === 'Succeeded') && this.pod.metadata.deletionTimestamp === undefined && this.readyState.percent === 100)
      },
      isIntermediary () {
        const state = this.pod.status.phase
        return !this.isTerminated && (state === 'Pending' || state === 'ContainerCreating' || this.readyState.percent !== 100)
      },
      isTerminated () {
        return this.pod.metadata.deletionTimestamp !== undefined
      },
      readyState () {
        if (!this.pod.status.containerStatuses) {
          return 0
        }
        const total = this.pod.status.containerStatuses.length
        const ready = this.pod.status.containerStatuses.filter((container) => {
          return container.ready === true
        }).length
        return {
          percent: ready / total * 100,
          label: ready + '/' + total
        }
      }
    }
  }
</script>

<style scoped>

</style>
