import {
    ADD_CHECKLIST,
    ADD_TO_ARRAY,
    ADD_UNFILTERED,
    ADD_ITEM_TO_CHECKLIST,
    ADD_SUB_ITEM_TO_CHECKLIST_ITEM,
    DECREMENT_ITEM_COUNT,
    DELETE_CHECKLIST,
    DELETE_UNFILTERED,
    DELETE_CHECKLIST_ITEM,
    DELIST_CHECKLIST_ITEM,
    REMOVE_FROM_ARRAY,
    UPDATE_FILTERS,
    UPDATE_CHECKLIST,
    UPDATE_CHECKLIST_ITEM,
    SET_EDITABLE_CHECKLIST_ITEM,
    SET_EDITABLE_CHECKLIST_ITEM_COMMENTS,
    SET_CHECKLIST_ITEM_DEADLINE,
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
    subItemChain: [],
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
    [ADD_TO_ARRAY] (state, payload = { array: null, item: null, addToTop: true }) {
      if (!! payload.item) {
        let index = payload.addToTop ? 0 : payload.array.length
        let alreadyInArray = payload.array.find( child => child.id == payload.item.id)
        if( ! alreadyInArray ) payload.array.splice(index, 0, payload.item)
      }
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
      // First, check for parent in checklistItems array
      let parent = payload.parent || findChecklistItemParent(state.checklistItems, payload.parent.id)
      // ...next, check in the editableSubItem and then the editableItem
      if ( ! parent && ! _.isEmpty(state.subItemChain[0].children) ) parent = findChecklistItemParent(state.subItemChain[0].children, payload.parent.id)
      if ( ! parent && ! _.isEmpty(state.editableItem.children) ) parent = findChecklistItemParent(state.editableItem.children, payload.parent.id)

      if( parent )
        if(parent.children !== undefined) parent.children.push(payload.child)
        else parent['children'] = payload.child
      // else console.log('parent not found');
    },
    [DECREMENT_ITEM_COUNT] (state, checklistID) {
      if ( ! _.isEmpty(state.checklists) ) {
        let i = _.findIndex(state.checklists, ['id', checklistID]);
        state.checklists[i].items_count = -- state.checklists[i].items_count
      }
    },
    [DELETE_CHECKLIST] (state, checklist) {
      if ( ! _.isEmpty(state.checklists) )
        state.checklists.splice(_.findIndex(state.checklists, ['id', checklist.id]), 1)
    },
    [DELETE_CHECKLIST_ITEM] (state, checklistItem) {
      let isSubItem = !! checklistItem.parent_id,
          haystack,
          index
      if (! isSubItem) haystack = state.checklistItems
      else {
        // First, check for parent in checklistItems array
        haystack = findChecklistItemParent(state.checklistItems, checklistItem.parent_id)
        // ...next, check in the editableSubItem and then the editableItem
        if ( ! haystack && ! _.isEmpty(state.subItemChain[0].children) ) haystack = findChecklistItemParent(state.subItemChain[0].children, checklistItem.parent_id)
        if ( ! haystack && ! _.isEmpty(state.editableItem.children) ) haystack = findChecklistItemParent(state.editableItem.children, checklistItem.parent_id)

        // remove it from editableItem or editableSubItem editableSubItem (fixes checklistitem tree not reflecting changes)
        if (state.editableItem.id == checklistItem.parent_id) {
          state.editableItem.children.splice(_.findIndex(state.editableItem.children, ['id', checklistItem.id]), 1)
        } else if (state.subItemChain[0].id == checklistItem.parent_id) {
          state.subItemChain[0].children.splice(_.findIndex(state.subItemChain[0].children, ['id', checklistItem.id]), 1)
        }
      }
      index = _.findIndex(haystack, ['id', checklistItem.id])
      if (! _.isEmpty(haystack) && index !== -1) haystack.splice(index, 1)
    },
    [DELIST_CHECKLIST_ITEM] (state, checklistItem) {
      state.delistedItems.unshift(checklistItem.id)
    },
    [DELETE_UNFILTERED] (state, item = null) {
      if (!! item && !! item.id) {
        let i = _.findIndex(state.unfilteredItems, ['id', item.id]);
        ~ i && state.unfilteredItems.splice(i,1)
      } else {
        state.unfilteredItems = []
      }
    },
    [REMOVE_FROM_ARRAY] (state, payload = { array: null, item: null, removePrecedingSubItems: false, removeAll: false }) {
      if(payload.removeAll || ! payload.item || ! payload.item.id) { // empties the entire array
        payload.array.splice(0,payload.array.length)
      } else {
        if( payload.removePrecedingSubItems ) { // remove every element that precedes the item
          payload.array.splice(0, _.findIndex(state.subItemChain, ['id', payload.item.id]))
        } else { // removes the item from the array
          let i = _.findIndex(payload.array, ['id', payload.item.id]);
          !! ~ i && payload.array.splice(i,1)
        }
      }
    },
    [SET_EDITABLE_CHECKLIST_ITEM] (state, item) {
      state.editableItem = item || {}
    },
    [SET_EDITABLE_CHECKLIST_ITEM_COMMENTS] (state, payload) {
      if (payload.isSubItem) state.subItemChain[0].comments = payload.html
      else state.editableItem.comments = payload.html
    },
    [SET_CHECKLIST_ITEM_DEADLINE] (state, payload) {
      let item
      if (payload.isSubItem) {
        if (!! state.subItemChain[0].id && state.subItemChain[0].id == payload.item.id) item = state.subItemChain[0]
        else {
          item = findChildItem( state.editableItem.children, payload.item.id )
          if( ! item ) item = findChildItem( state.subItemChain[0].children, payload.item.id)
        }
      } else { // If not a subItem
        if (!! state.editableItem.id && state.editableItem.id == payload.item.id) item = state.editableItem
        else item = findChildItem( state.checklistItems, payload.item.id )
      }

      if( !! item ) item.deadline = payload.date ? moment(payload.date).format('YYYY-MM-DD') : null
    },
    [SORT_CHECKLIST_ITEMS] (state) {
      state.checklistItems = sort(state.checklistItems).asc(i => i.sort_order)
    },
    [SORT_SUB_CHECKLIST_ITEMS] (state, payload) {

      let parent = findChecklistItemParent(state.checklistItems, payload.parent.id)

      if( parent && !! parent.children.length ) {
        sort(parent.children).asc(item => item.sort_order)
      }
    },
    [TOGGLE_ITEM_CHECK_MARK] (state, payload = {isSubItem: false}) {
      if (payload.isSubItem) {
        state.subItemChain[0].checked_at = state.subItemChain[0].checked_at ? null : moment().format()
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
        let i = _.findIndex(state.editableItem.children, ['id', payload.item.id]);
        state.editableItem.children[i].is_important = ! state.editableItem.children[i].is_important
      } else {
        console.log('is not sub item');
        let i = _.findIndex(state.checklistItems, ['id', payload.item.id]);
        state.checklistItems[i].is_important = ! state.checklistItems[i].is_important
      }
    },
    [TOGGLE_CHECKLIST_ITEM_URGENCY] (state, payload = {isSubItem: false}) {
      if (payload.isSubItem) {
        let i = _.findIndex(state.editableItem.children, ['id', payload.item.id]);
        state.editableItem.children[i].is_urgent = ! state.editableItem.children[i].is_urgent
      } else {
        let i = _.findIndex(state.checklistItems, ['id', payload.item.id]);
        state.checklistItems[i].is_urgent = ! state.checklistItems[i].is_urgent
      }
    },
    [UNDO_UPDATE_SORT_ORDER] (state) {
      // Maybe use https://github.com/pinguinjkeke/vue-local-storage or some other way to store/retrieve items
    },
    [UNSET_EDITABLE_CHECKLIST_ITEM] (state) {
      state.editableItem = {}
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
      if (!! updatedChecklist.title) state.checklist = updatedChecklist
    },
    [UPDATE_CHECKLIST_ITEM] (state, item) {
      let newItem = item.new,
          oldItem = item.old,
          isSubItem = !! newItem.parent_id,
          wasSubitem = !! oldItem.parent_id,
          parentItem = isSubItem ? state.checklistItems.find(checklistItem => checklistItem.id == item.new.parent_id) : null,
          source = wasSubitem ? state.editableItem.children : state.checklistItems,
          destination = ! isSubItem ? state.checklistItems : parentItem ? parentItem.children : null,
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
    [UPDATE_SORT_ORDER] (state) {
      for (var i = 0; i < state.checklistItems.length; i++) {
        state.checklistItems[i].sort_order = i
      }
    },
    [UPDATE_SUB_ITEM_SORT_ORDER] (state, payload) {
      let p = _.findIndex(state.checklistItems, ['id', payload.parent.id]);

      for (var i = 0; i < state.checklistItems[p].children.length; i++) {
      state.checklistItems[p].children[i].sort_order = i
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
  addCurrentlyEditable({commit, state}, payload = {item: null, isSubItem: false}) {
      return new Promise((resolve, reject) => {
        if (payload.isSubItem) {
          commit(ADD_TO_ARRAY, { array: state.subItemChain, item: payload.item, addToTop: true })
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
      let parentModel = checklistItem.parent_id ? 'checklist-item' : 'checklist',
          isSubItem = checklistItem.parent_id ? true : false;
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
  removeCurrentlyEditable({commit, state, dispatch, getters}, payload = {isSubItem: false, deselect: false, removePrecedingSubItems: false, item: null }) {
      return new Promise((resolve, reject) => {
        if (payload.isSubItem && state.editableSubItemIsExpanded || ! payload.isSubItem && state.editableItemIsExpanded || ! payload.isSubItem && state.editableSubItemIsExpanded) {
          commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION, payload)
        }
        if (!! payload.deselect) {
          let listing = payload.isSubItem ? getters.editableItem : state.editableItem
          dispatch('deselect', {listing, model: 'checklist-item', preserveState: true}, {root: true})
        }

        let removePrecedingSubItems = payload.removePrecedingSubItems || false,
            item = ! payload.isSubItem ? null : removePrecedingSubItems ? payload.item : getters.editableSubItem,
            removeAll = ! payload.isSubItem,
            inSubItemChain = item && payload.isSubItem && _.some(getters.subItemChain, ['id', item.id])

        if (! payload.isSubItem) {
          commit(UNSET_EDITABLE_CHECKLIST_ITEM)
        }

        // If the item is in the subItemChain,
        if ( inSubItemChain || removeAll ) {
          // Remove the item from the subItemChain
          commit(REMOVE_FROM_ARRAY, { array: state.subItemChain, item, removePrecedingSubItems, removeAll })
        }

        // add it to selected
        if( inSubItemChain && getters.editableSubItem.id ) dispatch( 'addToSelected', { model: 'checklist-item', listing: getters.editableSubItem }, { root: true } )
        else if( getters.editableItem.id ) dispatch( 'addToSelected', { model: 'checklist-item', listing: getters.editableItem }, { root: true } )

        resolve()
      })
  },
  updateChecklistItem({ commit }, item) {
    return new Promise((resolve, reject) => {
        commit(UPDATE_CHECKLIST_ITEM, item)
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
  saveChecklistItem({dispatch, commit, state, getters}, payload = { item: null, isSubItem: false }) {
      return new Promise((resolve, reject) => {
        let item = payload.item
        if( ! item ) item = payload.isSubItem ? getters.editableSubItem : state.editableItem

        if (!! item) {
          commit(ADD_UNFILTERED, item)
          axios.patch('/lists/item/' + item.id + '/update', {item:item})
               .then( response => resolve(dispatch('saveChecklistItemHandler', response)) )
               .catch( error => reject(error) )
        } else {
          reject('There is no item or currently editable item')
        }
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
  // setFilterability({commit}, payload) {
  //     return new Promise((resolve, reject) => {
  //         payload.filterable ? commit(ADD_UNFILTERED, payload.item) : commit(DELETE_UNFILTERED, payload.item)
  //         resolve()
  //     })
  // },
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
  toggleItemCheckMark({ dispatch, commit, state, getters }, payload) {
    return new Promise((resolve, reject) => {
      if (!payload.item) payload.item = payload.isSubItem ? getters.editableItem : state.editableItem ? state.editableItem  : null
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
  toggleChecklistItemImportance({ dispatch, commit, state, getters }, payload) {
    return new Promise((resolve, reject) => {
      if(! payload.item) {
        if (payload.isSubItem) {
          payload.item = getters.editableItem.id !== undefined ? getters.editableItem : reject('There is no item or currently editable sub item')
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
  toggleChecklistItemUrgency({ dispatch, commit, state, getters }, payload) {
    return new Promise((resolve, reject) => {
      if(! payload.item) {
        if (payload.isSubItem) {
          payload.item = getters.editableItem.id !== undefined ? getters.editableItem : reject('There is no item or currently editable sub item')
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
    checklistItems: state => state.checklistItems,
    delistedItems: state => state.delistedItems,
    editableItem: state => state.editableItem,
    editableSubItem: state => state.subItemChain[0] || {},
    editableItemIsExpanded: state => state.editableItemIsExpanded,
    editableSubItemIsExpanded: state => state.editableSubItemIsExpanded,
    filters: state => state.filters,
    subItemChain: state => state.subItemChain,
    unfilteredItems: state => state.unfilteredItems,
}

function findChecklistItemParent(itemsArray, parentId) {
  let parent = itemsArray.find(item => item.id == parentId)
  if(!! parent) return parent
  else {
    for (let item of itemsArray) {
      if( !! item.children.length ) {
        parent = findChecklistItemParent(item.children, parentId)
          if(!! parent) return parent
      }
    }
  }
  return parent // will return 'undefined'
} // end findChecklistItemParent

function findChildItem(itemsArray, childId) {
  let child = itemsArray.find(item => item.id == childId)
  if(!! child) return child
  else {
    for (let item of itemsArray.children) {
      if( !! item.children.length ) {
        child = findChildItem(item.children, childId)
          if(!! child) return child
      }
    }
  }
  return child // will return 'undefined'
} // end findChildItem

// var flattenArr = (arr) => arr.reduce((flat, next) => flat.concat(Array.isArray(next) ? flatten(next) : next), []);

export default {
    state,
    mutations,
    actions,
    getters
}
