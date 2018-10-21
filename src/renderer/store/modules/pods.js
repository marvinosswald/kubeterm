const state = {
  pods: [],
  expanded: {},
  expandedView: 'f1'
}

const mutations = {
  add (state, pod) {
    state.pods.push(pod)
  },
  update (state, pod) {
    // const i = state.pods.findIndex(x => x.metadata.name === pod.metadata.name)
    state.pods = [
      ...state.pods.filter(x => x.metadata.name !== pod.metadata.name),
      pod
    ]
  },
  remove (state, pod) {
    const i = state.pods.findIndex(x => x.metadata.name === pod.metadata.name)
    state.pods.splice(i, 1)
  },
  reset (state) {
    state.pods = []
  },
  setExpanded (state, pod) {
    state.expanded = pod
  },
  setExpandedView (state, functionKey) {
    state.expandedView = functionKey
  }
}

const actions = {
  add ({commit}, pod) {
    commit('add', pod)
  },
  update ({commit}, pod) {
    commit('update', pod)
  },
  remove ({commit}, pod) {
    commit('remove', pod)
  },
  reset ({commit}) {
    commit('reset')
  },
  setExpanded ({commit}, pod) {
    commit('setExpanded', pod)
  },
  setExpandedView ({commit}, functionKey) {
    commit('setExpandedView', functionKey)
  }
}

const getters = {
  getPods: (state, getters, rootState) => {
    return state.pods
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
