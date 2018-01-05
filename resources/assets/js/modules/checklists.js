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
    UPDATE_FILTERS,
    UPDATE_CHECKLIST,
    UPDATE_CHECKLIST_ITEM,
    SET_EDITABLE_CHECKLIST_ITEM,
    SET_EDITABLE_CHECKLIST_ITEM_COMMENTS,
    SET_CHECKLIST_ITEM_DEADLINE,
    SET_EDITABLE_SUB_CHECKLIST_ITEM,
    SORT_CHECKLIST_ITEMS,
    SORT_SUB_CHECKLIST_ITEMS,
    TOGGLE_ITEM_CHECK_MARK,
    TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION,
    TOGGLE_CHECKLIST_ITEM_IMPORTANCE,
    TOGGLE_CHECKLIST_ITEM_URGENCY,
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
    editableItem: {},
    editableSubItem: {},
    editableItemIsExpanded: false,
    editableSubItemIsExpanded: false,
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
      state.checklistItems.find(checklistItem => checklistItem.id == payload.parent.id)
                          .child_list_items.push(payload.child)
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
      let isSubItem = !! checklistItem.checklist_id,
          // source = isSubItem ? state.editableItem.child_list_items : state.checklistItems,
          source = isSubItem ? state.checklistItem.child_list_items : state.checklistItems,
          index = _.findIndex(source, ['id', checklistItem.id])

      // if (isSubItem && ! _.isEmpty(state.editableItem.child_list_items)) {
      //   let i = _.findIndex(state.editableItem.child_list_items, ['id', checklistItem.id]);
      //   state.editableItem.child_list_items.splice(i,1)
      // } else if (!isSubItem && ! _.isEmpty(state.checklistItems) {
      //   let i = _.findIndex(state.checklistItems, ['id', checklistItem.id]);
      //   state.checklistItems.splice(i,1)
      // }

      if (! _.isEmpty(source)) source.splice(index, 1)
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
    [UPDATE_CHECKLIST_ITEM] (state, item) {
      let newItem = item.new,
          oldItem = item.old,
          isSubItem = !! newItem.parent_checklist_item_id,
          wasSubitem = !! oldItem.parent_checklist_item_id,
          parentItem = isSubItem ? state.checklistItems.find(checklistItem => checklistItem.id == item.new.parent_checklist_item_id) : null,
          source = wasSubitem ? state.editableItem.child_list_items : state.checklistItems,
          destination = ! isSubItem ? state.checklistItems : parentItem ? parentItem.child_list_items : null,
          index = _.findIndex(source, ['id', oldItem.id])

      if (isSubItem == wasSubitem) {
        if (source) source.splice(index, 1, newItem)
      } else {
        if (source) source.splice(index, 1)
        if (destination) destination.push(newItem)
      }

      if (! wasSubitem) { // If the old item was not a subitem, update item counts
        let oldChecklist = state.checklists.find(checklist => checklist.id == oldItem.checklist_id)
        if (oldChecklist) oldChecklist.items_count = -- oldChecklist.items_count

        let newChecklist = state.checklists.find(checklist => checklist.id == newItem.checklist_id)
        if (newChecklist) newChecklist.items_count = ++ newChecklist.items_count
      }

    },
    [SET_EDITABLE_CHECKLIST_ITEM] (state, item) {
        let i = _.findIndex(state.checklistItems, ['id', item.id]);
        if( i !== -1 ) state.editableItem = state.checklistItems[i]
    },
    [SET_EDITABLE_SUB_CHECKLIST_ITEM] (state, item) {
        let i = _.findIndex(state.editableItem.child_list_items, ['id', item.id]);
        if( i !== -1 ) state.editableSubItem = state.editableItem.child_list_items[i]
    },
    [SET_EDITABLE_CHECKLIST_ITEM_COMMENTS] (state, payload) {
      if (payload.isSubItem) {
        state.editableSubItem.comments = payload.html
      } else {
        state.editableItem.comments = payload.html
      }
    },
    [SET_CHECKLIST_ITEM_DEADLINE] (state, payload) {
      if (payload.isSubItem) {

        if (state.editableSubItem && state.editableSubItem.id) {
          state.editableSubItem.deadline = payload.date ? moment(payload.date).format('YYYY-MM-DD') : null
        } else {
          let i = _.findIndex(state.editableItem.child_list_items, ['id', payload.item.id]);
          if( i !== -1 ) state.editableItem.child_list_items[i].deadline = payload.date ? moment(payload.date).format('YYYY-MM-DD') : null
        }

      } else {

        if (state.editableItem && state.editableItem.id) {
          state.editableItem.deadline = payload.date ? moment(payload.date).format('YYYY-MM-DD') : null.deadline = payload.date ? moment(payload.date).format('YYYY-MM-DD') : null
        } else {
          let i = _.findIndex(state.checklistItems, ['id', payload.item.id]);
          if( i !== -1 ) state.checklistItems[i].deadline = payload.date ? moment(payload.date).format('YYYY-MM-DD') : null
        }

      }
    },
    [SORT_CHECKLIST_ITEMS] (state) {
      state.checklistItems = sort(state.checklistItems).asc(i => i.sort_order)
    },
    [SORT_SUB_CHECKLIST_ITEMS] (state, payload) {
      let i = _.findIndex(state.checklistItems, ['id', payload.parent.id]);
      state.checklistItems[i].child_list_items = sort(state.checklistItems[i].child_list_items).asc(item => item.sort_order)
    },
    [TOGGLE_ITEM_CHECK_MARK] (state, payload = {isSubItem: false}) {
      if (payload.isSubItem) {
        state.editableSubItem.checked_at = state.editableSubItem.checked_at ? null : moment().format()
      } else {
        state.editableItem.checked_at = state.editableItem.checked_at ? null : moment().format()
      }
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION] (state, payload = {isSubItem: false}) {
        if (payload.isSubItem) {
          state.editableSubItemIsExpanded = ! state.editableSubItemIsExpanded
        } else {
          state.editableSubItemIsExpanded = false
          state.editableItemIsExpanded = ! state.editableItemIsExpanded
        }
    },
    [TOGGLE_CHECKLIST_ITEM_IMPORTANCE] (state, payload = {isSubItem: false}) {
      if (payload.isSubItem) {
        console.log('is sub item');
        let i = _.findIndex(state.editableItem.child_list_items, ['id', payload.item.id]);
        state.editableItem.child_list_items[i].is_important = ! state.editableItem.child_list_items[i].is_important
      } else {
        console.log('is not sub item');
        let i = _.findIndex(state.checklistItems, ['id', payload.item.id]);
        state.checklistItems[i].is_important = ! state.checklistItems[i].is_important
      }
    },
    [TOGGLE_CHECKLIST_ITEM_URGENCY] (state, payload = {isSubItem: false}) {
      if (payload.isSubItem) {
        let i = _.findIndex(state.editableItem.child_list_items, ['id', payload.item.id]);
        state.editableItem.child_list_items[i].is_urgent = ! state.editableItem.child_list_items[i].is_urgent
      } else {
        let i = _.findIndex(state.checklistItems, ['id', payload.item.id]);
        state.checklistItems[i].is_urgent = ! state.checklistItems[i].is_urgent
      }
    },
    [UNDO_UPDATE_SORT_ORDER] (state) {
      // Maybe use https://github.com/pinguinjkeke/vue-local-storage or some other way to store/retrieve items
    },
    [UNSET_EDITABLE_CHECKLIST_ITEM] (state, payload = {isSubItem: false}) {
        if (payload.isSubItem) {
          state.editableSubItem = {}
        } else {
          state.editableItem = state.editableSubItem = {}
        }
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
  addCurrentlyEditable({commit}, payload = {isSubItem: false}) {
      return new Promise((resolve, reject) => {
        if (payload.isSubItem) {
          commit(SET_EDITABLE_SUB_CHECKLIST_ITEM, payload.item)
        } else {
          commit(SET_EDITABLE_CHECKLIST_ITEM, payload.item)
        }
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
      let parentModel = checklistItem.parent_checklist_item_id ? 'checklist-item' : 'checklist',
          isSubItem = checklistItem.parent_checklist_item_id ? true : false;
      dispatch('delistChecklistItem', checklistItem).then(
        () => dispatch('deselect', { model: 'checklist-item', listing: checklistItem }, {root: true}).then(
          () => dispatch('removeCurrentlyEditable', {isSubItem: isSubItem}).then(
            () => {
              commit(DECREMENT_ITEM_COUNT, checklistItem.checklist_id)
              commit(DELETE_CHECKLIST_ITEM, checklistItem)
              commit(UPDATE_SORT_ORDER)
              dispatch('saveSortOrder', {checklistItems: state.checklistItems, parent: state.checklist, parentModel})
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
  removeCurrentlyEditable({commit, state, dispatch}, payload = {isSubItem: false, deselect: false}) {
      return new Promise((resolve, reject) => {
        if (payload.isSubItem && state.editableSubItemIsExpanded || ! payload.isSubItem && state.editableItemIsExpanded || ! payload.isSubItem && state.editableSubItemIsExpanded) {
          commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION, payload)
        }
        if (!! payload.deselect) {
          let listing = payload.isSubItem ? state.editableSubItem : state.editableItem
          dispatch('deselect', {listing, model: 'checklist-item', preserveState: true}, {root: true})
        }
        commit(UNSET_EDITABLE_CHECKLIST_ITEM, payload)
        resolve()
      })
  },
  updateChecklistItem({ commit }, item) {
    return new Promise((resolve, reject) => {
        commit(UPDATE_CHECKLIST_ITEM, item)

        // if (!! item.old.checklist_id) {
        //   dispatch('saveSortOrder', { checklistItems: state.checklistItem.child_list_items, parent: state.checklistItem, parentModel: 'checklist-item' })
        // } else {
        //   dispatch('saveSortOrder', { checklistItems: state.checklistItems, parent: state.checklist, parentModel: 'checklist' })
        // }
        //
        // if (!! item.new.checklist_id) {
        //   dispatch('saveSortOrder', { checklistItems: state.checklistItem.child_list_items, parent: state.checklistItem, parentModel: 'checklist-item' })
        // } else {
        //   dispatch('saveSortOrder', { checklistItems: state.checklistItems, parent: state.checklist, parentModel: 'checklist' })
        // }

        resolve(item)
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
  saveChecklistItem({dispatch, commit, state}, payload = { item: null, isSubItem: false }) {
      return new Promise((resolve, reject) => {
        let item
        if(! payload.item) {
          if (payload.isSubItem) {
            item = state.editableSubItem.id !== undefined ? state.editableSubItem : reject('There is no item or currently editable sub item')
          } else {
            item = state.editableItem.id !== undefined ? state.editableItem : reject('There is no item or currently editable item')
          }
        } else {
          item = payload.item
        }
        commit(ADD_UNFILTERED, item)
        axios.patch('/lists/item/' + item.id + '/update', {item:item})
             .then( response => resolve(dispatch('saveChecklistItemHandler', response)) )
             .catch( error => reject(error) )
      })
  },
  checkChecklistItem({dispatch, commit}, item) {
      return new Promise((resolve, reject) => {
        item.checked_at = item.checked_at ? null : moment().format();
        commit(ADD_UNFILTERED, item)
        axios.patch('/lists/item/' + item.id + '/check', {item:item})
             .then( response => resolve(dispatch('saveChecklistItemHandler', response)) )
             .catch( error => reject(error) )
      })
  },
  saveChecklistItemHandler({dispatch, commit}, response) {
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
  setChecklistItemDeadline({dispatch, commit, state}, payload = {item: null, date: null, isSubItem: false}) {
      return new Promise((resolve, reject) => {
        commit(SET_CHECKLIST_ITEM_DEADLINE, payload)
        dispatch('saveChecklistItem', payload)
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
  setCurrentEditableItemComments({dispatch, commit}, payload = {html: null, isSubItem: false}) {
      return new Promise((resolve, reject) => {
        commit(SET_EDITABLE_CHECKLIST_ITEM_COMMENTS, payload)
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
  toggleItemCheckMark({ dispatch, commit, state }, payload) {
    return new Promise((resolve, reject) => {
      if (!payload.item) payload.item = payload.isSubItem ? state.editableSubItem : state.editableItem ? state.editableItem  : null
      commit(TOGGLE_ITEM_CHECK_MARK, payload)
      dispatch('saveChecklistItem', payload).then(
        () => resolve()
      ).catch(
        (error) => reject(error)
      )
    })
  },
  toggleCurrentEditableItemExpansion({ commit }, payload) {
    return new Promise((resolve, reject) => {
        commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION, payload)
        resolve()
    })
  },
  toggleChecklistItemImportance({ dispatch, commit, state }, payload) {
    return new Promise((resolve, reject) => {
      if(! payload.item) {
        if (payload.isSubItem) {
          payload.item = state.editableSubItem.id !== undefined ? state.editableSubItem : reject('There is no item or currently editable sub item')
        } else {
          payload.item = state.editableItem.id !== undefined ? state.editableItem : reject('There is no item or currently editable item')
        }
      }
      commit(TOGGLE_CHECKLIST_ITEM_IMPORTANCE, payload)
      dispatch('saveChecklistItem', payload)
      .then( () => resolve() )
      .catch( (error) => reject(error) )
    })
  },
  toggleChecklistItemUrgency({ dispatch, commit, state }, payload) {
    return new Promise((resolve, reject) => {
      if(! payload.item) {
        if (payload.isSubItem) {
          payload.item = state.editableSubItem.id !== undefined ? state.editableSubItem : reject('There is no item or currently editable sub item')
        } else {
          payload.item = state.editableItem.id !== undefined ? state.editableItem : reject('There is no item or currently editable item')
        }
      }
      commit(TOGGLE_CHECKLIST_ITEM_URGENCY, payload)
      dispatch('saveChecklistItem', payload)
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
    checklists: state => _.orderBy(state.checklists, 'title'),
    checklist: state => state.checklist,
    unfilteredItems: state => state.unfilteredItems,
    delistedItems: state => state.delistedItems,
    filters: state => state.filters,
    editableItem: state => state.editableItem,
    editableSubItem: state => state.editableSubItem,
    editableItemIsExpanded: state => state.editableItemIsExpanded,
    editableSubItemIsExpanded: state => state.editableSubItemIsExpanded,
    checklistItems: state => state.checklistItems,
}

export default {
    state,
    mutations,
    actions,
    getters
}
