const K8s = require('@kubernetes/client-node')
const kc = new K8s.KubeConfig()
kc.loadFromDefault()

const state = {
  nodes: []
}

const mutations = {
  add (state, node) {
    state.nodes.push(node)
  },
  update (state, node) {
    // const i = state.nodes.findIndex(x => x.metadata.name === node.metadata.name)
    state.nodes = [
      ...state.nodes.filter(x => x.metadata.name !== node.metadata.name),
      node
    ]
  },
  remove (state, node) {
    const i = state.nodes.findIndex(x => x.metadata.name === node.metadata.name)
    state.nodes.splice(i, 1)
  },
  reset (state) {
    state.nodes = []
  }
}

const actions = {
  add ({commit}, node) {
    commit('add', node)
  },
  update ({commit}, node) {
    commit('update', node)
  },
  remove ({commit}, node) {
    commit('remove', node)
  },
  reset ({commit}) {
    commit('reset')
  },
  async getWatcher ({commit}, doneCb) {
    return new K8s.Watch(kc).watch(
      '/api/v1/nodes',
      {}, (type, node) => {
        if (type === 'ADDED') {
          commit('add', node)
        } else if (type === 'MODIFIED') {
          commit('update', node)
        } else if (type === 'DELETED') {
          commit('remove', node)
        } else {
          console.log('unknown type: ' + type)
        }
      }, doneCb)
  }
}

const getters = {
  getNodes: (state, getters, rootState) => {
    return state.nodes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
