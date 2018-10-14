<template>
    <div>
        <Search
                @keydown.native.up="up"
                @keydown.native.down="down"
                @keyup.native.ctrl.l="openLogs"
                @keyup.native.ctrl.d="deletePod"
                @keyup.native.ctrl.e="edit"
                @keyup.native.F1="toggleExpanded()"
                @keyup.native.F8="openTreeView()"
                v-on:input="setSearchInput"
                v-on:filter="applyFilter"
                ref="search"
        />
        <ul class="list">
            <li v-for="(pod, index) in filteredItems" :key="pod.metadata.name">
                <PodListItem
                        :pod="pod"
                        :index="index"
                        :class="{active: podIsActive(pod)}"
                        :expanded="pod === expanded"
                        v-on:beenClicked="selectedIndex = index"
                        v-on:beenClickedRight="toggleExpanded()"
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
  import SelectResource from './Dialogs/SelectResource'
  import { create } from 'vue-modal-dialogs'
  import Search from './Elements/Search'
  // const { exec } = require('child_process')
  const K8s = require('@kubernetes/client-node')
  const kc = new K8s.KubeConfig()
  kc.loadFromDefault()
  export default {
    components: {
      Search,
      PodListItem
    },
    name: 'PodList',
    data () {
      return {
        watcher: undefined,
        selectedPods: [],
        expanded: undefined,
        search: '',
        filter: []
      }
    },
    computed: {
      filteredItems () {
        let items = this.pods.filter((pod) => {
          this.selectedPods = []
          return pod.metadata.name.indexOf(this.search) !== -1
        })
        if (this.filter.length !== 0) {
          items = items.filter((pod) => this.pairsInObject(pod, this.filter))
        }
        items = items.sort((a, b) => {
          if (a.metadata.name < b.metadata.name) {
            return -1
          } else if (a.metadata.name > b.metadata.name) {
            return 1
          }
          return 0
        })
        return items
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
      pairsInObject (obj, pairs) {
        const _flatten = (o) => [].concat(...Object.keys(o).map(k => typeof o[k] === 'object' ? _flatten(o[k]) : ({[k]: o[k]})))
        const flattend = Object.assign({}, ..._flatten(obj))
        console.log(flattend)

        return true
      },
      applyFilter (filter) {
        this.filter = filter
      },
      setSearchInput (input) {
        this.search = input
      },
      podIsActive (pod) {
        return this.selectedPods.includes(pod)
      },
      async edit () {
        console.log('test')
        const resourceDialog = create(SelectResource, 'items')
        let resource = resourceDialog([{label: 'a'}, {label: 'b'}])
        alert(resource)
        /* const { stdout, stderr } = await exec('kubectl edit deploy keycloak')
        stdout.on('data', (data) => {
          console.log(data)
        })
        console.log('stdout:', stdout)
        console.log('stderr:', stderr) */
      },
      // todo: refactor to use array
      toggleExpanded () {
        if (this.selectedPods.length === 1 && this.expanded !== this.selectedPods[0]) {
          this.expanded = this.selectedPods[0]
        } else if (this.expanded === this.selectedPods[0]) {
          this.expanded = undefined
        }
      },
      openLogs () {
        localStorage.setItem('LogsOfPodsToWatch', JSON.stringify(this.selectedPods))
        window.open('/#log-monitor')
      },
      openTreeView () {
        if (this.selectedPods.length === 1) {
          const pod = this.selectedPods[0]
          localStorage.setItem(pod.metadata.uid, JSON.stringify(pod))
          window.open('/#json-tree-view?uid=' + pod.metadata.uid)
        }
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
        this.setPreviousPod()
      },
      down () {
        this.setNextPod()
      },
      setNextPod () {
        if (this.selectedPods === []) {
          this.selectedPods = [this.filteredItems[0]]
        } else {
          const pod = this.selectedPods[this.selectedPods.length - 1]
          const currentPodIndex = this.filteredItems.indexOf(pod)
          if (currentPodIndex < this.filteredItems.length - 1) {
            this.selectedPods = [this.filteredItems[currentPodIndex + 1]]
          }
        }
      },
      setPreviousPod () {
        if (this.selectedPods !== []) {
          const pod = this.selectedPods[this.selectedPods.length - 1]
          const currentPodIndex = this.filteredItems.indexOf(pod)
          if (currentPodIndex !== 0) {
            this.selectedPods = [this.filteredItems[currentPodIndex - 1]]
          }
        }
      },
      setSelectedIndex (value) {
        if (this.selectedIndex !== undefined && value >= 0 && value < Object.keys(this.pods).length) {
          this.selectedIndex = value
        } else if (this.selectedIndex === undefined) {
          this.selectedIndex = 0
        }
      },
      getWatcher (resource, params = {}, cb, doneCb) {
        let watch = new K8s.Watch(kc)
        if (this.watcher !== undefined) {
          this.watcher.abort()
        }
        this.resetPods()
        this.selectedIndex = undefined
        this.watcher = watch.watch(resource, params, cb, doneCb)
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
            this.startWatcher()
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
