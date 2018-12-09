<template>
    <div>
        <Search
                @keydown.native.up="up"
                @keydown.native.down="down"
                @keyup.native.ctrl.l="openLogs"
                @keyup.native.ctrl.d="deletePod"
                @keyup.native.ctrl.e="edit"
                @keyup.native.ctrl.m="mode === 'list' ? mode = 'dots' : mode = 'list'"
                @keyup.native.F1="toggleExpanded('f1')"
                @keyup.native.F2="toggleExpanded('f2')"
                @keyup.native.F3="toggleExpanded('f3')"
                @keyup.native.F4="toggleExpanded('f4')"
                @keyup.native.F8="openTreeView()"
                v-on:input="setSearchInput"
                v-on:filter="applyFilter"
                :filterOptions="this.flatTree(this.filteredItems[0])"
                ref="search"
        />
        <ul class="list" v-if="mode === 'list'">
            <li v-for="(pod, index) in filteredItems" :key="pod.metadata.name">
                <PodListItem
                        :pod="pod"
                        :index="index"
                        :ns-label="currentNamespace === null"
                        :class="{active: podIsActive(pod)}"
                        v-on:beenClicked="selectedIndex = index"
                        v-on:beenClickedRight="toggleExpanded()"
                ></PodListItem>
            </li>
        </ul>
        <div class="dots" v-if="mode === 'dots'">
            <div v-for="(pod, index) in filteredItems" :key="pod.metadata.uid">
                <Status class="dot" :pod="pod"></Status>
            </div>
        </div>
        <div v-if="error || pods.length === 0" class="error">
            <div class="push-top"></div>
            <div class="error-body" v-if="error">
                <font-awesome-icon :icon="error.icon" size="6x"/>
                <span>{{error.message}}</span>
            </div>
            <div class="error-body" v-if="pods.length === 0">
                <font-awesome-icon icon="ban" size="6x"/>
                <span>No items found</span>
            </div>
        </div>
    </div>
</template>

<script>
  import podsRepo from '../repos/pods'
  import PodListItem from './PodList/PodListItem'
  import { mapState, mapActions } from 'vuex'
  import Confirm from './Dialogs/Confirm'
  import SelectResource from './Dialogs/SelectResource'
  import { create } from 'vue-modal-dialogs'
  import Search from './Elements/Search'
  import Status from './PodList/PodListItem/Status'
  const K8s = require('@kubernetes/client-node')
  const kc = new K8s.KubeConfig()
  kc.loadFromDefault()
  export default {
    components: {
      Status,
      Search,
      PodListItem
    },
    name: 'PodList',
    data () {
      return {
        watcher: undefined,
        error: undefined,
        selectedPods: [],
        search: '',
        filter: [],
        mode: 'list'
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
        pods: state => state.pods.pods,
        expanded: state => state.pods.expanded,
        expandedView: state => state.pods.expandedView
      })
    },
    watch: {
      currentNamespace () {
        this.startWatcher()
      }
    },
    methods: {
      pairsInObject (obj, pairs) {
        const flattend = this.flatTree(obj)
        const keys = Object.keys(flattend)
        for (let pair of pairs) {
          let i = keys.indexOf(pair.key.toLowerCase())
          if (i === -1 || flattend[keys[i]] !== pair.value) {
            return false
          }
        }
        return true
      },
      flatTree (tree) {
        if (tree) {
          const makeFlat = (o) => {
            if (o) {
              return [].concat(...Object.keys(o).map(k => typeof o[k] === 'object' ? makeFlat(o[k]) : {[k.toLowerCase()]: o[k]}))
            }
          }
          return Object.assign({}, ...makeFlat(tree))
        }
        return null
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
        console.log(resource)
        /* const { stdout, stderr } = await exec('kubectl edit deploy keycloak')
        stdout.on('data', (data) => {
          console.log(data)
        })
        console.log('stdout:', stdout)
        console.log('stderr:', stderr) */
      },
      toggleExpanded (functionKey) {
        if (this.selectedPods.length === 1 && this.expanded !== this.selectedPods[0]) {
          this.setExpandedPod(this.selectedPods[0])
        } else if (this.expanded === this.selectedPods[0] && functionKey === this.expandedView) {
          this.setExpandedPod(undefined)
        }
        this.setExpandedView(functionKey)
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
          podsRepo.deletePod(pod)
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
      startWatcher () {
        if (this.watcher !== undefined) {
          this.watcher.abort()
        }
        this.resetPods()
        this.selectedIndex = undefined
        this.error = undefined
        this.getWatcher(this.currentNamespace,
          (err) => {
            if (err && err !== null) {
              console.error(err)
              if (err.toString().search('ENOTFOUND') !== -1) {
                this.error = {
                  icon: 'plug',
                  message: 'No connection'
                }
              }
              this.startWatcher()
            }
          })
          .then((watcher) => {
            this.watcher = watcher
          })
        this.$refs.search.focus()
      },
      ...mapActions({
        addPod: 'pods/add',
        updatePod: 'pods/update',
        removePod: 'pods/remove',
        resetPods: 'pods/reset',
        getWatcher: 'pods/getWatcher',
        setExpandedPod: 'pods/setExpanded',
        setExpandedView: 'pods/setExpandedView'
      })
    },
    mounted () {
      this.startWatcher()
    }
  }
</script>

<style scoped lang="sass">
    .dots
        padding: 15px
        display: flex
        flex-direction: row
        width: 100vw
        flex-wrap: wrap
        .dot
            margin: 5px
    ul
        list-style-type: none
        margin: 0
        padding: 5px
    .error
        width: 100%
        margin-top: 10vh
        display: flex
        align-items: center
        justify-content: center
        .top-push
            align-self: flex-start
            max-width: 50%
        .error-body
            max-width: 50%
            display: flex
            flex-direction: column
            svg
                margin-left: auto
                margin-right: auto
                margin-bottom: 10px
</style>
