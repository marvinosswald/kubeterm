<template>
    <div>
        <input type="text" class="minimal"
               autofocus
               ref="search"
               @keydown.up="up"
               @keydown.down="down"
               @keyup.enter="submit"
               v-model="search">
        <ul>
            <li v-for="(ns, index) in filteredItems" :class="{active: index === selectedIndex}">
                <span class="label">
                    {{ns.metadata.name}}
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  export default {
    name: 'SelectNamespace',
    data () {
      return {
        selectedIndex: undefined,
        search: ''
      }
    },
    computed: {
      filteredItems () {
        return [...this.namespaces, ...[{metadata: {name: 'all-namespaces'}}]].filter((item) => {
          this.selectedIndex = undefined
          return item.metadata.name.indexOf(this.search) !== -1
        }).sort((a, b) => {
          if (a.metadata.name < b.metadata.name) {
            return -1
          } else if (a.metadata.name > b.metadata.name) {
            return 1
          }
          return 0
        })
      },
      ...mapState({
        namespaces: state => state.namespaces.namespaces
      })
    },
    methods: {
      up () {
        this.setSelectedIndex(this.selectedIndex - 1)
      },
      down () {
        this.setSelectedIndex(this.selectedIndex + 1)
      },
      submit () {
        if (this.filteredItems.length === 1) {
          this.selectedIndex = 0
        }
        let ns = this.filteredItems[this.selectedIndex]
        if (ns.metadata.name === 'all-namespaces') {
          ns.metadata.name = null
        }
        this.setCurrentNamespace(ns)

        this.$modal.hide('select-namespace')
      },
      setSelectedIndex (value) {
        if (this.selectedIndex !== undefined && value >= 0 && value < Object.keys(this.filteredItems).length) {
          this.selectedIndex = value
        } else if (this.selectedIndex === undefined) {
          this.selectedIndex = 0
        }
      },
      ...mapActions({
        setCurrentNamespace: 'setCurrentNamespace',
        getAllNamespaces: 'namespaces/getAll'
      })
    },
    mounted () {
      this.getAllNamespaces().then(() => this.$refs.search.focus())
    }
  }
</script>

<style scoped lang="sass">
    .active
        .label
            background: #e6375a
</style>
