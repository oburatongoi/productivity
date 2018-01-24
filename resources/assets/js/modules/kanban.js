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
    payload.array.splice(payload.array.length, 0, payload.value)
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
              commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'descendants', value: success.data.descendants, assign: true })
            }
            resolve()
          })
          .catch( error => reject(error) )
      } else if (payload.response.data.descendants) {
        if ( ! payload.response.data.descendants.length ) {
          commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'infoMessage', value: 'This ' + payload.nestedKanban.model + ' is empty.' })
        }
        commit(SET_OR_TOGGLE_KANBAN_PROPERTY, { object: payload.nestedKanban, property: 'descendants', value: payload.response.data.descendants, assign: true })
        resolve()
      } else if (payload.response.data.error) reject(payload.response.data.error)
      else reject()
    })
  },
  toggleNestedKanban({ dispatch, commit }, nestedKanban) {
    return new Promise((resolve, reject) => {
      if(! nestedKanban.hasOwnProperty('opened') || ! nestedKanban.opened && nestedKanban.descendants == undefined) {
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
