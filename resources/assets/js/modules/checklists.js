import {
    ADD_CHECKLIST,
    ADD_CURRENTLY_EDITABLE,
    ADD_UNFILTERED,
    ADD_ITEM_TO_CHECKLIST,
    DECREMENT_ITEM_COUNT,
    DELETE_CHECKLIST,
    DELETE_CURRENTLY_EDITABLE,
    DELETE_UNFILTERED,
    DELETE_CHECKLIST_ITEM,
    DELIST_CHECKLIST_ITEM,
    INCREMENT_ITEM_COUNT,
    OBSERVE_CHECKLIST,
    OBSERVE_CURRENT_EDITABLE_ITEM,
    UPDATE_FILTERS,
    UPDATE_CHECKLIST,
    UPDATE_ITEM_COUNTS,
    REPLACE_PENDING_TASK,
    RESET_NEW_CHECKLIST_ITEM,
    SET_CURRENT_EDITABLE_ITEM_COMMENTS,
    SET_CURRENT_EDITABLE_ITEM_DEADLINE,
    SORT_CHECKLIST_ITEMS,
    TOGGLE_CURRENT_EDITABLE_ITEM_CHECK_MARK,
    TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION,
    TOGGLE_CURRENT_EDITABLE_ITEM_IMPORTANCE,
    TOGGLE_CURRENT_EDITABLE_ITEM_URGENCY,
    UNDO_UPDATE_SORT_ORDER,
    UPDATE_SORT_ORDER
} from '../mutations'

import sort from 'fast-sort';

const { observe } = require('dirty-object'); // used to check if object has been modified before saving

const namespaced = true;

const state = {
    checklists: Productivity.checklists ? Productivity.checklists: [],
    checklist: Productivity.checklist ? Productivity.checklist: [],
    checklistItems: Productivity.checklistItems ? Productivity.checklistItems : Productivity.checklist && Productivity.checklist.items ? Productivity.checklist.items : [],
    unfilteredItems: [],
    currentEditableItemID: null,
    currentEditableItemIndex: null,
    currentEditableItemIsExpanded: false,
    newChecklistItem: {
        content: null,
        is_urgent: false,
        is_important: false,
        deadline: null,
        comments: null,
        sort_order: Productivity.checklistItems ? Productivity.checklistItems.length : Productivity.checklist && Productivity.checklist.items ? Productivity.checklist.items.length : 0,
    },
    delistedItems: [],
    filters: {
        checked: 'unchecked',
        priority: 'none'
    }
}

