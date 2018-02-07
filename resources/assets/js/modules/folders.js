import {
    ADD_FOLDER,
    DELETE_FOLDER,
    UPDATE_FOLDER,
} from '../mutations'

const namespaced = true;

const state = {
    folders: Productivity.folders ? Productivity.folders : [],
    currentFolder: Productivity.currentFolder ? Productivity.currentFolder : {}
}

const mutations = {
    [ADD_FOLDER] (state, folder) {
        state.folders.splice(0,0,folder)
    },
    [DELETE_FOLDER] (state, folder) {
        let i = _.findIndex(state.folders, ['id', folder.id]);
        console.log('i = ' + i);
        state.folders.splice(i,1)
    },
    [UPDATE_FOLDER] (state, payload) {
        let i = _.findIndex(state.folders, ['id', payload.folder.id]);
        state.folders.splice(i,1,payload.updatedFolder)
    },
}

const actions = {
    addFolder({ commit }, folder) {
      console.log(folder);
      return new Promise((resolve, reject) => {
          commit(ADD_FOLDER, folder)
          resolve()
      })
    },
    delistFolder({ commit }, folder) {
      console.log(folder);
      return new Promise((resolve, reject) => {
          commit(DELETE_FOLDER, folder)
          resolve()
      })
    },
    deleteFolder({ commit }, folder) {
      return new Promise((resolve, reject) => {
        axios.delete('/folders/'+ folder.fake_id)
        .then(function(response) {
            if (response.data.tokenMismatch) {
                Vue.handleTokenMismatch(response.data).then(
                    (response) => {
                        if (response.data.folder) {
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
    saveFolder({ dispatch }, folder) {
        return new Promise((resolve, reject) => {
          axios.patch('/folders/'+folder.fake_id, {folder})
               .then( response => resolve(dispatch('saveFolderHandler', response)))
               .catch( error => reject(error))
        })
    },
    saveFolderHandler({commit}, response) {
        return new Promise((resolve, reject) => {
          if (response.data.tokenMismatch) {
              Vue.handleTokenMismatch(response.data)
                  .then( response => {
                    if (response.data.folder) {
                      resolve(response.data.folder)
                    } else if (response.data.error)
                        reject(response.data.error)
                      else reject()
                  })
                  .catch( error => reject(error) )
          } else if (response.data.folder) {
              resolve(response.data.folder)
          } else if (response.data.error)
              reject(response.data.error)
            else reject()
        })
    },
    storeFolder({commit}, folder) {
        return new Promise((resolve, reject) => {
            axios.post('/folders', { folder })
            .then(function(response) {
                if (response.data.tokenMismatch) {
                    Vue.handleTokenMismatch(response.data).then(
                        (response) => {
                            if (response.data.folder) {
                                // if(payload.root) commit(ADD_FOLDER, response.data.folder)
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
                    // if(payload.root) commit(ADD_FOLDER, response.data.folder)
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
    foldersByName: state => _.orderBy(state.folders, 'name'),
    currentFolder: state => state.currentFolder
}

export default {
    state,
    mutations,
    actions,
    getters
}
