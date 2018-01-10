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
    state.selected = {
        folders: [],
        checklists: [],
        checklistItems: [],
        movable: false,
        deletable: false
    }
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
    commit(CLEAR_SELECTED)
  },

  createNew({ commit }, model) {
    commit(SET_CREATING_NEW, model)
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

  toggleCreatingNewButtons({ commit }) {
    commit(TOGGLE_CREATING_NEW_BUTTONS)
  },

  toggleDeletable({ commit }) {
    commit(TOGGLE_DELETABLE)
  },

  toggleEditability({ commit }, bool = "unset") {
    commit(TOGGLE_EDITABILITY, bool)
  },

  toggleMovable({ commit }) {
    commit(TOGGLE_MOVABLE)
  },

  toggleSelection({ dispatch, commit, getters, state, rootState }, payload = { selection: { model:null, listing: null, parentModel: null }, removePrecedingSubItems: false, event: null }) {
    let isInSelectedArray = false,
        isHome = false,
        isChecklist = false,
        isChecklistItem = false,
        isSubItem = false,
        isChildOfEditableSubItem = false,
        isLoneSelected = false,
        modifierKeyPressed = ! payload.event ? false : !! payload.event.shiftKey || !! payload.event.ctrlKey || !! payload.event.metaKey,
        editableItemIsSet = !! rootState.checklists.editableItem && !! rootState.checklists.editableItem.id,
        editableSubItemIsSet = !! rootState.checklists.editableSubItem && !! rootState.checklists.editableSubItem.id,
        removePrecedingSubItems = payload.removePrecedingSubItems || false,
        currentlyEditableIsRemovable = false

    switch (payload.selection.model) {
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
        isChildOfEditableSubItem = isSubItem && payload.selection.listing.parent_id == getters.editableSubItem.id
        currentlyEditableIsRemovable = (! isSubItem || ! isChildOfEditableSubItem)
                                       && (editableItemIsSet || editableSubItemIsSet)
                                       && ! modifierKeyPressed
        break;
      case 'home':
        isHome = true
        break;
    }

    if (isChecklist || isHome) {
      if (editableSubItemIsSet) dispatch('removeCurrentlyEditable', {isSubItem: true}, {root: true})
      if (editableItemIsSet) dispatch('removeCurrentlyEditable', {isSubItem: false}, {root: true})
    } else if ( currentlyEditableIsRemovable ) {
      // console.log('editable is set, and is checklist item, and modifier not pressed, so removing currently editable');
      dispatch('removeCurrentlyEditable', {isSubItem, removePrecedingSubItems, item: payload.selection.listing }, {root: true})
    }

    // console.log('number of listings already in selected: '+getters.selectedCount);
    // if(isChecklistItem) console.log('selected already has items: '+ !! getters.selectedChecklistItemsCount);
    // if(isChecklistItem) console.log('number of items already in selected: '+getters.selectedChecklistItemsCount);
    // if(isChecklist) console.log('number of checklists already in selected: '+getters.selectedChecklistsCount);
    // if(!isChecklistItem&&!isChecklist) console.log('number of folders already in selected: '+getters.selectedFoldersCount);
    //
    //
    // console.log('isChecklistItem: '+isChecklistItem+'; isLoneSelected: '+isLoneSelected+'; isInSelectedArray: '+isInSelectedArray);
    // console.log('should remove: '+ (isInSelectedArray && (isLoneSelected || modifierKeyPressed)));

    if (isInSelectedArray) {
        // Remove if modifier key was pressed
        if (isLoneSelected || modifierKeyPressed) {
          // if (isLoneSelected && modifierKeyPressed) console.log('is loneSelected and modifier pressed so removing from selected');
          // else if (isLoneSelected) console.log('is loneSelected so removing from selected');
          // else if (modifierKeyPressed) console.log('modifier pressed so removing from selected');
          commit(REMOVE_FROM_SELECTED, payload.selection)
        } else { // If a modifier key was not pressed
          // console.log('is not loneSelected and modifier not pressed so adding to selected');
          commit(CLEAR_SELECTED)
          commit(ADD_TO_SELECTED, payload.selection)
        }

    } else { // If it is not in the selected array

        let selectedHasItem = _.some(state.selected.checklistItems, ['parent_id', null]),
            selectedHasSubItem = _.some(state.selected.checklistItems, ['checklist_id', null]),
            selectedOnlyHasPeers = selectedHasItem != selectedHasSubItem,
            isPeerItem = selectedOnlyHasPeers && isSubItem == selectedHasSubItem

         // Add to selection if selected is empty, or a modifier key was pressed, or listing is a checklistItem and all currenlty selected items are peers of the current item
        if ( ! getters.selectedCount || modifierKeyPressed && (! isChecklistItem || isPeerItem && selectedOnlyHasPeers)) {
          // console.log('add because selected is empty, or modifier pressed and is not a checklist item, is a peer item and selected has only peers');
          commit(ADD_TO_SELECTED, payload.selection)
        } else { // else, clear the selection and then add the current item
          // console.log('clear and add because selected is not empty, or modifier was not pressed and is either not a checklist item, or is a peer item and selected has only peers');
          commit(CLEAR_SELECTED)
          commit(ADD_TO_SELECTED, payload.selection)
        }
    }

    // If the selected array has only one checklist item, make it editable
    if (isChecklistItem && getters.selectedChecklistItemsCount === 1) {
      // console.log('adding currently editable...');
      dispatch('addCurrentlyEditable', { isSubItem, item: state.selected.checklistItems[0] }, {root: true})
    }

    if (isSubItem) {
      let selectedAlreadyHasChecklistItems = !! getters.selectedChecklistItemsCount,
          isAlreadySelected = selectedAlreadyHasChecklistItems && _.findIndex(state.selected.checklistItems, ['id', payload.selection.listing.id]) !== -1

      // console.log('index of listing in selected items: '+_.findIndex(state.selected.checklistItems, ['id', payload.selection.listing.id]));
      // console.log('editableSubItemIsSet: '+editableSubItemIsSet);
      // console.log('editableItemIsSet: '+editableItemIsSet);
      // console.log('isAlreadySelected: '+isAlreadySelected);
      // console.log('has selected checklistItems: '+ selectedAlreadyHasChecklistItems);

      // Select the editableSubItem if it exists, or the editable Item if that exists
      if (! selectedAlreadyHasChecklistItems && (editableSubItemIsSet || editableItemIsSet) && ! isAlreadySelected) {
        let listing = editableSubItemIsSet ? rootState.checklists.editableSubItem : rootState.checklists.editableItem
        // if(editableSubItemIsSet && isSubItem) console.log('adding '+ payload.selection.listing.content +' to selected because editableSubItemIsSet and is not already selected');
        // if(editableItemIsSet && ! isSubItem) console.log('adding '+ payload.selection.listing.content +' to selected because editableItemIsSet and is not already selected');
        commit(ADD_TO_SELECTED, {model: 'checklist-item', listing})
      }
    }
  },

  replaceSelected({ commit }, payload) {
    commit(CLEAR_SELECTED)
    commit(ADD_TO_SELECTED, payload)
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
