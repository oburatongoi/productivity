import {
  ADD_TO_MOVER_ARRAY,
  REMOVE_FROM_MOVER_ARRAY,
  SET_MOVER_VARIABLE,
  TOGGLE_MOVER_VARIABLE,
} from '../mutations'

const namespaced = true;

const state = {
  movableFolders: [],
  movableChecklists: [],
  movableChecklistItems: [],
  movableChecklistSubItems: [],
  folderInfoMessage: { content: undefined, type: undefined },
  checklistInfoMessage: { content: undefined, type: undefined },
  checklistItemInfoMessage: { content: undefined, type: undefined },
  checklistSubItemInfoMessage: { content: undefined, type: undefined },
  moverContext: 'folder',
  moverIsLoading: false,
  moverIsAddingFolder: false,
  moverIsAddingChecklist: false,
  isStoringMovableFolder: false,
  isStoringMovableChecklist: false,
  selectedMovableFolder: {},
  selectedMovableChecklist: {},
  selectedMovableChecklistItem: {},
  openMovableFolder: Productivity.currentFolder || {},
  openMovableChecklist: {},
  openMovableChecklistItemChain: [],
}

const mutations = {
  [ADD_TO_MOVER_ARRAY] (state, payload = { array: null, value: null }) {
    let array = payload.array
    if(
      state[array]
      && payload.value
      &&  _.findIndex(state[array], ['id', payload.value.id]) == -1  // only add if it does not already exist
    ){
      state[array].splice(0, 0, payload.value) }
  },
  [REMOVE_FROM_MOVER_ARRAY] (state, payload = { array: null, value: null, removePrecedingSubItems: false, removeAll: false  }) {
    let array = payload.array
    if(payload.removeAll) { // empties the entire array
      state[array].splice(0, state[array].length)
    } else if(payload.value&&payload.value.id) {
      if( payload.removePrecedingSubItems ) state[array].splice(0, _.findIndex(state[array], ['id', payload.value.id])) // remove every element that precedes the item
      else state[array].splice(_.findIndex(state[array], ['id', payload.value.id]), 1) // removes the item from the array
    }
  },
  [SET_MOVER_VARIABLE] (state, payload = { variable: null, value: null }) {
    let variable = payload.variable
    state[variable] = payload.value || null
  },
  [TOGGLE_MOVER_VARIABLE] (state, payload = { variable: null, value: null }) {
    let variable = payload.variable
    if ( typeof payload.value == 'boolean' ) {
      state[variable] = payload.value
    } else if( typeof state[variable] == 'boolean' ) {
      state[variable] = ! state[variable]
    }
  },
}

