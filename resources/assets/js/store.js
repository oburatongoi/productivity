require('es6-promise').polyfill();
import Vue from 'vue'
import Vuex from 'vuex'

import Home from './modules/home'
import Folders from './modules/folders'
import Checklists from './modules/checklists'
import Search from './modules/search'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Home,
        Folders,
        Checklists,
        Search
    }
})
