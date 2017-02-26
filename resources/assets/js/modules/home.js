import {
    SET_CREATING_NEW,
    TOGGLE_BUTTONS,
    SELECT_LISTING,
    DESELECT_LISTING,
    TOGGLE_DELETABLE,
    TOGGLE_MOVABLE
} from '../mutations'

const state = {
    user: Productivity.user,
    creatingNew: undefined,
    showButtons: false,
    ancestors: Productivity.ancestors ? Productivity.ancestors : {},
    selected: {
        id: undefined,
        model: undefined,
        listing: {},
        movable: false,
        deletable: false
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
    [TOGGLE_DELETABLE] (state) {
        state.selected.deletable = ! state.selected.deletable
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
        state.selected.movable = false,
        state.selected.deletable = false
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
    toggleDeletable({ commit }) {
        commit(TOGGLE_DELETABLE)
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
