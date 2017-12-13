import {
    ADD_CHECKLIST,
    ADD_UNFILTERED,
    ADD_ITEM_TO_CHECKLIST,
    ADD_SUB_ITEM_TO_CHECKLIST_ITEM,
    DECREMENT_ITEM_COUNT,
    DELETE_CHECKLIST,
    DELETE_UNFILTERED,
    DELETE_CHECKLIST_ITEM,
    DELIST_CHECKLIST_ITEM,
    INCREMENT_ITEM_COUNT,
    UPDATE_FILTERS,
    UPDATE_CHECKLIST,
    UPDATE_ITEM_COUNTS,
    REPLACE_PENDING_TASK,
    SET_EDITABLE_CHECKLIST_ITEM,
    SET_EDITABLE_CHECKLIST_ITEM_COMMENTS,
    SET_EDITABLE_CHECKLIST_ITEM_DEADLINE,
    SORT_CHECKLIST_ITEMS,
    SORT_SUB_CHECKLIST_ITEMS,
    TOGGLE_CURRENT_EDITABLE_ITEM_CHECK_MARK,
    TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION,
    TOGGLE_CURRENT_EDITABLE_ITEM_IMPORTANCE,
    TOGGLE_CURRENT_EDITABLE_ITEM_URGENCY,
    UNDO_UPDATE_SORT_ORDER,
    UNSET_EDITABLE_CHECKLIST_ITEM,
    UPDATE_SORT_ORDER,
    UPDATE_SUB_ITEM_SORT_ORDER
} from '../mutations'

import sort from 'fast-sort';

const namespaced = true;

const state = {
    checklists: Productivity.checklists ? Productivity.checklists: [],
    checklist: Productivity.checklist ? Productivity.checklist: [],
    checklistItems: Productivity.checklistItems ? Productivity.checklistItems : [],
    unfilteredItems: [],
    editableChecklistItem: {},
    currentEditableItemIsExpanded: false,
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
    [ADD_UNFILTERED] (state, item) {
      if( ! state.unfilteredItems.includes(item.id) ) {
        state.unfilteredItems.unshift(item.id)
      }
    },
    [ADD_ITEM_TO_CHECKLIST] (state, item) {
      state.checklistItems.push(item)
    },
    [ADD_SUB_ITEM_TO_CHECKLIST_ITEM] (state, payload) {
      let i = _.findIndex(state.checklistItems, ['id', payload.parent.id]);
      if( i == -1 ) return false;
      state.checklistItems[i].child_list_items.push(payload.child)
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
        }
    },
    [DELIST_CHECKLIST_ITEM] (state, checklistItem) {
        state.delistedItems.unshift(checklistItem.id)
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
    [SET_EDITABLE_CHECKLIST_ITEM] (state, item) {
        let i = _.findIndex(state.checklistItems, ['id', item.id]);
        if( i !== -1 ) state.editableChecklistItem = state.checklistItems[i]
    },
    [SET_EDITABLE_CHECKLIST_ITEM_COMMENTS] (state, html = null) {
      state.editableChecklistItem.comments = html
    },
    [SET_EDITABLE_CHECKLIST_ITEM_DEADLINE] (state, date = null) {
      state.editableChecklistItem.deadline = date ? moment(date).format('YYYY-MM-DD') : null
    },
    [UNSET_EDITABLE_CHECKLIST_ITEM] (state) {
        state.editableChecklistItem = {}
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_CHECK_MARK] (state) {
      state.editableChecklistItem.checked_at = state.editableChecklistItem.checked_at ? null : moment().format()
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION] (state) {
        state.currentEditableItemIsExpanded = ! state.currentEditableItemIsExpanded
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_IMPORTANCE] (state) {
        state.editableChecklistItem.is_important = ! state.editableChecklistItem.is_important
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_URGENCY] (state) {
        state.editableChecklistItem.is_urgent = ! state.editableChecklistItem.is_urgent
    },
    [SORT_CHECKLIST_ITEMS] (state) {
      state.checklistItems = sort(state.checklistItems).asc(i => i.sort_order)
    },
    [SORT_SUB_CHECKLIST_ITEMS] (state, payload) {
      let i = _.findIndex(state.checklistItems, ['id', payload.parent.id]);
      state.checklistItems[i].child_list_items = sort(state.checklistItems[i].child_list_items).asc(item => item.sort_order)
    },
    [UNDO_UPDATE_SORT_ORDER] (state) {
      // Maybe use https://github.com/pinguinjkeke/vue-local-storage or some other way to store/retrieve items
    },
    [UPDATE_SORT_ORDER] (state) {
      for (var i = 0; i < state.checklistItems.length; i++) {
        state.checklistItems[i].sort_order = i
      }
    },
    [UPDATE_SUB_ITEM_SORT_ORDER] (state, payload) {
      let p = _.findIndex(state.checklistItems, ['id', payload.parent.id]);

      for (var i = 0; i < state.checklistItems[p].child_list_items.length; i++) {
      state.checklistItems[p].child_list_items[i].sort_order = i
      }
    },
}