const mutations = {
    [ADD_CHECKLIST] (state, checklist) {
        state.checklists.unshift(checklist)
    },
    [ADD_CURRENTLY_EDITABLE] (state, item) {
        let i = _.findIndex(state.checklistItems, ['id', item.id]);
        state.currentEditableItemIndex = i
        state.currentEditableItemID = item.id
    },
    [ADD_UNFILTERED] (state, item) {
      if( ! state.unfilteredItems.includes(item.id) ) {
        state.unfilteredItems.unshift(item.id)
      }
    },
    [ADD_ITEM_TO_CHECKLIST] (state, item) {
      state.checklist.items.unshift(item)
    },
    [DECREMENT_ITEM_COUNT] (state, checklistID) {
      if (
        ! _.isEmpty(state.checklists)
      ) {
        let i = _.findIndex(state.checklists, ['id', checklistID]);
        state.checklists[i].items_count = -- state.checklists[i].items_count
      }
    },
    [DELETE_CHECKLIST] (state, checklist) {
      if (
        ! _.isEmpty(state.checklists)
      ) {
        let i = _.findIndex(state.checklists, ['id', checklist.id]);
        state.checklists.splice(i,1)
      }
    },
    [DELETE_CHECKLIST_ITEM] (state, checklistItem) {
        if (
          ! _.isEmpty(state.checklistItems)
        ) {
          let i = _.findIndex(state.checklistItems, ['id', checklistItem.id]);
          state.checklistItems.splice(i,1)
        } else if (
          ! _.isEmpty(state.checklist.items)
        ) {
          let i = _.findIndex(state.checklist.items, ['id', checklistItem.id]);
          state.checklist.items.splice(i,1)
        }
    },
    [DELIST_CHECKLIST_ITEM] (state, checklistItem) {
        state.delistedItems.unshift(checklistItem.id)
    },
    [DELETE_CURRENTLY_EDITABLE] (state) {
        state.currentEditableItemID = state.currentEditableItemIndex = null
    },
    [DELETE_UNFILTERED] (state, item = null) {
        if (item) {
            let i = _.findIndex(state.unfilteredItems, ['id', item.id]);
            ~ i && state.unfilteredItems.splice(i,1)
        }
        state.unfilteredItems = []
    },
    [INCREMENT_ITEM_COUNT] (state, checklistID) {
      if (
        ! _.isEmpty(state.checklists)
      ) {
        let i = _.findIndex(state.checklists, ['id', checklistID]);
        state.checklists[i].items_count = ++ state.checklists[i].items_count
      }
    },
    [OBSERVE_CHECKLIST] (state) {
        // observe(state.checklist)
    },
    [OBSERVE_CURRENT_EDITABLE_ITEM] (state) {
      if (state.currentEditableItemID) {
        let i = _.findIndex(state.checklistItems, ['id', state.currentEditableItemID]);
        observe(state.checklistItems[i])
        console.log('simulating editable item observed');
      }
    },
    [UPDATE_FILTERS] (state, payload) {
      switch (payload.type) {
          case 'checked':
              state.filters.checked = payload.value
              break;
          case 'priority':
              state.filters.priority = payload.value
              break;
      }
    },
    [UPDATE_CHECKLIST] (state, updatedChecklist) {
      if (updatedChecklist && updatedChecklist.title) {
          state.checklist = updatedChecklist
      }
    },
    [UPDATE_ITEM_COUNTS] (state, payload) {
      if (
           ! _.isEmpty(state.checklists)
        && ! _.isEmpty(payload.old.checklist_id)
        && ! _.isEmpty(payload.new.checklist_id)
      ) {
        let o = _.findIndex(state.checklists, ['id', payload.old.checklist_id]);
        state.checklists[o].items_count = -- state.checklists[o].items_count

        let n = _.findIndex(state.checklists, ['id', payload.new.checklist_id]);
        state.checklists[n].items_count = ++ state.checklists[n].items_count
      }
    },
    [REPLACE_PENDING_TASK] (state, payload) {
        let i = _.findIndex(state.checklistItems, ['id', payload.old.id]);
        state.checklistItems.splice(i,1,payload.new)
    },
    [RESET_NEW_CHECKLIST_ITEM] (state) {
        state.newChecklistItem = {
            content: undefined,
            is_urgent: undefined,
            is_important: undefined,
            deadline: undefined,
            comments: undefined,
            sort_order: Productivity.checklistItems ? Productivity.checklistItems.length : Productivity.checklist && Productivity.checklist.items ? Productivity.checklist.items.length : 0,
        }
    },
    [SET_CURRENT_EDITABLE_ITEM_COMMENTS] (state, html = null) {
      state.checklistItems[state.currentEditableItemIndex].comments = html
    },
    [SET_CURRENT_EDITABLE_ITEM_DEADLINE] (state, date = null) {
      state.checklistItems[state.currentEditableItemIndex].deadline = date ? moment(date).format('YYYY-MM-DD') : null
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_CHECK_MARK] (state) {
      state.checklistItems[state.currentEditableItemIndex].checked_at = state.checklistItems[state.currentEditableItemIndex].checked_at ? null : moment().format()
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION] (state) {
        state.currentEditableItemIsExpanded = ! state.currentEditableItemIsExpanded
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_IMPORTANCE] (state) {
        state.checklistItems[state.currentEditableItemIndex].is_important = ! state.checklistItems[state.currentEditableItemIndex].is_important
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_URGENCY] (state) {
        state.checklistItems[state.currentEditableItemIndex].is_urgent = ! state.checklistItems[state.currentEditableItemIndex].is_urgent
    },
    [SORT_CHECKLIST_ITEMS] (state) {
      state.checklistItems = sort(state.checklistItems).asc(i => i.sort_order)
    },
    [UNDO_UPDATE_SORT_ORDER] (state) {
      // Maybe use https://github.com/pinguinjkeke/vue-local-storage or some other way to store/retrieve items
    },
    [UPDATE_SORT_ORDER] (state) {
      for (var i = 0; i < state.checklistItems.length; i++) {
        state.checklistItems[i].sort_order = i
      }
    },
}

