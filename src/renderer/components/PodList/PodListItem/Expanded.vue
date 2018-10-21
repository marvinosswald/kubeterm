<template>
    <div class="expanded-content">
        <Containers v-if="active === 'f2'" :containers="pod.status.containerStatuses"></Containers>
        <Details v-if="active === 'f1'" :pod="pod"></Details>
        <Events v-if="active === 'f3'" :pod="pod"></Events>
        <div class="menu">
            <a href="#" :class="{active: active === 'f1'}">F1: Details</a> |
            <a href="#" :class="{active: active === 'f2'}">F2: Containers</a> |
            <a href="#" :class="{active: active === 'f3'}">F3: Events</a>
        </div>
    </div>
</template>

<script>
  import Containers from './Containers'
  import Details from './Details'
  import Events from './Events'
  import { mapState } from 'vuex'
  export default {
    name: 'Expanded',
    props: ['pod'],
    data () {
      return {
      }
    },
    components: {Events, Details, Containers},
    computed: {
      ...mapState({
        active: state => state.pods.expandedView
      })
    }
  }
</script>

<style scoped lang="sass">
.expanded-content
    margin: 0 -5px 0 15px
    padding: 5px
    display: block
    border: 1px #fff dashed
    .menu
        margin-top: 10px
        padding-top: 4px
        border-top: 1px dashed #fff
    .labels
        margin-top: 5px
        ul
            margin-left: 15px
        li
            text-align: left
a
    text-decoration: none
    color: #fff
    &:hover, &.active
        background: #fff
        color: black
</style>
