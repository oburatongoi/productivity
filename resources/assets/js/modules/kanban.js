import {
    ADD_TO_KANBAN_ARRAY,
    REMOVE_FROM_KANBAN_ARRAY,
    SET_OR_TOGGLE_KANBAN_PROPERTY,
} from '../mutations'

const namespaced = true;

const state = {
  kanbanPreview: {}
}

const mutations = {
  [SET_OR_TOGGLE_KANBAN_PROPERTY] (state, payload = { object: {}, property: null, value: null }) {
    if(payload.value) Vue.set(payload.object, payload.property, payload.value)
    else if(payload.object.hasOwnProperty(payload.property) && typeof payload.object[payload.property] == 'boolean') Vue.set(payload.object, payload.property, ! payload.object[payload.property])
    else Vue.set(payload.object, payload.property, true)
  },
  [ADD_TO_KANBAN_ARRAY] (state, payload = { array: [], value: null }) {
    if(payload.array) payload.array.splice(payload.array.length, 0, payload.value)
    else console.log('Payload array is undefined');
  },
  [REMOVE_FROM_KANBAN_ARRAY] (state, payload = { array: null, value: null, removePreceding: false, removeAll: false  }) {
    if(payload.removeAll) { // empties the entire array
      payload.array.splice(0, payload.array.length)
    } else if(payload.value&&payload.value.id) {
      if( payload.removePreceding ) payload.array.splice(0, _.findIndex(payload.array, ['id', payload.value.id])) // remove every element that precedes the item
      else payload.array.splice(_.findIndex(payload.array, ['id', payload.value.id]), 1) // removes the item from the array
    }
  },
}

