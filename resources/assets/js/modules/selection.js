import {
  ADD_TO_SELECTED,
  CLEAR_SELECTED,
  REMOVE_FROM_SELECTED,
  SET_CREATING_NEW,
  TOGGLE_CREATING_NEW_BUTTONS,
  TOGGLE_DELETABLE,
  TOGGLE_EDITABILITY,
  TOGGLE_MOVABLE
} from '../mutations'

const namespaced = true;

const state = {
    creatingNew: undefined,
    showCreatingNewButtons: false,
    ancestors: Productivity.ancestors ? Productivity.ancestors : [],
    selected: {
        folders: [],
        checklists: [],
        checklistItems: [],
        movable: false,
        deletable: false
    },
    isEditable: false,
}

const mutations = {
  [ADD_TO_SELECTED] (state, payload) {
    switch (payload.model) {
      case 'folder':
      if( ! _.some(state.selected.folders, ['id', payload.listing.id]) )
        state.selected.folders.unshift(payload.listing)
        break;
      case 'checklist':
      if( ! _.some(state.selected.checklists, ['id', payload.listing.id]) )
        state.selected.checklists.unshift(payload.listing)
        break;
      case 'checklist-item':
      if( ! _.some(state.selected.checklistItems, ['id', payload.listing.id]) )
        state.selected.checklistItems.unshift(payload.listing)
        break;
      default: return

    }
  },
  [CLEAR_SELECTED] (state) {
    Object.keys(state.selected).map(e => {
      if(typeof state.selected[e] == 'object') state.selected[e] = []
      if(typeof state.selected[e] == 'boolean') state.selected[e] = false
    });
  },
  [REMOVE_FROM_SELECTED] (state, payload) {
    if (payload && payload.model) {
      switch (payload.model) {
        case 'folder':
          state.selected.folders.splice(_.findIndex(state.selected.folders, ['id', payload.listing.id]), 1)
          break;
        case 'checklist':
          state.selected.checklists.splice(_.findIndex(state.selected.checklists, ['id', payload.listing.id]), 1)
          break;
        case 'checklist-item':
          state.selected.checklistItems.splice(_.findIndex(state.selected.checklistItems, ['id', payload.listing.id]), 1)
          break;
        default:

      }
    }

    let hasSelectedItems = state.selected.folders.length + state.selected.checklists.length + state.selected.checklistItems.length

    if ( ! payload.preserveState || payload.preserveState && ! hasSelectedItems ) {
      state.selected.movable = false,
      state.selected.deletable = false
    }

  },
  [SET_CREATING_NEW] (state, model) {
    state.creatingNew = model
  },
  [TOGGLE_CREATING_NEW_BUTTONS] (state) {
    state.showCreatingNewButtons = ! state.showCreatingNewButtons
  },
  [TOGGLE_DELETABLE] (state) {
    state.selected.deletable = ! state.selected.deletable
  },
  [TOGGLE_EDITABILITY] (state, bool) {
    if (bool !== "unset") state.isEditable = bool
    else state.isEditable = ! state.isEditable
  },
  [TOGGLE_MOVABLE] (state) {
    state.selected.movable = ! state.selected.movable
  },
}

