import {
    ADD_CHECKLIST,
    ADD_EDITABLE,
    ADD_CURRENTLY_EDITABLE,
    ADD_UNFILTERED,
    ADD_ITEM_TO_CHECKLIST,
    DELETE_CHECKLIST,
    DELETE_CURRENTLY_EDITABLE,
    DELETE_EDITABLE,
    DELETE_UNFILTERED,
    DELETE_CHECKLIST_ITEM,
    UPDATE_FILTERS,
    UPDATE_CHECKLIST,
    TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION
} from '../mutations'

const state = {
    checklists: Productivity.checklists,
    checklist: Productivity.checklist,
    editableItems: [],
    unfilteredItems: [],
    currentEditableItem: {},
    currentEditableItemIsExpanded: false,
    deletedItems: [],
    filters: {
        checked: 'unchecked',
        priority: 'none'
    }
}

const mutations = {
    [ADD_CHECKLIST] (state, checklist) {
        state.checklists.unshift(checklist)
    },
    [ADD_EDITABLE] (state, item) {
        state.editableItems.unshift(item.id)
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
    [DELETE_CHECKLIST] (state, checklist) {
        let i = state.checklists.indexOf(checklist);
        state.checklists.splice(i,1)
    },
    [DELETE_CHECKLIST_ITEM] (state, id) {
        state.deletedItems.unshift(id)
    },
    [DELETE_CURRENTLY_EDITABLE] (state) {
        state.currentEditableItem = {}
    },
    [DELETE_EDITABLE] (state, item) {
        let i = state.editableItems.indexOf(item.id);
        ~ i && state.editableItems.splice(i,1)
    },
    [DELETE_UNFILTERED] (state, item = null) {
        if (item) {
            let i = state.unfilteredItems.indexOf(item.id);
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
    [TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION] (state) {
        state.currentEditableItemIsExpanded = ! state.currentEditableItemIsExpanded
    },
}

const actions = {
    delistChecklist({ commit }, checklist) {
      return new Promise((resolve, reject) => {
          commit(DELETE_CHECKLIST, checklist)
          resolve()
      })
    },
    toggleCurrentEditableItemExpansion({ commit }) {
      return new Promise((resolve, reject) => {
          commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION)
          resolve()
      })
    },
    deleteChecklist({ commit }, checklist) {
      return new Promise((resolve, reject) => {
          axios.delete('/productivity/lists/'+ checklist.fake_id)
            .then(function(response) {
                if (response.data && response.data.checklist) {
                    commit(DELETE_CHECKLIST, checklist)
                    resolve()
                } else {
                    reject(response.data.error)
                }
            })
            .catch(function(error) {
                reject(error)
            })
        })
    },
    saveChecklist({ commit }, checklist) {
        return new Promise((resolve, reject) => {
          axios.patch('/productivity/lists/'+checklist.fake_id, {checklist:checklist})
          .then(function(response) {
              if (response.data && response.data.checklist) {
                commit(UPDATE_CHECKLIST, response.data.checklist)
                resolve(response.data.checklist)
              } else {
                reject(response.data.error)
              }
          })
          .catch(function(error) {
              reject(error)
          })

        })

    },
    setFilters: function({commit}, payload){
        return new Promise((resolve, reject) => {
            commit(UPDATE_FILTERS, payload)
            commit(DELETE_UNFILTERED)
            resolve()
        })
    },
    storeChecklist({commit}, checklist) {
        return new Promise((resolve, reject) => {
            axios.post('/productivity/lists', {checklist: checklist})
            .then(function(response) {
                if (response.data && response.data.checklist) {
                    commit(ADD_CHECKLIST, response.data.checklist)
                    resolve()
                } else {
                    reject(response.data.error)
                }
            })
            .catch(function(error) {
                reject(error)
            })
        })
    },
    addChecklistItem({commit}, payload) {
        return new Promise((resolve, reject) => {
            var fakeId = payload.checklist_fake_id ? payload.checklist_fake_id : state.checklist.fake_id
            axios.post('/productivity/lists/' + fakeId + '/add-item', {item:payload.item})
            .then(function(response) {
                commit(ADD_ITEM_TO_CHECKLIST, response.data.item)
                commit(ADD_UNFILTERED, response.data.item)
                resolve()
            })
            .catch(function(error) {
                reject(error)
            })
        })
    },
    saveCurrentEditableItem({commit}, item = null) {
        return new Promise((resolve, reject) => {
            if (!item) {
                item = state.currentEditableItem ? state.currentEditableItem : reject('There is no item or currently editable item')
            }
            commit(ADD_UNFILTERED, item)
            axios.patch('/productivity/lists/item/' + item.id + '/update', {item:item})
            .then(function(response) {
                resolve()
            })
            .catch(function(error) {
                reject(error)
            })
        })
    },
    deleteChecklistItem({commit}, payload) {
        return new Promise((resolve, reject) => {
            axios.patch('/productivity/lists/item/' + payload.item.id + '/delete', {item:payload.item})
            .then(function(response) {
                if (response.data && response.data.item) {
                    commit(DELETE_EDITABLE, response.data.item)
                    commit(DELETE_CHECKLIST_ITEM, response.data.item.id)
                    if (state.currentEditableItemIsExpanded) {
                        commit(TOGGLE_CURRENT_EDITABLE_ITEM_EXPANSION)
                    }
                  resolve()
                } else {
                  reject(response.data.error)
                }
            })
            .catch(function(error) {
                reject(error)
            })
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
    addCurrentlyEditable({commit}, item) {
        return new Promise((resolve, reject) => {
            commit(ADD_CURRENTLY_EDITABLE, item)
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
    }
}

const getters = {
    checklists: state => state.checklists,
    checklist: state => state.checklist,
    editableItems: state => state.editableItems,
    unfilteredItems: state => state.unfilteredItems,
    deletedItems: state => state.deletedItems,
    filters: state => state.filters,
    currentEditableItem: state => state.currentEditableItem,
    currentEditableItemIsExpanded: state => state.currentEditableItemIsExpanded
}

export default {
    state,
    mutations,
    actions,
    getters
}
