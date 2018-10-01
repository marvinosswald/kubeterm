<template>
    <div class="list-item-inner">
        <vue-circle :progress="readyPercent"
                    :size="15"
                    :reverse="true"
                    line-cap="square"
                    :fill="statusColor"
                    empty-fill="rgba(0, 0, 0, .6)"
                    :animation-start-value="1.0"
                    :start-angle="0"
                    insert-mode="append"
                    :thickness="2"
                    :show-percent="false"
                    class="status"
        ></vue-circle>
        <span class="label">
            {{pod.metadata.name}}
        </span>
        <span class="restarts">
            {{pod.status.containerStatuses[0].restartCount}}
        </span>
        <span class="age">
            {{pod.status.startTime | moment("from", "now", true)}}
        </span>
    </div>
</template>

<script>
  import VueCircle from 'vue2-circle-progress'
  export default {
    components: {
      VueCircle
    },
    name: 'PodListItem',
    props: ['pod', 'index'],
    computed: {
      statusColor () {
        if (this.pod.metadata.deletionTimestamp) {
          return {color: this.colors['Terminating']}
        }
        return {color: this.colors[this.pod.status.phase] || 'grey'}
      },
      readyPercent () {
        const total = this.pod.status.containerStatuses.length
        const ready = this.pod.status.containerStatuses.filter((container) => {
          return container.ready === true
        }).length
        return ready / total * 100
      }
    },
    data () {
      return {
        colors: {
          'Running': '#4BD28F',
          'Failed': '#FF4D4D',
          'CrashLoopBackOff': '#FF4D4D',
          'Error': '#FF4D4D',
          'Pending': '#FFAA00',
          'ContainerCreating': '#FFAA00',
          'Terminating': '#0194FF'
        }
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
        .list-item-inner
            display: flex
            flex-direction: row
    .status
        align-self: flex-start
        height: 15px
        padding-right: 5px
    .label
        align-self: flex-start
        flex-grow: 1
    .restarts
        min-width: 5vw
    .active
        .label
            background: #e6375a
    .age
        align-self: flex-end
        min-width: 12vw
    .icon
        color: #fff
</style>