const actions = {
  addToSelected({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(ADD_TO_SELECTED, payload)
      resolve()
    })
  },

  clearSelected({ commit }) {
    return new Promise((resolve, reject) => {
      commit(CLEAR_SELECTED)
      resolve()
    })
  },

  createNew({ commit }, model) {
    return new Promise((resolve, reject) => {
      commit(SET_CREATING_NEW, model)
      resolve()
    })
  },

  deleteSelection({ dispatch }) {
    return new Promise((resolve, reject) => {

      axios.post('/selection', {selected: state.selected}).then(function(response) {
          if (response.data.tokenMismatch) {
              Vue.handleTokenMismatch(response.data).then(
                  (response) => resolve( dispatch('deleteSelectionHandler', response) )
              ).catch( (error) => reject(error) )

          } else if (response.data.success && response.data.selected) {
            resolve( dispatch('deleteSelectionHandler', response) )
        } else if (response.data.error) {
            reject(response.data.error)
        } else {
            reject()
        }
      }).catch( (error) => reject(error) )

    })
  },

  deleteSelectionHandler({ dispatch }, response) {
    return new Promise((resolve, reject) => {
      if (response.data.selected) {
        dispatch('deleteSelectionHandleSuccess', response.data.selected).then(
          (response) => resolve(response)
        ).catch( (error) => reject(error) )
      } else if (response.data.error) {
          reject(response.data.error)
      } else {
          reject()
      }

    })
  },

  deleteSelectionHandleSuccess({ dispatch, commit, state }, selected) {
    return new Promise((resolve, reject) => {
      // Note: selected represents data passed down from the server response
      var count =  0;

      if (selected.folders && selected.folders.length) {
        for (var i = 0; i < selected.folders.length; i++) {
          dispatch('delistFolder', selected.folders[i], { root: true })
          commit(REMOVE_FROM_SELECTED, {model: 'folder', listing: selected.folders[i]})
          count ++
        }
      }

      if (selected.checklists && selected.checklists.length) {
        for (var i = 0; i < selected.checklists.length; i++) {
          dispatch('delistChecklist', selected.checklists[i], { root: true })
          commit(REMOVE_FROM_SELECTED, {model: 'checklist', listing: selected.checklists[i]})
          count ++
        }
      }

      if (selected.checklistItems && selected.checklistItems.length) {
        for (var i = 0; i < selected.checklistItems.length; i++) {
          dispatch('deleteChecklistItem', selected.checklistItems[i], { root: true })
          commit(REMOVE_FROM_SELECTED, {model: 'checklist-item', listing: selected.checklistItems[i]})
          count ++
        }
      }

      if (count > 0) {
        var msg = count == 1 ? 'The selected item has been successfuly deleted.' : count + ' items have been successfuly deleted.';
        var notice = {
              type: 'success',
              heading: 'Success!',
              message: msg,
              persist: false,
          }
        dispatch('addNotice', notice, {root: true})
      }

      resolve(selected) // return the items passed down from the server

    })
  },

  deselect({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(REMOVE_FROM_SELECTED, payload)
      resolve(payload)
    })
  },

  removeFromSelected({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(REMOVE_FROM_SELECTED, payload)
      resolve()
    })
  },

  replaceSelected({ commit }, payload) {
    return new Promise((resolve, reject) => {
      commit(CLEAR_SELECTED)
      commit(ADD_TO_SELECTED, payload)
      resolve()
    })
  },

  toggleCreatingNewButtons({ commit }) {
    return new Promise((resolve, reject) => {
      commit(TOGGLE_CREATING_NEW_BUTTONS)
      resolve()
    })
  },

  toggleDeletable({ commit }) {
    return new Promise((resolve, reject) => {
      commit(TOGGLE_DELETABLE)
      resolve()
    })
  },

  toggleEditability({ commit }, bool = "unset") {
    return new Promise((resolve, reject) => {
      commit(TOGGLE_EDITABILITY, bool)
      resolve()
    })
  },

  toggleMovable({ commit }) {
    return new Promise((resolve, reject) => {
    commit(TOGGLE_MOVABLE)
    resolve()
  })
  },

  toggleSelection({ dispatch, getters, state, rootGetters }, payload = { selection: { model:null, listing: null, parentModel: null }, removePrecedingSubItems: false, event: null }) {
    let isInSelectedArray = false,
        isHome = false,
        isChecklist = false,
        isChecklistItem = false,
        isSubItem = false,
        isChildOfEditableSubItem = false,
        isLoneSelected = false,
        modifierKeyPressed = ! payload.event ? false : !! payload.event.shiftKey || !! payload.event.ctrlKey || !! payload.event.metaKey,
        editableItemIsSet = !! rootGetters.editableItem && !! rootGetters.editableItem.id,
        editableSubItemIsSet = !! rootGetters.editableSubItem && !! rootGetters.editableSubItem.id,
        removePrecedingSubItems = payload.removePrecedingSubItems || false,
        currentlyEditableIsRemovable = false

    switch (payload.selection.model) {
      case 'home':
        isHome = true
        break;
      case 'folder':
        isInSelectedArray = _.some(state.selected.folders, ['id', payload.selection.listing.id])
        isLoneSelected = isInSelectedArray && state.selected.folders.length === 1
        break;
      case 'checklist':
        isInSelectedArray = _.some(state.selected.checklists, ['id', payload.selection.listing.id])
        isChecklist = true
        isLoneSelected = isInSelectedArray && state.selected.checklists.length === 1
        break;
      case 'checklist-item':
        isInSelectedArray = _.some(state.selected.checklistItems, ['id', payload.selection.listing.id])
        isChecklistItem = true
        isSubItem = payload.selection.parentModel == 'checklist-item' || ! payload.selection.listing.checklist_id
        isLoneSelected = isInSelectedArray && state.selected.checklistItems.length === 1
        isChildOfEditableSubItem = isSubItem && payload.selection.listing.parent_id == rootGetters.editableSubItem.id
        currentlyEditableIsRemovable = (! isSubItem || ! isChildOfEditableSubItem)
                                       && (editableItemIsSet || editableSubItemIsSet)
                                       && ! modifierKeyPressed
        break;
    }

    if (isChecklist || isHome) {
      if (editableSubItemIsSet) dispatch('removeCurrentlyEditable', {isSubItem: true}, {root: true})
      if (editableItemIsSet) dispatch('removeCurrentlyEditable', {isSubItem: false}, {root: true})
    } else if ( currentlyEditableIsRemovable ) {
      dispatch('removeCurrentlyEditable', { isSubItem, removePrecedingSubItems, item: payload.selection.listing }, {root: true} )
    }

    if (isInSelectedArray) {
        // Remove if modifier key was pressed
        if (isLoneSelected || modifierKeyPressed) {
          dispatch('removeFromSelected', payload.selection)
        } else { // If a modifier key was not pressed
          dispatch('replaceSelected', payload.selection)
        }

    } else { // If it is not in the selected array

        let selectedHasItem = _.some(state.selected.checklistItems, ['parent_id', null]),
            selectedHasSubItem = _.some(state.selected.checklistItems, ['checklist_id', null]),
            selectedOnlyHasPeers = selectedHasItem != selectedHasSubItem,
            isNotChildOfASelectedItem = ! _.some(state.selected.checklistItems, ['id', payload.selection.listing.parent_id]),
            isPeerItem = selectedOnlyHasPeers && isSubItem == selectedHasSubItem && isNotChildOfASelectedItem

         // Add to selection if selected is empty, or a modifier key was pressed, or listing is a checklistItem and all currenlty selected items are peers of the current item
        if ( ! getters.selectedCount || modifierKeyPressed && (! isChecklistItem || isPeerItem && selectedOnlyHasPeers)) {
          dispatch('addToSelected', payload.selection)
        } else { // else, clear the selection and then add the current item
          dispatch('replaceSelected', payload.selection)
        }
    }

    // If the selected array has only one checklist item, make it editable
    if (isChecklistItem && getters.selectedChecklistItemsCount === 1 && ! modifierKeyPressed) {
      dispatch('addCurrentlyEditable', { isSubItem, item: state.selected.checklistItems[0] }, {root: true})
    }

    if (isSubItem) {
      let selectedAlreadyHasChecklistItems = !! getters.selectedChecklistItemsCount,
          isAlreadySelected = selectedAlreadyHasChecklistItems && _.findIndex(state.selected.checklistItems, ['id', payload.selection.listing.id]) !== -1

      // Select the editableSubItem if it exists, or the editable Item if that exists
      if (! selectedAlreadyHasChecklistItems && (editableSubItemIsSet || editableItemIsSet) && ! isAlreadySelected) {
        let listing = editableSubItemIsSet ? rootGetters.editableSubItem : rootGetters.editableItem
        dispatch('addToSelected', { model: 'checklist-item', listing })
      }
    }
  },

}

const getters = {
    creatingNew: state => state.creatingNew,
    showCreatingNewButtons: state => state.showCreatingNewButtons,
    ancestors: state => state.ancestors,
    selected: state => state.selected,
    selectedFoldersCount: state => state.selected.folders.length,
    selectedChecklistsCount: state => state.selected.checklists.length,
    selectedChecklistItemsCount: state => state.selected.checklistItems.length,
    selectedCount: (state, getters) => getters.selectedFoldersCount + getters.selectedChecklistsCount + getters.selectedChecklistItemsCount,
    isEditable: state => state.isEditable,
    selectedIsMovable: (state, getters) => state.selected.movable && getters.selectedCount,
    listingIsActionable: (state, getters) => !state.selected.movable && getters.selectedCount
}

export default {
    state,
    mutations,
    actions,
    getters
}
