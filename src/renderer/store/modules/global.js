const state = {
  currentNamespace: 'default',
  context: ''
}

const mutations = {
  setCurrentNamespace (state, { namespace }) {
    state.currentNamespace = namespace
  }
}

const actions = {
  setCurrentNamespace ({ commit }, namespace) {
    commit('setCurrentNamespace', { namespace: namespace.metadata.name })
  },
  setCurrentNamespaceByString ({commit}, payload) {
    commit('setCurrentNamespace', payload)
  }
}

const getters = {
  currentNamespace: (state, getters, rootState) => {
    return state.currentNamespace
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