const actions = {
  EXAMPLE({ dispatch, commit }, example) {
    return new Promise((resolve, reject) => {

      resolve()
    })
  },
  addToMoverArray({ commit }, payload = { array: null, value: null }) {
    return new Promise((resolve, reject) => {
      commit(ADD_TO_MOVER_ARRAY, payload)
      resolve()
    })
  },
  closeMoverChecklist({ dispatch }) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'openMovableChecklist', value: {} })
      dispatch('setMoverVariable', { variable: 'moverContext', value: 'folder' })
      dispatch('refreshChecklistItems')
      resolve()
    })
  },
  closeMoverChecklistItem({ dispatch, state }) {
    return new Promise((resolve, reject) => {
      dispatch('removeFromMoverArray', { array: 'openMovableChecklistItemChain', value: state.openMovableChecklistItemChain[0] })
        .then( () => {
          if(state.openMovableChecklistItemChain[0]) {
            dispatch('fetchChecklistSubItems', state.openMovableChecklistItemChain[0]) // fetch items for preceding subItem in chain (which is now the open item), if any
            dispatch('setMoverVariable', { variable: 'selectedMovableChecklistItem', value: state.openMovableChecklistItemChain[0] }) //select this item as well
          }
          else {
            dispatch('refreshChecklistSubItems')
            dispatch('setMoverVariable', { variable: 'moverContext', value: 'checklist' }) // if there is no other subItem in the chain
            dispatch('setMoverVariable', { variable: 'selectedMovableChecklistItem', value: {} })
            if(state.openMovableChecklist && state.openMovableChecklist.id !== state.selectedMovableChecklist.id) {
              dispatch('setMoverVariable', { variable: 'selectedMovableChecklist', value: state.openMovableChecklist }) }
          }
        })
      resolve()
    })
  },
  closeOpenMovables({ dispatch }) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'openMovableChecklist', value: {} })
      dispatch('setMoverVariable', { variable: 'openMovableChecklistItemChain', value: [] })
      resolve()
    })
  },
  deselectMoverSelected({ dispatch, state }, force = false) {
    return new Promise((resolve, reject) => {
      if(force || state.selectedMovableChecklist.id) dispatch('setMoverVariable', { variable: 'selectedMovableChecklist', value: {} })
      if(force || state.selectedMovableChecklistItem.id) dispatch('setMoverVariable', { variable: 'selectedMovableChecklistItem', value: {} })
      resolve()
    })
  },
  fetchChecklistItems({ dispatch }, checklist) {
    return new Promise((resolve, reject) => {
      axios.post('/lists/'+checklist.fake_id+'/fetch-list-items')
           .then( response => resolve( dispatch('fetchChecklistItemsHandler', response) ) )
           .catch( error => {
             dispatch('setInfoMessage', { content: 'The following error occurred while fetching items: '+error+'. Please refresh this page.', type: 'error', model: 'checklist' })
             reject()
           })
    })
  },
  fetchChecklistItemsHandler({ state, dispatch }, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
          .then( response => {
            if ( ! response.data.checklist.items.length ) {
              let model = state.moverContext == 'folder' ? 'checklist' : 'checklist-item',
                  content = state.moverContext == 'folder' ? 'There are no lists in this '+state.moverContext+'.' : 'There are no items in this '+state.moverContext+'.'
              dispatch('setInfoMessage', { content, type: 'info', model })
            }
            dispatch('refreshChecklistItems', { freshChecklistItems: response.data.checklist.items || [], reportEmpty: true })
            resolve()
          })
          .catch( error => reject(error) )
      } else if (response.data.checklist.items) {
        if ( ! response.data.checklist.items.length ) {
          let model = state.moverContext == 'folder' ? 'checklist' : 'checklist-item',
              content = state.moverContext == 'folder' ? 'There are no lists in this '+state.moverContext+'.' : 'There are no items in this '+state.moverContext+'.'
          dispatch('setInfoMessage', { content, type: 'info', model })
        }
        dispatch('refreshChecklistItems', { freshChecklistItems: response.data.checklist.items || [], reportEmpty: true })
        resolve()
      } else if (response.data.error) reject(response.data.error)
      else reject()
    })
  },
  fetchChecklistSubItems({ dispatch }, item) {
    return new Promise((resolve, reject) => {
      axios.post('/lists/items/'+item.id+'/fetch-sub-items')
           .then( response => resolve( dispatch('fetchChecklistSubItemsHandler', response) ) )
           .catch( error => {
             dispatch('setInfoMessage', { content: 'The following error occurred while fetching items: '+error+'. Please refresh this page.', type: 'error', model: 'checklist-item' })
             reject()
           })
    })
  },
  fetchChecklistSubItemsHandler({ dispatch }, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
          .then( response => {
            if ( ! response.data.item.sub_items.length ) {
              dispatch('setInfoMessage', { content: 'There are no items at this time.', type: 'info', model: 'checklist-item' })
            }
            dispatch('refreshChecklistSubItems', { freshChecklistSubItems: response.data.item.sub_items || [], reportEmpty: true })
            resolve()
          })
          .catch( error => reject(error) )
      } else if (response.data.item.sub_items) {
        if ( ! response.data.item.sub_items.length ) {
          dispatch('setInfoMessage', { content: 'There are no items at this time.', type: 'info', model: 'checklist-item' })
        }
        dispatch('refreshChecklistSubItems', { freshChecklistSubItems: response.data.item.sub_items || [], reportEmpty: true })
        resolve()
      } else if (response.data.error) reject(response.data.error)
      else reject()
    })
  },
  fetchInitialFoldersAndChecklists({ dispatch }, folder = null) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: true })
      dispatch('resetInfoMessage')
      dispatch('deselectMoverSelected')
      let folderId = folder && folder.id ? folder.id : null
      axios.post('/fetch-initial-tree', {folder_id: folderId, includeChecklists: true})
           .then( response => {
             dispatch('fetchInitialFoldersAndChecklistsHandler', response)
              .then( () => {
                  if (!folderId) dispatch('setMoverVariable', { variable: 'openMovableFolder', value: {name: 'Home', id: null} })
                  resolve()
                })
            })
           .catch( error => {
             dispatch('setInfoMessage', { content: 'The following error occurred while fetching folders and lists: '+error+'. Please refresh this page.', type: 'error', model: 'folder' })
             reject()
           })
      resolve()
    })
  },
  fetchInitialFoldersAndChecklistsHandler({ dispatch }, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
          .then( response => {
            dispatch('refreshFolders', { freshFolders: response.data.folders, reportEmpty: true })
            dispatch('refreshChecklists', { freshChecklists: response.data.checklists, reportEmpty: true })
            resolve()
          })
          .catch( error => reject(error) )
      } else if (response.data.folders || response.data.checklists) {
        dispatch('refreshFolders', { freshFolders: response.data.folders, reportEmpty: true })
        dispatch('refreshChecklists', { freshChecklists: response.data.checklists, reportEmpty: true })
        resolve()
      } else if (response.data.error) reject(response.data.error)
      else reject()
    })
  },
  fetchNewFoldersAndChecklists({ dispatch }, folder) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: true })
      dispatch('resetInfoMessage')
      dispatch('deselectMoverSelected')
      axios.post('/'+folder.fake_id+'/fetch-new-tree', {includeChecklists: true})
           .then( response => resolve( dispatch('fetchNewFoldersAndChecklistsHandler', response) ) )
           .catch( error => {
             dispatch('setInfoMessage', { content: 'The following error occurred while fetching folders and lists: '+error+'. Please refresh this page.', type: 'error', model: 'folder' })
             reject()
           })
      resolve()
    })
  },
  fetchNewFoldersAndChecklistsHandler({ dispatch }, response) {
    return new Promise((resolve, reject) => {
      if (response.data.tokenMismatch) {
          Vue.handleTokenMismatch(response.data)
          .then( response => {
            dispatch('refreshCurrentFolder', response.data.folder)
            dispatch('refreshFolders', { freshFolders: response.data.folder.subfolders, reportEmpty: true })
            dispatch('refreshChecklists', { freshChecklists: response.data.folder.checklists, reportEmpty: true })
            resolve()
          })
          .catch( error => reject(error) )
      } else if (response.data.folder) {
        dispatch('refreshCurrentFolder', response.data.folder)
        dispatch('refreshFolders', { freshFolders: response.data.folder.subfolders, reportEmpty: true })
        dispatch('refreshChecklists', { freshChecklists: response.data.folder.checklists, reportEmpty: true })
        resolve()
      } else if (response.data.error) reject(response.data.error)
      else reject()
    })
  },
  openMoverFolder({ dispatch }, folder = null) {
    return new Promise((resolve, reject) => {
      dispatch('refreshMover')
      dispatch('closeOpenMovables')
      dispatch('setMoverVariable', { variable: 'moverContext', value: 'folder' })
      if(folder) dispatch('fetchNewFoldersAndChecklists', folder)
      else dispatch('fetchInitialFoldersAndChecklists')
      resolve()
    })
  },
  openMoverChecklist({ dispatch }, checklist) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'openMovableChecklist', value: checklist})
      dispatch('setMoverVariable', { variable: 'moverContext', value: 'checklist' })
      dispatch('fetchChecklistItems', checklist)
      resolve()
    })
  },
  openMoverChecklistItem({ dispatch }, item) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'selectedMovableChecklistItem', value: item })
      dispatch('addToMoverArray', { array: 'openMovableChecklistItemChain', value: item})
      dispatch('setMoverVariable', { variable: 'moverContext', value: 'checklist-item' })
      // dispatch('fetchChecklistSubItems', item)
      dispatch('refreshChecklistSubItems', { freshChecklistSubItems: item.sub_items || [], reportEmpty: true })
      resolve()
    })
  },
  refreshChecklists({ dispatch }, payload = { freshChecklists: null, reportEmpty: false }) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: true })
      dispatch('resetInfoMessage', 'checklist')
      dispatch('setMoverVariable', { variable: 'movableChecklists', value: payload.freshChecklists || null })
      if (payload.reportEmpty && _.isEmpty(payload.freshChecklists)) dispatch('setInfoMessage', { content: 'This folder has no lists', type: 'info', model: 'checklist' })
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: false })
      resolve()
    })
  },
  refreshChecklistItems({ dispatch }, payload = { freshChecklistItems: null, reportEmpty: false }) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: true })
      dispatch('resetInfoMessage', 'checklist')
      dispatch('setMoverVariable', { variable: 'movableChecklistItems', value: payload.freshChecklistItems || null })
      if (payload.reportEmpty && _.isEmpty(payload.freshChecklistItems)) dispatch('setInfoMessage', { content: 'This list has no items', type: 'info', model: 'checklist' })
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: false })
      resolve()
    })
  },
  refreshChecklistSubItems({ dispatch }, payload = { freshChecklistSubItems: null, reportEmpty: false }) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: true })
      dispatch('resetInfoMessage', 'checklist-item')
      dispatch('setMoverVariable', { variable: 'movableChecklistSubItems', value: payload.freshChecklistSubItems || null })
      if (payload.reportEmpty && _.isEmpty(payload.freshChecklistSubItems)) dispatch('setInfoMessage', { content: 'This item has no subitems', type: 'info', model: 'checklist-item' })
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: false })
      resolve()
    })
  },
  refreshCurrentFolder({ dispatch }, folder) {
    return new Promise((resolve, reject) => {
      if (folder && folder.id) {
        dispatch('setMoverVariable', { variable: 'openMovableFolder', value: folder })
      } else {
        dispatch('setInfoMessage', { content: 'The folder could not be retrieved', type: 'error', model: 'folder' })
      }
      resolve()
    })
  },
  refreshFolders({ dispatch }, payload = { freshFolders: null, reportEmpty: false }) {
    return new Promise((resolve, reject) => {
      dispatch('setMoverVariable', { variable: 'moverIsLoading', value: false })
      dispatch('resetInfoMessage', 'folder')
      dispatch('setMoverVariable', { variable: 'movableFolders', value: payload.freshFolders || null })
      if (payload.reportEmpty && _.isEmpty(payload.freshFolders)) dispatch('setInfoMessage', { content: 'This folder has no subfolders', type: 'info', model: 'folder' })
      resolve()
    })
  },
  refreshMover({ dispatch }) {
    return new Promise((resolve, reject) => {
      dispatch('refreshFolders')
      dispatch('refreshChecklists')
      dispatch('refreshChecklistItems')
      resolve()
    })
  },
  removeFromMoverArray({ commit }, payload = { array: null, value: null }) {
    return new Promise((resolve, reject) => {
      commit(REMOVE_FROM_MOVER_ARRAY, payload)
      resolve()
    })
  },
  resetMover({ commit, state }, checklist) { // resets all values to their intial ones
    return new Promise((resolve, reject) => {
      Object.keys(state).map(e => {
        if (e == 'moverContext') {
          state[e] = 'folder'
        } else if(e == 'openMovableFolder') {
          state[e] = Productivity.currentFolder || {}
        } else if(e == 'folderInfoMessage' || e == 'checklistInfoMessage' || e == 'checklistItemInfoMessage' || e == 'checklistSubItemInfoMessage') {
          state[e] = { content: undefined, type: undefined }
        } else {
          if(typeof state[e] == 'object' && state[e] === null ) state[e] = null
          else if(typeof state[e] == 'object' && Object.prototype.toString.call(state[e]) === '[object Array]') state[e] = []
          else if(typeof state[e] == 'object') state[e] = {}
          if(typeof state[e] == 'string') state[e] = null
          if(typeof state[e] == 'boolean') state[e] = false
        }
      });
      resolve()
    })
  },
  resetInfoMessage({ state, dispatch }, model = null) {
    return new Promise((resolve, reject) => {
      switch (model) {
        case 'folder':
          resolve( dispatch('setMoverVariable', { variable: 'folderInfoMessage', value: { content: null, type: null } }) )
          break;
        case 'checklist':
          resolve( dispatch('setMoverVariable', { variable: 'checklistInfoMessage', value: { content: null, type: null } }) )
          break;
        case 'checklist-item':
          let variable = state.moverContext == 'checklist-item' ? 'checklistSubItemInfoMessage' : 'checklistItemInfoMessage'
          resolve( dispatch('setMoverVariable', { variable, value: { content: null, type: null } }) )
          break;
        default:
          resolve(
            dispatch('setMoverVariable', { variable: 'folderInfoMessage', value: { content: null, type: null } })
                .then( dispatch('setMoverVariable', { variable: 'checklistInfoMessage', value: { content: null, type: null } } )
                  .then( dispatch('setMoverVariable', { variable: 'checklistItemInfoMessage', value: { content: null, type: null } }) )
                    .then( dispatch('setMoverVariable', { variable: 'checklistSubItemInfoMessage', value: { content: null, type: null } }) ) )
          )
      }
    })
  },
  selectAndOpenMoverChecklist({ dispatch }, checklist) {
    return new Promise((resolve, reject) => {
      dispatch('selectMoverChecklist', checklist)
      .then(() => {
        resolve( dispatch('openMoverChecklist' , checklist) )
      })
    })
  },
  selectMoverChecklist({ dispatch, getters }, checklist) {
    return new Promise((resolve, reject) => {
      dispatch('toggleMoverVariable', { variable: 'moverIsAddingFolder', value: false })
      dispatch('toggleMoverVariable', { variable: 'moverIsAddingChecklist', value: false })
      if(checklist.id != getters.selectedMovableChecklist.id ) {
        dispatch('deselectMoverSelected')
        dispatch('refreshChecklistItems')
        dispatch('setMoverVariable', { variable: 'selectedMovableChecklist', value: checklist })
      }
      if (checklist.id == getters.openMovableChecklist.id) dispatch('closeMoverChecklist') // toggle openMovableChecklist.id
      resolve()
    })
  },
  selectMoverChecklistItem({ dispatch, state }, item) {
    return new Promise((resolve, reject) => {
      dispatch('toggleMoverVariable', { variable: 'moverIsAddingFolder', value: false })
      dispatch('toggleMoverVariable', { variable: 'moverIsAddingChecklist', value: false })
      if(item.id != state.selectedMovableChecklistItem.id ) {
        dispatch('deselectMoverSelected')
        dispatch('setMoverVariable', { variable: 'selectedMovableChecklistItem', value: item })
      }
      resolve()
    })
  },
  setInfoMessage({ state, dispatch }, payload = { content: null, type: null, model: null }) {
    return new Promise((resolve, reject) => {
      switch (payload.model) {
        case 'folder':
          resolve( dispatch('setMoverVariable', { variable: 'folderInfoMessage', value: { content:payload.content, type:payload.type } }) )
          break;
        case 'checklist':
          resolve( dispatch('setMoverVariable', { variable: 'checklistInfoMessage', value: { content:payload.content, type:payload.type } }) )
          break;
        case 'checklist-item':
          let variable = state.moverContext == 'checklist-item' ? 'checklistSubItemInfoMessage' : 'checklistItemInfoMessage'
          resolve( dispatch('setMoverVariable', { variable, value: { content:payload.content, type:payload.type } }) )
          break;
        default:
          resolve(
            dispatch('setMoverVariable', { variable: 'folderInfoMessage', value: { content: payload.content || null, type: payload.type || null } })
                .then( dispatch('setMoverVariable', { variable: 'checklistInfoMessage', value: { content: payload.content || null, type: payload.type || null } })
                  .then( dispatch('setMoverVariable', { variable: 'checklistItemInfoMessage', value: { content: payload.content || null, type: payload.type || null } }) )
                    .then( dispatch('setMoverVariable', { variable: 'checklistSubItemInfoMessage', value: { content: payload.content || null, type: payload.type || null } }) ) )
          )
      }
    })
  },
  setMoverVariable({ commit }, payload = { variable: null, value: null }) {
    return new Promise((resolve, reject) => {
      commit(SET_MOVER_VARIABLE, payload)
      resolve()
    })
  },
  toggleMoverVariable({ commit }, payload = { variable: null, value: null }) {
    return new Promise((resolve, reject) => {
      commit(TOGGLE_MOVER_VARIABLE, payload)
      resolve()
    })
  },
}