const actions = {
  addChecklistItem({dispatch, commit}, payload) {
      return new Promise((resolve, reject) => {
          axios.post('/lists/' + payload.parent.fake_id + '/add-item', {item:payload.item})
               .then( response => dispatch('addChecklistItemHandler', response)
                                    .then( response => resolve(response) ) )
      })
  },
  addChecklistItemHandler({commit}, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
          .then( (response) => {
                  if (response.data.item) {
                      commit(ADD_ITEM_TO_CHECKLIST, response.data.item)
                      commit(SORT_CHECKLIST_ITEMS)
                      commit(ADD_UNFILTERED, response.data.item)
                      resolve(response.data.item)
                  } else if (response.data.error) {
                      reject(response.data.error)
                  } else {
                      reject()
                  }
              } )
          .catch( error => reject(error) )
      } else if (response.data.item) {
          commit(ADD_ITEM_TO_CHECKLIST, response.data.item)
          commit(SORT_CHECKLIST_ITEMS)
          commit(ADD_UNFILTERED, response.data.item)
          resolve(response.data.item)
      } else if (response.data.error) {
          reject(response.data.error)
      } else {
          reject()
      }
    })
  },
  addSubChecklistItem({dispatch, commit}, payload) {
      return new Promise((resolve, reject) => {
          axios.post('/lists/item/' + payload.parent.id + '/add-sub-item', {item:payload.item})
               .then( response => dispatch('addSubChecklistItemHandler', {parent:payload.parent, response:response})
                                    .then( response => resolve(response) ) )
      })
  },
  addSubChecklistItemHandler({commit}, payload) {
    return new Promise((resolve, reject) => {
      let parent = payload.parent;
      if (payload.response.data.tokenMismatch) {
          Vue.handleTokenMismatch(payload.response.data)
          .then( (response) => {
                  if (response.data.item) {
                      commit(ADD_SUB_ITEM_TO_CHECKLIST_ITEM, {parent, child: response.data.item})
                      commit(SORT_SUB_CHECKLIST_ITEMS, {parent})
                      resolve(response.data.item)
                  } else if (response.data.error) {
                      reject(response.data.error)
                  } else {
                      reject()
                  }
              } )
          .catch( error => reject(error) )
      } else if (payload.response.data.item) {
          commit(ADD_SUB_ITEM_TO_CHECKLIST_ITEM, {parent, child: payload.response.data.item})
          commit(SORT_SUB_CHECKLIST_ITEMS, {parent})
          resolve(payload.response.data.item)
      } else if (payload.response.data.error) {
          reject(payload.response.data.error)
      } else {
          reject()
      }
    })
  },
  addCurrentlyEditable({commit}, item) {
      return new Promise((resolve, reject) => {
          commit(SET_EDITABLE_CHECKLIST_ITEM, item)
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
              dispatch('saveSortOrder', {checklistItems: state.checklistItems, parent: state.checklist, parentModel: 'checklist'})
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
  removeCurrentlyEditable({commit}) {
      return new Promise((resolve, reject) => {
          if (state.currentEditableItemIsExpanded) {
              commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION)
          }
          commit(UNSET_EDITABLE_CHECKLIST_ITEM)
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
  // resetNewChecklistItem({commit}) {
  //     return new Promise((resolve, reject) => {
  //         commit(RESET_NEW_CHECKLIST_ITEM)
  //         resolve()
  //     })
  // },
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
            item = state.editableChecklistItem.id !== undefined ? state.editableChecklistItem : reject('There is no item or currently editable item')
        }
        commit(ADD_UNFILTERED, item)
        axios.patch('/lists/item/' + item.id + '/update', {item:item})
             .then( response => resolve(dispatch('saveCurrentEditableItemHandler', response)) )
             .catch( error => reject(error) )
      })
  },
  checkChecklistItem({dispatch, commit}, item) {
      return new Promise((resolve, reject) => {
        item.checked_at = item.checked_at ? null : moment().format();
        commit(ADD_UNFILTERED, item)
        axios.patch('/lists/item/' + item.id + '/check', {item:item})
             .then( response => resolve(dispatch('saveCurrentEditableItemHandler', response)) )
             .catch( error => reject(error) )
      })
  },
  saveCurrentEditableItemHandler({dispatch, commit}, response) {
      return new Promise((resolve, reject) => {
        if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
             .catch( error => reject(error) )
             .then( response => resolve() )
        } else if (response.data.item) {
            resolve()
        } else {
          reject(response)
        }
      })
  },
  saveSortOrder({ commit, state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      axios.patch('/lists/save-sort-order', payload)
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
        commit(SET_EDITABLE_CHECKLIST_ITEM_DEADLINE, date)
        dispatch('saveCurrentEditableItem')
        .then( (success) => resolve(success) )
        .catch( (error) => {
          dispatch(
            'addNotice',
            { type: 'error',
              heading: 'Error!',
              message: 'There was a problem setting the deadline.',
              persist: false
            },
            {root: true}
          )
          reject(error)
        })
      })
  },
  setCurentEditableItemComments({dispatch, commit}, html = null) {
      return new Promise((resolve, reject) => {
        commit(SET_EDITABLE_CHECKLIST_ITEM_COMMENTS, html)
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
  sortChecklistItems: function({commit}, payload = { parentModel: 'checklist' }){
    return new Promise((resolve, reject) => {
      switch (payload.parentModel) {
        case 'checklist-item':
          if(payload.parent) {
            commit(SORT_SUB_CHECKLIST_ITEMS, {parent: payload.parent})
          } else {
            console.log('Error: no parent included in the payload');
          }
          break;
        default: commit(SORT_CHECKLIST_ITEMS)

      }
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
  updateSortOrder({ commit, state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      if (payload.parentModel == 'checklist') {
        commit(UPDATE_SORT_ORDER)
        commit(SORT_CHECKLIST_ITEMS)
      } else if (payload.parentModel == 'checklistItem') {
        commit(UPDATE_SUB_ITEM_SORT_ORDER, payload)
        commit(SORT_SUB_CHECKLIST_ITEMS, payload)
      }

      dispatch('saveSortOrder', payload)
        .then( () => resolve() )
        .catch( (error) => {
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
    editableChecklistItem: state => state.editableChecklistItem,
    currentEditableItemIsExpanded: state => state.currentEditableItemIsExpanded,
    checklistItems: state => state.checklistItems,
    deadlinePlaceholder: state => state.editableChecklistItem&&state.editableChecklistItem.deadline ? 'Due: ' + moment(state.editableChecklistItem.deadline).format('MMM D, YYYY') : 'No Due Date'
}

export default {
    state,
    mutations,
    actions,
    getters
}
