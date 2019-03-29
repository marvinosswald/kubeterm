import namespaces from '../../repos/namespaces'

const state = {
  namespaces: []
}

const mutations = {
  setNamespaces (state, namespaces) {
    state.namespaces = namespaces
  }
}

const actions = {
  getAll ({ commit }) {
    namespaces.getAll().then((res) => {
      commit('setNamespaces', res.body.items)
    })
  }
}

const getters = {
  getNamespaces: (state, getters, rootState) => {
    return state.namespaces
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
