<template>
  <div id="app">
    <el-container>
      <el-container>
        <el-aside width="65px">
          <Menu></Menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <modal name="select-namespace" :width="300" :height="400">
      <SelectNamespace></SelectNamespace>
    </modal>
    <dialogs-wrapper transition-name="fade"></dialogs-wrapper>
    <GlobalEvents
            @keyup.ctrl.n="openSelectNamespaceModal"
    />
    <StatusBar></StatusBar>
  </div>
</template>

<script>
  import SelectNamespace from './components/Dialogs/SelectNamespace'
  import StatusBar from './components/StatusBar'
  import {mapActions} from 'vuex'
  import Menu from './components/Elements/Menu'
  export default {
    name: 'kubeterm',
    components: {Menu, StatusBar, SelectNamespace},
    methods: {
      openSelectNamespaceModal () {
        this.$modal.show('select-namespace')
      },
      ...mapActions({
        setCurrentNamespace: 'setCurrentNamespace'
      })
    },
    mounted () {
      //
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
  .dialog-mask
    position: fixed
    top: 0
    right: 0
    bottom: 0
    left: 0
    display: -ms-flexbox
    display: flex
    -ms-flex-align: center
    align-items: center
    -ms-flex-pack: center
    justify-content: center
    background-color: rgba(0,0,0,.33)
    .dialog-content
      margin: 0 20px
      padding: 20px 30px
      border: 1px solid #fff
      border-radius: 0
      background-color: #000
      min-width: 240px
      text-align: center
      font-size: 16px
      color: #fff
      .dialog-body
        color: red
      header
        margin: 10px 0 10px
        font-size: 18px
        font-weight: 700
      footer
        margin: 5px 0
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
  .el-main
    padding: 0 !important
</style>
