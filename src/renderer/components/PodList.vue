<template>
    <div>
        <input type="text" class="minimal"
               @keyup.up="up"
               @keyup.down="down"
               @keyup.l="openLogs"
               v-model="search">
        <ul class="list">
            <li v-for="(pod, index) in filteredItems" :key="pod.metadata.name">
                <PodListItem :pod="pod" :index="index" :class="{active: index === selectedIndex}"></PodListItem>
            </li>
            <li v-if="pods.length === 0">
                No data
            </li>
        </ul>
    </div>
</template>

<script>
  import PodListItem from './PodList/PodListItem'
  import { mapGetters } from 'vuex'
  const K8s = require('@kubernetes/client-node')
  export default {
    components: {
      PodListItem
    },
    name: 'PodList',
    data () {
      return {
        pods: [],
        watcher: undefined,
        selectedIndex: undefined,
        search: ''
      }
    },
    computed: {
      ...mapGetters({
        currentNamespace: 'currentNamespace'
      }),
      filteredItems () {
        return this.pods.filter((pod) => {
          return pod.metadata.name.indexOf(this.search) !== -1
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
    watch: {
      currentNamespace () {
        this.startWatcher()
      }
    },
    methods: {
      openLogs () {

      },
      up () {
        this.setSelectedIndex(this.selectedIndex - 1)
      },
      down () {
        this.setSelectedIndex(this.selectedIndex + 1)
      },
      setSelectedIndex (value) {
        if (this.selectedIndex !== undefined && value >= 0 && value < Object.keys(this.pods).length) {
          this.selectedIndex = value
        } else if (this.selectedIndex === undefined) {
          this.selectedIndex = 0
        }
      },
      getWatcher (resource, params = {}, cb, errCb) {
        const kc = new K8s.KubeConfig()
        kc.loadFromDefault()
        let watch = new K8s.Watch(kc)
        if (this.watcher !== undefined) {
          this.watcher.abort()
          this.pods = []
          this.selectedIndex = undefined
        }
        this.watcher = watch.watch(resource, params, cb, errCb)
        return this.watcher
      },
      startWatcher () {
        this.getWatcher(`/api/v1/namespaces/${this.currentNamespace}/pods`,
          // optional query parameters can go here.
          {},
          // callback is called for each received object.
          (type, obj) => {
            if (type === 'ADDED') {
              this.pods.push(obj)
            } else if (type === 'MODIFIED') {
              for (const [i, pod] in this.pods.entries()) {
                if (pod.metadata.name === obj.metadata.name) {
                  this.$set(this.pods, i, obj)
                }
              }
            } else if (type === 'DELETED') {
              for (const [i, pod] in this.pods.entries()) {
                if (pod.metadata.name === obj.metadata.name) {
                  this.pods.splice(i, 1)
                }
              }
            } else {
              console.log('unknown type: ' + type)
            }
          },
          // done callback is called if the watch terminates normally
          (err) => {
            if (err) {
              console.log(err)
            }
          })
      }
    },
    mounted () {
      this.startWatcher()
    }
  }
</script>

<style scoped lang="sass">
    ul
        list-style-type: none
        margin: 0
        padding: 5px
</style>
