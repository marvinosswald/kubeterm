<template>
    <div class="list-item-inner container" @click.left="$emit('beenClicked')" @click.right="$emit('beenClickedRight')">
        <div class="row">
            <div class="status">
                <status-indicator :active="isTerminated" :positive="isPositive" :intermediary="isIntermediary" :negative="isNegative" :pulse="isTerminated || isNegative || isIntermediary" ></status-indicator>
            </div>
            <div class="label">
                <span class="workload">{{workload}}</span>-<span class="ownerReference">{{ownerReference}}</span>-{{podName}}
            </div>
            <div class="ready">
                <span v-if="readyState.percent !== 100">
                    {{readyState.label}}
                </span>
            </div>
            <span class="restarts">
                <span v-if="restarts !== 0">
                    {{restarts}}
                </span>
            </span>
            <span class="age">
                {{pod.status.startTime | moment("from", "now", true)}}
            </span>
        </div>
        <Expanded v-if="expanded" :pod="pod"></Expanded>
    </div>
</template>

<script>
  import { StatusIndicator } from 'vue-status-indicator'
  import 'vue-status-indicator/styles.css'
  import Container from './PodListItem/Containers/Container'
  import Events from './PodListItem/Events'
  import Expanded from './PodListItem/Expanded'

  export default {
    components: {
      Expanded,
      Events,
      Container,
      StatusIndicator
    },
    name: 'PodListItem',
    props: ['pod', 'index', 'expanded'],
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
      restarts () {
        let restarts = 0
        for (let container of this.pod.status.containerStatuses) {
          restarts += container.restartCount
        }
        return restarts
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
      },
      workload () {
        const parts = this.pod.metadata.name.split('-')
        parts.pop()
        parts.pop()
        return parts.join('-')
      },
      ownerReference () {
        const parts = this.pod.metadata.name.split('-')
        return parts[parts.length - 2]
      },
      podName () {
        const parts = this.pod.metadata.name.split('-')
        return parts[parts.length - 1]
      }
    },
    data () {
      return {
      }
    },
    methods: {

    }
  }
</script>

<style scoped lang="sass">
    li
        line-height: 15px
        text-align: center
    .status
        align-self: flex-start
        height: 15px
        padding-right: 5px
    .label
        align-self: flex-start
        flex-grow: 1
        color: rgba(255,255,255,0.4)
        .ownerReference
            color: rgba(255,255,255,0.5)
        .workload
            color: #fff
    .container-label
        align-self: flex-start
        flex-grow: 1
        color: #fff
    .ready
        min-width: 10vw
        align-self: flex-end
    .restarts
        min-width: 5vw
        color: orange
    .active
        .label
            background: #e6375a
        .age
            color: #fff
        .restarts
            color: #fff
    .age
        align-self: flex-end
        min-width: 12vw
        color: grey
    .key
        background: #99AAB5
</style>
