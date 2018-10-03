<template>
    <div>
        <input type="text" class="minimal"
               autofocus
               @keyup.up="up"
               @keyup.down="down"
               @keyup.ctrl.l="openLogs"
               @keyup.ctrl.d="deletePod"
               @keyup.F1="setExpandedIndex(selectedIndex)"
               v-model="search"
                ref="search">
        <ul class="list">
            <li v-for="(pod, index) in filteredItems" :key="pod.metadata.name">
                <PodListItem
                        :pod="pod"
                        :index="index"
                        :class="{active: index === selectedIndex}"
                        :expanded="index === expandedIndex"
                        v-on:beenClicked="selectedIndex = index"
                        v-on:beenClickedRight="setExpandedIndex(index)"
                ></PodListItem>
            </li>
            <li v-if="pods.length === 0">
                No data
            </li>
        </ul>
    </div>
</template>

<script>
  import pods from '../repos/pods'
  import PodListItem from './PodList/PodListItem'
  import { mapState, mapActions } from 'vuex'
  import Confirm from './Dialogs/Confirm'
  import { create } from 'vue-modal-dialogs'
  const K8s = require('@kubernetes/client-node')
  export default {
    components: {
      PodListItem
    },
    name: 'PodList',
    data () {
      return {
        watcher: undefined,
        selectedIndex: undefined,
        expandedIndex: undefined,
        search: ''
      }
    },
    computed: {
      filteredItems () {
        return this.pods.filter((pod) => {
          this.selectedIndex = undefined
          return pod.metadata.name.indexOf(this.search) !== -1
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
        currentNamespace: state => state.global.currentNamespace,
        pods: state => state.pods.pods
      })
    },
    watch: {
      currentNamespace () {
        this.startWatcher()
      }
    },
    methods: {
      setExpandedIndex (index) {
        this.expandedIndex === index ? this.expandedIndex = undefined : this.expandedIndex = this.selectedIndex = index
      },
      openLogs () {
        window.open('/#log-monitor')
      },
      async deletePod () {
        this.$refs.search.blur()
        const confirm = create(Confirm, 'title', 'content')
        const pod = this.filteredItems[this.selectedIndex]
        if (await confirm('Confirm deletion !', pod.metadata.name)) {
          pods.deletePod(pod)
        }
        this.$refs.search.focus()
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
        }
        this.resetPods()
        this.selectedIndex = undefined
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
              this.addPod(obj)
            } else if (type === 'MODIFIED') {
              this.updatePod(obj)
            } else if (type === 'DELETED') {
              this.removePod(obj)
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
        this.$refs.search.focus()
      },
      ...mapActions({
        addPod: 'pods/add',
        updatePod: 'pods/update',
        removePod: 'pods/remove',
        resetPods: 'pods/reset'
      })
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
