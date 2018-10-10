// Weex is using native navigator to manage instance pages,
// the context of them are isolated.
// so just forget vuex!!!
// import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import preview from './modules/preview'
import profile from './modules/profile'

// Vuex is auto installed on the web
if (WXEnvironment.platform !== 'Web') {
  Vue.use(Vuex)
}
// Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    preview, profile
  },
  actions,

  state: { },

  getters: { }
})

export default store
