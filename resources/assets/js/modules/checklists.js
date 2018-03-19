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
        state.unfilteredItems.splice(0, 0, item.id)
      }
    },
    [ADD_ITEM_TO_CHECKLIST] (state, item) {
      state.checklistItems.splice(state.checklistItems.length, 0, item)
    },
    [ADD_SUB_ITEM_TO_CHECKLIST_ITEM] (state, payload) {
      if(payload.parent.sub_items == undefined) Vue.set(payload.parent, 'sub_items', [])
      payload.parent.sub_items.splice(payload.parent.sub_items.length, 0, payload.child)
    },
    [DECREMENT_ITEM_COUNT] (state, checklistItem) {
      if(checklistItem.items_count) Vue.set(checklistItem, 'items_count', -- checklistItem.items_count)
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
        if ( ! haystack && ! _.isEmpty(state.subItemChain[0].sub_items) ) haystack = findChecklistItemParent(state.subItemChain[0].sub_items, checklistItem.parent_id)
        if ( ! haystack && ! _.isEmpty(state.editableItem.sub_items) ) haystack = findChecklistItemParent(state.editableItem.sub_items, checklistItem.parent_id)

        // remove it from editableItem or editableSubItem editableSubItem (fixes checklistitem tree not reflecting changes)
        if (state.editableItem.id == checklistItem.parent_id) {
          state.editableItem.sub_items.splice(_.findIndex(state.editableItem.sub_items, ['id', checklistItem.id]), 1)
        } else if (state.subItemChain[0].id == checklistItem.parent_id) {
          state.subItemChain[0].sub_items.splice(_.findIndex(state.subItemChain[0].sub_items, ['id', checklistItem.id]), 1)
        }
      }
      index = _.findIndex(haystack, ['id', checklistItem.id])
      if (! _.isEmpty(haystack) && index !== -1) haystack.splice(index, 1)
    },
    [DELIST_CHECKLIST_ITEM] (state, checklistItem) {
      state.delistedItems.splice(0, 0, checklistItem.id)
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
          ~ i && payload.array.splice(i,1)
        }
      }
    },
    [SET_EDITABLE_CHECKLIST_ITEM] (state, item = {}) {
      Vue.set(state, 'editableItem', item)
    },
    [SET_EDITABLE_CHECKLIST_ITEM_COMMENTS] (state, payload) {
      Vue.set(payload.item, 'comments', payload.html)
    },
    [SET_CHECKLIST_ITEM_DEADLINE] (state, payload) {
      Vue.set(payload.item, 'deadline', payload.date ? moment(payload.date).format('YYYY-MM-DD') : null)
    },
    [SORT_CHECKLIST_ITEMS] (state) {
      state.checklistItems = sort(state.checklistItems).asc(i => i.sort_order)
    },
    [SORT_SUB_CHECKLIST_ITEMS] (state, payload) {
      if( payload.parent.sub_items.length ) {
        sort(payload.parent.sub_items).asc(item => item.sort_order)
      }
    },
    [TOGGLE_ITEM_CHECK_MARK] (state, item) {
      Vue.set(item, 'checked_at', item.checked_at ? null : moment().format())
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION] (state, item) {
      if(item.isExpanded == undefined) Vue.set(item, 'isExpanded', true)
      else Vue.set(item, 'isExpanded', ! item.isExpanded)
    },
    [TOGGLE_CHECKLIST_ITEM_IMPORTANCE] (state, item) {
      Vue.set(item, 'is_important', ! item.is_important)
    },
    [TOGGLE_CHECKLIST_ITEM_URGENCY] (state, item) {
      Vue.set(item, 'is_urgent', ! item.is_urgent)
    },
    [UNDO_UPDATE_SORT_ORDER] (state) {
      // Maybe use https://github.com/pinguinjkeke/vue-local-storage or some other way to store/retrieve items
    },
    [UNSET_EDITABLE_CHECKLIST_ITEM] (state) {
      Vue.set(state, 'editableItem', {})
    },
    [UPDATE_FILTERS] (state, payload) {
      switch (payload.type) {
        case 'checked':
          Vue.set(state.filters, 'checked', payload.value)
          break;
        case 'priority':
          Vue.set(state.filters, 'priority', payload.value)
          break;
      }
    },
    [UPDATE_CHECKLIST] (state, updatedChecklist) {
      Vue.set(state, 'checklist', updatedChecklist)
    },
    [UPDATE_CHECKLIST_ITEM] (state, item) {
      let newItem = item.new,
          oldItem = item.old,
          isSubItem = !! newItem.parent_id,
          wasSubitem = !! oldItem.parent_id,
          parentItem = isSubItem ? state.checklistItems.find(checklistItem => checklistItem.id == item.new.parent_id) : null,
          source = wasSubitem ? state.editableItem.sub_items : state.checklistItems,
          destination = ! isSubItem ? state.checklistItems : parentItem ? parentItem.sub_items : null,
          index = _.findIndex(source, ['id', oldItem.id])

      if (isSubItem == wasSubitem) {
        if (source) source.splice(index, 1, newItem)
      } else {
        if (source) source.splice(index, 1)
        if (destination) destination.splice(destination.length, 0, newItem)
      }

      if (! wasSubitem) { // If the old item was not a subitem, update item counts
        let oldChecklist = state.checklists.find(checklist => checklist.id == oldItem.checklist_id)
        if (oldChecklist) Vue.set(oldChecklist, 'items_count', -- oldChecklist.items_count)

        let newChecklist = state.checklists.find(checklist => checklist.id == newItem.checklist_id)
        if (newChecklist) Vue.set(newChecklist, 'items_count', -- newChecklist.items_count)
      }

    },
    [UPDATE_SORT_ORDER] (state) {
      for (var i = 0; i < state.checklistItems.length; i++) {
        state.checklistItems[i].sort_order = i
      }
    },
    [UPDATE_SUB_ITEM_SORT_ORDER] (state, payload) {
      let p = _.findIndex(state.checklistItems, ['id', payload.parent.id]);

      for (var i = 0; i < state.checklistItems[p].sub_items.length; i++) {
      state.checklistItems[p].sub_items[i].sort_order = i
      }
    },
}

