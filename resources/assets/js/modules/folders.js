import {
    ADD_FOLDER,
    DELETE_FOLDER,
    UPDATE_FOLDER,
} from '../mutations'

const state = {
    folders: Productivity.folders ? Productivity.folders : {},
    currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {}
}

const mutations = {
    [ADD_FOLDER] (state, folder) {
        if (state.currentFolder.id == folder.folder_id) {
            state.folders.unshift(folder)
        }
    },
    [DELETE_FOLDER] (state, folder) {
        let i = state.folders.indexOf(folder);
        state.folders.splice(i,1)
    },
    [UPDATE_FOLDER] (state, payload) {
        let i = state.folders.indexOf(payload.folder);
        state.folders.splice(i,1,payload.updatedFolder)
    },
}

const actions = {
    delistFolder({ commit }, folder) {
      return new Promise((resolve, reject) => {
          commit(DELETE_FOLDER, folder)
          resolve()
      })
    },
    deleteFolder({ commit }, folder) {
      return new Promise((resolve, reject) => {
        Vue.http.delete('/productivity/folders/'+ folder.fake_id).then((response) => {

          if (response.data && response.data.folder) {
            commit(DELETE_FOLDER, folder)
            resolve({
                folder: response.data.folder
            })
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

          Vue.http.patch('/productivity/folders/'+folder.fake_id, folder).then(
            (response) => {
              if (response.data.folder) {
                commit(UPDATE_FOLDER, {folder:folder, updatedFolder:response.data.folder})
                resolve({
                    folder: response.data.folder
                })
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
    storeFolder({commit}, folder) {
        return new Promise((resolve, reject) => {
            Vue.http.post('/productivity/folders', {folder: folder}).then(
                (response) => {
                    if (response.data && response.data.folder) {
                        commit(ADD_FOLDER, response.data.folder)
                        resolve({
                            folder: response.data.folder
                        })
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
    folders: state => state.folders,
    currentFolder: state => state.currentFolder
}

export default {
    state,
    mutations,
    actions,
    getters
}
