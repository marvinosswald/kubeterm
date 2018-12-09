<template>
    <ul class="events">
        <li v-for="event in events" v-bind:class="{error: event.message.indexOf('Error') !== -1}">
            {{event.message}}
        </li>
    </ul>
</template>

<script>
  import pods from '../../../repos/pods'
  export default {
    name: 'Events',
    props: ['pod'],
    data () {
      return {
        events: []
      }
    },
    mounted () {
      pods.getEvents(this.pod).then((res) => {
        this.events = res.body.items
      }).catch((err) => {
        console.error(err)
      })
    }
  }
</script>

<style scoped lang="sass">
    .events
        margin-left: 15px
        li
            margin-left: 15px
            &.error
                color: red
</style>
