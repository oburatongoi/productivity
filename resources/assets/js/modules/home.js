import {
    SET_CREATING_NEW,
    TOGGLE_CREATING_NEW_BUTTONS,
    SELECT_LISTING,
    DESELECT_LISTING,
    TOGGLE_DELETABLE,
    TOGGLE_MOVABLE
} from '../mutations'

const namespaced = true;

const state = {
    user: Productivity.user,
    creatingNew: undefined,
    showCreatingNewButtons: false,
    ancestors: Productivity.ancestors ? Productivity.ancestors : {},
    model: Productivity.model ? Productivity.model : {},
    currentView: Productivity.currentView ? Productivity.currentView : undefined,
    pendingItems: Productivity.pendingItems ? Productivity.pendingItems: {},
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
    [TOGGLE_CREATING_NEW_BUTTONS] (state) {
        state.showCreatingNewButtons = ! state.showCreatingNewButtons
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
    toggleCreatingNewButtons({ commit }) {
        commit(TOGGLE_CREATING_NEW_BUTTONS)
    },
    toggleMovable({ commit }) {
        commit(TOGGLE_MOVABLE)
    },
    toggleDeletable({ commit }) {
        commit(TOGGLE_DELETABLE)
    },
    selectListing({ commit }, payload) {
      commit(SELECT_LISTING, payload)
    },
    deselectListing({ commit }) {
      commit(DESELECT_LISTING)
    },
}

const getters = {
    creatingNew: state => state.creatingNew,
    showCreatingNewButtons: state => state.showCreatingNewButtons,
    user: state => state.user,
    ancestors: state => state.ancestors,
    model: state => state.model,
    currentView: state => state.currentView,
    selected: state => state.selected,
    pendingItems: state => state.pendingItems,
    selectedIsMovable: state => state.selected.model && state.selected.id && state.selected.movable,
    listingIsActionable: state =>  state.selected.model && state.selected.id && !state.selected.movable
}

export default {
    state,
    mutations,
    actions,
    getters
}