const actions = {
  EXAMPLE({ dispatch, commit }, example) {
    return new Promise((resolve, reject) => {

      resolve()
    })
  },
  addToKanbanArray({ commit }, payload = { array: [], value: null, prepend: false }) {
    return new Promise((resolve, reject) => {
      commit(ADD_TO_KANBAN_ARRAY, payload)
      resolve()
    })
  },
  closeNestedKanbanPreview({ state, commit }) {
    return new Promise((resolve, reject) => {
      commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: state, property: 'kanbanPreview', value: {} })
      resolve()
    })
  },
  fetchNestedKanbanDescendants({ dispatch, commit }, nestedKanban) {
    return new Promise((resolve, reject) => {
      commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: nestedKanban, property: 'isLoading' })
      axios.post('/fetch-nested-kanban-descendants', { nestedKanban })
           .then( (response) => resolve( dispatch('fetchNestedKanbanDescendantsHandler', { response, nestedKanban}) ) )
           .catch( (error) => reject(error))
      resolve()
    })
  },
  fetchNestedKanbanDescendantsHandler({ dispatch, commit }, payload = { response: null, nestedKanban: null }) {
    return new Promise((resolve, reject) => {
      if (payload.response.data.tokenMismatch) {
          Vue.handleTokenMismatch(payload.response.data)
          .then( success => {
            if (
                   payload.nestedKanban.model == 'folder'
              && ! success.data.descendants.checklists.length
              && ! success.data.descendants.subfolders.length
              ||   payload.nestedKanban.model == 'checklist'
              && ! success.data.descendants.sections.length
              && ! success.data.descendants.items.length
              ||   payload.nestedKanban.model == 'checklist-item'
              && ! success.data.descendants.sub_items.length
            ) {
              commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'isLoading' })
              commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'infoMessage', value: 'This ' + payload.nestedKanban.model + ' is empty.' })
            } else resolve( dispatch('fetchNestedKanbanDescendantsHandleSuccess', { descendants: success.data.descendants, nestedKanban: payload.nestedKanban }) )
          })
          .catch( error => reject(error) )
      } else if (payload.response.data.descendants) {
        if (
               payload.nestedKanban.model == 'folder'
          && ! payload.response.data.descendants.checklists.length
          && ! payload.response.data.descendants.subfolders.length
          ||   payload.nestedKanban.model == 'checklist'
          && ! payload.response.data.descendants.sections.length
          && ! payload.response.data.descendants.items.length
          ||   payload.nestedKanban.model == 'checklist-item'
          && ! payload.response.data.descendants.sub_items.length
        ) {
          commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'isLoading' })
          commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'infoMessage', value: 'This ' + payload.nestedKanban.model + ' is empty.' })
        } else resolve( dispatch('fetchNestedKanbanDescendantsHandleSuccess', { descendants: payload.response.data.descendants, nestedKanban: payload.nestedKanban }) )
      } else if (payload.response.data.error) reject(payload.response.data.error)
      else reject()
    })
  },
  fetchNestedKanbanDescendantsHandleSuccess({ commit }, payload = { descendants: null, nestedKanban: null }) {
    return new Promise((resolve, reject) => {
      switch (payload.nestedKanban.model) {
        case 'folder':
          if(payload.descendants.subfolders && payload.descendants.subfolders.length) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'subfolders', value: payload.descendants.subfolders, assign: true })
          if(payload.descendants.checklists && payload.descendants.checklists.length) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'checklists', value: payload.descendants.checklists, assign: true })
          commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'isLoading'})
          resolve()
          break;
        case 'checklist':
          if(payload.descendants.sections && payload.descendants.sections.length) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'sections', value: payload.descendants.sections, assign: true })
          if(payload.descendants.items && payload.descendants.items.length) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'items', value: payload.descendants.items, assign: true })
          commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'isLoading'})
          resolve()
          break;
        case 'checklist-item':
          if(payload.descendants.sub_items) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'sub_items', value: payload.descendants.sub_items, assign: true })
          commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'isLoading'})
          resolve()
          break;
        default: reject('The nestedKanban\'s model was not provided')

      }
    })
  },
  navigateToNestedKanban({}, nestedKanban = { model: null, fake_id: null }) {
    return new Promise((resolve, reject) => {
      let model = nestedKanban.model == 'folder' ? 'folders' : nestedKanban.model == 'checklist' ? 'lists' : null
      if(model) resolve(window.location.href = '/'+model+'/'+nestedKanban.fake_id)
      else reject('Model not supported')
    })
  },
  previewNestedKanban({ dispatch, commit, state }, nestedKanban) {
    return new Promise((resolve, reject) => {
      dispatch('fetchNestedKanbanDescendants', nestedKanban)
      .then( () => commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: state, property: 'kanbanPreview', value: nestedKanban }) )
      resolve()
    })
  },
  removeFromKanbanArray({ commit }, payload = { array: null, value: null, removePreceding: false, removeAll: false  }) {
    return new Promise((resolve, reject) => {
      commit(REMOVE_FROM_KANBAN_ARRAY, payload)
      resolve()
    })
  },
  toggleNestedKanban({ dispatch, commit }, nestedKanban) {
    return new Promise((resolve, reject) => {
      dispatch('deselect', { model: nestedKanban.model, listing: nestedKanban }, { root: true })
      commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: nestedKanban, property: 'opened'})
      if(! nestedKanban.hasOwnProperty('opened') || ! nestedKanban.opened && nestedKanban.sections == undefined || nestedKanban.items == undefined) {
        dispatch('fetchNestedKanbanDescendants', nestedKanban)
      }
      resolve()
    })
  },
  toggleNestedKanbanMeta({ dispatch, commit }, nestedKanban) {
    return new Promise((resolve, reject) => {
      commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: nestedKanban, property: 'showMeta' })
      resolve()
    })
  },
}

const getters = {
  kanbanCards: (state, rootGetters) => rootGetters.folders.concat(rootGetters.checklists),
  kanbanPreview: (state) => state.kanbanPreview
}

export default {
    state,
    mutations,
    actions,
    getters
}
