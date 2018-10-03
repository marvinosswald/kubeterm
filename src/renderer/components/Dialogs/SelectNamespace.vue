<template>
    <div>
        <input type="text" class="minimal"
               autofocus
               ref="search"
               @keyup.up="up"
               v-model="search"
               @keyup.down="down"
                @keyup.enter="submit">
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
  import { mapActions } from 'vuex'
  const k8s = require('@kubernetes/client-node')
  export default {
    name: 'SelectNamespace',
    data () {
      return {
        items: [],
        selectedIndex: undefined,
        search: ''
      }
    },
    computed: {
      filteredItems () {
        return this.items.filter((item) => {
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
      }
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
        this.setCurrentNamespace(this.filteredItems[this.selectedIndex])
        this.$modal.hide('select-namespace')
      },
      setSelectedIndex (value) {
        if (this.selectedIndex !== undefined && value >= 0 && value < Object.keys(this.items).length) {
          this.selectedIndex = value
        } else if (this.selectedIndex === undefined) {
          this.selectedIndex = 0
        }
      },
      ...mapActions([
        'setCurrentNamespace'
      ])
    },
    mounted () {
      const kc = new k8s.KubeConfig()
      kc.loadFromDefault()

      const k8sApi = kc.makeApiClient(k8s.Core_v1Api)

      k8sApi.listNamespace().then((res) => {
        this.items = res.body.items
        this.$refs.search.focus()
      })
    }
  }
</script>

<style scoped lang="sass">
    .active
        .label
            background: #e6375a
</style>