const actions = {
  addChecklistItem({dispatch, commit}, payload) {
      return new Promise((resolve, reject) => {
          axios.post('/lists/' + state.checklist.fake_id + '/add-item', {item:payload.item})
               .then( response => dispatch('addChecklistItemHandler', response).then(
                      response => resolve(response)
               ) )
      })
  },
  addChecklistItemHandler({commit}, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data).then(
              (response) => {
                  if (response.data.item) {
                      commit(ADD_ITEM_TO_CHECKLIST, response.data.item)
                      commit(ADD_UNFILTERED, response.data.item)
                      commit(RESET_NEW_CHECKLIST_ITEM)
                      commit(SORT_CHECKLIST_ITEMS)
                      resolve(response.data.item)
                  } else if (response.data.error) {
                      reject(response.data.error)
                  } else {
                      reject()
                  }
              }
          ).catch(
              (error) => reject(error)
          )
      } else if (response.data.item) {
          commit(ADD_ITEM_TO_CHECKLIST, response.data.item)
          commit(ADD_UNFILTERED, response.data.item)
          commit(RESET_NEW_CHECKLIST_ITEM)
          commit(SORT_CHECKLIST_ITEMS)
          resolve(response.data.item)
      } else if (response.data.error) {
          reject(response.data.error)
      } else {
          reject()
      }
    })
  },
  addCurrentlyEditable({commit}, item) {
      return new Promise((resolve, reject) => {
          commit(ADD_CURRENTLY_EDITABLE, item)
          resolve()
      })
  },
  deleteChecklist({ dispatch, commit }, checklist) {
    return new Promise((resolve, reject) => {
        axios.delete('/lists/'+ checklist.fake_id)
          .then( response => dispatch('deleteChecklistHandler', response).then(
                 response => resolve(response)
          ) )
      })
  },
  deleteChecklistHandler({ commit }, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data).then(
              (response) => {
                  if (response.data.checklist) {
                      commit(DELETE_CHECKLIST, response.data.checklist)
                      resolve(response.data.checklist)
                  } else if (response.data.error) {
                      reject(response.data.error)
                  } else {
                      reject()
                  }
              }
          ).catch(
              (error) => reject(error)
          )
      } else if (response.data.checklist) {
          commit(DELETE_CHECKLIST, response.data.checklist)
          resolve(response.data.checklist)
      } else if (response.data.error) {
          reject(response.data.error)
      } else {
          reject()
      }
    })
  },
  deleteChecklistItem({dispatch, commit}, checklistItem) {
    return new Promise((resolve, reject) => {
      dispatch('delistChecklistItem', checklistItem).then(
        () => dispatch('deselect', { model: 'checklist-item', listing: checklistItem }, {root: true}).then(
          () => dispatch('removeCurrentlyEditable').then(
            () => {
              commit(DECREMENT_ITEM_COUNT, checklistItem.checklist_id)
              commit(DELETE_CHECKLIST_ITEM, checklistItem)
              commit(UPDATE_SORT_ORDER)
              dispatch('saveSortOrder')
              resolve(checklistItem)
            }
          )
        )
      )

    })
  },
  delistChecklist({ commit }, checklist) {
    return new Promise((resolve, reject) => {
        commit(DELETE_CHECKLIST, checklist)
        resolve()
    })
  },
  delistChecklistItem({ commit }, checklistItem) {
    return new Promise((resolve, reject) => {
        commit(DELIST_CHECKLIST_ITEM, checklistItem)
        resolve(checklistItem)
    })
  },
  observeChecklist({ commit }) {
    return new Promise((resolve, reject) => {
        commit(OBSERVE_CHECKLIST)
        resolve()
    })
  },
  observeCurrentEditableItem({ commit }) {
    return new Promise((resolve, reject) => {
        commit(OBSERVE_CURRENT_EDITABLE_ITEM)
        resolve()
    })
  },
  removeCurrentlyEditable({commit}) {
      return new Promise((resolve, reject) => {
          if (state.currentEditableItemIsExpanded) {
              commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION)
          }
          commit(DELETE_CURRENTLY_EDITABLE)
          resolve()
      })
  },
  replacePendingTask({ commit }, payload) {
    return new Promise((resolve, reject) => {
        commit(REPLACE_PENDING_TASK, payload)
        commit(UPDATE_ITEM_COUNTS, payload)
        resolve(payload)
    })
  },
  resetNewChecklistItem({commit}) {
      return new Promise((resolve, reject) => {
          commit(RESET_NEW_CHECKLIST_ITEM)
          resolve()
      })
  },
  saveChecklist({ dispatch, commit }, checklist) {
      return new Promise((resolve, reject) => {
        axios.patch('/lists/'+checklist.fake_id, {checklist:checklist})
             .then( response => dispatch('saveChecklistHandler', response).then(
                    response => resolve(response)
                  ) )
      })
  },
  saveChecklistHandler({ commit }, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data).then(
              (response) => {
                  if (response.data.checklist) {
                      commit(UPDATE_CHECKLIST, response.data.checklist)
                      resolve(response.data.checklist)
                  } else if (response.data.error) {
                      reject(response.data.error)
                  } else {
                      reject()
                  }
              }
          ).catch(
              (error) => reject(error)
          )
      } else if (response.data.checklist) {
          commit(UPDATE_CHECKLIST, response.data.checklist)
          resolve(response.data.checklist)
      } else if (response.data.error) {
          reject(response.data.error)
      } else {
          reject()
      }

    })
  },
  saveCurrentEditableItem({dispatch, commit}, item = null) {
      return new Promise((resolve, reject) => {
        if (item == null) {
            item = state.checklistItems[state.currentEditableItemIndex] ? state.checklistItems[state.currentEditableItemIndex] : reject('There is no item or currently editable item')
        }
        commit(ADD_UNFILTERED, item)
        axios.patch('/lists/item/' + item.id + '/update', {item:item})
             .then( response => resolve(dispatch('saveCurrentEditableItemHandler', response)) )
             .catch( error => reject(error) )
      })
  },
  saveCurrentEditableItemHandler({dispatch, commit}, response) {
      return new Promise((resolve, reject) => {
        if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
             .catch( error => reject(error) )
             .then( response => {
               dispatch('observeCurrentEditableItem')
                .then( () => resolve() )
                .catch( () => reject() )
              resolve()
             })

        } else if (response.data.item) {
            dispatch('observeCurrentEditableItem')
             .then( () => resolve() )
             .catch( () => reject() )
            resolve()
        } else {
          reject(response)
        }
      })
  },
  saveSortOrder({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      axios.patch('/lists/' + state.checklist.fake_id + '/save-sort-order', { checklistItems: state.checklistItems })
           .then( response => resolve( dispatch('saveSortOrderHandler', response) ))
           .catch( error => console.log(error) )
    })
  },
  saveSortOrderHandler({ dispatch, commit }, response) {
    return new Promise((resolve, reject) => {
      if (response.data.exceptions) {
        dispatch(
          'addNotice',
          { type: 'error',
            heading: 'Error!',
            message: 'The list could not be re-sorted at this time.',
            persist: false
          },
          {root: true}
        )
      }
     resolve()
    })
  },
  setCurentEditableItemDeadline({dispatch, commit}, date = null) {
      return new Promise((resolve, reject) => {
        commit(SET_CURRENT_EDITABLE_ITEM_DEADLINE, date)
        dispatch('saveCurrentEditableItem')
        .then( (success) => resolve(success) )
        .catch( (error) => reject(error) )
      })
  },
  setCurentEditableItemComments({dispatch, commit}, html = null) {
      return new Promise((resolve, reject) => {
        commit(SET_CURRENT_EDITABLE_ITEM_COMMENTS, html)
        resolve()
      })
  },
  setEditability({commit}, payload) {
      return new Promise((resolve, reject) => {
          payload.editable ? commit(ADD_EDITABLE, payload.item) : commit(DELETE_EDITABLE, payload.item)
          resolve()
      })
  },
  setFilterability({commit}, payload) {
      return new Promise((resolve, reject) => {
          payload.filterable ? commit(ADD_UNFILTERED, payload.item) : commit(DELETE_UNFILTERED, payload.item)
          resolve()
      })
  },
  setFilters: function({commit}, payload){
    return new Promise((resolve, reject) => {
        commit(UPDATE_FILTERS, payload)
        commit(DELETE_UNFILTERED)
        resolve()
    })
  },
  sortChecklistItems: function({commit}){
    return new Promise((resolve, reject) => {
        commit(SORT_CHECKLIST_ITEMS)
        resolve()
    })
  },
  storeChecklist({dispatch, commit}, checklist) {
    return new Promise((resolve, reject) => {
        axios.post('/lists', {checklist: checklist})
             .then( response => dispatch('storeChecklistHandler', response).then(
                    response => resolve(response)
                  ) )
    })
  },
  storeChecklistHandler({commit}, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data).then(
              (response) => {
                  if (response.data.checklist) {
                      commit(ADD_CHECKLIST, response.data.checklist)
                      resolve(response.data.checklist)
                  } else if (response.data.error) {
                      reject(response.data.error)
                  } else {
                      reject()
                  }
              }
          ).catch(
              (error) => reject(error)
          )
      } else if (response.data.checklist) {
          commit(ADD_CHECKLIST, response.data.checklist)
          resolve(response.data.checklist)
      } else if (response.data.error) {
          reject(response.data.error)
      } else {
          reject()
      }
    })
  },
  toggleCurrentEditableItemCheckMark({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
        commit(TOGGLE_CURRENT_EDITABLE_ITEM_CHECK_MARK)
        dispatch('saveCurrentEditableItem').then(
          () => resolve()
        ).catch(
          (error) => reject(error)
        )
    })
  },
  toggleCurrentEditableItemExpansion({ commit }) {
    return new Promise((resolve, reject) => {
        commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION)
        resolve()
    })
  },
  toggleCurentEditableItemImportance({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
        commit(TOGGLE_CURRENT_EDITABLE_ITEM_IMPORTANCE)
        dispatch('saveCurrentEditableItem')
        .then( () => resolve() )
        .catch( (error) => reject(error) )
    })
  },
  toggleCurentEditableItemUrgency({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
        commit(TOGGLE_CURRENT_EDITABLE_ITEM_URGENCY)
        dispatch('saveCurrentEditableItem')
        .then( () => resolve() )
        .catch( (error) => reject(error) )
    })
  },
  updateSortOrder({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit(UPDATE_SORT_ORDER)
      commit(SORT_CHECKLIST_ITEMS)
      dispatch('saveSortOrder')
        .then( () => resolve() )
        .catch( (error) => {
          console.log(error);
          commit(UNDO_UPDATE_SORT_ORDER) //WIP : set initial items
          reject()
        })

    })
  },
}

const getters = {
    checklists: state => state.checklists,
    checklist: state => state.checklist,
    unfilteredItems: state => state.unfilteredItems,
    delistedItems: state => state.delistedItems,
    filters: state => state.filters,
    newChecklistItem: state => state.newChecklistItem,
    currentEditableItemID: state => state.currentEditableItemID,
    currentEditableItemIndex: state => state.currentEditableItemIndex,
    checklistItems: state => state.checklistItems,
    currentEditableItemIndexIsSet: state => state.currentEditableItemIndex === null ? false : true,
    currentEditableItemIsExpanded: state => state.currentEditableItemIsExpanded,
    deadlinePlaceholder: state => state.checklistItems[state.currentEditableItemIndex]&&state.checklistItems[state.currentEditableItemIndex].deadline ? 'Due: ' + moment(state.checklistItems[state.currentEditableItemIndex].deadline).format('MMM D, YYYY') : 'No Due Date'
}

export default {
    state,
    mutations,
    actions,
    getters
}
