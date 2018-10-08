<template>
    <div>
        <input type='text' class='minimal'
               autofocus
               v-model='search'
               ref='search'/>
        <tree-view class="tree-view" :data='jsonFiltered' :options='treeViewOptions'></tree-view>
    </div>
</template>

<script>
  const jp = require('jsonpath')
  export default {
    name: 'JsonTreeView',
    data () {
      return {
        search: '',
        json: {'hello': 'world'},
        treeViewOptions: {
          maxDepth: 3
        }
      }
    },
    computed: {
      jsonFiltered () {
        if (this.search === '') {
          return this.json
        }
        return jp.query(this.json, this.search)
      }
    },
    mounted () {
      const uid = this.$route.query.uid
      const jsonString = localStorage.getItem(uid)
      this.json = JSON.parse(jsonString)
      localStorage.removeItem(uid)
    }
  }
</script>

<style lang="sass">
    .tree-view
        width: 100vw
        .tree-view-item-key
            color: #FF6188
        .tree-view-item-value
            color: #A9DC76
        .tree-view-item-hint
            color: #78DCE8

</style>
