import {
    SET_CREATING_NEW,
    TOGGLE_BUTTONS,
} from '../mutations'

const state = {
    user: Productivity.user,
    creatingNew: undefined,
    showButtons: false,
    currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {}
}

const mutations = {
    [SET_CREATING_NEW] (state, model) {
        state.creatingNew = model
    },
    [TOGGLE_BUTTONS] (state) {
        state.showButtons = ! state.showButtons
    },
}

const actions = {
    createNew({ commit }, model) {
        commit(SET_CREATING_NEW, model)
    },
    toggleButtons({ commit }) {
        commit(TOGGLE_BUTTONS)
    },
}

const getters = {
    creatingNew: state => state.creatingNew,
    currentFolder: state => state.currentFolder,
    showButtons: state => state.showButtons,
    user: state => state.user
}

export default {
    state,
    mutations,
    actions,
    getters
}
