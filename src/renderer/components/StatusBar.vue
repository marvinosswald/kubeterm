<template>
    <div class="statusbar">
        Namespace: {{currentNamespace}}
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'StatusBar',
    computed: {
      ...mapGetters({
        currentNamespace: 'currentNamespace'
      })
    }
  }
</script>

<style scoped lang="sass">
    .statusbar
        height: 30px
        padding: 0 5px
        border-top: 1px rgba(255,255,255,0.5) solid
        line-height: 30px
</style>
