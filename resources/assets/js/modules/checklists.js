import {
    ADD_CHECKLIST,
    ADD_EDITABLE,
    ADD_UNFILTERED,
    ADD_ITEM_TO_CHECKLIST,
    DELETE_CHECKLIST,
    DELETE_CURRENTLY_EDITABLE,
    DELETE_EDITABLE,
    DELETE_UNFILTERED,
    DELETE_CHECKLIST_ITEM,
    UPDATE_FILTERS,
    UPDATE_CHECKLIST,
    // UPDATE_CHECKLIST_ITEM,
    UPDATE_CHECKLIST_ITEM_CHECK
} from '../mutations'

const state = {
    checklists: Productivity.checklists,
    checklist: Productivity.checklist,
    editableItems: [],
    unfilteredItems: [],
    currentEditableItem: {},
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
        state.currentEditableItem = item
        state.editableItems.unshift(item.id)
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
    // [UPDATE_CHECKLIST_ITEM] (state, payload) {
    //     let i = state.checklist.items.indexOf(payload.item);
    //     state.checklist.items.splice(i,1,payload.updatedItem)
    // },
    [UPDATE_CHECKLIST_ITEM_CHECK] (state, payload) {
        let i = state.checklist.items.indexOf(payload.item);
        state.checklist.items[i].checked_at = payload.updatedItem.checked_at
    },
}

const actions = {
    delistChecklist({ commit }, checklist) {
      return new Promise((resolve, reject) => {
          commit(DELETE_CHECKLIST, checklist)
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
    // updateChecklistItem({commit}, payload) {
    //     return new Promise((resolve, reject) => {
    //         axios.patch('/productivity/lists/item/' + payload.item.id + '/update', {item:payload.item})
    //         .then(function(response) {
    //             commit(UPDATE_CHECKLIST_ITEM, {item: payload.oldItem, updatedItem: response.data.item})
    //             resolve()
    //         })
    //         .catch(function(error) {
    //             reject(error)
    //         })
    //     })
    // },
    saveCurrentEditableItem({commit}, item = null) {
        return new Promise((resolve, reject) => {
            if (!item) {
                item = state.currentEditableItem ? state.currentEditableItem : reject('There is no item or currently editable item')
            }
            axios.patch('/productivity/lists/item/' + item.id + '/update', {item:item})
            .then(function(response) {
                commit(ADD_UNFILTERED, item)
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
    // check({commit}, payload) {
    //     return new Promise((resolve, reject) => {
    //         axios.patch('/productivity/lists/item/' + payload.item.id + '/check', {item:payload.item, action: payload.action})
    //         .then(function(response) {
    //             // commit(UPDATE_CHECKLIST_ITEM_CHECK, {item: payload.item, updatedItem: response.data.item})
    //             commit(ADD_UNFILTERED, payload.item)
    //             resolve({updatedItem:response.data.item})
    //         })
    //         .catch(function(error) {
    //             reject(error)
    //         })
    //     })
    // },
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
    removeCurrentlyEditable({commit}) {
        return new Promise((resolve, reject) => {
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
    currentEditableItem: state => state.currentEditableItem
}

export default {
    state,
    mutations,
    actions,
    getters
}
