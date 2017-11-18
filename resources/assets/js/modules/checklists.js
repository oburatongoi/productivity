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
    UPDATE_FILTERS,
    UPDATE_CHECKLIST,
    UPDATE_ITEM_COUNTS,
    REPLACE_PENDING_TASK,
    RESET_NEW_CHECKLIST_ITEM,
    TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION
} from '../mutations'

const namespaced = true;

const state = {
    checklists: Productivity.checklists,
    checklist: Productivity.checklist,
    unfilteredItems: [],
    currentEditableItem: {},
    currentEditableItemIsExpanded: false,
    newChecklistItem: {
        content: null,
        is_urgent: false,
        is_important: false,
        deadline: null,
        comments: null
    },
    delistedItems: [],
    checklistAlias: Productivity.checklistAlias ? Productivity.checklistAlias: [],
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
        state.currentEditableItem = item
    },
    [ADD_UNFILTERED] (state, item) {
        state.unfilteredItems.unshift(item.id)
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
    [INCREMENT_ITEM_COUNT] (state, checklistID) {
      if (
        ! _.isEmpty(state.checklists)
      ) {
        let i = _.findIndex(state.checklists, ['id', checklistID]);
        state.checklists[i].items_count = ++ state.checklists[i].items_count
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
    [DELETE_CHECKLIST] (state, checklist) {
      if (
        ! _.isEmpty(state.checklists)
      ) {
        let i = _.findIndex(state.checklists, checklist);
        state.checklists.splice(i,1)
      }
    },
    [DELETE_CHECKLIST_ITEM] (state, checklistItem) {
        if (
          ! _.isEmpty(state.checklistAlias)
        ) {
          let i = _.findIndex(state.checklistAlias, ['id', checklistItem.id]);
          state.checklistAlias.splice(i,1)
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
        state.currentEditableItem = {}
    },
    [DELETE_UNFILTERED] (state, item = null) {
        if (item) {
            let i = _.findIndex(state.unfilteredItems, item.id);
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
            state.checklist.title = updatedChecklist.title
        }
    },
    [REPLACE_PENDING_TASK] (state, payload) {
        let i = _.findIndex(state.checklistAlias, payload.old);
        state.checklistAlias.splice(i,1,payload.new)
    },
    [RESET_NEW_CHECKLIST_ITEM] (state) {
        state.newChecklistItem = {
            content: undefined,
            is_urgent: undefined,
            is_important: undefined,
            deadline: undefined,
            comments: undefined
        }
    },
    [TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION] (state) {
        state.currentEditableItemIsExpanded = ! state.currentEditableItemIsExpanded
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
  saveCurrentEditableItem({commit}, item = null) {
      return new Promise((resolve, reject) => {
          if (item == null) {
              item = state.currentEditableItem ? state.currentEditableItem : reject('There is no item or currently editable item')
          }
          commit(ADD_UNFILTERED, item)
          axios.patch('/lists/item/' + item.id + '/update', {item:item})
          .then(function(response) {
              if (response.data.tokenMismatch) {
                  Vue.handleTokenMismatch(response.data).then(
                      response => resolve(response)
                  ).catch( error => reject(error) )
              } else {
                  resolve(response)
              }
          })
          .catch( error => reject(error) )
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
  toggleCurrentEditableItemExpansion({ commit }) {
    return new Promise((resolve, reject) => {
        commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION)
        resolve()
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
    currentEditableItem: state => state.currentEditableItem,
    checklistAlias: state => state.checklistAlias,
    currentEditableItemIsExpanded: state => state.currentEditableItemIsExpanded
}

export default {
    state,
    mutations,
    actions,
    getters
}
