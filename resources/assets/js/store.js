require('es6-promise').polyfill();
import Vue from 'vue'
import Vuex from 'vuex'

import selection from './modules/selection'
import folders from './modules/folders'
import checklists from './modules/checklists'
import search from './modules/search'
import mover from './modules/mover'
import notices from './modules/notices'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        selection,
        folders,
        checklists,
        search,
        mover,
        notices
    }
})
