<template>
    <div class="row space-between">
        <div class="status">
            <status-indicator :pulse="!isReady" :positive="isReady"></status-indicator>
        </div>
        <div class="label">
            <span class="workload">{{container.name}}</span>
        </div>
        <span class="restarts">
            {{container.restartCount}}
        </span>
        <span class="age">
        {{container.state.running ? container.state.running.startedAt : '' | moment("from", "now", true)}}
    </span>
    </div>
</template>

<script>
  import { StatusIndicator } from 'vue-status-indicator'
  import 'vue-status-indicator/styles.css'
  export default {
    name: 'Container',
    components: {
      StatusIndicator
    },
    props: ['container'],
    computed: {
      isReady () {
        return this.container.ready
      }
    }
  }
</script>

<style scoped lang="sass">
    .status
        align-self: flex-start
        height: 15px
        padding-right: 5px
    .label
        align-self: flex-start
        flex-grow: 1
        color: #fff
    .restarts
        min-width: 5vw
        color: orange
    .age
        align-self: flex-end
        min-width: 12vw
        color: grey
</style>