const actions = {
  addChecklist({commit}, checklist) {
      return new Promise((resolve, reject) => {
        commit(ADD_CHECKLIST, checklist)
        resolve()
      })
  },
  addChecklistItem({commit}, item) {
      return new Promise((resolve, reject) => {
        commit(ADD_ITEM_TO_CHECKLIST, item)
        commit(SORT_CHECKLIST_ITEMS)
        commit(ADD_UNFILTERED, item)
        resolve()
      })
  },
  addSubChecklistItem({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit(ADD_SUB_ITEM_TO_CHECKLIST_ITEM, { parent: payload.parent, child: payload.child })
        commit(SORT_SUB_CHECKLIST_ITEMS, { parent: payload.parent })
        resolve()
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
              commit(DECREMENT_ITEM_COUNT, checklistItem)
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
        if (payload.item && payload.item.isExpanded) commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION, payload.item)

        if (!! payload.deselect) {
          let listing = payload.isSubItem ? getters.editableItem : state.editableItem
          dispatch('deselect', {listing, model: 'checklist-item', preserveState: true}, {root: true})
        }

        let removePrecedingSubItems = payload.removePrecedingSubItems || false,
            item = ! payload.isSubItem ? null : removePrecedingSubItems ? payload.item : getters.editableSubItem,
            removeAll = ! payload.isSubItem,
            inSubItemChain = item && payload.isSubItem && _.some(getters.subItemChain, ['id', item.id])

        if (! payload.isSubItem) commit(UNSET_EDITABLE_CHECKLIST_ITEM)

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
  resizeInput({}) {
    Vue.nextTick(function(){
      let count = 1,
          minWidth = 275;

      for (let form of document.getElementsByClassName('item-form')) {
        let content = form.querySelector('.item-form-content'),
            input = form.querySelector('.item-form-input'),
            icon = form.querySelector('.item-form-icon'),
            meta = form.querySelector('.item-form-meta');

        let resetStyles = function() {
          if (icon) icon.style = ''
          if (meta) meta.style = ''
          if (content) content.style = ''
          if (input) input.style = ''
        }

        resetStyles()

        let formWidth = form ? $(form).outerWidth(true) : 0,
            contentWidth = content ? $(content).outerWidth(true) : 0,
            inputWidth = input ? $(input).outerWidth(true) : 0,
            iconWidth = icon ? $(icon).outerWidth(true) : 0,
            metaWidth = meta ? $(meta).outerWidth(true) : 0;

        // console.log('formWidth = '+formWidth);
        // console.log('contentWidth = '+contentWidth);
        // console.log('inputWidth = '+inputWidth);
        // console.log('iconWidth = '+iconWidth);
        // console.log('metaWidth = '+metaWidth);

        let computedContentWidth = contentWidth > minWidth && formWidth - metaWidth > minWidth ? formWidth - metaWidth : null;

        let computedInputWidth = computedContentWidth && computedContentWidth - iconWidth - 10 >= minWidth ? computedContentWidth - iconWidth - 10 : null;



        // console.log('form number '+ count);
        count ++

        if(computedContentWidth) {
          content.style.width = computedContentWidth+'px'
        };

        if(computedInputWidth) {
          input.style.width = computedInputWidth+'px'
        } else {
          icon.style.display = 'none'
          content.style.padding = '0'
          content.style.width = input.style.width = '100%'
          if (meta) {
            meta.style.width = '100%'
            meta.style.position = 'relative'
            meta.style.display = 'block'
            meta.style.borderLeft = '0'
            meta.style.borderTop = '1px solid #ccd0d2'
          }
        };
      }
    })
  }, // End resizeInput
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
  saveChecklistItem({dispatch, commit, state, getters}, item) {
      return new Promise((resolve, reject) => {
        commit(ADD_UNFILTERED, item)
        axios.patch('/lists/item/' + item.id + '/update', { item })
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
        dispatch('saveChecklistItem', payload.item)
        .then( success => resolve(success) )
        .catch( error => {
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
  setCurrentEditableItemComments({dispatch, commit}, payload = { html: null, item: null }) {
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
             .then( response => resolve( dispatch('storeChecklistHandler', response) ) )
             .catch( error => reject(error) )
    })
  },
  storeChecklistHandler({commit}, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
             .then( response => {
                if (response.data.checklist) resolve(response.data.checklist)
                else if (response.data.error) reject(response.data.error)
                else reject()
              })
              .catch( error => reject(error) )}
      else if (response.data.checklist) resolve(response.data.checklist)
      else if (response.data.error) reject(response.data.error)
      else reject()
    })
  },
  storeChecklistItem({dispatch}, payload) {
      return new Promise((resolve, reject) => {
          axios.post('/lists/' + payload.parent.fake_id + '/add-item', { item:payload.item })
               .then( response => resolve( dispatch('storeChecklistItemHandler', response) ) )
               .catch( error => console.log(error) )
      })
  },
  storeChecklistItemHandler({commit}, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
          .then( (response) => {
                  if (response.data.item) {
                      resolve(response.data.item)
                  } else if (response.data.error) {
                      reject(response.data.error)
                  } else {
                      reject()
                  }
              } )
          .catch( error => reject(error) )
      } else if (response.data.item) {
          resolve(response.data.item)
      } else if (response.data.error) {
          reject(response.data.error)
      } else {
          reject()
      }
    })
  },
  storeSubChecklistItem({dispatch}, payload) {
      return new Promise((resolve, reject) => {
          axios.post('/lists/item/' + payload.parent.id + '/add-sub-item', { item:payload.item })
               .then( response => resolve( dispatch('storeSubChecklistItemHandler', { parent:payload.parent, response:response }) ) )
               .catch( error => console.log(error) )
      })
  },
  storeSubChecklistItemHandler({commit}, payload) {
    return new Promise((resolve, reject) => {
      let parent = payload.parent;
      if (payload.response.data.tokenMismatch) {
          Vue.handleTokenMismatch(payload.response.data)
          .then( (response) => {
                  if (response.data.item) {
                      resolve(response.data.item)
                  } else if (response.data.error) {
                      reject(response.data.error)
                  } else {
                      reject()
                  }
              } )
          .catch( error => reject(error) )
      } else if (payload.response.data.item) {
          resolve(payload.response.data.item)
      } else if (payload.response.data.error) {
          reject(payload.response.data.error)
      } else {
          reject()
      }
    })
  },
  toggleItemCheckMark({ dispatch, commit, state, getters }, item) {
    return new Promise((resolve, reject) => {
      commit(TOGGLE_ITEM_CHECK_MARK, item)
      dispatch('saveChecklistItem', item)
        .then( () => resolve() )
        .catch( error => reject(error) )
    })
  },
  toggleCurrentEditableItemExpansion({ commit }, item) {
    return new Promise((resolve, reject) => {
        commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION, item)
        resolve()
    })
  },
  toggleChecklistItemImportance({ dispatch, commit }, item) {
    return new Promise((resolve, reject) => {
      commit(TOGGLE_CHECKLIST_ITEM_IMPORTANCE, item)
      resolve( dispatch('saveChecklistItem', item) )
    })
  },
  toggleChecklistItemUrgency({ dispatch, commit }, item) {
    return new Promise((resolve, reject) => {
      commit(TOGGLE_CHECKLIST_ITEM_URGENCY, item)
      resolve( dispatch('saveChecklistItem', item) )
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
    // checklistItems: state => state.checklistItems,
    checklistItems: state => _.orderBy(state.checklistItems, 'sort_order'),
    delistedItems: state => state.delistedItems,
    editableItem: state => state.editableItem,
    editableSubItem: state => state.subItemChain[0] || {},
    filters: state => state.filters,
    subItemChain: state => state.subItemChain,
    unfilteredItems: state => state.unfilteredItems,
}

function findChecklistItemParent(itemsArray, parentId) {
  let parent = itemsArray.find(item => item.id == parentId)
  if(!! parent) return parent
  else {
    for (let item of itemsArray) {
      if( item.sub_items && item.sub_items.length ) {
        parent = findChecklistItemParent(item.sub_items, parentId)
          if(!! parent) return parent
      }
    }
  }
  return parent // will return 'undefined'
} // end findChecklistItemParent

/* To recursively find a child item */
function findChildItem(itemsArray, childId) {
  let child = itemsArray.find(item => item.id == childId)
  if(!! child) return child
  else {
    for (let item of itemsArray.sub_items) {
      if( !! item.sub_items.length ) {
        child = findChildItem(item.sub_items, childId)
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
