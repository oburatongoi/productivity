import {
    CLEAR_SELECTED,
    SET_CREATING_NEW,
    TOGGLE_CREATING_NEW_BUTTONS,
    ADD_TO_SELECTED,
    REMOVE_FROM_SELECTED,
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
            var i = _.findIndex(state.selected.folders, payload.listing);
            state.selected.folders.splice(i,1)
            break;
          case 'checklist':
            var i = _.findIndex(state.selected.checklists, payload.listing);
            state.selected.checklists.splice(i,1)
            break;
          case 'checklist-item':
            var i = _.findIndex(state.selected.checklists, payload.listing);
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
    toggleSelection({ dispatch, commit, state }, payload) {
      switch (payload.selection.model) {
        case 'folder':
          if ((_.findIndex(state.selected.folders, payload.selection.listing)) !== -1) {
            if (payload.event.shiftKey || payload.event.ctrlKey || payload.event.metaKey) {
              commit(REMOVE_FROM_SELECTED, payload.selection)
            } else {
              commit(CLEAR_SELECTED)
              commit(ADD_TO_SELECTED, payload.selection)
            }
          } else {
            if (payload.event.shiftKey || payload.event.ctrlKey || payload.event.metaKey) {
              commit(ADD_TO_SELECTED, payload.selection)
            } else {
              commit(CLEAR_SELECTED)
              commit(ADD_TO_SELECTED, payload.selection)
            }
          }
          break;
        case 'checklist':
          if (_.findIndex(state.selected.checklists, payload.selection.listing) !== -1) {
            if (payload.event.shiftKey || payload.event.ctrlKey || payload.event.metaKey) {
              commit(REMOVE_FROM_SELECTED, payload.selection)
            } else {
              commit(CLEAR_SELECTED)
              commit(ADD_TO_SELECTED, payload.selection)
            }
          } else {
            if (payload.event.shiftKey || payload.event.ctrlKey || payload.event.metaKey) {
              commit(ADD_TO_SELECTED, payload.selection)
            } else {
              commit(CLEAR_SELECTED)
              commit(ADD_TO_SELECTED, payload.selection)
            }
          }
          break;
        case 'checklist-item':
          if (_.findIndex(state.selected.checklistItems, payload.selection.listing) !== -1) {
              dispatch('removeCurrentlyEditable', null, {root: true}).then(
                () => {

                  if ((payload.event.shiftKey || payload.event.ctrlKey || payload.event.metaKey) || state.selected.checklistItems.length === 1) {
                    // if either a modifier key was used or there is only one selected item
                    commit(REMOVE_FROM_SELECTED, payload.selection)
                  } else { // if there are mulitple items and a modifier key was not used
                    commit(CLEAR_SELECTED)
                    commit(ADD_TO_SELECTED, payload.selection)
                  }

                  if (state.selected.checklistItems.length === 1) { //If only one is left, make it editable
                    dispatch('addCurrentlyEditable', state.selected.checklistItems[0], {root: true})
                  }
                }
              ).catch(
                () => {console.log('error dispatching. home.js toggleSelection()');}
              )

          } else {

            if (payload.event.shiftKey || payload.event.ctrlKey || payload.event.metaKey) {
              commit(ADD_TO_SELECTED, payload.selection)
            } else {
              commit(CLEAR_SELECTED)
              commit(ADD_TO_SELECTED, payload.selection)
            }

            if (state.selected.checklistItems.length == 1) {
              dispatch('addCurrentlyEditable', payload.selection.listing, {root: true})
            } else {
              dispatch('removeCurrentlyEditable', null, {root: true})
            }
          }
          break;
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

        if (state.selected.folders && state.selected.folders.length) {
          for (var i = 0; i < state.selected.folders.length; i++) {
            dispatch('delistFolder', state.selected.folders[i], { root: true })
          }
        }

        if (state.selected.checklists && state.selected.checklists.length) {
          for (var i = 0; i < state.selected.checklists.length; i++) {
            dispatch('delistChecklist', state.selected.checklists[i], { root: true })
          }
        }

        if (state.selected.checklistItems && state.selected.checklistItems.length) {
          for (var i = 0; i < state.selected.checklistItems.length; i++) {
            dispatch('delistChecklistItem', state.selected.checklistItems[i], { root: true })
          }
        }

        resolve(selected) // return the items passed down from the server

      })
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
