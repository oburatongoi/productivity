import {
    ADD_CHECKLIST,
    DELETE_CHECKLIST,
    UPDATE_CHECKLIST,
} from '../mutations'

const state = {
    checklists: Productivity.checklists,
}

const mutations = {
    [ADD_CHECKLIST] (state, checklist) {
        state.checklists.unshift(checklist)
    },
    [DELETE_CHECKLIST] (state, checklist) {
        let i = state.checklists.indexOf(checklist);
        state.checklists.splice(i,1)
    },
    [UPDATE_CHECKLIST] (state, payload) {
        let i = state.checklists.indexOf(payload.checklist);
        state.checklists.splice(i,1,payload.updatedChecklist)
    },
}

const actions = {
    deleteChecklist({ commit }, checklist) {
      return new Promise((resolve, reject) => {
        Vue.http.delete('/productivity/lists/'+ checklist.id).then((response) => {

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

          Vue.http.patch('/productivity/lists/'+checklist.id, checklist).then(
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
}

const getters = {
    checklists: state => state.checklists,
}

export default {
    state,
    mutations,
    actions,
    getters
}
