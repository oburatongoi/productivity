import {
    ADD_CHECKLIST,
    ADD_EDITABLE,
    ADD_ITEM_TO_CHECKLIST,
    DELETE_CHECKLIST,
    DELETE_EDITABLE,
    DELETE_CHECKLIST_ITEM,
    UPDATE_CHECKLIST,
    UPDATE_CHECKLIST_ITEM,
    UPDATE_CHECKLIST_ITEM_CHECK,
} from '../mutations'

const state = {
    checklists: Productivity.checklists,
    checklist: Productivity.checklist,
    editableItems: []
}

const mutations = {
    [ADD_CHECKLIST] (state, checklist) {
        state.checklists.unshift(checklist)
    },
    [ADD_EDITABLE] (state, item) {
        state.editableItems.unshift(item)
    },
    [ADD_ITEM_TO_CHECKLIST] (state, item) {
        state.checklist.items.unshift(item)
    },
    [DELETE_CHECKLIST] (state, checklist) {
        let i = state.checklists.indexOf(checklist);
        state.checklists.splice(i,1)
    },
    [DELETE_CHECKLIST_ITEM] (state, item) {
        let i = state.checklist.items.indexOf(item);
        state.checklist.items.splice(i,1)
    },
    [DELETE_EDITABLE] (state, item) {
        let i = state.editableItems.indexOf(item);
        state.editableItems.splice(i,1)
    },
    [UPDATE_CHECKLIST] (state, payload) {
        let i = state.checklists.indexOf(payload.checklist);
        state.checklists.splice(i,1,payload.updatedChecklist)
    },
    [UPDATE_CHECKLIST_ITEM] (state, payload) {
        let i = state.checklist.items.indexOf(payload.item);
        state.checklist.items.splice(i,1,payload.updatedItem)
    },
    [UPDATE_CHECKLIST_ITEM_CHECK] (state, payload) {
        let i = state.checklist.items.indexOf(payload.item);
        state.checklist.items[i].checked_at = payload.updatedItem.checked_at
    },
}

const actions = {
    deleteChecklist({ commit }, checklist) {
      return new Promise((resolve, reject) => {
        Vue.http.delete('/productivity/lists/'+ checklist.fake_id).then((response) => {

          if (response.data && response.data.checklist) {
            commit(DELETE_CHECKLIST, checklist)
            resolve()
          } else {
            reject()
          }

        }, (response) => {
          console.log(response);
          reject()
        })
      })
    },
    saveChecklist({ commit }, checklist) {
        return new Promise((resolve, reject) => {

          Vue.http.patch('/productivity/lists/'+checklist.fake_id, checklist).then(
            (response) => {
              if (response.data.checklist) {
                commit(UPDATE_CHECKLIST, {checklist:checklist, updatedChecklist:response.data.checklist})
                resolve()
              } else {
                reject()
              }
            },
            (response) => {
              reject()
            }
          )

        })

    },
    storeChecklist({commit}, checklist) {
        return new Promise((resolve, reject) => {
            Vue.http.post('/productivity/lists', {checklist: checklist}).then(
                (response) => {
                    if (response.data && response.data.checklist) {
                        commit(ADD_CHECKLIST, response.data.checklist)
                        resolve()
                    } else {
                        reject()
                    }
                },
                (response) => {
                    reject()
                }
            )
        })
    },
    addChecklistItem({commit}, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post('/productivity/lists/' + payload.checklist_fake_id + '/add-item', {item:payload.item}).then(
                (response) => {
                    commit(ADD_ITEM_TO_CHECKLIST, response.data.item)
                    resolve()
                },
                (response) => {
                    reject()
                }
            )
        })
    },
    updateChecklistItem({commit}, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.patch('/productivity/lists/item/' + payload.item.id + '/update', {item:payload.item}).then(
                (response) => {
                    commit(UPDATE_CHECKLIST_ITEM, {item: payload.oldItem, updatedItem: response.data.item})
                    commit(DELETE_EDITABLE, payload.item)
                    resolve()
                },
                (response) => {
                    reject()
                }
            )
        })
    },
    deleteChecklistItem({commit}, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.patch('/productivity/lists/item/' + payload.item.id + '/delete', {item:payload.item}).then(
                (response) => {
                    if (response.data && response.data.item) {
                      commit(DELETE_CHECKLIST_ITEM, payload.item)
                      resolve()
                    } else {
                      reject()
                    }
                },
                (response) => {
                    reject()
                }
            )
        })
    },
    check({commit}, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.patch('/productivity/lists/item/' + payload.item.id + '/check', {item:payload.item, action: payload.action}).then(
                (response) => {
                    commit(UPDATE_CHECKLIST_ITEM_CHECK, {item: payload.item, updatedItem: response.data.item})
                    resolve()
                },
                (response) => {
                    reject()
                }
            )
        })
    },
    setEditability({commit}, payload) {
        return new Promise((resolve, reject) => {
            switch (payload.editable) {
                case true:
                    commit(ADD_EDITABLE, payload.item)
                    break;
                default: commit(DELETE_EDITABLE, payload.item)

            }
            resolve()
        })
    }
}

const getters = {
    checklists: state => state.checklists,
    checklist: state => state.checklist,
    editableItems: state => state.editableItems,
}

export default {
    state,
    mutations,
    actions,
    getters
}
