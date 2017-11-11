import {
    CLEAR_SELECTED,
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
    ancestors: Productivity.ancestors ? Productivity.ancestors : [],
    model: Productivity.model ? Productivity.model : {},
    currentView: Productivity.currentView ? Productivity.currentView : undefined,
    pendingItems: Productivity.pendingItems ? Productivity.pendingItems: [],
    selected: {
        folders: [],
        checklists: [],
        checklistItems: [],
        movable: false,
        deletable: false
    }
}

const mutations = {
    [CLEAR_SELECTED] (state) {
        state.selected = {
            folders: [],
            checklists: [],
            checklistItems: [],
            movable: false,
            deletable: false
        }
    },
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
      switch (payload.model) {
        case 'folder':
          state.selected.folders.unshift(payload.listing)
          break;
        case 'checklist':
          state.selected.checklists.unshift(payload.listing)
          break;
        case 'checklist-item':
          state.selected.checklistItems.unshift(payload.listing)
          break;
        default: return

      }
    },
    [DESELECT_LISTING] (state, payload) {

      if (payload && payload.model) {
        switch (payload.model) {
          case 'folder':
            var i = state.selected.folders.indexOf(payload.listing);
            state.selected.folders.splice(i,1)
            break;
          case 'checklist':
            var i = state.selected.checklists.indexOf(payload.listing);
            state.selected.checklists.splice(i,1)
            break;
          case 'checklist-item':
            var i = state.selected.checklistItems.indexOf(payload.listing);
            state.selected.checklistItems.splice(i,1)
            break;
          default:

        }
      }
      state.selected.movable = false,
      state.selected.deletable = false
    }
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
    deselectListing({ commit }, payload) {
      commit(DESELECT_LISTING, payload)
    },
    clearSelected({ commit }) {
      commit(CLEAR_SELECTED)
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
    selectedIsMovable: state => state.selected.movable && (state.selected.folders.length || state.selected.checklists.length || state.selected.checklistItems.length),
    listingIsActionable: state => !state.selected.movable && (state.selected.folders.length || state.selected.checklists.length || state.selected.checklistItems.length)
}

export default {
    state,
    mutations,
    actions,
    getters
}
