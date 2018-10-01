<template>
    <div>
        <vue-circle :progress="100"
                    :size="15"
                    :reverse="false"
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
        return {color: this.colors[this.pod.status.phase] || 'grey'}
      }
    },
    data () {
      return {
        colors: {
          'Running': '#4BD28F',
          'Failed': '#FF4D4D',
          'CrashLoopBackOff': '#FF4D4D',
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
    .status
        height: 15px
    .active
        .label
            background: #e6375a
</style>
