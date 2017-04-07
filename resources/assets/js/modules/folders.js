import {
    ADD_FOLDER,
    DELETE_FOLDER,
    UPDATE_FOLDER,
} from '../mutations'

const namespaced = true;

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
            if (response.data.tokenMismatch) {
                Vue.handleTokenMismatch(response.data).then(
                    (response) => {
                        if (response.data.item) {
                            commit(DELETE_FOLDER, response.data.folder)
                            resolve(response.data.folder)
                        } else if (response.data.error) {
                            reject(response.data.error)
                        } else {
                            reject()
                        }
                    }
                ).catch(
                    (error) => reject(error)
                )
            } else if (response.data.folder) {
                commit(DELETE_FOLDER, response.data.folder)
                resolve(response.data.folder)
            } else if (response.data.error) {
                reject(response.data.error)
            } else {
                reject()
            }
        })
        .catch(function(error) {
            reject(error)
        })

      })
    },
    saveFolder({ commit }, folder) {
        return new Promise((resolve, reject) => {

          axios.patch('/productivity/folders/'+folder.fake_id, folder)
          .then(function(response) {
              if (response.data.tokenMismatch) {
                  Vue.handleTokenMismatch(response.data).then(
                      (response) => {
                          if (response.data.item) {
                              commit(UPDATE_FOLDER, response.data.folder)
                              resolve(response.data.folder)
                          } else if (response.data.error) {
                              reject(response.data.error)
                          } else {
                              reject()
                          }
                      }
                  ).catch(
                      (error) => reject(error)
                  )
              } else if (response.data.folder) {
                  commit(UPDATE_FOLDER, response.data.folder)
                  resolve(response.data.folder)
              } else if (response.data.error) {
                  reject(response.data.error)
              } else {
                  reject()
              }
          })
          .catch(function(error) {
              reject(error)
          })

        })

    },
    storeFolder({commit}, folder) {
        return new Promise((resolve, reject) => {
            axios.post('/productivity/folders', {folder: folder})
            .then(function(response) {
                if (response.data.tokenMismatch) {
                    Vue.handleTokenMismatch(response.data).then(
                        (response) => {
                            if (response.data.item) {
                                commit(ADD_FOLDER, response.data.folder)
                                resolve(response.data.folder)
                            } else if (response.data.error) {
                                reject(response.data.error)
                            } else {
                                reject()
                            }
                        }
                    ).catch(
                        (error) => reject(error)
                    )
                } else if (response.data.folder) {
                    commit(ADD_FOLDER, response.data.folder)
                    resolve(response.data.folder)
                } else if (response.data.error) {
                    reject(response.data.error)
                } else {
                    reject()
                }
            })
            .catch(function(error) {
                reject(error)
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
