import Vue from 'vue'
import Vuex from 'vuex'

import Home from './modules/home'
import Folders from './modules/folders'
import Checklists from './modules/checklists'
import Notes from './modules/notes'
import Goals from './modules/goals'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Home,
        Folders,
        Checklists,
        Notes,
        Goals,
    }
})
