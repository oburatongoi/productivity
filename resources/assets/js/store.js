require('es6-promise').polyfill();
import Vue from 'vue'
import Vuex from 'vuex'

import home from './modules/home'
import folders from './modules/folders'
import checklists from './modules/checklists'
import search from './modules/search'
import notices from './modules/notices'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        home,
        folders,
        checklists,
        search,
        notices
    }
})
