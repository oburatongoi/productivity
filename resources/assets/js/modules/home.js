import {
  ADD_TO_SELECTED,
  CLEAR_SELECTED,
  REMOVE_FROM_SELECTED,
  SET_CREATING_NEW,
  TOGGLE_CREATING_NEW_BUTTONS,
  TOGGLE_DELETABLE,
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
    [ADD_TO_SELECTED] (state, payload) {
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
    [REMOVE_FROM_SELECTED] (state, payload) {

      if (payload && payload.model) {
        switch (payload.model) {
          case 'folder':
            var i = _.findIndex(state.selected.folders, ['id', payload.listing.id]);
            state.selected.folders.splice(i,1)
            break;
          case 'checklist':
            var i = _.findIndex(state.selected.checklists, ['id', payload.listing.id]);
            state.selected.checklists.splice(i,1)
            break;
          case 'checklist-item':
            var i = _.findIndex(state.selected.checklistItems, ['id', payload.listing.id]);
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
    toggleSelection({ dispatch, commit, state, rootState }, payload = {selection: null, model:null, event: null, parentModel: null}) {
      let isInSelectedArray
      let isSubItem
      let isChecklistItem = false
      let isChecklist = false
      let isHome = false
      let modifierKeyPressed = payload.event.shiftKey || payload.event.ctrlKey || payload.event.metaKey ? true : false

      switch (payload.selection.model) {
        case 'folder':
          isInSelectedArray = _.findIndex(state.selected.folders, ['id', payload.selection.listing.id]) !== -1
          break;
        case 'checklist':
          isInSelectedArray = _.findIndex(state.selected.checklists, ['id', payload.selection.listing.id]) !== -1
          isChecklist = true
          break;
        case 'checklist-item':
          isInSelectedArray = _.findIndex(state.selected.checklistItems, ['id', payload.selection.listing.id]) !== -1
          isChecklistItem = true
          isSubItem = payload.selection.parentModel === 'checklist-item'
          break;
        case 'home':
          isHome = true
          break;
      }

      if (isChecklist || isHome) {

        if (rootState.checklists.editableSubItem && rootState.checklists.editableSubItem.id) {
          dispatch('removeCurrentlyEditable', {isSubItem: true}, {root: true})
        }

        if (rootState.checklists.editableItem && rootState.checklists.editableItem.id) {
          dispatch('removeCurrentlyEditable', {isSubItem: false}, {root: true})
        }

      }

      if (isChecklistItem) {
        dispatch('removeCurrentlyEditable', {isSubItem}, {root: true})
      }

      if (isInSelectedArray) {
          // Remove if modifier key was pressed
          if (modifierKeyPressed || isChecklistItem && state.selected.checklistItems.length === 1) {
            commit(REMOVE_FROM_SELECTED, payload.selection)
          } else { // If a modifier key was not pressed
            commit(CLEAR_SELECTED)
            commit(ADD_TO_SELECTED, payload.selection)
          }

      } else { // If it is not in the selected array
          if (modifierKeyPressed) { // Add to selection if modifier key was pressed
            commit(ADD_TO_SELECTED, payload.selection)
          } else { // If a modifier key was not pressed, clear the selection and then add the current item
            commit(CLEAR_SELECTED)
            commit(ADD_TO_SELECTED, payload.selection)
          }
      }

      // If only one checklist item is left, make it editable
      if (isChecklistItem && state.selected.checklistItems.length === 1) {
        dispatch('addCurrentlyEditable', { isSubItem, item: state.selected.checklistItems[0] }, {root: true})
      }

      // Select the editable item
      if (isSubItem && (! rootState.checklists.editableSubItem || ! rootState.checklists.editableSubItem.id) && rootState.checklists.editableItem && rootState.checklists.editableItem.id) {
        commit(ADD_TO_SELECTED, {model: 'checklist-item', listing: rootState.checklists.editableItem})
      }
    },
    deleteSelection({ dispatch, commit, state }) {
      return new Promise((resolve, reject) => {

        axios.post('/selection', {selected: state.selected}).then(function(response) {
            if (response.data.tokenMismatch) {
                Vue.handleTokenMismatch(response.data).then(
                    (response) => {

                        if (response.data.selected) {
                          dispatch('handleSuccessfulDelete', response.data.selected).then(
                            (response) => resolve(response)
                          ).catch(
                            (error) => reject(error)
                          )
                        } else if (response.data.error) {
                            reject(response.data.error)
                        } else {
                            reject()
                        }
                    }
                ).catch( (error) => reject(error) )

            } else if (response.data.success && response.data.selected) {

              dispatch('handleSuccessfulDelete', response.data.selected).then(
                (response) => resolve(response)
              ).catch( (error) => reject(error) )

          } else if (response.data.error) {
              reject(response.data.error)
          } else {
              reject()
          }
        }).catch( (error) => reject(error) )

      })
    },
    addToSelected({ commit }, payload) {
      commit(ADD_TO_SELECTED, payload)
    },
    deselect({ commit }, payload) {
      return new Promise((resolve, reject) => {
        commit(REMOVE_FROM_SELECTED, payload)
        resolve(payload)
      })
    },
    replaceSelected({ commit }, payload) {
      commit(CLEAR_SELECTED)
      commit(ADD_TO_SELECTED, payload)
    },
    clearSelected({ commit }) {
      commit(CLEAR_SELECTED)
    },
    handleSuccessfulDelete({ dispatch, commit, state }, selected) {
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
}

const getters = {
    creatingNew: state => state.creatingNew,
    showCreatingNewButtons: state => state.showCreatingNewButtons,
    ancestors: state => state.ancestors,
    selected: state => state.selected,
    selectedIsMovable: state => state.selected.movable && (state.selected.folders.length || state.selected.checklists.length || state.selected.checklistItems.length),
    listingIsActionable: state => !state.selected.movable && (state.selected.folders.length || state.selected.checklists.length || state.selected.checklistItems.length)
}

export default {
    state,
    mutations,
    actions,
    getters
}
