<template lang="html">
  <input
    type="search"
    class="search-input"
    v-model="search.query"
    placeholder="SEARCH"
    v-on:keyup="debounceSearch"
    v-on:keydown="debounceSearch"
    v-on:change="debounceSearch"
    v-on:keyup.delete="clearSearchResults"
  >
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Mark from 'mark.js'

export default {
  name: 'search-input',
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
      if (this.search.query) {
        this.triggerSearch()
      } else {
        this.setIsSearching(false)
      }
    }, 500),
    triggerSearch: function() {
      axios.post('/search', {currentFolderId: this.currentFolder.id, query: this.search.query})
      .then(
        (response) => {
          if (response.data.tokenMismatch) {
             Vue.handleTokenMismatch(response.data).then(
                 (response) => {
                     if (response) {
                         this.handleSuccessfulSearch(response)
                     } else if (response.data.error) {
                         this.handleSearchError(response.data.error)
                     }
                 }).catch(
                 (error) => this.handleSearchError(error)
               )
          } else if (response) {
            this.handleSuccessfulSearch(response)
          } else if (response.data.error) {
            this.handleSearchError(response.data.error)
          }
    }).catch(
      (error) => this.handleSearchError(error)
    )},
    handleSuccessfulSearch: function(response) {
      this.setIsSearching(false)
      response.data.results ? this.setSearchResults(response.data.results) : this.clearSearchResults()
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
  computed: {
    ...mapGetters([
      'search',
      'currentFolder'
    ])
  },
}
</script>

<style lang="css">
</style>
