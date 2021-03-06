import {
    CLEAR_QUERY,
    SET_SEARCHABILITY,
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
        isSearchable: false,
        isSearching: false
    }
}

const mutations = {
    [CLEAR_QUERY] (state) {
        state.search.query = undefined
    },
    [SET_SEARCHABILITY] (state, bool) {
        state.search.isSearchable = bool
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
    setSearchability({ dispatch, commit }, bool) {
      return new Promise((resolve, reject) => {
          dispatch('setIsSearching', false)
          commit(SET_SEARCHABILITY, bool)
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
    hasSearchResults: (state, getters) => {
      return getters.searchResultHasFolders || getters.searchResultHasChecklists
    },
    searchResultHasFolders: state => !_.isEmpty(state.search.results.folders),
    searchResultHasChecklists: state => !_.isEmpty(state.search.results.checklists),
    alphabeticalFolderSearchResults: state => _.orderBy(state.search.results.folders, 'name'),
    alphabeticalChecklistSearchResults: state => _.orderBy(state.search.results.checklists, 'title'),
}

export default {
    state,
    mutations,
    actions,
    getters
}
