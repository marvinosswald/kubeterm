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
    console.log(namespace)
    commit('setCurrentNamespace', { namespace: namespace.metadata.name })
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
