import {
    ADD_FOLDER,
    DELETE_FOLDER,
    TOGGLE_CREATE_FOLDER_FORM,
    UPDATE_FOLDER,
} from '../mutations'

const state = {
    user: {},
    folders: [],
    creatingFolder: false,
    currentFolder: {}
}

const mutations = {
    [ADD_FOLDER] (state, folder) {
        state.folders.unshift(folder)
    },
    [DELETE_FOLDER] (state, folder) {
        let i = state.folders.indexOf(folder);
        state.folders.splice(i,1)
    },
    [TOGGLE_CREATE_FOLDER_FORM] (state) {
        state.creatingFolder = ! state.creatingFolder
    },
    [UPDATE_FOLDER] (state, payload) {
        let i = state.folders.indexOf(payload.folder);
        state.folders.splice(i,1,payload.updatedFolder)
    },
}

const actions = {
    deleteFolder({ commit }, folder) {
      return new Promise((resolve, reject) => {
        Vue.http.delete('/productivity/folders/'+ folder.id).then((response) => {

          if (response.data && response.data.folder) {
            commit(DELETE_FOLDER, folder)
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
    saveFolder({ commit }, folder) {
        return new Promise((resolve, reject) => {

          Vue.http.patch('/productivity/folders/'+folder.id, folder).then(
            (response) => {
              if (response.data.folder) {
                commit(UPDATE_FOLDER, {folder:folder, updatedFolder:response.data.folder})
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
    storeFolder({commit}, payload) {
        return new Promise((resolve, reject) => {
            Vue.http.post('/productivity/folders', {folder: payload.folder}).then(
                (response) => {
                    if (response.data && response.data.folder) {
                        commit(ADD_FOLDER, response.data.folder)
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
    toggleCreateFolderForm({ commit }) {
        commit(TOGGLE_CREATE_FOLDER_FORM)
    },
}

const getters = {
    creatingFolder: state => state.creatingFolder,
    currentFolder: state => state.currentFolder,
    folders: state => state.folders,
    user: state => state.user,
}

export default {
    state,
    mutations,
    actions,
    getters
}
