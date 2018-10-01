<template>
  <div id="app">
    <router-view></router-view>
    <modal name="select-namespace" :width="300" :height="400">
      <SelectNamespace></SelectNamespace>
    </modal>
    <GlobalEvents
            @keyup.ctrl.n="openSelectNamespaceModal"
    />
    <StatusBar></StatusBar>
  </div>
</template>

<script>
  import SelectNamespace from './components/Dialogs/SelectNamespace'
  import StatusBar from './components/StatusBar'
  export default {
    name: 'kubeit',
    components: {StatusBar, SelectNamespace},
    methods: {
      openSelectNamespaceModal () {
        this.$modal.show('select-namespace')
      }
    }
  }
</script>

<style lang="sass">
  #app
    min-height: 100vh
    width: 100vw
    display: flex
    flex-direction: column
  .v--modal-box.v--modal
    background-color: #23272A
    border: 1px #fff solid
    border-radius: 0
  input.minimal
    width: 100%
    height: 30px
    background: rgba(0,0,0,0)
    border: 0
    color: #fff
    padding-left: 10px
    border-bottom: 1px rgba(255,255,255,0.5) solid
</style>
