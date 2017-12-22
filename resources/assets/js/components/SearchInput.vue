<template lang="html">
  <input
    type="search"
    class="search-input"
    v-model="search.query"
    placeholder="SEARCH"
    @keyup="debounceSearch"
    @keydown="debounceSearch"
    @change="debounceSearch"
    @keydown.enter.prevent="debounceSearch"
    @keyup.enter.prevent="debounceSearch"
    @keyup.delete="clearSearchResults"
  >
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Mark from 'mark.js'

export default {
  name: 'search-input',
  computed: {
    ...mapGetters([
      'search',
      'currentFolder'
    ])
  },
  methods: {
    ...mapActions([
      'clearSearchResults',
      'setSearchResults',
      'setIsSearching',
      'setSearchErrorMessage'
    ]),
    debounceSearch: _.debounce(function() {
      this.setSearchErrorMessage()
      this.setIsSearching(true)
      if (this.search.query) { this.triggerSearch() }
      else { this.setIsSearching(false) }
    }, 500),
    triggerSearch: function() {
      axios.post('/search', {currentFolderId: this.currentFolder.id, query: this.search.query})
      .then(
        (response) => {
          if (response.data.tokenMismatch) {
             Vue.handleTokenMismatch(response.data).then(
                 (response) => {
                     if (response) { this.handleSuccessfulSearch(response) }
                     else if (response.data.error) { this.handleSearchError(response.data.error) }
                 }).catch(
                 (error) => this.handleSearchError(error)
               )
          } else if (response) { this.handleSuccessfulSearch(response)}
            else if (response.data.error) { this.handleSearchError(response.data.error)}
    }).catch(
      (error) => this.handleSearchError(error)
    )},
    handleSuccessfulSearch: function(response) {
      this.setIsSearching(false)
      _.isEmpty(response.data.results.folders) && _.isEmpty(response.data.results.checklists) ? this.handleEmptySearchResults() : this.setSearchResults(response.data.results)
      var markSearchResults = new Mark(document.querySelector(".search-results"));
      var keyword = this.search.query,
          options = {};
      this.$nextTick(function () {
        markSearchResults.unmark({
          done: function() {
            markSearchResults.mark(keyword, options)
          }
        })
      })
    },
    handleEmptySearchResults: function() {
      this.setIsSearching(false)
      this.clearSearchResults()
      this.setSearchErrorMessage("There were no files or folders matching your search.")
    },
    handleSearchError: function(response) {
      this.setIsSearching(false)
      this.setSearchErrorMessage("An error occurred while searching")
    },
    cancel: function() {
      this.clearSearchResults()
      this.setSearchErrorMessage()
      this.search.query = undefined
      return this.setIsSearching(false)
    }
  },
}
</script>

<style lang="css">
</style>