const getters = {
  movableFolders: state => state.movableFolders,
  movableChecklists: state => state.movableChecklists,
  movableChecklistItems: state => state.movableChecklistItems,
  movableChecklistSubItems: state => state.movableChecklistSubItems,
  folderInfoMessage: state => state.folderInfoMessage,
  checklistInfoMessage: state => state.checklistInfoMessage,
  checklistItemInfoMessage: state => state.checklistItemInfoMessage,
  checklistSubItemInfoMessage: state => state.checklistSubItemInfoMessage,
  moverContext: state => state.moverContext,
  moverIsLoading: state => state.moverIsLoading,
  moverIsAddingFolder: state => state.moverIsAddingFolder,
  moverIsAddingChecklist: state => state.moverIsAddingChecklist,
  isStoringMovableFolder: state => state.isStoringMovableFolder,
  isStoringMovableChecklist: state => state.isStoringMovableChecklist,
  selectedMovableFolder: state => state.selectedMovableFolder,
  selectedMovableChecklist: state => state.selectedMovableChecklist,
  selectedMovableChecklistItem: state => state.selectedMovableChecklistItem,
  openMovableFolder: state => state.openMovableFolder,
  openMovableChecklist: state => state.openMovableChecklist,
  openMovableChecklistItemChain: state => state.openMovableChecklistItemChain,
  openMovableChecklistItem: state => state.openMovableChecklistItemChain[0] || {},
  precedingMovableChecklistItem: state => state.openMovableChecklistItemChain[1] || {},
}

export default {
    state,
    mutations,
    actions,
    getters
}
