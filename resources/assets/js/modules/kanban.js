import {
    ADD_TO_KANBAN_ARRAY,
    SET_OR_TOGGLE_KANBAN_PROPERTY,
} from '../mutations'

const namespaced = true;

const state = {

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
}

const actions = {
  EXAMPLE({ dispatch, commit }, example) {
    return new Promise((resolve, reject) => {

      resolve()
    })
  },
  addToKanbanArray({ commit }, payload = { array: [], value: null }) {
    return new Promise((resolve, reject) => {
      commit(ADD_TO_KANBAN_ARRAY, payload)
      resolve()
    })
  },
  fetchNestedKanbanDescendants({ dispatch }, nestedKanban) {
    return new Promise((resolve, reject) => {
      axios.post('/fetch-nested-kanban-descendants', { nestedKanban })
           .then( (response) => resolve( dispatch('fetchNestedKanbanDescendantsHandler', { response, nestedKanban}) ) )
           .catch( (error) => reject(error))
      resolve()
    })
  },
  fetchNestedKanbanDescendantsHandler({ commit }, payload = { response: null, nestedKanban: null }) {
    return new Promise((resolve, reject) => {
      if (payload.response.data.tokenMismatch) {
          Vue.handleTokenMismatch(payload.response.data)
          .then( success => {
            if ( ! success.data.descendants.length ) {
              commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'infoMessage', value: 'This ' + payload.nestedKanban.model + ' is empty.' })
            } else {
              if(success.data.descendants.sections) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'sections', value: success.data.descendants.sections, assign: true })
              if(success.data.descendants.items) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'items', value: success.data.descendants.items, assign: true })
            }
            resolve()
          })
          .catch( error => reject(error) )
      } else if (payload.response.data.descendants) {
        if ( ! payload.response.data.descendants.length ) {
          commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'infoMessage', value: 'This ' + payload.nestedKanban.model + ' is empty.' })
        }
        if(payload.response.data.descendants.sections.length) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'sections', value: payload.response.data.descendants.sections, assign: true })
        if(payload.response.data.descendants.items.length) commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'items', value: payload.response.data.descendants.items, assign: true })
        resolve()
      } else if (payload.response.data.error) reject(payload.response.data.error)
      else reject()
    })
  },
  toggleNestedKanban({ dispatch, commit }, nestedKanban) {
    return new Promise((resolve, reject) => {
      if(! nestedKanban.hasOwnProperty('opened') || ! nestedKanban.opened && nestedKanban.sections == undefined || nestedKanban.items == undefined) {
        dispatch('fetchNestedKanbanDescendants', nestedKanban)
      }
      commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: nestedKanban, property: 'opened'})
      resolve()
    })
  },
}

const getters = {
  kanbanCards: (state, rootGetters) => rootGetters.folders.concat(rootGetters.checklists),
}

export default {
    state,
    mutations,
    actions,
    getters
}
