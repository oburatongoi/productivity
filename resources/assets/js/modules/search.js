import {
    CLEAR_QUERY,
    UPDATE_QUERY,
    UPDATE_RESULTS,
    UPDATE_ERROR_MESSAGE,
    UPDATE_IS_SEARCHING
} from '../mutations'

const namespaced = true;

const state = {
    search: {
        query: undefined,
        results: {
            folders: [],
            checklists: []
        },
        errorMessage: undefined,
        isSearching: false
    }
}

const mutations = {
    [CLEAR_QUERY] (state) {
        state.search.query = undefined
    },
    [UPDATE_QUERY] (state, query) {
        state.search.query = query
    },
    [UPDATE_RESULTS] (state, results) {
        state.search.results = results
    },
    [UPDATE_ERROR_MESSAGE] (state, errorMessage) {
        state.search.errorMessage = errorMessage
    },
    [UPDATE_IS_SEARCHING] (state, isSearching) {
        state.search.isSearching = isSearching
    }
}

const actions = {
    clearSearchResults({ commit }) {
      return new Promise((resolve, reject) => {
          let results = {
              folders: {},
              checklists: {}
          }
          commit(UPDATE_RESULTS, results)
          resolve()
      })
    },
    setSearchResults({ commit }, results) {
      return new Promise((resolve, reject) => {
          commit(UPDATE_RESULTS, results)
          resolve()
      })
    },
    setSearchErrorMessage({ commit }, value = undefined) {
      return new Promise((resolve, reject) => {
          commit(UPDATE_ERROR_MESSAGE, value)
          resolve()
      })
    },
    setSearchQuery({ commit }, value = undefined) {
      return new Promise((resolve, reject) => {
          commit(CLEAR_QUERY)
          commit(UPDATE_QUERY, value)
          resolve()
      })
    },
    setIsSearching({ commit }, value) {
      return new Promise((resolve, reject) => {
          commit(UPDATE_IS_SEARCHING, value)
          resolve()
      })
    },
}

const getters = {
    search: state => state.search,
    hasSearchResults: state => {
      if( state.search.results
          && (
            (state.search.results.folders && !_.isEmpty(state.search.results.folders))
            || (state.search.results.checklists && !_.isEmpty(state.search.results.checklists))
          )
      ) return true
      return false
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}
