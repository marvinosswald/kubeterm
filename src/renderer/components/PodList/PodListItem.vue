<template>
    <div class="list-item-inner container" @click.left="$emit('beenClicked')" @click.right="$emit('beenClickedRight')">
        <div class="row">
            <div class="status">
                <status-indicator :active="isActive" :positive="isPositive" :intermediary="isIntermediary" :negative="isNegative" :pulse="isActive || isNegative || isIntermediary" ></status-indicator>
            </div>
            <div class="label">
                <span class="workload">{{workload}}</span>-<span class="ownerReference">{{ownerReference}}</span>-{{podName}}
            </div>
            <span class="restarts">
                {{pod.status.containerStatuses ? pod.status.containerStatuses[0].restartCount : ''}}
            </span>
            <span class="age">
            {{pod.status.startTime | moment("from", "now", true)}}
        </span>
        </div>
        <div class="expanded-content container" v-if="expanded">
            <div class="row space-between">
                <span><span class="key">Phase</span> {{pod.status.phase}}</span>
                <span><span class="key">Ready</span> {{readyState.label}}</span>
                <span><span class="key">Host</span> {{pod.status.hostIP}}</span>
            </div>
            <div class="column labels">
                <span class="key">
                    Labels
                </span>
                <ul>
                    <li v-for="(value, key) in pod.metadata.labels">
                        {{key}}: <span class="value">{{value}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
  import { StatusIndicator } from 'vue-status-indicator'
  import 'vue-status-indicator/styles.css'

  export default {
    components: {
      StatusIndicator
    },
    name: 'PodListItem',
    props: ['pod', 'index', 'expanded'],
    computed: {
      isNegative () {
        const state = this.pod.status.phase
        return state === 'Failed' || state === 'CrashLoopBackOff' || state === 'Error'
      },
      isPositive () {
        const state = this.pod.status.phase
        return (state === 'Running' || state === 'Completed' || state === 'Succeeded') && this.pod.metadata.deletionTimestamp === undefined && this.readyState.percent === 100
      },
      isIntermediary () {
        const state = this.pod.status.phase
        return state === 'Pending' || state === 'ContainerCreating' || this.readyState.percent !== 100
      },
      isActive () {
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
    .restarts
        min-width: 5vw
    .active
        .label
            background: #e6375a
    .age
        align-self: flex-end
        min-width: 12vw
    .key
        background: #99AAB5
    .expanded-content
        margin: 0 0 0 15px
        padding: 5px
        display: block
        border: 1px #fff dashed
        .labels
            margin-top: 5px
            ul
                margin-left: 15px
            li
                text-align: left
    .container
        display: flex
        flex-direction: column
        .column
            flex-direction: column
        .row
            display: flex
            flex-direction: row
        .space-between
            justify-content: space-between
</style>
