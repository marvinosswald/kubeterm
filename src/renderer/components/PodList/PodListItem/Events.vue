<template>
    <ul>
        <li v-for="event in events">
            {{event}}
        </li>
    </ul>
</template>

<script>
  export default {
    name: 'Events',
    data: {
      events: []
    },
    mounted () {

    }
  }
</script>

<style scoped>

</style>
