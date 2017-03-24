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
        if (state.currentFolder.id && folder.folder_id && state.currentFolder.id == folder.folder_id) {
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

        axios.delete('/productivity/folders/'+ folder.fake_id)
        .then(function(response) {
            if (response.data && response.data.folder) {
              commit(DELETE_FOLDER, folder)
              resolve({
                  folder: response.data.folder
              })
            } else {
              reject()
            }
        })
        .catch(function(error) {
            console.log(response);
            reject()
        })

      })
    },
    saveFolder({ commit }, folder) {
        return new Promise((resolve, reject) => {

          axios.patch('/productivity/folders/'+folder.fake_id, folder)
          .then(function(response) {
              if (response.data.folder) {
                commit(UPDATE_FOLDER, {folder:folder, updatedFolder:response.data.folder})
                resolve({
                    folder: response.data.folder
                })
              } else {
                reject()
              }
          })
          .catch(function(error) {
              reject()
          })

        })

    },
    storeFolder({commit}, folder) {
        return new Promise((resolve, reject) => {
            axios.post('/productivity/folders', {folder: folder})
            .then(function(response) {
                if (response.data && response.data.folder) {
                    commit(ADD_FOLDER, response.data.folder)
                    resolve({
                        folder: response.data.folder
                    })
                } else {
                    reject()
                }
            })
            .catch(function(error) {
                reject()
            })
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
