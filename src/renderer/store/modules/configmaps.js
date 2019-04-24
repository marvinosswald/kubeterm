import configmapRepo from '../../repos/configmaps'

const state = {
  items: []
}

const mutations = {
  setConfigMaps (state, configMaps) {
    state.items = configMaps
  }
}

const actions = {
  getAll ({ commit, rootState }) {
    configmapRepo.getAll(rootState.global.currentNamespace).then((res) => {
      commit('setConfigMaps', res.body.items)
    })
  }
}

const getters = {
  getConfigMaps: (state, getters, rootState) => {
    return state.items
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
}
