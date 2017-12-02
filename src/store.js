import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: false,
    user: undefined,
    loading: false
  },
  mutations: {
    login (state, payload) {
      state.token = payload.token
      state.user = payload.user
    },
    logout (state) {
      state.token = false
      state.user = undefined
    },
    showLoading (state) {
      state.loading = true
    },
    hideLoading (state) {
      state.loading = false
    }
  }
})