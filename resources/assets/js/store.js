import Vue from 'vue'
import Vuex from 'vuex'

import Folders from './modules/folders'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        Folders
    }
})
