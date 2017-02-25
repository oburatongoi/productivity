import {
    SET_CREATING_NEW,
    TOGGLE_BUTTONS,
    SELECT_LISTING,
    DESELECT_LISTING,
    TOGGLE_MOVABLE
} from '../mutations'

const state = {
    user: Productivity.user,
    creatingNew: undefined,
    showButtons: false,
    ancestors: Productivity.ancestors ? Productivity.ancestors : {},
    currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {},
    selected: {
        id: undefined,
        model: undefined,
        listing: {},
        movable: false
    }
}

const mutations = {
    [SET_CREATING_NEW] (state, model) {
        state.creatingNew = model
    },
    [TOGGLE_BUTTONS] (state) {
        state.showButtons = ! state.showButtons
    },
    [TOGGLE_MOVABLE] (state) {
        state.selected.movable = ! state.selected.movable
    },
    [SELECT_LISTING] (state, payload) {
        state.selected.model = payload.model
        state.selected.id = payload.id
        state.selected.listing = payload.listing
    },
    [DESELECT_LISTING] (state) {
        state.selected.model = undefined
        state.selected.id = undefined
        state.selected.listing = {}
        state.selected.movable = false
    },
}

const actions = {
    createNew({ commit }, model) {
        commit(SET_CREATING_NEW, model)
    },
    toggleButtons({ commit }) {
        commit(TOGGLE_BUTTONS)
    },
    toggleMovable({ commit }) {
        commit(TOGGLE_MOVABLE)
    },
    selectListing: function({ commit }, payload) {
      commit(SELECT_LISTING, payload)
    },
    deselectListing: function({ commit }) {
      commit(DESELECT_LISTING)
    },
}

const getters = {
    creatingNew: state => state.creatingNew,
    currentFolder: state => state.currentFolder,
    showButtons: state => state.showButtons,
    user: state => state.user,
    ancestors: state => state.ancestors,
    selected: state => state.selected
}

export default {
    state,
    mutations,
    actions,
    getters
}
