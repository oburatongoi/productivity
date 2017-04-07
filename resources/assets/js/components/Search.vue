<template lang="html">
  <div class="search-wrapper">
    <form class="search-form" :class="searchFormClass" @submit.prevent="triggerSearch">
      <i class="fa fa-search" aria-hidden="true"></i>
      <input type="search" class="search-input" v-model="query" placeholder="SEARCH" v-on:keyup="triggerSearch" v-on:keyup.delete="clearSearchResults">
      <i class="fa fa-times cancel-search-btn" aria-hidden="true" v-if="query" @click="cancel"></i>
    </form>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Mark from 'mark.js'

export default {
  name: 'search',
  data () {
    return {
      query: undefined
    }
  },
  methods: {
    ...mapActions([
      'clearSearchResults',
      'setSearchResults',
      'setSearchQuery',
      'setIsSearching',
      'setSearchErrorMessage'
    ]),
    triggerSearch: _.debounce(function() {
      this.setSearchErrorMessage()
      this.setIsSearching(true)
      this.setSearchQuery(this.query)
      axios.post('/search', {currentFolderId: this.currentFolder.id, query: this.query})
      .then(
        (response) => this.handleSuccessfulSearch(response)
      )
      .catch(
        (response) => this.handleSearchError(response)
      )
    }, 300),
    handleSuccessfulSearch: function(response) {
      this.setIsSearching(false)
      response.data.results ? this.setSearchResults(response.data.results) : this.clearSearchResults()
      var markSearchResults = new Mark(document.querySelector(".search-results"));
      var keyword = this.search.query,
          options = {
            // "accuracy": {
            //   "value": "partially",
            //   "limiters": [",", ".", "-", "/"]
            // }
          };
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
      this.setSearchQuery()
      this.query = undefined
      return this.setIsSearching(false)
    }
  },
  computed: {
    ...mapGetters([
      'currentFolder',
      'search',
      'hasSearchResults'
    ]),
    searchFormClass: function() {
      return this.query ? 'has-query' : null
    }
  },
}
</script>

<style lang="css">
</style>
